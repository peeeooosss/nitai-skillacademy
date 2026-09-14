import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { verifyToken, extractToken } from './lib/auth'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'

export const handler: NetlifyHandler = async (event) => {
  const origin = event.headers.origin

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCorsHeaders(origin), body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return errorResponse('Method not allowed', 405, origin)
  }

  const token = extractToken(event.headers.authorization)
  if (!token) {
    return errorResponse('Unauthorized', 401, origin)
  }

  const payload = verifyToken(token)
  if (!payload) {
    return errorResponse('Invalid token', 401, origin)
  }

  try {
    const [user, progress, credits, enrollments] = await Promise.all([
      prisma.user.findUnique({ where: { id: payload.userId } }),
      prisma.userProgress.findMany({
        where: { userId: payload.userId, completed: true },
        include: { module: { include: { course: true } } },
      }),
      prisma.userCredit.findUnique({ where: { userId: payload.userId } }),
      prisma.userCourseEnrollment.findMany({
        where: { userId: payload.userId },
        include: { course: { include: { modules: { orderBy: { missionNumber: 'asc' } } } } },
        orderBy: { startedAt: 'desc' },
      }),
    ])

    if (!user) {
      return errorResponse('User not found', 404, origin)
    }

    const totalCompleted = progress.length
    const totalHours = Math.round(totalCompleted * 0.5 * 10) / 10

    // Streak: consecutive days (by completion date) ending today
    let streak = 0
    const completionDates = [...new Set(
      progress
        .map(p => (p.completedAt ? new Date(p.completedAt).toDateString() : ''))
        .filter(Boolean),
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (completionDates.length) {
      const cursor = new Date()
      cursor.setHours(0, 0, 0, 0)
      const index = completionDates.findIndex(d => new Date(d).getTime() === cursor.getTime())
      const start = index >= 0 ? index : 0
      for (let i = start; i < completionDates.length; i++) {
        const expected = new Date(cursor.getTime() - i * 86400000).toDateString()
        if (completionDates[i] === expected) streak++
        else break
      }
    }

    // Enrolled courses with per-course progress + current mission
    const completedByModule = new Map(
      progress.filter(p => Boolean(p.moduleId)).map(p => [p.moduleId, true]),
    )

    const enrolledCourses = enrollments.map(e => {
      const missions = e.course.modules.filter(m => m.missionNumber != null)
      const total = missions.length
      const done = missions.filter(m => completedByModule.has(m.id)).length
      const firstIncomplete = missions.find(m => !completedByModule.has(m.id))
      return {
        courseId: e.course.id,
        slug: e.course.slug,
        title: e.course.title,
        shortTitle: e.course.shortTitle,
        trackName: e.course.trackName,
        icon: e.course.icon,
        accentColor: e.course.accentColor,
        moduleCount: e.course.moduleCount,
        progress: {
          completedMissions: done,
          totalMissions: total,
          percent: total ? Math.round((done / total) * 100) : 0,
        },
        currentMission: firstIncomplete
          ? { missionNumber: firstIncomplete.missionNumber, title: firstIncomplete.title }
          : null,
        startedAt: e.startedAt,
      }
    })

    // Recent activity (latest 5 completions)
    const recentActivity = progress
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())
      .slice(0, 5)
      .map(p => ({
        moduleId: p.moduleId,
        missionNumber: p.module.missionNumber,
        title: p.module.title,
        courseTitle: p.module.course?.title || null,
        courseSlug: p.module.course?.slug || null,
        completedAt: p.completedAt,
      }))

    // Recommended next mission: earliest incomplete across enrolled courses
    const nextMission = await findNextMission(payload.userId, enrollments)

    return successResponse({
      stats: {
        totalCredits: credits?.balance || 0,
        currentStreak: streak,
        completedMissions: totalCompleted,
        totalHours,
        enrolledCourses: enrolledCourses.length,
      },
      enrolledCourses,
      nextMission,
      recentActivity,
    }, 200, origin)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return errorResponse('Internal server error', 500, origin)
  }
}

async function findNextMission(
  userId: string,
  enrollments: Array<{ course: { id: string; slug: string; title: string; modules: Array<{ id: number; missionNumber: number | null; title: string }> } }>,
) {
  const progressRows = await prisma.userProgress.findMany({
    where: { userId, completed: true },
  })
  const completedByModule = new Set(progressRows.map(p => p.moduleId))

  for (const e of enrollments) {
    const missions = e.course.modules.filter(m => m.missionNumber != null)
    const firstIncomplete = missions.find(m => !completedByModule.has(m.id))
    if (!firstIncomplete) continue
    const idx = missions.findIndex(m => m.id === firstIncomplete.id)
    return {
      courseSlug: e.course.slug,
      courseTitle: e.course.title,
      missionNumber: firstIncomplete.missionNumber,
      missionTitle: firstIncomplete.title,
      isFirst: idx === 0,
      previousCompleted: idx === 0 ? true : completedByModule.has(missions[idx - 1].id),
    }
  }
  return null
}