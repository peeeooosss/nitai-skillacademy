/**
 * Generates playable skeleton mission files for courses that don't yet have
 * hand-authored content. Run: npx tsx scripts/generate-skeletons.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { SKELETON_TITLES } from './skeleton-titles'

const CONTENT_DIR = path.join(__dirname, 'content', 'courses')

interface CourseOutlines {
  [dir: string]: { week: string; titles: string[] }
}

function buildMission(dir: string, n: number, title: string, week: string): string {
  const slug = dir.replace(/^\d+-/, '')
  const friendly = slug.replace(/-/g, ' ')

  return `# Mission ${n}: ${title}

Prepared for the ${week} — a practical, hands-on lesson you can finish in one sitting.

## Learning Objectives

- Understand how this mission fits your real work as a ${friendly.replace(/s$/, '')}.
- Learn the core AI concept you need for this task, in plain language.
- Know exactly which AI tools to open and what to type.
- Complete a short practice challenge that produces something you can actually use.

## The Core Idea

AI tools are best understood not as magic but as a very fast assistant who has read a great deal and follows instructions carefully. Your job is to give clear instructions, check the output, and improve it. This mission teaches the specific instructions for this task.

### What You Will Do

Start with the simple principle: **input quality decides output quality.** The better you describe your situation, audience, format, and constraints, the more useful the AI response. Every activity in this course follows the same loop — Ask, Check, Improve, Save — and by the end of this mission the loop will feel automatic.

### Key Techniques

- **Be specific:** name the task, the audience, the tone, and the length.
- **Give it a role:** "Act as an experienced ${friendly.replace(/-/g, ' ')} advisor…"
- **Ask for structure:** headings, bullet points, or a table make outputs usable.
- **Iterate:** treat the first answer as a draft. Ask for revisions.

### A Simple Framework to Remember

Use the three-part prompt frame: **Context – Task – Format.** Example: our professional context, the task you perform, and how you want the answer delivered. Master this frame and you can apply it to almost every other mission in the course.

## Real-World Examples

**Example 1 – The busy-work problem.** A typical day is full of small, repetitive tasks: drafting emails, summarising notes, structuring plans. With one well-worded prompt, a participant turns a half-hour of routine drafting into five minutes of checking and editing.

**Example 2 – The blank-page problem.** Staring at an empty document is common. Use AI to produce a first draft or an outline in seconds, then spend your energy improving the draft rather than starting from nothing.

**Example 3 – The consistency problem.** When the same style or format is needed repeatedly — a report layout, a newsletter structure, a lesson plan — save your best prompt and reuse it. Consistency becomes easy because the tool applies the pattern every time.

## Key Takeaways

- AI is an assistant that follows clear instructions; no prompt experience is needed to start.
- The Context – Task – Format frame works for most tasks in this course.
- Always review and edit AI output before using it — you are responsible for the result.
- Save your best prompts to reuse; they become your personal toolkit.

## Practice Challenge

**Task:** Use your chosen AI tool to complete one real task from this mission.

1. Open your AI assistant (ChatGPT, Gemini, or the tool your course suggests).
2. Write a Context – Task – Format prompt for a task you did for real this week.
3. Ask for a revision once: "Make it shorter and more practical."
4. Save the final output; share a 2–3 sentence note on what you changed and why.
`
}

function main() {
  const outlines = SKELETON_TITLES as CourseOutlines

  for (const [dir, outline] of Object.entries(outlines)) {
    const targetDir = path.join(CONTENT_DIR, dir)
    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).some(f => f.endsWith('.md'))) {
      console.log(`[skip] ${dir} already has content`)
      continue
    }
    fs.mkdirSync(targetDir, { recursive: true })
    outline.titles.forEach((title, i) => {
      const n = i + 1
      const file = path.join(targetDir, `module-${String(n).padStart(2, '0')}.md`)
      fs.writeFileSync(file, buildMission(dir, n, title, outline.week))
      console.log(`[write] ${dir}/module-${String(n).padStart(2, '0')}.md`)
    })
  }
  console.log('Skeleton generation complete.')
}

main()