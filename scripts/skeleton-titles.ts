/**
 * Mission title outlines for courses that don't yet have hand-authored content.
 * Used by scripts/generate-skeletons.ts to produce playable skeleton missions.
 * Keyed by course content dir name.
 */
export const SKELETON_TITLES: Record<string, { week: string; titles: string[] }> = {
  '05-professionals': {
    week: 'AI Productivity Track',
    titles: [
      'AI for Your Role: Zero to Workflow',
      'Automating Repetitive Tasks with AI',
      'Prompting Like a Pro at Work',
      'AI Reports, Emails & Presentations',
      'Department-Specific AI Workflows',
      'Measuring and Presenting Your AI Gains',
    ],
  },
  '06-leaders': {
    week: 'AI Leadership Track',
    titles: [
      'The AI Landscape for Business Leaders',
      'Building Your AI Adoption Roadmap',
      'Evaluating AI Tools, Vendors & Build vs Buy',
      'Leading Change: AI-Ready Teams',
    ],
  },
  '07-journalists': {
    week: 'Newsroom AI Track',
    titles: [
      'AI in the Newsroom: Your Toolkit',
      'Research & Fact-Checking with AI',
      'Structuring Stories with AI',
      'AI-Assisted Video, Audio & Visuals',
      'Ethics & Transparency in AI Journalism',
    ],
  },
  '08-lawyers': {
    week: 'Legal AI Track',
    titles: [
      'AI for Legal Research',
      'Drafting & Summarising Documents with AI',
      'Contract Review with AI Analysis',
      'AI as a Case Tool: Fact Patterns & Research',
      'Confidentiality & AI Governance for Lawyers',
      'Building an AI-Enabled Legal Practice',
    ],
  },
  '09-doctors': {
    week: 'Clinical AI Track',
    titles: [
      'AI in Clinical Practice: An Orientation',
      'Clinical Documentation with AI',
      'AI-Assisted Literature Review',
      'Patient Communication & Education with AI',
      'Diagnostics Support & Safety with AI',
      'Health Data Privacy & Responsible AI Use',
    ],
  },
  '10-creators': {
    week: 'Creator AI Track',
    titles: [
      'Your AI Content Engine: Setup',
      'Scripting & Ideation with AI',
      'Shooting & Editing Faster with AI',
      'AI-Powered Calendars & Repurposing',
      'Growth & Analytics with AI',
      'Monetising Your Audience with AI',
    ],
  },
}