import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { verifyToken, extractToken } from './lib/auth'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'

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
  if (!payload) {
    return errorResponse('Invalid token', 401, origin)
  }

  if (event.httpMethod !== 'GET') {
    return errorResponse('Method not allowed', 405, origin)
  }

  const params = event.queryStringParameters || {}

  try {
    const enrollments = await prisma.userCourseEnrollment.findMany({
      where: { userId: payload.userId },
    })
    const enrolledCourseIds = enrollments.map(e => e.courseId)

    // Users who are not enrolled in any course should not see global sessions.
    if (enrolledCourseIds.length === 0) {
      const empty = params.courseSlug ? { sessions: [] } : { upcoming: [], past: [] }
      return successResponse(empty, 200, origin)
    }

    const sessions = await prisma.liveSession.findMany({
      where: {
        isActive: true,
        OR: [{ courseId: { in: enrolledCourseIds } }, { courseId: null }],
      },
      include: {
        course: {
          select: { slug: true, title: true, shortTitle: true, icon: true, accentColor: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    })

    const serialize = (s: (typeof sessions)[number]) => ({
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
    })

    // Per-course/mission lookup → used by the mission player Live step.
    if (params.courseSlug) {
      const courseSlug = params.courseSlug
      const mission = params.mission ? parseInt(params.mission, 10) : null

      const scoped = sessions.filter(s => {
        if (s.courseId !== null && s.course?.slug !== courseSlug) return false
        if (mission != null && s.missionNumber !== mission) return false
        if (mission == null && s.missionNumber != null) return false
        return true
      })

      return successResponse({ sessions: scoped.map(serialize) }, 200, origin)
    }

    const now = new Date()
    const upcoming = sessions.filter(s => s.scheduledAt >= now).map(serialize)
    const past = sessions.filter(s => s.scheduledAt < now).reverse().map(serialize)

    return successResponse({ upcoming, past }, 200, origin)
  } catch (error) {
    console.error('List live sessions error:', error)
    return errorResponse('Internal server error', 500, origin)
  }
}