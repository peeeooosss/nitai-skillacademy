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

  // ── GET /enrollments → my enrolled courses with progress ──
  if (event.httpMethod === 'GET') {
    try {
      const [enrollments, progress] = await Promise.all([
        prisma.userCourseEnrollment.findMany({
          where: { userId: payload.userId },
          include: { course: { include: { modules: { orderBy: { missionNumber: 'asc' } } } } },
          orderBy: { startedAt: 'desc' },
        }),
        prisma.userProgress.findMany({ where: { userId: payload.userId } }),
      ])

      const completedByModule = new Map(
        progress.filter(p => p.completed).map(p => [p.moduleId, true]),
      )

      const enrolled = enrollments.map(e => {
        const modules = e.course.modules.filter(m => m.missionNumber != null)
        const total = modules.length
        const done = modules.filter(m => completedByModule.has(m.id)).length
        const firstIncomplete = modules.find(m => !completedByModule.has(m.id))
        return {
          courseId: e.course.id,
          slug: e.course.slug,
          title: e.course.title,
          trackName: e.course.trackName,
          icon: e.course.icon,
          accentColor: e.course.accentColor,
          moduleCount: e.course.moduleCount,
          progress: { completedMissions: done, totalMissions: total, percent: total ? Math.round((done / total) * 100) : 0 },
          currentMission: firstIncomplete
            ? { missionNumber: firstIncomplete.missionNumber, title: firstIncomplete.title }
            : null,
          startedAt: e.startedAt,
        }
      })

      return successResponse({ enrollments: enrolled }, 200, origin)
    } catch (error) {
      console.error('Get enrollments error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  // ── POST /enrollments {courseId} → open one-click enrollment ──
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}')
      const { courseId } = body
      if (!courseId) {
        return errorResponse('courseId is required', 400, origin)
      }

      const course = await prisma.course.findUnique({ where: { id: courseId } })
      if (!course || !course.isActive) {
        return errorResponse('Course not found', 404, origin)
      }

      const existing = await prisma.userCourseEnrollment.findUnique({
        where: { userId_courseId: { userId: payload.userId, courseId } },
      })

      if (existing) {
        return successResponse({ message: 'Already enrolled', enrolled: true }, 200, origin)
      }

      await prisma.userCourseEnrollment.create({
        data: { userId: payload.userId, courseId },
      })

      return successResponse({ message: 'Enrolled successfully', enrolled: true }, 201, origin)
    } catch (error) {
      console.error('Enroll error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  return errorResponse('Method not allowed', 405, origin)
}