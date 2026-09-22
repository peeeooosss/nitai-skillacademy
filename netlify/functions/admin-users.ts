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
  const id = params.id || null
  const search = params.search || null

  try {
    // ── GET /api/admin/users?id=xxx  → one user w/ full detail ──
    if (id) {
      const [user, enrollments, progress, quizSubmissions, assignmentSubmissions, creditTxs] =
        await Promise.all([
          prisma.user.findUnique({ where: { id }, include: { credits: true } }),
          prisma.userCourseEnrollment.findMany({
            where: { userId: id },
            include: {
              course: { select: { id: true, slug: true, title: true, shortTitle: true, icon: true, accentColor: true, moduleCount: true } },
            },
            orderBy: { startedAt: 'desc' },
          }),
          prisma.userProgress.findMany({
            where: { userId: id },
            include: { module: { include: { course: { select: { slug: true, title: true } } } } },
            orderBy: { createdAt: 'desc' },
          }),
          prisma.quizSubmission.findMany({ where: { userId: id }, orderBy: { submittedAt: 'desc' } }),
          prisma.assignmentSubmission.findMany({ where: { userId: id }, orderBy: { submittedAt: 'desc' } }),
          prisma.creditTransaction.findMany({ where: { userId: id }, orderBy: { createdAt: 'desc' } }).catch(() => []),
        ])

      if (!user) {
        return errorResponse('User not found', 404, origin)
      }

      const completed = progress.filter(p => p.completed)
      const byCourse = new Map<string, { total: number; done: number }>()
      for (const p of progress) {
        const courseId = p.module.courseId
        if (!courseId) continue
        const cur = byCourse.get(courseId) ?? { total: 0, done: 0 }
        cur.total++
        if (p.completed || (p.module.missionNumber != null && p.completed)) cur.done++
        byCourse.set(courseId, cur)
      }

      const enrolledCourses = enrollments.map(e => {
        const c = byCourse.get(e.course.id) ?? { total: 0, done: 0 }
        return {
          courseId: e.course.id,
          slug: e.course.slug,
          title: e.course.title,
          shortTitle: e.course.shortTitle,
          icon: e.course.icon,
          accentColor: e.course.accentColor,
          moduleCount: e.course.moduleCount,
          startedAt: e.startedAt,
          completedMissions: c.done,
          totalMissions: e.course.moduleCount,
        }
      })

      const quizPassed = quizSubmissions.filter(q => q.passed).length
      const quizTotal = quizSubmissions.length
      const quizBestScores = new Map<string, number>()
      for (const q of quizSubmissions) {
        const prev = quizBestScores.get(q.quizId) ?? -1
        if (q.score > prev) quizBestScores.set(q.quizId, q.score)
      }

      const recentProgress = progress.slice(0, 20).map(p => ({
        moduleId: p.moduleId,
        missionNumber: p.module.missionNumber,
        title: p.module.title,
        courseTitle: p.module.course?.title ?? null,
        courseSlug: p.module.course?.slug ?? null,
        completed: p.completed,
        videoWatched: p.videoWatched,
        quizPassed: p.quizPassed,
        assignmentSubmitted: p.assignmentSubmitted,
        completedAt: p.completedAt,
        updatedAt: p.createdAt,
      }))

      const recentQuizzes = quizSubmissions.slice(0, 20).map(q => ({
        quizId: q.quizId,
        score: q.score,
        passed: q.passed,
        submittedAt: q.submittedAt,
      }))

      const recentAssignments = assignmentSubmissions.slice(0, 20).map(a => ({
        assignmentId: a.assignmentId,
        status: a.status,
        aiScore: a.aiScore,
        submittedAt: a.submittedAt,
        reviewedAt: a.reviewedAt,
      }))

      return successResponse({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          provider: user.provider,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          credits: {
            balance: user.credits?.balance ?? 0,
            totalEarned: user.credits?.totalEarned ?? 0,
          },
        },
        enrolledCourses,
        progress: {
          completed: completed.length,
          total: progress.length,
          recent: recentProgress,
        },
        quizzes: {
          passed: quizPassed,
          total: quizTotal,
          bestScoreAvg: quizBestScores.size
            ? Math.round([...quizBestScores.values()].reduce((s, v) => s + v, 0) / quizBestScores.size)
            : 0,
          recent: recentQuizzes,
        },
        assignments: {
          submitted: assignmentSubmissions.length,
          pending: assignmentSubmissions.filter(a => a.status === 'PENDING').length,
          approved: assignmentSubmissions.filter(a => a.status === 'APPROVED').length,
          recent: recentAssignments,
        },
        creditTransactions: creditTxs.length ? creditTxs.slice(0, 50) : null,
      }, 200, origin)
    }

    // ── GET /api/admin/users  → all users + rollup ──
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [users, credits, enrollments, progress, quizSubmissions, assignmentSubmissions] =
      await Promise.all([
        prisma.user.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            provider: true,
            createdAt: true,
          },
        }),
        prisma.userCredit.findMany(),
        prisma.userCourseEnrollment.findMany({ select: { userId: true, courseId: true } }),
        prisma.userProgress.findMany({ select: { userId: true, completed: true } }),
        prisma.quizSubmission.findMany({ select: { userId: true, passed: true } }),
        prisma.assignmentSubmission.findMany({ select: { userId: true } }),
      ])

    const creditByUser = new Map(credits.map(c => [c.userId, c]))
    const enrollmentCount = new Map<string, number>()
    for (const e of enrollments) enrollmentCount.set(e.userId, (enrollmentCount.get(e.userId) ?? 0) + 1)
    const completedCount = new Map<string, number>()
    for (const p of progress) if (p.completed) completedCount.set(p.userId, (completedCount.get(p.userId) ?? 0) + 1)
    const quizPassedCount = new Map<string, number>()
    for (const q of quizSubmissions) if (q.passed) quizPassedCount.set(q.userId, (quizPassedCount.get(q.userId) ?? 0) + 1)
    const assignmentSubmittedCount = new Map<string, number>()
    for (const a of assignmentSubmissions) assignmentSubmittedCount.set(a.userId, (assignmentSubmittedCount.get(a.userId) ?? 0) + 1)

    const list = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      provider: u.provider,
      createdAt: u.createdAt,
      credits: {
        balance: creditByUser.get(u.id)?.balance ?? 0,
        totalEarned: creditByUser.get(u.id)?.totalEarned ?? 0,
      },
      enrolledCourses: enrollmentCount.get(u.id) ?? 0,
      completedMissions: completedCount.get(u.id) ?? 0,
      quizzesPassed: quizPassedCount.get(u.id) ?? 0,
      assignmentsSubmitted: assignmentSubmittedCount.get(u.id) ?? 0,
      hasCredits: creditByUser.has(u.id),
    }))

    const aggregate = {
      users: users.length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      students: users.filter(u => u.role === 'STUDENT').length,
      enrollments: enrollments.length,
      completions: progress.filter(p => p.completed).length,
      totalCreditsOutstanding: credits.reduce((s, c) => s + c.balance, 0),
      totalCreditsEarned: credits.reduce((s, c) => s + c.totalEarned, 0),
      quizzesPassed: quizSubmissions.filter(q => q.passed).length,
      assignmentsSubmitted: assignmentSubmissions.length,
    }

    return successResponse({ users: list, aggregate }, 200, origin)
  } catch (error) {
    console.error('Admin users error:', error)
    return errorResponse('Internal server error', 500, origin)
  }
}