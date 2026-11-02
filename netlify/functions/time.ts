import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { verifyToken, extractToken } from './lib/auth'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'

const MAX_CHUNK_SECONDS = 300

export const handler: NetlifyHandler = async (event) => {
  const origin = event.headers.origin

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCorsHeaders(origin), body: '' }
  }

  if (event.httpMethod !== 'POST') {
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
    const body = JSON.parse(event.body || '{}')
    const moduleId = Number(body.moduleId)
    const rawSeconds = Number(body.seconds)

    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      return errorResponse('moduleId is required', 400, origin)
    }
    if (!Number.isFinite(rawSeconds) || rawSeconds <= 0) {
      return errorResponse('seconds must be a positive number', 400, origin)
    }

    const seconds = Math.min(Math.max(Math.floor(rawSeconds), 1), MAX_CHUNK_SECONDS)
    const mod = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true, weekId: true },
    })
    if (!mod) {
      return errorResponse('Module not found', 404, origin)
    }

    const progress = await prisma.userProgress.upsert({
      where: { userId_moduleId: { userId: payload.userId, moduleId } },
      update: {
        timeSpentSeconds: { increment: seconds },
        lastActiveAt: new Date(),
        weekId: mod.weekId,
      },
      create: {
        userId: payload.userId,
        moduleId,
        weekId: mod.weekId,
        timeSpentSeconds: seconds,
        lastActiveAt: new Date(),
      },
      select: { timeSpentSeconds: true },
    })

    return successResponse({ timeSpentSeconds: progress.timeSpentSeconds }, 200, origin)
  } catch (error) {
    console.error('Track study time error:', error)
    return errorResponse('Internal server error', 500, origin)
  }
}
