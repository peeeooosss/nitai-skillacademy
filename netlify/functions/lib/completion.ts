import prisma from './prisma'

export interface StageFlags {
  videoWatched: boolean
  quizPassed: boolean
  assignmentSubmitted: boolean
}

export interface CompletionResult {
  completed: boolean
  newlyCompleted: boolean
  moduleId: number
  creditsRewarded: number
}

/**
 * Strict sequential completion evaluator.
 *
 * A module is only "completed" once ALL three stages are true:
 *   videoWatched && quizPassed && assignmentSubmitted
 *
 * Called after every stage write (video / quiz / assignment). The FIRST time
 * all three become true it:
 *   1. marks UserProgress completed + completedAt, and
 *   2. awards module.creditsReward (XP) exactly once (guard: previously not completed).
 *
 * No credits are granted on intermediate stages — XP happens only at hard
 * completion. Repeated writes after completion are idempotent (no double XP).
 */
export async function evaluateAndMaybeComplete(
  userId: string,
  moduleId: number,
  flags: StageFlags,
): Promise<CompletionResult> {
  const completed = flags.videoWatched && flags.quizPassed && flags.assignmentSubmitted

  // Pre-write read: was this already completed? (transition guard for XP)
  const before = await prisma.userProgress.findUnique({
    where: { userId_moduleId: { userId, moduleId } },
  })
  const wasCompleted = before?.completed === true

  await prisma.userProgress.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    update: {
      videoWatched: flags.videoWatched,
      quizPassed: flags.quizPassed,
      assignmentSubmitted: flags.assignmentSubmitted,
      completed,
      completedAt: completed ? new Date() : null,
    },
    create: {
      userId,
      moduleId,
      weekId: before?.weekId ?? undefined,
      videoWatched: flags.videoWatched,
      quizPassed: flags.quizPassed,
      assignmentSubmitted: flags.assignmentSubmitted,
      completed,
      completedAt: completed ? new Date() : null,
    },
  })

  if (!completed || wasCompleted) {
    return { completed, newlyCompleted: false, moduleId, creditsRewarded: 0 }
  }

  // First-time full completion → award XP exactly once
  const module = await prisma.module.findUnique({ where: { id: moduleId } })
  const reward = module?.creditsReward ?? 0

  if (reward > 0) {
    await prisma.userCredit.upsert({
      where: { userId },
      update: {
        balance: { increment: reward },
        totalEarned: { increment: reward },
      },
      create: {
        userId,
        balance: reward,
        totalEarned: reward,
      },
    })

    await prisma.creditTransaction.create({
      data: {
        userId,
        type: 'EARNED',
        amount: reward,
        description: module ? `Completed mission: ${module.title}` : 'Mission completed',
        referenceId: String(moduleId),
      },
    })
  }

  return { completed: true, newlyCompleted: true, moduleId, creditsRewarded: reward }
}