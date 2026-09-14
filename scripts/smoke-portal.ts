/**
 * Full-journey smoke test for the Nitai Skill Academy portal API.
 *
 * Walks the real user flow end-to-end against a deployed API:
 *   register → login → me → courses → enroll → course detail →
 *   mission → quiz (fail then pass) → progress (award credits) → dashboard.
 *
 * Run with:  npx tsx scripts/smoke-portal.ts
 *
 * Configure the target with SMOKE_API_BASE (defaults to production):
 *   SMOKE_API_BASE=https://nitai-skillacademy.netlify.app npx tsx scripts/smoke-portal.ts
 */

import * as crypto from 'crypto'

const API_BASE = process.env.SMOKE_API_BASE || 'https://nitai-skillacademy.netlify.app'
const SMOKE_COURSE_SLUG = process.env.SMOKE_COURSE_SLUG || 'farmers'

interface ApiUser {
  id: string
  name: string
  email: string
  credits: number
}
interface CourseMeta {
  id: string
  slug: string
  title: string
  missionNumber: number
}
interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

let failures = 0
let token = ''

function ok(message: string): void {
  console.log(`  ✓ ${message}`)
}

function fail(message: string): void {
  failures++
  console.error(`  ✗ ${message}`)
}

async function request<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${(data as { error?: string }).error || 'unknown error'}`)
  }
  return data as T
}

async function main(): Promise<void> {
  console.log(`Smoke-testing ${API_BASE}  (course: ${SMOKE_COURSE_SLUG})\n`)

  // ── 1. Register ────────────────────────────────────────────────────────────
  const email = `smoke_${Date.now()}@nitai-test.local`
  const password = 'SmokeTest123!'
  console.log('[1/9] Register')
  const reg = await request<{ token: string; user: ApiUser }>('/api/auth/register', 'POST', {
    name: 'Smoke Test Learner',
    email,
    password,
  })
  if (reg.token && reg.user?.email === email) ok(`registered ${email} (credits=${reg.user.credits})`)
  else fail('register did not return a valid token + user')
  token = reg.token

  // ── 2. Login ───────────────────────────────────────────────────────────────
  console.log('[2/9] Login')
  const login = await request<{ token: string; user: ApiUser }>('/api/auth/login', 'POST', { email, password })
  if (login.token && login.user?.id === reg.user.id) ok('login returned token + matching user')
  else fail('login did not return a valid token + user')
  token = login.token

  // ── 3. Me ──────────────────────────────────────────────────────────────────
  console.log('[3/9] Me')
  const me = await request<{ user: ApiUser }>('/api/auth/me', 'GET')
  if (me.user?.email === email) ok('GET /auth/me authenticated')
  else fail('GET /auth/me failed')

  // ── 4. Courses list ────────────────────────────────────────────────────────
  console.log('[4/9] Courses')
  const courses = await request<{ courses: CourseMeta[] }>('/api/courses', 'GET')
  if (courses.courses.length === 12) ok(`saw ${courses.courses.length} course(s) in catalog`)
  else fail(`expected 12 courses, got ${courses.courses.length}`)
  const target = courses.courses.find(c => c.slug === SMOKE_COURSE_SLUG)
  if (!target) {
    fail(`course "${SMOKE_COURSE_SLUG}" not in catalog`)
    throw new Error('aborting: target course missing')
  }
  ok(`catalog contains "${SMOKE_COURSE_SLUG}"`)
  const enrollmentBefore = courses.courses.find(c => c.slug === SMOKE_COURSE_SLUG) as unknown as { enrolled?: boolean }
  if (enrollmentBefore.enrolled === true) {
    fail(`expected "${SMOKE_COURSE_SLUG}" NOT enrolled before enrolling`)
  } else {
    ok(`"${SMOKE_COURSE_SLUG}" not enrolled yet`)
  }

  // ── 5. Enroll ──────────────────────────────────────────────────────────────
  console.log('[5/9] Enroll')
  await request('/api/enrollments', 'POST', { courseId: target.id })
  const afterEnroll = await request<{ courses: Array<{ slug: string; enrolled: boolean }> }>('/api/courses', 'GET')
  if (afterEnroll.courses.find(c => c.slug === SMOKE_COURSE_SLUG)?.enrolled === true) ok('enrollment confirmed via GET /courses')
  else fail('enrollment not reflected')

  // ── 6. Course detail ───────────────────────────────────────────────────────
  console.log('[6/9] Course detail')
  const detail = await request<{
    enrolled: boolean
    missions: Array<{ missionNumber: number; unlocked: boolean; completed: boolean }>
    course: { id: string }
  }>(`/api/courses?slug=${SMOKE_COURSE_SLUG}`, 'GET')
  if (!detail.enrolled) fail('course detail says not enrolled')
  else ok('course detail shows enrolled')
  if (!detail.missions.some(m => m.missionNumber === 1 && m.unlocked)) fail('mission 1 should be unlocked')
  else ok(`mission 1 unlocked, ${detail.missions.length} total missions`)

  // ── 7. Mission detail ──────────────────────────────────────────────────────
  console.log('[7/9] Mission + quiz')
  const mission = await request<{
    module: { id: number; creditsReward: number }
    quiz: { id: string; questions: QuizQuestion[]; passScore: number } | null
    progress: { completed: boolean }
    gating: { unlocked: boolean }
  }>(`/api/missions?courseSlug=${SMOKE_COURSE_SLUG}&mission=1`, 'GET')
  if (!mission.gating.unlocked) fail('mission gating: expected unlocked')
  else ok('mission gating unlocked')
  if (!mission.quiz) fail('mission has no quiz')
  else ok(`mission quiz has ${mission.quiz.questions.length} question(s)`)

  // ── 8. Quiz: fail once, then pass ──────────────────────────────────────────
  console.log('[8/9] Quiz submit (fail → pass)')
  const quiz = mission.quiz as { id: string; questions: QuizQuestion[] }
  if (mission.quiz) {
    const allWrong = Array(quiz.questions.length).fill(-1)
    const first = await request<{ submission: { passed: boolean; score: number } }>('/api/quizzes', 'POST', {
      quizId: quiz.id,
      answers: allWrong,
    })
    if (first.submission.passed) fail('expected first quiz attempt to FAIL')
    else ok(`first attempt failed as expected (score=${first.submission.score})`)

    const allCorrect = quiz.questions.map(q => q.correctIndex)
    const second = await request<{ submission: { passed: boolean; score: number } }>('/api/quizzes', 'POST', {
      quizId: quiz.id,
      answers: allCorrect,
    })
    if (second.submission.passed) ok(`second attempt passed (score=${second.submission.score})`)
    else fail('expected second quiz attempt to PASS')
  }

  // ── 9. Complete + dashboard ────────────────────────────────────────────────
  console.log('[9/9] Complete mission + dashboard')
  const creditsBefore = me.user.credits
  const complete = await request<{ creditsEarned: number }>('/api/progress', 'POST', {
    moduleId: mission.module.id,
  })
  if (complete.creditsEarned !== mission.module.creditsReward) {
    fail(`expected creditsEarned=${mission.module.creditsReward}, got ${complete.creditsEarned}`)
  } else {
    ok(`completed mission 1, +${complete.creditsEarned} credits`)
  }

  const dashboard = await request<{ stats: { totalCredits: number; completedMissions: number } }>('/api/dashboard', 'GET')
  if (dashboard.stats.totalCredits >= creditsBefore + mission.module.creditsReward) {
    ok(`dashboard stats reflect credits (${dashboard.stats.totalCredits})`)
  } else {
    fail(`dashboard credits (${dashboard.stats.totalCredits}) did not increase from ${creditsBefore}`)
  }
  if (dashboard.stats.completedMissions >= 1) ok('dashboard shows a completed mission')
  else fail('dashboard shows 0 completed missions')

  const afterComplete = await request<{ missions: Array<{ missionNumber: number; unlocked: boolean; completed: boolean }> }>(
    `/api/courses?slug=${SMOKE_COURSE_SLUG}`,
    'GET'
  )
  const m1 = afterComplete.missions.find(m => m.missionNumber === 1)
  const m2 = afterComplete.missions.find(m => m.missionNumber === 2)
  if (m1?.completed && m2?.unlocked) ok('mission 1 completed, mission 2 now unlocked')
  else fail('gating did not advance: mission1.completed/mission2.unlocked check failed')

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('')
  if (failures === 0) {
    console.log('SMOKE TEST PASSED ✅')
  } else {
    console.log(`SMOKE TEST FAILED with ${failures} assertion(s) ❌`)
    process.exitCode = 1
  }
}

main().catch(err => {
  console.error('SMOKE TEST ERROR:', err instanceof Error ? err.message : err)
  process.exit(1)
})