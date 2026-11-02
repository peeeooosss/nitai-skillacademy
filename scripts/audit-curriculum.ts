/**
 * Curriculum completeness audit.
 *
 * The architecture is Course → Mission (`module-NN.md`) → Sub-module
 * (`### Sub-module K · Title`). Outlines describe the target number of
 * missions and sub-modules per course, while the seeder only creates what
 * is actually authored on disk. This script surfaces the gap so the app is
 * never advertised as complete while sub-module content is still missing.
 *
 * Run:  npx tsx scripts/audit-curriculum.ts           (report only)
 *       npx tsx scripts/audit-curriculum.ts --strict  (exit 1 on gaps)
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONTENT_DIR = path.join(__dirname, 'content')
const COURSES_DIR = path.join(CONTENT_DIR, 'courses')
const OUTLINES_DIR = path.join(CONTENT_DIR, 'outlines')

interface CourseAudit {
  course: string
  plannedMissions: number
  authoredMissions: number
  plannedSubmodules: number
  authoredSubmodules: number
  minSubsPerMission: number
  maxSubsPerMission: number
}

function parseOutline(filePath: string): { missions: number; submodules: number } {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n')
  let missions = 0
  let submodules = 0
  let inMission = false
  let inSubmodules = false

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '')
    const trimmed = line.trim()

    if (/^\*\*Mission:\*\*/.test(trimmed)) {
      missions++
      inMission = true
      inSubmodules = false
      continue
    }

    if (inMission && /^Submodules:\s*$/.test(trimmed)) {
      inSubmodules = true
      continue
    }

    if (inSubmodules) {
      if (/^  - /.test(line)) {
        submodules++
        continue
      }
      if (!trimmed) continue
      inSubmodules = false
      if (/^###/.test(trimmed) || /^---$/.test(trimmed)) inMission = false
    }
  }

  return { missions, submodules }
}

function countAuthoredSubmodules(markdown: string): number {
  const matches = markdown.match(/^###\s+(?:Sub-?module|Module)\s*\d+\b/gim)
  return matches ? matches.length : 0
}

function auditCourse(courseDirName: string): CourseAudit {
  const courseDir = path.join(COURSES_DIR, courseDirName)
  const outlinePath = path.join(OUTLINES_DIR, `${courseDirName}.md`)
  const planned = fs.existsSync(outlinePath)
    ? parseOutline(outlinePath)
    : { missions: 0, submodules: 0 }

  const files = fs.existsSync(courseDir)
    ? fs
        .readdirSync(courseDir)
        .filter(f => /^module-\d+\.md$/.test(f))
        .sort()
    : []

  const perMission = files.map(file =>
    countAuthoredSubmodules(fs.readFileSync(path.join(courseDir, file), 'utf-8'))
  )

  return {
    course: courseDirName,
    plannedMissions: planned.missions,
    authoredMissions: files.length,
    plannedSubmodules: planned.submodules,
    authoredSubmodules: perMission.reduce((sum, n) => sum + n, 0),
    minSubsPerMission: perMission.length ? Math.min(...perMission) : 0,
    maxSubsPerMission: perMission.length ? Math.max(...perMission) : 0,
  }
}

function pad(value: string | number, width: number): string {
  return String(value).padEnd(width, ' ')
}

function main(): void {
  const strict = process.argv.includes('--strict')
  const courses = fs
    .readdirSync(OUTLINES_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
    .sort()

  const rows = courses.map(auditCourse)
  const totals = rows.reduce(
    (acc, r) => ({
      plannedMissions: acc.plannedMissions + r.plannedMissions,
      authoredMissions: acc.authoredMissions + r.authoredMissions,
      plannedSubmodules: acc.plannedSubmodules + r.plannedSubmodules,
      authoredSubmodules: acc.authoredSubmodules + r.authoredSubmodules,
    }),
    { plannedMissions: 0, authoredMissions: 0, plannedSubmodules: 0, authoredSubmodules: 0 }
  )

  console.log('\nCurriculum audit — Course → Mission → Sub-module\n')
  console.log(
    pad('COURSE', 22) +
      pad('MISSIONS', 14) +
      pad('SUB-MODULES', 16) +
      'SUBS/MISSION'
  )
  console.log('-'.repeat(72))

  let gaps = 0
  for (const r of rows) {
    const missionGap = r.plannedMissions - r.authoredMissions
    const subGap = r.plannedSubmodules - r.authoredSubmodules
    if (missionGap > 0 || subGap > 0) gaps++

    const missionCell = `${r.authoredMissions}/${r.plannedMissions}${missionGap > 0 ? ` (-${missionGap})` : ''}`
    const subCell = `${r.authoredSubmodules}/${r.plannedSubmodules}${subGap > 0 ? ` (-${subGap})` : ''}`
    const perMission = r.authoredMissions
      ? `${r.minSubsPerMission}-${r.maxSubsPerMission}`
      : '—'

    console.log(pad(r.course, 22) + pad(missionCell, 14) + pad(subCell, 16) + perMission)
  }

  console.log('-'.repeat(72))
  console.log(
    pad('TOTAL', 22) +
      pad(`${totals.authoredMissions}/${totals.plannedMissions}`, 14) +
      pad(`${totals.authoredSubmodules}/${totals.plannedSubmodules}`, 16)
  )

  console.log(
    `\n${rows.length - gaps}/${rows.length} courses fully authored. ` +
      `${totals.plannedMissions - totals.authoredMissions} mission files and ` +
      `${totals.plannedSubmodules - totals.authoredSubmodules} sub-modules still to author.`
  )

  if (strict && gaps > 0) {
    console.error('\nStrict mode: curriculum is incomplete.')
    process.exit(1)
  }
}

main()
