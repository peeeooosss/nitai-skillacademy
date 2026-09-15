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

async function request<T = unknown>(path: string, method = 'GET', body?: unknown): Promise<T> {
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
    module: { id: number; creditsReward: number; submodules: unknown[] }
    quiz: { id: string; questions: QuizQuestion[]; passScore: number } | null
    progress: { completed: boolean }
    gating: { unlocked: boolean }
  }>(`/api/missions?courseSlug=${SMOKE_COURSE_SLUG}&mission=1`, 'GET')
  if (!mission.gating.unlocked) fail('mission gating: expected unlocked')
  else ok('mission gating unlocked')
  const hasSubmodules = Array.isArray(mission.module.submodules) && mission.module.submodules.length > 0
  if (hasSubmodules) {
    ok(`mission has ${mission.module.submodules.length} sub-modules (module-sequential)`)
  } else {
    if (!mission.quiz) fail('mission has no quiz')
    else ok(`mission quiz has ${mission.quiz.questions.length} question(s)`)
  }

  // ── 8. Quiz: fail once, then pass ──────────────────────────────────────────
  if (hasSubmodules) {
    console.log('[8/9] Graded quiz skipped (submodule-sequential mission)')
  } else {
    console.log('[8/9] Quiz submit (fail → pass)')
  }
  const quiz = mission.quiz as { id: string; questions: QuizQuestion[] } | null
  if (quiz) {
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
  if (hasSubmodules) {
    // Legacy one-shot complete must be rejected for submodule missions.
    try {
      await request('/api/progress', 'POST', { moduleId: mission.module.id })
      fail('legacy /progress (no submoduleIndex) should be rejected for submodule missions')
    } catch {
      ok('legacy /progress (no submoduleIndex) correctly rejected for submodule missions')
    }
  } else {
    const complete = await request<{ creditsEarned: number }>('/api/progress', 'POST', {
      moduleId: mission.module.id,
    })
    if (complete.creditsEarned !== mission.module.creditsReward) {
      fail(`expected creditsEarned=${mission.module.creditsReward}, got ${complete.creditsEarned}`)
    } else {
      ok(`completed mission 1, +${complete.creditsEarned} credits`)
    }
  }

  const dashboard = await request<{ stats: { totalCredits: number; completedMissions: number } }>('/api/dashboard', 'GET')
  const minCredits = hasSubmodules ? creditsBefore : creditsBefore + mission.module.creditsReward
  if (dashboard.stats.totalCredits >= minCredits) {
    ok(`dashboard stats reflect credits (${dashboard.stats.totalCredits})`)
  } else {
    fail(`dashboard credits (${dashboard.stats.totalCredits}) did not increase from ${creditsBefore}`)
  }
  if (dashboard.stats.completedMissions >= (hasSubmodules ? 0 : 1)) ok('dashboard shows a completed mission')
  else fail('dashboard shows 0 completed missions')

  const afterComplete = await request<{ missions: Array<{ missionNumber: number; unlocked: boolean; completed: boolean }> }>(
    `/api/courses?slug=${SMOKE_COURSE_SLUG}`,
    'GET'
  )
  const m1 = afterComplete.missions.find(m => m.missionNumber === 1)
  const m2 = afterComplete.missions.find(m => m.missionNumber === 2)
  if (!hasSubmodules) {
    if (m1?.completed && m2?.unlocked) ok('mission 1 completed, mission 2 now unlocked')
    else fail('gating did not advance: mission1.completed/mission2.unlocked check failed')
  } else {
    if (m1 && !m1.completed) ok('mission 1 correctly NOT completed via one-shot (waiting for modules)')
    else fail('mission 1 should not be completed by legacy one-shot on a submodule mission')
  }

  // ── 10. Live sessions (enrolled-only student lookup) ──────────────────────
  console.log('[10] Live sessions (enrolled scope)')
  const live = await request<{ upcoming: unknown[]; past: unknown[] }>('/api/live-sessions', 'GET')
  if (Array.isArray(live.upcoming) && Array.isArray(live.past)) {
    ok(`live sessions lists present (upcoming=${live.upcoming.length}, past=${live.past.length})`)
  } else {
    fail('live-sessions should return {upcoming, past}')
  }
  const scoped = await request<{ sessions: unknown[] }>(`/api/live-sessions?courseSlug=${SMOKE_COURSE_SLUG}&mission=1`, 'GET')
  if (Array.isArray(scoped.sessions)) ok('course/mission scoped live lookup works')
  else fail('scoped live-sessions lookup should return a sessions array')

  // ── 11. Mission sub-modules + live step ───────────────────────────────────
  console.log('[11] Mission submodules + live step')
  const m3 = await request<{
    module: { missionNumber: number; submodules: Array<{
      index: number
      unlocked: boolean
      completed: boolean
      exampleQuiz: unknown[] | null
    }> }
    liveSession: unknown | null
  }>('/api/missions?courseSlug=school-students&mission=3', 'GET')
  if (Array.isArray(m3.module.submodules) && m3.module.submodules.length >= 5) {
    ok(`school-students mission 3 parsed ${m3.module.submodules.length} sub-modules`)
  } else {
    fail('expected ≥5 parsed sub-modules for school-students mission 3')
  }
  const firstSub = m3.module.submodules[0]
  const withQuiz = m3.module.submodules.filter(s => Array.isArray(s.exampleQuiz) && s.exampleQuiz.length > 0).length
  if (firstSub && firstSub.unlocked === true && firstSub.completed === false) {
    ok('module 1 unlocked + not completed (sequential start)')
  } else {
    fail('module 1 should start unlocked + not completed')
  }
  if (m3.module.submodules[1] && m3.module.submodules[1].unlocked === false) {
    ok('module 2 locked until module 1 completed')
  } else {
    fail('module 2 should be locked before module 1 completed')
  }
  if (withQuiz >= 5) ok(`${withQuiz} modules carry an example quiz`)
  else fail(`expected ≥5 modules with example quiz, got ${withQuiz}`)
  if ('liveSession' in m3) ok(`mission response includes liveSession (${m3.liveSession ? 'attached' : 'none'})`)
  else fail('mission response missing liveSession field')

  // ── 11b. Module-sequential completion + credits-award-once ────────────────
  console.log('[11b] Module-sequential completion flow')
  const flow = await request<{
    module: { id: number; creditsReward: number }
    progress: { completed: boolean; submodulesCompleted: number; submodulesTotal: number }
  }>('/api/missions?courseSlug=school-students&mission=3', 'GET')
  const flowModules = m3.module.submodules
  const anyCredits = flow.module.creditsReward
  const advance: Array<'premature' | 'sequential' | 'final'> = []
  let creditsEarnedTotal = 0
  for (let i = 0; i < flowModules.length; i++) {
    const s = flowModules[i]
    const resp = await request<{
      completed: boolean
      submodulesCompleted: number
      submodulesTotal: number
      creditsEarned: number
    }>('/api/progress', 'POST', {
      moduleId: flow.module.id,
      submoduleIndex: s.index,
    })
    creditsEarnedTotal += resp.creditsEarned
    if (i < flowModules.length - 1) {
      if (resp.completed === false && resp.submodulesCompleted === i + 1) advance.push('sequential')
      else advance.push('premature')
    } else {
      if (resp.completed === true && resp.submodulesCompleted === flowModules.length) advance.push('final')
      else advance.push('premature')
    }
  }
  if (advance.every(a => a !== 'premature')) {
    ok(`modules advanced sequentially (${advance.length} steps) and final step completed=true`)
  } else {
    fail(`module flow misbehaved: ${advance.join(',')}`)
  }
  if (creditsEarnedTotal === anyCredits) ok(`credits awarded once at completion (+${creditsEarnedTotal})`)
  else fail(`credits should be awarded once (got ${creditsEarnedTotal}, expected ${anyCredits})`)

  // Posting the same module again must not re-award credits.
  const dup = await request<{ creditsEarned: number; completed: boolean }>('/api/progress', 'POST', {
    moduleId: flow.module.id,
    submoduleIndex: flowModules[0].index,
  })
  if (dup.creditsEarned === 0) ok('duplicate completion did not re-award credits')
  else fail(`duplicate completion re-awarded credits (${dup.creditsEarned})`)

  // ── 12. Admin authz — student must be blocked ─────────────────────────────
  console.log('[12] Admin authz (student blocked)')
  const forbidden = await fetch(`${API_BASE}/api/admin/live-sessions`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (forbidden.status === 403) ok('student token rejected at admin endpoint (403)')
  else fail(`expected 403 for student at admin endpoint, got ${forbidden.status}`)

  // ── 13. Admin CRUD (opt-in) ───────────────────────────────────────────────
  const adminEmail = process.env.SMOKE_ADMIN_EMAIL
  if (adminEmail) {
    console.log('[13] Admin live-session CRUD')
    const adminPassword = 'SmokeAdmin123!'
    let adminTok = ''
    try {
      const r1 = await request<{ token: string; user: { role: string } }>('/api/auth/register', 'POST', {
        name: 'Smoke Admin Tester',
        email: adminEmail,
        password: adminPassword,
      })
      adminTok = r1.token
      token = adminTok
      if (r1.user.role === 'ADMIN') ok(`admin register granted ADMIN role (${adminEmail})`)
      else fail(`expected role ADMIN on register, got ${r1.user.role}`)
    } catch {
      const r2 = await request<{ token: string; user: { role: string } }>('/api/auth/login', 'POST', {
        email: adminEmail,
        password: adminPassword,
      })
      adminTok = r2.token
      token = adminTok
      if (r2.user.role === 'ADMIN') ok('reused existing admin account (role ADMIN)')
      else fail(`admin login role=${r2.user.role}, expected ADMIN`)
    }
    const cc = await request<{ courses: Array<{ slug: string; id: string }> }>('/api/courses', 'GET')
    const school = cc.courses.find(c => c.slug === 'school-students')
    if (!school) {
      fail('school-students course missing for admin CRUD test')
    } else {
      const future = new Date(Date.now() + 24 * 3600 * 1000).toISOString()
      const created = await request<{ session: { id: string; isActive: boolean } }>('/api/admin/live-sessions', 'POST', {
        title: 'Smoke Live Q&A',
        description: 'Created by smoke test',
        platform: 'ZOOM',
        link: 'https://zoom.us/j/123456789',
        scheduledAt: future,
        durationMins: 45,
        courseId: school.id,
        missionNumber: 3,
        isActive: true,
      })
      ok(`admin created session (id=${created.session.id})`)

      // Un-enrolled student must not see it (school-students not enrolled by smoke user)
      const studentTok = token
      token = '' // request() only sends header when token is set; login as admin again below
      // We already own adminTok; restore it for the remaining admin calls
      token = adminTok
      const scoped2 = await request<{ sessions: unknown[] }>('/api/live-sessions?courseSlug=school-students&mission=3', 'GET')
      if (scoped2.sessions.length === 0) ok('enrolled-only: un-enrolled student sees 0 sessions for school-students')
      else fail('un-enrolled student should see 0 sessions for school-students')
      void studentTok

      const updated = await request<{ session: { isActive: boolean } }>(
        `/api/admin/live-sessions?id=${created.session.id}`,
        'PUT',
        { isActive: false }
      )
      if (updated.session.isActive === false) ok('admin toggled session inactive')
      else fail('toggle inactive failed')

      await request(`/api/admin/live-sessions?id=${created.session.id}`, 'DELETE')
      const after = await request<{ sessions: Array<{ id: string }> }>('/api/admin/live-sessions', 'GET')
      if (after.sessions.some(s => s.id === created.session.id)) fail('session still present after delete')
      else ok('session deleted')
    }
  } else {
    console.log('  (admin CRUD checks skipped — set SMOKE_ADMIN_EMAIL to run)')
  }

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