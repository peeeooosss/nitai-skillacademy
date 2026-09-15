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
  const courseSlug = params.courseSlug
  const mission = parseInt(params.mission || '0')

  if (!courseSlug || !mission) {
    return errorResponse('courseSlug and mission query parameters required', 400, origin)
  }

  try {
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } })
    if (!course || !course.isActive) {
      return errorResponse('Course not found', 404, origin)
    }

    const module = await prisma.module.findUnique({
      where: { courseId_missionNumber: { courseId: course.id, missionNumber: mission } },
      include: {
        quiz: true,
        assignment: true,
        aiContext: true,
        week: true,
      },
    })

    if (!module) {
      return errorResponse('Mission not found', 404, origin)
    }

    // All course missions for gating + progress
    const allMissions = await prisma.module.findMany({
      where: { courseId: course.id, missionNumber: { not: null } },
      orderBy: { missionNumber: 'asc' },
      select: { id: true, missionNumber: true, title: true },
    })

    const progressRows = await prisma.userProgress.findMany({
      where: { userId: payload.userId },
    })
    const progressByModule = new Map(progressRows.map(p => [p.moduleId, p]))

    const liveSession = await prisma.liveSession.findFirst({
      where: { courseId: course.id, missionNumber: mission, isActive: true },
      orderBy: { scheduledAt: 'desc' },
    })

    const idx = allMissions.findIndex(m => m.id === module.id)
    const previousCompleted = idx <= 0
      ? true
      : progressByModule.get(allMissions[idx - 1].id)?.completed === true

    const current = progressByModule.get(module.id)
    const unlocked = previousCompleted

    interface RawSubmodule { index: number; title: string; markdown: string; exampleQuiz?: unknown }
    const rawSubmodules = ((module.submodules as RawSubmodule[] | null) || [])
      .slice()
      .sort((a, b) => a.index - b.index)
    const completedSet = new Set<number>((current?.completedSubmodules as number[] | null) || [])
    const submodules = rawSubmodules.map((s, i) => ({
      index: s.index,
      title: s.title,
      markdown: s.markdown,
      exampleQuiz: s.exampleQuiz ?? null,
      unlocked: i === 0 || completedSet.has(rawSubmodules[i - 1].index),
      completed: completedSet.has(s.index),
    }))

    return successResponse({
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        shortTitle: course.shortTitle,
        icon: course.icon,
        accentColor: course.accentColor,
      },
      module: {
        id: module.id,
        dayNumber: module.dayNumber,
        missionNumber: module.missionNumber,
        sessionType: module.sessionType,
        title: module.title,
        description: module.description,
        submodules,
        videoUrl: module.videoUrl,
        creditsReward: module.creditsReward,
      },
      liveSession: liveSession
        ? {
            id: liveSession.id,
            title: liveSession.title,
            description: liveSession.description,
            platform: liveSession.platform,
            link: liveSession.link,
            scheduledAt: liveSession.scheduledAt.toISOString(),
            durationMins: liveSession.durationMins,
          }
        : null,
      quiz: module.quiz
        ? {
            id: module.quiz.id,
            questions: module.quiz.questions,
            passScore: module.quiz.passScore,
            timeLimit: module.quiz.timeLimit,
          }
        : null,
      assignment: module.assignment
        ? {
            id: module.assignment.id,
            prompt: module.assignment.prompt,
            type: module.assignment.type,
            maxCredits: module.assignment.maxCredits,
          }
        : null,
      progress: {
        videoWatched: current?.videoWatched ?? false,
        quizPassed: current?.quizPassed ?? false,
        assignmentSubmitted: current?.assignmentSubmitted ?? false,
        completed: current?.completed ?? false,
        submodulesCompleted: completedSet.size,
        submodulesTotal: submodules.length,
      },
      gating: {
        unlocked,
        firstMission: mission === 1,
        previousMissionNumber: idx > 0 ? allMissions[idx - 1].missionNumber : null,
        previousMissionTitle: idx > 0 ? allMissions[idx - 1].title : null,
        previousCompleted,
      },
    }, 200, origin)
  } catch (error) {
    console.error('Get mission error:', error)
    return errorResponse('Internal server error', 500, origin)
  }
}