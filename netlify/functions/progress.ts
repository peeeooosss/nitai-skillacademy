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

  if (event.httpMethod === 'GET') {
    try {
      const progress = await prisma.userProgress.findMany({
        where: { userId: payload.userId },
        include: { module: true },
      })

      const completedDays = progress
        .filter(p => p.completed)
        .map(p => p.module.dayNumber)
        .sort((a, b) => a - b)

      return successResponse({
        completedDays,
        totalCompleted: completedDays.length,
      }, 200, origin)
    } catch (error) {
      console.error('Get progress error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}')
      const { moduleId, submoduleIndex } = body

      if (!moduleId) {
        return errorResponse('moduleId is required', 400, origin)
      }

      const mod = await prisma.module.findUnique({ where: { id: moduleId } })
      if (!mod) {
        return errorResponse('Module not found', 404, origin)
      }

      const submodules = ((mod.submodules as { index: number }[] | null) || [])
        .slice()
        .sort((a, b) => a.index - b.index)

      const existing = await prisma.userProgress.findUnique({
        where: { userId_moduleId: { userId: payload.userId, moduleId } },
      })

      // ── Legacy one-shot completion (missions without sub-modules) ──────────
      if (submodules.length === 0) {
        if (existing?.completed) {
          return successResponse({ message: 'Already completed', completed: true }, 200, origin)
        }

        await prisma.userProgress.upsert({
          where: { userId_moduleId: { userId: payload.userId, moduleId } },
          update: {
            completed: true,
            completedAt: new Date(),
            weekId: mod.weekId,
          },
          create: {
            userId: payload.userId,
            moduleId,
            weekId: mod.weekId,
            completed: true,
            completedAt: new Date(),
          },
        })

        await prisma.userCredit.upsert({
          where: { userId: payload.userId },
          update: {
            balance: { increment: mod.creditsReward },
            totalEarned: { increment: mod.creditsReward },
          },
          create: {
            userId: payload.userId,
            balance: mod.creditsReward,
            totalEarned: mod.creditsReward,
          },
        })

        return successResponse({
          message: 'Module completed',
          creditsEarned: mod.creditsReward,
          completed: true,
          submodulesCompleted: 0,
          submodulesTotal: 0,
        }, 200, origin)
      }

      // ── Module-sequential completion (missions with sub-modules) ───────────
      if (typeof submoduleIndex !== 'number' || !Number.isInteger(submoduleIndex)) {
        return errorResponse('submoduleIndex is required for this mission', 400, origin)
      }

      const position = submodules.findIndex(s => s.index === submoduleIndex)
      if (position === -1) {
        return errorResponse('Invalid submoduleIndex', 400, origin)
      }

      const doneSet = new Set<number>((existing?.completedSubmodules as number[] | null) || [])
      if (existing?.completed) {
        return successResponse({ message: 'Already completed', completed: true, creditsEarned: 0 }, 200, origin)
      }
      if (doneSet.has(submoduleIndex)) {
        return successResponse({ message: 'Module already completed', completed: false, creditsEarned: 0 }, 200, origin)
      }

      // Enforce sequential unlocking: module N can only be completed after N-1.
      if (position > 0 && !doneSet.has(submodules[position - 1].index)) {
        return errorResponse('Complete the previous module first', 400, origin)
      }

      doneSet.add(submoduleIndex)
      const allDone = submodules.every(s => doneSet.has(s.index))
      const completedSubmodules = [...doneSet].sort((a, b) => a - b)

      await prisma.userProgress.upsert({
        where: { userId_moduleId: { userId: payload.userId, moduleId } },
        update: {
          completedSubmodules,
          completed: allDone,
          completedAt: allDone ? new Date() : existing?.completedAt ?? null,
          weekId: mod.weekId,
        },
        create: {
          userId: payload.userId,
          moduleId,
          weekId: mod.weekId,
          completedSubmodules,
          completed: allDone,
          completedAt: allDone ? new Date() : null,
        },
      })

      let creditsEarned = 0
      if (allDone) {
        await prisma.userCredit.upsert({
          where: { userId: payload.userId },
          update: {
            balance: { increment: mod.creditsReward },
            totalEarned: { increment: mod.creditsReward },
          },
          create: {
            userId: payload.userId,
            balance: mod.creditsReward,
            totalEarned: mod.creditsReward,
          },
        })
        creditsEarned = mod.creditsReward
      }

      return successResponse({
        message: allDone ? 'Mission completed' : 'Module completed',
        completed: allDone,
        submodulesCompleted: completedSubmodules.length,
        submodulesTotal: submodules.length,
        creditsEarned,
      }, 200, origin)
    } catch (error) {
      console.error('Complete module error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  return errorResponse('Method not allowed', 405, origin)
}