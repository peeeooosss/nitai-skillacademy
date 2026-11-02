import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { verifyToken, extractToken } from './lib/auth'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'

const VALID_PLATFORMS = ['ZOOM', 'MEET', 'TEAMS', 'OTHER']

function isIsoDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value))
}

export const handler: NetlifyHandler = async (event) => {
  const origin = event.headers.origin

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCorsHeaders(origin), body: '' }
  }

  const token = extractToken(event.headers.authorization)
  if (!token) {
    return errorResponse('Unauthorized', 401, origin)
  }

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'ADMIN') {
    return errorResponse('Forbidden', 403, origin)
  }

  const params = event.queryStringParameters || {}
  const id = params.id || null

  try {
    // ── GET: list all sessions (admins see every course) ──
    if (event.httpMethod === 'GET') {
      const sessions = await prisma.liveSession.findMany({
        include: {
          course: { select: { slug: true, title: true, shortTitle: true, icon: true } },
        },
        orderBy: { scheduledAt: 'desc' },
      })

      return successResponse(
        {
          sessions: sessions.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            platform: s.platform,
            link: s.link,
            scheduledAt: s.scheduledAt.toISOString(),
            durationMins: s.durationMins,
            missionNumber: s.missionNumber,
            courseId: s.courseId,
            course: s.course,
            isAllCourses: s.courseId === null,
            isActive: s.isActive,
          })),
        },
        200,
        origin,
      )
    }

    // ── POST: create ──
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const { title, description, platform, link, scheduledAt, durationMins, missionNumber, isActive } = body
      const courseId = body.courseId === 'ALL' || body.courseId === '' || body.courseId == null
        ? null
        : String(body.courseId)

      if (!title || !link || !scheduledAt) {
        return errorResponse('title, link, and scheduledAt are required', 400, origin)
      }
      if (!VALID_PLATFORMS.includes(platform || 'ZOOM')) {
        return errorResponse(`platform must be one of: ${VALID_PLATFORMS.join(', ')}`, 400, origin)
      }
      if (!isIsoDate(scheduledAt)) {
        return errorResponse('scheduledAt must be a valid ISO date', 400, origin)
      }
      if (courseId) {
        const course = await prisma.course.findUnique({ where: { id: courseId } })
        if (!course) {
          return errorResponse('Course not found', 404, origin)
        }
      }
      const parsedMission = missionNumber != null && missionNumber !== '' ? parseInt(missionNumber, 10) : null
      if (parsedMission != null) {
        if (!Number.isInteger(parsedMission) || parsedMission < 1) {
          return errorResponse('missionNumber must be a positive integer', 400, origin)
        }
        if (courseId) {
          const mission = await prisma.module.findUnique({
            where: { courseId_missionNumber: { courseId, missionNumber: parsedMission } },
          })
          if (!mission) {
            return errorResponse('Mission not found for this course', 404, origin)
          }
        }
      }

      const session = await prisma.liveSession.create({
        data: {
          title,
          description: description || null,
          platform: platform || 'ZOOM',
          link,
          scheduledAt: new Date(scheduledAt),
          durationMins: durationMins ? parseInt(durationMins, 10) : 60,
          courseId,
          missionNumber: parsedMission,
          isActive: isActive !== false,
        },
      })

      return successResponse({ session }, 201, origin)
    }

    // ── PUT: update ──
    if (event.httpMethod === 'PUT') {
      if (!id) {
        return errorResponse('id query parameter required', 400, origin)
      }
      const body = JSON.parse(event.body || '{}')
      const existing = await prisma.liveSession.findUnique({ where: { id } })
      if (!existing) {
        return errorResponse('Live session not found', 404, origin)
      }

      if (body.platform && !VALID_PLATFORMS.includes(body.platform)) {
        return errorResponse(`platform must be one of: ${VALID_PLATFORMS.join(', ')}`, 400, origin)
      }
      if (body.scheduledAt && !isIsoDate(body.scheduledAt)) {
        return errorResponse('scheduledAt must be a valid ISO date', 400, origin)
      }
      const courseId = body.courseId === undefined
        ? existing.courseId
        : (body.courseId === 'ALL' || body.courseId === '' || body.courseId === null ? null : String(body.courseId))

      if (courseId) {
        const course = await prisma.course.findUnique({ where: { id: courseId } })
        if (!course) {
          return errorResponse('Course not found', 404, origin)
        }
      }

      const missionNumber = body.missionNumber !== undefined
        ? (body.missionNumber ? parseInt(body.missionNumber, 10) : null)
        : existing.missionNumber

      if (missionNumber != null && (!Number.isInteger(missionNumber) || missionNumber < 1)) {
        return errorResponse('missionNumber must be a positive integer', 400, origin)
      }

      if (missionNumber != null && courseId) {
        const mission = await prisma.module.findUnique({
          where: { courseId_missionNumber: { courseId, missionNumber } },
        })
        if (!mission) {
          return errorResponse('Mission not found for this course', 404, origin)
        }
      }

      const session = await prisma.liveSession.update({
        where: { id },
        data: {
          title: body.title ?? undefined,
          description: body.description !== undefined ? body.description : undefined,
          platform: body.platform ?? undefined,
          link: body.link ?? undefined,
          scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
          durationMins: body.durationMins !== undefined ? parseInt(body.durationMins, 10) : undefined,
          courseId,
          missionNumber,
          isActive: body.isActive !== undefined ? body.isActive !== false : undefined,
        },
      })

      return successResponse({ session }, 200, origin)
    }

    // ── DELETE ──
    if (event.httpMethod === 'DELETE') {
      if (!id) {
        return errorResponse('id query parameter required', 400, origin)
      }
      const existing = await prisma.liveSession.findUnique({ where: { id } })
      if (!existing) {
        return errorResponse('Live session not found', 404, origin)
      }
      await prisma.liveSession.delete({ where: { id } })
      return successResponse({ message: 'Deleted' }, 200, origin)
    }

    return errorResponse('Method not allowed', 405, origin)
  } catch (error) {
    console.error('Admin live sessions error:', error)
    return errorResponse('Internal server error', 500, origin)
  }
}