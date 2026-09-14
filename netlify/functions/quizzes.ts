import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { verifyToken, extractToken } from './lib/auth'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'
import { evaluateAndMaybeComplete } from './lib/completion'

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
  const moduleId = parseInt(params.moduleId || '0')

  if (event.httpMethod === 'GET') {
    if (!moduleId) {
      return errorResponse('moduleId query parameter required', 400, origin)
    }
    try {
      const quiz = await prisma.quiz.findUnique({ where: { moduleId } })

      if (!quiz) {
        return successResponse({ quiz: null, submissions: [] }, 200, origin)
      }

      const submissions = await prisma.quizSubmission.findMany({
        where: { userId: payload.userId, quizId: quiz.id },
        orderBy: { submittedAt: 'desc' },
      })

      const best = submissions[0]

      return successResponse({
        quiz: {
          id: quiz.id,
          moduleId: quiz.moduleId,
          questions: quiz.questions,
          passScore: quiz.passScore,
          timeLimit: quiz.timeLimit,
        },
        bestSubmission: best
          ? {
              id: best.id,
              score: best.score,
              passed: best.passed,
              submittedAt: best.submittedAt,
            }
          : null,
        submissions: submissions.map(s => ({
          id: s.id,
          score: s.score,
          passed: s.passed,
          submittedAt: s.submittedAt,
        })),
      }, 200, origin)
    } catch (error) {
      console.error('Get quiz error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}')
      const { quizId, answers } = body

      if (!quizId || !answers || !Array.isArray(answers)) {
        return errorResponse('quizId and answers array required', 400, origin)
      }

      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { module: true },
      })
      if (!quiz) {
        return errorResponse('Quiz not found', 404, origin)
      }

      const questions = quiz.questions as Array<{ question: string; options: string[]; correctIndex: number }>
      let correctCount = 0
      questions.forEach((q, i) => {
        if (questions[i] && answers[i] === q.correctIndex) correctCount++
      })

      const totalQuestions = questions.length || 1
      const score = Math.round((correctCount / totalQuestions) * 100)
      const passed = score >= (quiz.passScore || 75)

      const submission = await prisma.quizSubmission.create({
        data: {
          userId: payload.userId,
          quizId: quiz.id,
          answers,
          score,
          passed,
        },
      })

      // Strict-gating writeback: update quizPassed and run the shared sequential
      // completion evaluator (completed only when all three stages are true).
      const moduleId_ = quiz.module.id
      const current = await prisma.userProgress.findUnique({
        where: { userId_moduleId: { userId: payload.userId, moduleId: moduleId_ } },
      })

      const completion = await evaluateAndMaybeComplete(payload.userId, moduleId_, {
        videoWatched: current?.videoWatched ?? false,
        quizPassed: passed,
        assignmentSubmitted: current?.assignmentSubmitted ?? false,
      })

      return successResponse({
        submission: {
          id: submission.id,
          score,
          passed,
          correctCount,
          totalQuestions,
        },
        completion: {
          completed: completion.completed,
          newlyCompleted: completion.newlyCompleted,
          creditsRewarded: completion.creditsRewarded,
        },
      }, 201, origin)
    } catch (error) {
      console.error('Submit quiz error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  return errorResponse('Method not allowed', 405, origin)
}