/**
 * Seed all 12 Nitai Skill Academy courses into Prisma.
 *
 * Reads the authored mission markdown from scripts/content/courses/{slug}/module-{NN}.md
 * and idempotently upserts:
 *   Course → Week (one per course) → Module (one per mission)
 *         → Quiz, Assignment, ModuleAIContext per module
 *
 * Run with:  npx tsx scripts/seed-courses.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface CourseMeta {
  slug: string
  dir: string
  index: string
  title: string
  shortTitle: string
  tagline: string
  description: string
  trackName: string
  audience: string
  category: string
  outcomes: string[]
  duration: string
  icon: string
  accentColor: string
  position: number
  weekNumber: number
  dayBase: number
}

const COURSES: CourseMeta[] = [
  {
    slug: 'school-students',
    dir: '01-school-students',
    index: '01',
    title: 'AI for School Students (Class 6-12)',
    shortTitle: 'School Students',
    tagline: 'AI Literacy · Safe AI Use · Creative Projects',
    description:
      'A fun, hands-on introduction to AI for young learners. Discover what AI is, talk to it safely, use it for homework and projects, and build an AI showcase of your own.',
    trackName: 'Young AI Explorer Track',
    audience: 'Class 6-12 school students exploring AI for the first time',
    category: 'Students & Youth',
    outcomes: [
      'Use AI tools safely and confidently for schoolwork and projects',
      'Build simple AI-assisted presentations, stories, and science projects',
      'Understand AI ethics and responsible use from an early age',
    ],
    duration: '8 Weeks · Weekend Batches',
    icon: 'School',
    accentColor: '#22d3ee',
    position: 1,
    weekNumber: 101,
    dayBase: 1001,
  },
  {
    slug: 'college-students',
    dir: '02-college-students',
    index: '02',
    title: 'AI for College Students (UG & PG)',
    shortTitle: 'College Students',
    tagline: 'Portfolio Building · Prompt Engineering · Placement Ready',
    description:
      'Apply AI across assignments, research, and campus projects. Build a personal AI project portfolio that earns internships and placements — while learning prompt engineering, automation, and agents.',
    trackName: 'Campus-to-Career AI Track',
    audience: 'Undergraduate and postgraduate students across streams',
    category: 'Students & Youth',
    outcomes: [
      'Apply AI tools across assignments, research, and campus projects',
      'Build a personal AI project portfolio for internships and placements',
      'Get introduced to prompt engineering, automation, and AI agents',
    ],
    duration: '10 Weeks · Live + Self-Paced',
    icon: 'GraduationCap',
    accentColor: '#a78bfa',
    position: 2,
    weekNumber: 102,
    dayBase: 2001,
  },
  {
    slug: 'job-seekers',
    dir: '03-job-seekers',
    index: '03',
    title: 'AI for Job Seekers & Career Transitioners',
    shortTitle: 'Job Seekers',
    tagline: 'Resume AI · Interview Prep · Role Mapping',
    description:
      'A career sprint that maps you into AI-augmented roles, rebuilds your resume and LinkedIn with AI, runs AI-powered mock interviews, and builds a job-search system that actually converts.',
    trackName: 'Career Reboot AI Track',
    audience: 'Job seekers and professionals switching into AI-enabled roles',
    category: 'Students & Youth',
    outcomes: [
      'Rebuild your resume and LinkedIn profile using AI tools',
      'Practice AI-powered mock interviews and live case studies',
      'Identify AI-augmented roles that match your existing experience',
    ],
    duration: '6 Weeks · Career Sprint',
    icon: 'Briefcase',
    accentColor: '#f472b6',
    position: 3,
    weekNumber: 103,
    dayBase: 3001,
  },
  {
    slug: 'entrepreneurs',
    dir: '04-entrepreneurs',
    index: '04',
    title: 'AI for Aspiring Entrepreneurs',
    shortTitle: 'Entrepreneurs',
    tagline: 'MVP Building · Market Research · Pitch Ready',
    description:
      'A founder track that moves you from idea to validated lean startup: market research with AI, business model design, an MVP and landing page, a pitch deck, and your first paying customers.',
    trackName: 'Founder AI Track',
    audience: 'First-time founders validating an idea before building a company',
    category: 'Students & Youth',
    outcomes: [
      'Validate a business idea using AI-powered market research',
      'Build MVPs, landing pages, and pitch decks using AI tools',
      'Design a lean, AI-first operating model for a new venture',
    ],
    duration: '8 Weeks · Founder Track',
    icon: 'Rocket',
    accentColor: '#fbbf24',
    position: 4,
    weekNumber: 104,
    dayBase: 4001,
  },
  {
    slug: 'working-professionals',
    dir: '05-professionals',
    index: '05',
    title: 'AI for Working Professionals',
    shortTitle: 'Professionals',
    tagline: 'Workflow Automation · Productivity · Career Growth',
    description:
      'Automate repetitive tasks inside your current role, build department-specific AI workflows for reporting and communication, and present measurable AI-led productivity gains to your manager.',
    trackName: 'Workplace AI Track',
    audience: 'Employees across functions who want to stay relevant with AI',
    category: 'Professionals & Leaders',
    outcomes: [
      'Automate repetitive tasks inside your current role using AI',
      'Build department-specific AI workflows for reporting and communication',
      'Present measurable AI-led productivity gains to your manager',
    ],
    duration: '6 Weeks · Evenings & Weekends',
    icon: 'Users',
    accentColor: '#38bdf8',
    position: 5,
    weekNumber: 105,
    dayBase: 5001,
  },
  {
    slug: 'business-leaders',
    dir: '06-leaders',
    index: '06',
    title: 'AI for Business Leaders & Executives',
    shortTitle: 'Leaders',
    tagline: 'AI Strategy · Change Leadership · ROI Planning',
    description:
      'Design an AI adoption roadmap for your organisation, evaluate AI vendors, tools, and build-vs-buy decisions, and lead change management for AI-enabled teams.',
    trackName: 'Executive AI Track',
    audience: 'Founders, CXOs, and senior leaders driving AI transformation',
    category: 'Professionals & Leaders',
    outcomes: [
      'Design an AI adoption roadmap for your organisation',
      'Evaluate AI vendors, tools, and build-vs-buy decisions',
      'Lead change management for AI-enabled teams',
    ],
    duration: '4 Weeks · Executive Format',
    icon: 'Crown',
    accentColor: '#a3e635',
    position: 6,
    weekNumber: 106,
    dayBase: 6001,
  },
  {
    slug: 'journalists',
    dir: '07-journalists',
    index: '07',
    title: 'AI for Journalists & Media Creators',
    shortTitle: 'Journalists',
    tagline: 'Content AI · Fact-Checking · Media Production',
    description:
      'Use AI for research, fact-checking, and story structuring. Produce AI-assisted video, audio, and visual content, and build an ethical framework for AI use in journalism.',
    trackName: 'Newsroom AI Track',
    audience: 'Journalists, editors, and media professionals producing content faster',
    category: 'Professionals & Leaders',
    outcomes: [
      'Use AI for research, fact-checking, and story structuring',
      'Produce AI-assisted video, audio, and visual content',
      'Build an ethical framework for AI use in journalism',
    ],
    duration: '5 Weeks · Newsroom Track',
    icon: 'Newspaper',
    accentColor: '#fb7185',
    position: 7,
    weekNumber: 107,
    dayBase: 7001,
  },
  {
    slug: 'lawyers',
    dir: '08-lawyers',
    index: '08',
    title: 'AI for Lawyers & Legal Professionals',
    shortTitle: 'Lawyers',
    tagline: 'Legal Research · Contract AI · Confidentiality',
    description:
      'Use AI for legal research, drafting, and case summarisation. Review contracts faster with AI-assisted analysis, and understand AI governance and confidentiality in legal practice.',
    trackName: 'Legal AI Track',
    audience: 'Advocates, in-house counsel, and legal researchers',
    category: 'Specialized Sectors',
    outcomes: [
      'Use AI for legal research, drafting, and case summarisation',
      'Review contracts faster with AI-assisted analysis',
      'Understand AI governance and confidentiality in legal practice',
    ],
    duration: '6 Weeks · Legal Practice Track',
    icon: 'Scale',
    accentColor: '#60a5fa',
    position: 8,
    weekNumber: 108,
    dayBase: 8001,
  },
  {
    slug: 'doctors',
    dir: '09-doctors',
    index: '09',
    title: 'AI for Doctors & Healthcare Practitioners',
    shortTitle: 'Doctors',
    tagline: 'Clinical AI · Documentation · Health Data Ethics',
    description:
      'Use AI for clinical documentation and patient communication. Explore AI-assisted diagnostics support and literature review, and apply AI safely within healthcare data and privacy norms.',
    trackName: 'Clinical AI Track',
    audience: 'Doctors, clinicians, and healthcare administrators',
    category: 'Specialized Sectors',
    outcomes: [
      'Use AI for clinical documentation and patient communication',
      'Explore AI-assisted diagnostics support and literature review',
      'Apply AI safely within healthcare data and privacy norms',
    ],
    duration: '6 Weeks · Clinical Practice Track',
    icon: 'Stethoscope',
    accentColor: '#34d399',
    position: 9,
    weekNumber: 109,
    dayBase: 9001,
  },
  {
    slug: 'creators',
    dir: '10-creators',
    index: '10',
    title: 'AI for Creators & Digital Influencers',
    shortTitle: 'Creators',
    tagline: 'Content AI · Growth · Monetisation',
    description:
      'Script, shoot, and edit content faster with AI tools. Build an AI-powered content calendar and repurposing system, and grow and monetise an audience using AI-driven insights.',
    trackName: 'Creator AI Track',
    audience: 'Content creators, YouTubers, and digital influencers',
    category: 'Professionals & Leaders',
    outcomes: [
      'Script, shoot, and edit content faster with AI tools',
      'Build an AI-powered content calendar and repurposing system',
      'Grow and monetise an audience using AI-driven insights',
    ],
    duration: '6 Weeks · Creator Track',
    icon: 'Camera',
    accentColor: '#e879f9',
    position: 10,
    weekNumber: 110,
    dayBase: 10001,
  },
  {
    slug: 'homemakers',
    dir: '11-homemakers',
    index: '11',
    title: 'AI for Women & Homemakers (AI Didi)',
    shortTitle: 'Homemakers',
    tagline: 'Micro-Business · Flexible Income · Community Leadership',
    description:
      'Master AI basics in simple, everyday language. Start a flexible micro-business or freelance service using AI, and build the confidence to teach AI to your family and community.',
    trackName: 'AI Didi Track',
    audience: 'Homemakers and women exploring flexible, AI-powered income',
    category: 'Specialized Sectors',
    outcomes: [
      'Learn AI basics in simple, everyday language',
      'Start a flexible micro-business or freelance service using AI',
      'Build the confidence to teach AI to family and community',
    ],
    duration: '6 Weeks · Flexible Timing',
    icon: 'HeartHandshake',
    accentColor: '#f87171',
    position: 11,
    weekNumber: 111,
    dayBase: 11001,
  },
  {
    slug: 'farmers',
    dir: '12-farmers',
    index: '12',
    title: 'AI for Farmers & Agri-Entrepreneurs',
    shortTitle: 'Farmers',
    tagline: 'Crop Advisory · Agri-Business · Local Language Support',
    description:
      'Use AI apps for weather, soil, and crop advisory. Access government schemes and mandi prices using AI assistants, and explore AI-powered agri-business and value-addition opportunities.',
    trackName: 'Kisan AI Track',
    audience: 'Farmers and agri-entrepreneurs improving yield and income',
    category: 'Specialized Sectors',
    outcomes: [
      'Use AI apps for weather, soil, and crop advisory',
      'Access government schemes and mandi prices using AI assistants',
      'Explore AI-powered agri-business and value-addition opportunities',
    ],
    duration: '6 Weeks · Farm-Season Aligned',
    icon: 'Sprout',
    accentColor: '#4ade80',
    position: 12,
    weekNumber: 112,
    dayBase: 12001,
  },
]

const BASE_XP = 50
const PASS_SCORE = 75
const QUIZ_TIME_LIMIT = 10
const MAX_ASSIGNMENT_CREDITS = 50
const MAX_RAG_CHUNKS = 10
const CHUNK_LENGTH = 500

function cleanOption(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140)
}

function parseSection(content: string, heading: string): string | null {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`^##\\s+${escaped}\\s*$`, 'm')
  const start = content.search(re)
  if (start === -1) return null

  const body = content.slice(start)
  const nextHeading = body.search(/\n##\s+[^\n]+\s*$/m)
  const sectionEnd = nextHeading === -1 ? body.length : nextHeading
  return body.slice(0, sectionEnd).trim()
}

function parseBullets(section: string | null): string[] {
  if (!section) return []
  return section
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('- '))
    .map(l => cleanOption(l.slice(2)))
    .filter(Boolean)
    .slice(0, 6)
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : 'Untitled Mission'
}

function extractMissionNumber(title: string): number {
  const match = title.match(/Mission\s+(\d+)/i)
  return match ? parseInt(match[1], 10) : 0
}

const GENERIC_DISTRACTORS = [
  'Using AI tools without any human judgment',
  'Memorising AI terminology without practice',
  'Skipping every verification step',
  'Replacing all human thinking with AI',
  'Avoiding practise challenges entirely',
  'Working without any plan or structure',
  'Never asking for help when stuck',
  'Copying the example outputs verbatim',
]

function rotate<T>(arr: T[], n: number): T[] {
  const out = [...arr]
  for (let i = 0; i < n; i++) out.push(out.shift() as T)
  return out
}

function rotateRight<T>(arr: T[], n: number): T[] {
  if (arr.length === 0) return arr
  const shift = ((n % arr.length) + arr.length) % arr.length
  return [...arr.slice(-shift), ...arr.slice(0, arr.length - shift)]
}

// Shuffle options deterministically so the correct answer is not always first.
function addQuestion(
  list: Array<{ question: string; options: string[]; correctIndex: number; explanation: string }>,
  question: string,
  options: string[],
  explanation: string,
  index: number
): void {
  const shuffled = rotateRight(options, index + 1)
  const correctOption = options[0]
  const correctIndex = shuffled.indexOf(correctOption)
  list.push({ question, options: shuffled, correctIndex, explanation })
}

function buildQuiz(
  missionTitle: string,
  objectives: string[],
  takeaways: string[],
  idx: number
): Array<{ question: string; options: string[]; correctIndex: number; explanation: string }> {
  const subtitle = missionTitle.replace(/^Mission\s+\d+\s*:\s*/i, '') || missionTitle
  const obj = objectives.length ? objectives : takeaways
  const take = takeaways.length ? takeaways : objectives

  const questions: Array<{ question: string; options: string[]; correctIndex: number; explanation: string }> = []
  let qi = 0

  addQuestion(
    questions,
    `What is the main focus of this mission?`,
    [
      `Mastering "${subtitle}"`,
      'Learning a foreign language',
      'Memorising facts without practice',
      'Avoiding technology entirely',
    ],
    `This mission focuses on ${subtitle}.`,
    qi++
  )

  const d = rotate(GENERIC_DISTRACTORS, idx)

  const templates = [
    {
      question: 'Which of these is a learning objective of this mission?',
      correct: obj[0] ?? '',
      distractor: d,
      explanation: 'Learning objectives describe the skills you will build in this mission.',
    },
    {
      question: 'Another learning objective of this mission is:',
      correct: obj[1] ?? (obj[0] ?? ''),
      distractor: rotate(d, 2),
      explanation: 'Each mission lists several learning objectives you are expected to master.',
    },
    {
      question: 'Which of the following is a key takeaway from this mission?',
      correct: take[0] ?? '',
      distractor: rotate(d, 4),
      explanation: 'Key takeaways summarise the most important points of the mission.',
    },
    {
      question: 'A stated takeaway from this mission is:',
      correct: take[1] ?? (take[0] ?? ''),
      distractor: rotate(d, 6),
      explanation: 'Takeaways condense the mission into the ideas you should remember.',
    },
  ]

  templates.forEach(t => {
    const correct = cleanOption(t.correct)
    if (!correct) return
    addQuestion(
      questions,
      t.question,
      [correct, t.distractor[0], t.distractor[1], t.distractor[2]].map(cleanOption),
      t.explanation,
      qi++
    )
  })

  return questions.slice(0, 5)
}

