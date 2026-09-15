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

  const params = event.queryStringParameters || {}
  const slug = params.slug

  // ── GET /courses?slug=xxx  → course detail + gated missions + progress ──
  if (event.httpMethod === 'GET' && slug) {
    try {
      const course = await prisma.course.findUnique({
        where: { slug },
        include: { modules: { orderBy: { missionNumber: 'asc' } }, enrollments: true },
      })
      if (!course) {
        return errorResponse('Course not found', 404, origin)
      }

      const progressRows = await prisma.userProgress.findMany({
        where: { userId: payload.userId },
      })
      const progressByModule = new Map(progressRows.map(p => [p.moduleId, p]))

      const missions = course.modules
        .filter(m => m.missionNumber != null)
        .map((m, i) => {
          const pr = progressByModule.get(m.id)
          const videoWatched = pr?.videoWatched ?? false
          const quizPassed = pr?.quizPassed ?? false
          const assignmentSubmitted = pr?.assignmentSubmitted ?? false
          const completed = pr?.completed ?? false
          const unlocked = i === 0 ? true : (progressByModule.get(course.modules[i - 1].id)?.completed === true)
          const rawSubmodules = ((m.submodules as { index: number; title: string }[] | null) || [])
            .slice()
            .sort((a, b) => a.index - b.index)
          const completedSet = new Set<number>((pr?.completedSubmodules as number[] | null) || [])
          const submodules = rawSubmodules.map((s, si) => ({
            index: s.index,
            title: s.title,
            unlocked: si === 0 || completedSet.has(rawSubmodules[si - 1].index),
            completed: completedSet.has(s.index),
          }))
          return {
            id: m.id,
            missionNumber: m.missionNumber as number,
            title: m.title,
            description: m.description,
            sessionType: m.sessionType,
            creditsReward: m.creditsReward,
            submodules,
            submodulesCompleted: completedSet.size,
            submodulesTotal: submodules.length,
            videoWatched,
            quizPassed,
            assignmentSubmitted,
            completed,
            unlocked,
          }
        })

      const completedMissions = missions.filter(m => m.completed).length
      const enrolled = course.enrollments.some(e => e.userId === payload.userId)
      const firstIncomplete = missions.find(m => !m.completed)
      const currentMission = firstIncomplete
        ? { missionNumber: firstIncomplete.missionNumber, title: firstIncomplete.title }
        : null

      return successResponse({
        course: {
          id: course.id,
          slug: course.slug,
          index: course.index,
          title: course.title,
          shortTitle: course.shortTitle,
          tagline: course.tagline,
          description: course.description,
          trackName: course.trackName,
          audience: course.audience,
          category: course.category,
          outcomes: course.outcomes,
          duration: course.duration,
          icon: course.icon,
          accentColor: course.accentColor,
          moduleCount: course.moduleCount,
          totalXp: course.totalXp,
          position: course.position,
        },
        enrolled,
        progress: {
          completedMissions,
          totalMissions: missions.length,
          percent: missions.length ? Math.round((completedMissions / missions.length) * 100) : 0,
        },
        currentMission,
        missions,
      }, 200, origin)
    } catch (error) {
      console.error('Get course error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  // ── GET /courses  → all courses + enrollment + progress summary ──
  if (event.httpMethod === 'GET') {
    try {
      const [courses, enrollments, progress] = await Promise.all([
        prisma.course.findMany({
          where: { isActive: true },
          orderBy: { position: 'asc' },
          include: { modules: { orderBy: { missionNumber: 'asc' } } },
        }),
        prisma.userCourseEnrollment.findMany({
          where: { userId: payload.userId },
          include: { course: true },
        }),
        prisma.userProgress.findMany({
          where: { userId: payload.userId },
          include: { module: true },
        }),
      ])

      const enrolledCourseIds = new Set(enrollments.map(e => e.courseId))
      const completedByModule = new Map(
        progress.filter(p => p.completed).map(p => [p.moduleId, true]),
      )

      const list = courses.map(c => {
        const missions = c.modules.filter(m => m.missionNumber != null)
        const completedMissions = missions.filter(m => completedByModule.has(m.id)).length
        const enrolled = enrolledCourseIds.has(c.id)
        return {
          id: c.id,
          slug: c.slug,
          index: c.index,
          title: c.title,
          shortTitle: c.shortTitle,
          tagline: c.tagline,
          description: c.description,
          trackName: c.trackName,
          audience: c.audience,
          category: c.category,
          outcomes: c.outcomes,
          duration: c.duration,
          icon: c.icon,
          accentColor: c.accentColor,
          moduleCount: c.moduleCount,
          totalXp: c.totalXp,
          position: c.position,
          enrolled,
          progress: {
            completedMissions,
            totalMissions: missions.length,
            percent: missions.length ? Math.round((completedMissions / missions.length) * 100) : 0,
          },
        }
      })

      return successResponse({ courses: list }, 200, origin)
    } catch (error) {
      console.error('List courses error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  return errorResponse('Method not allowed', 405, origin)
}