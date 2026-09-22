import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { requireAdmin } from './lib/admin'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'

export const handler: NetlifyHandler = async (event) => {
  const origin = event.headers.origin

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCorsHeaders(origin), body: '' }
  }

  const admin = requireAdmin(event.headers.authorization)
  if (!admin) {
    return errorResponse('Forbidden', 403, origin)
  }

  if (event.httpMethod !== 'GET') {
    return errorResponse('Method not allowed', 405, origin)
  }

  const params = event.queryStringParameters || {}
  const slug = params.slug || null

  try {
    // ── GET /api/admin/courses?slug=xxx  → one course w/ full mission detail ──
    if (slug) {
      const course = await prisma.course.findUnique({
        where: { slug },
        include: {
          modules: {
            orderBy: { missionNumber: 'asc' },
            include: { quiz: true, assignment: true, _count: { select: { progress: true } } },
          },
          enrollments: true,
        },
      })
      if (!course) {
        return errorResponse('Course not found', 404, origin)
      }

      const modules = course.modules.map(m => {
        const questionCount = Array.isArray(m.quiz?.questions)
          ? (m.quiz!.questions as unknown[]).length
          : 0
        const submoduleCount = Array.isArray(m.submodules) ? (m.submodules as unknown[]).length : 0
        return {
          missionNumber: m.missionNumber,
          title: m.title,
          description: m.description,
          sessionType: m.sessionType,
          creditsReward: m.creditsReward,
          submodules: submoduleCount,
          quizQuestions: questionCount,
          passScore: m.quiz?.passScore ?? null,
          assignmentMaxCredits: m.assignment?.maxCredits ?? null,
          completions: m._count.progress,
        }
      })

      return successResponse({
        course: {
          id: course.id,
          slug: course.slug,
          index: course.index,
          title: course.title,
          shortTitle: course.shortTitle,
          tagline: course.tagline,
          trackName: course.trackName,
          audience: course.audience,
          category: course.category,
          moduleCount: course.moduleCount,
          totalXp: course.totalXp,
          isActive: course.isActive,
          position: course.position,
          enrollmentCount: course.enrollments.length,
          createdAt: course.createdAt,
        },
        modules,
      }, 200, origin)
    }

    // ── GET /api/admin/courses  → all courses + rollup stats ──
    const [courses, enrollments, progress, users] = await Promise.all([
      prisma.course.findMany({
        orderBy: { position: 'asc' },
        include: { modules: { select: { id: true, missionNumber: true, submodules: true, quiz: true } } },
      }),
      prisma.userCourseEnrollment.findMany({ select: { courseId: true, userId: true } }),
      prisma.userProgress.findMany({ select: { moduleId: true, completed: true } }),
      prisma.user.findMany({ select: { id: true } }),
    ])

    const enrollmentByCourse = new Map<string, Set<string>>()
    for (const e of enrollments) {
      let set = enrollmentByCourse.get(e.courseId)
      if (!set) { set = new Set(); enrollmentByCourse.set(e.courseId, set) }
      set.add(e.userId)
    }

    const completedCountByModule = new Map<number, number>()
    for (const p of progress) {
      if (!p.completed) continue
      completedCountByModule.set(p.moduleId, (completedCountByModule.get(p.moduleId) ?? 0) + 1)
    }
    const startedCountByModule = new Map<number, number>()
    for (const p of progress) {
      startedCountByModule.set(p.moduleId, (startedCountByModule.get(p.moduleId) ?? 0) + 1)
    }

    const totalUsers = users.length
    const list = courses.map(c => {
      const missions = c.modules.filter(m => m.missionNumber != null)
      const submoduleCount = missions.reduce(
        (sum, m) => sum + (Array.isArray(m.submodules) ? (m.submodules as unknown[]).length : 0),
        0,
      )
      const quizQuestionCount = missions.reduce(
        (sum, m) => sum + (Array.isArray(m.quiz?.questions) ? (m.quiz!.questions as unknown[]).length : 0),
        0,
      )
      let completions = 0
      let started = 0
      for (const m of missions) {
        completions += completedCountByModule.get(m.id) ?? 0
        started += startedCountByModule.get(m.id) ?? 0
      }
      return {
        id: c.id,
        slug: c.slug,
        index: c.index,
        title: c.title,
        shortTitle: c.shortTitle,
        tagline: c.tagline,
        trackName: c.trackName,
        audience: c.audience,
        category: c.category,
        moduleCount: c.moduleCount,
        totalXp: c.totalXp,
        isActive: c.isActive,
        position: c.position,
        missionCount: missions.length,
        submoduleCount,
        quizQuestionCount,
        enrollmentCount: enrollmentByCourse.get(c.id)?.size ?? 0,
        startedCount: started,
        completionCount: completions,
        completionRate: started ? Math.round((completions / started) * 100) : 0,
      }
    })

    const aggregate = {
      courses: courses.length,
      missions: courses.reduce((s, c) => s + c.modules.filter(m => m.missionNumber != null).length, 0),
      enrollments: enrollmentByCourse.size,
      totalUsers,
      totalCompletions: progress.filter(p => p.completed).length,
      totalXp: courses.reduce((s, c) => s + c.totalXp, 0),
    }

    return successResponse({ courses: list, aggregate }, 200, origin)
  } catch (error) {
    console.error('Admin courses error:', error)
    return errorResponse('Internal server error', 500, origin)
  }
}