function buildSystemPrompt(meta: CourseMeta, title: string): string {
  return `You are Nitai's AI Didi — a warm, encouraging AI mentor for the "${meta.title}" course in the Nitai Skill Academy.

You are helping a learner who is working on the mission "${title}" (${meta.trackName}).

Your role is to:
1. Explain the mission concepts clearly, simply, and with practical everyday examples
2. Ground every answer in the mission's module content — use the RAG chunks provided
3. Help the student complete their Practice Challenge step by step
4. Celebrate progress and keep the learner motivated
5. Be honest and clear about AI limitations and ethics

Keep responses concise, friendly, and actionable. If a question is outside this mission's scope, gently redirect to the mission content or suggest the relevant mission. You never do the student's work for them — you coach them to do it themselves.`
}

function buildRagChunks(content: string, missionNumber: number, meta: CourseMeta) {
  const paragraphs = content
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 50)

  return paragraphs.slice(0, MAX_RAG_CHUNKS).map((p, i) => ({
    id: `${meta.slug}_m${missionNumber}_c${i}`,
    content: p.slice(0, CHUNK_LENGTH),
    source: `${meta.slug}/module-${String(missionNumber).padStart(2, '0')}`,
    relevance: parseFloat((1.0 - i * 0.08).toFixed(2)),
  }))
}

function defaultAssignmentPrompt(meta: CourseMeta, title: string): string {
  return `**Practice Challenge: ${title}**

Complete the practice challenge from this mission to demonstrate what you learned.

**Requirements:**
1. Follow every step of the mission's Practice Challenge section
2. Use real, personal inputs (not placeholder or AI-generated filler)
3. Add a short reflection (100+ words): what was easy, what was hard, what you would do differently

**Deliverables:**
- Your completed challenge output
- Supporting screenshots or files where relevant
- Your written reflection (100+ words)`
}

function listMissionFiles(dir: string): string[] {
  const files = fs.readdirSync(dir).filter(f => /^module-\d+\.md$/.test(f))
  files.sort((a, b) => {
    const na = parseInt(a.match(/\d+/)![0], 10)
    const nb = parseInt(b.match(/\d+/)![0], 10)
    return na - nb
  })
  return files
}

async function main() {
  console.log('Seeding Skill Academy courses...\n')

  for (const meta of COURSES) {
    const contentDir = path.join(__dirname, 'content', 'courses', meta.dir)
    if (!fs.existsSync(contentDir)) {
      console.warn(`  ⚠ Skipping ${meta.slug}: content dir not found (${contentDir})`)
      continue
    }

    const missionFiles = listMissionFiles(contentDir)
    if (missionFiles.length === 0) {
      console.warn(`  ⚠ Skipping ${meta.slug}: no module-*.md files found`)
      continue
    }

    // Upsert Course
    const course = await prisma.course.upsert({
      where: { slug: meta.slug },
      update: {
        index: meta.index,
        title: meta.title,
        shortTitle: meta.shortTitle,
        tagline: meta.tagline,
        description: meta.description,
        trackName: meta.trackName,
        audience: meta.audience,
        category: meta.category,
        outcomes: meta.outcomes,
        duration: meta.duration,
        icon: meta.icon,
        accentColor: meta.accentColor,
        position: meta.position,
        isActive: true,
      },
      create: {
        slug: meta.slug,
        index: meta.index,
        title: meta.title,
        shortTitle: meta.shortTitle,
        tagline: meta.tagline,
        description: meta.description,
        trackName: meta.trackName,
        audience: meta.audience,
        category: meta.category,
        outcomes: meta.outcomes,
        duration: meta.duration,
        icon: meta.icon,
        accentColor: meta.accentColor,
        position: meta.position,
        isActive: true,
      },
    })

    // Upsert one Week per course (weekNumber 101+, tagged with courseId)
    const weekStart = new Date()
    const weekEnd = new Date(weekStart.getTime() + 90 * 24 * 60 * 60 * 1000)
    const week = await prisma.week.upsert({
      where: { courseId_weekNumber: { courseId: course.id, weekNumber: meta.weekNumber } },
      update: {
        title: `${missionFiles.length} Missions · ${meta.trackName}`,
        phase: 1,
        phaseName: meta.shortTitle,
      },
      create: {
        weekNumber: meta.weekNumber,
        title: `${missionFiles.length} Missions · ${meta.trackName}`,
        phase: 1,
        phaseName: meta.shortTitle,
        startDate: weekStart,
        endDate: weekEnd,
        courseId: course.id,
      },
    })

    let totalXp = 0
    let missionsSeeded = 0

    for (let i = 0; i < missionFiles.length; i++) {
      const filePath = path.join(contentDir, missionFiles[i])
      const content = fs.readFileSync(filePath, 'utf-8')

      const title = extractTitle(content)
      const missionNumber = extractMissionNumber(title) || i + 1
      const objectives = parseBullets(parseSection(content, 'Learning Objectives'))
      const takeaways = parseBullets(parseSection(content, 'Key Takeaways'))
      let practiceChallenge = parseSection(content, 'Practice Challenge') || null

      if (practiceChallenge && !/^##\s+Practice Challenge/i.test(practiceChallenge)) {
        practiceChallenge = null
      }

      const description = cleanOption(title.replace(/^Mission\s+\d+:\s*/i, ''))

      const module = await prisma.module.upsert({
        where: { courseId_missionNumber: { courseId: course.id, missionNumber } },
        update: {
          dayNumber: meta.dayBase + i,
          dayInWeek: missionNumber,
          weekNumber: meta.weekNumber,
          weekId: week.id,
          title,
          description,
          contentMarkdown: content,
          creditsReward: BASE_XP,
        },
        create: {
          weekId: week.id,
          dayNumber: meta.dayBase + i,
          dayInWeek: missionNumber,
          weekNumber: meta.weekNumber,
          courseId: course.id,
          missionNumber,
          sessionType: 'THEORY',
          title,
          description,
          contentMarkdown: content,
          videoUrl: null,
          creditsReward: BASE_XP,
        },
      })

      // Quiz (content-derived)
      const questions = buildQuiz(title, objectives, takeaways, missionNumber) as any
      await prisma.quiz.upsert({
        where: { moduleId: module.id },
        update: { questions, passScore: PASS_SCORE, timeLimit: QUIZ_TIME_LIMIT },
        create: { moduleId: module.id, questions, passScore: PASS_SCORE, timeLimit: QUIZ_TIME_LIMIT },
      })

      // Assignment (Practice Challenge becomes the prompt)
      const prompt = practiceChallenge || defaultAssignmentPrompt(meta, title)
      await prisma.assignment.upsert({
        where: { moduleId: module.id },
        update: { prompt, maxCredits: MAX_ASSIGNMENT_CREDITS },
        create: { moduleId: module.id, prompt, type: 'TEXT', maxCredits: MAX_ASSIGNMENT_CREDITS },
      })

      // AI context for AI Didi RAG
      const systemPrompt = buildSystemPrompt(meta, title)
      const ragChunks = buildRagChunks(content, missionNumber, meta)
      await prisma.moduleAIContext.upsert({
        where: { moduleId: module.id },
        update: { systemPrompt, ragChunks },
        create: { moduleId: module.id, systemPrompt, ragChunks },
      })

      totalXp += module.creditsReward
      missionsSeeded++
    }

    await prisma.course.update({
      where: { id: course.id },
      data: { moduleCount: missionsSeeded, totalXp },
    })

    console.log(
      `  ✓ ${meta.index} ${meta.shortTitle.padEnd(18)} → ${missionsSeeded} missions, ${totalXp} XP (${meta.slug})`
    )
  }

  console.log('\n=== Seed Complete ===')
  console.log(`  Courses:    ${COURSES.length}`)
  console.log('\nSeeding finished successfully!')
}

main()
  .catch(e => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('Database connection closed.')
  })