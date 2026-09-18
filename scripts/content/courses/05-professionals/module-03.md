# Mission 3: Prompting Like a Pro at Work

## Learning Objectives

- Write role-based prompts that produce work-ready output
- Use structure and format requests to control the result
- Iterate like a professional: one revision at a time
- Avoid the classic prompt mistakes that waste time
- Build a set of reusable prompt patterns for your role

---
### Module 1 · Give the AI a Role

The single biggest upgrade to any prompt is a role. Saying 'Act as a senior financial analyst...' or 'You are an experienced HR partner...' changes the depth and tone of the answer.

Use the pattern:

'Act as a [role]. Your audience is [audience]. Produce [task] with [constraints].'

Role prompts work because they give the model context it would otherwise guess. Guessing wastes a round-trip; a role sets the bar from the first sentence.

**Example Quiz**

1. What is the single biggest upgrade to a prompt?
- A) Adding a role for the AI
- B) Typing faster
- C) Using CAPS LOCK
- D) Adding more questions

**Answer:** A — A role - 'Act as a senior financial analyst' - sets depth and tone immediately.

2. What does a role give the model?
- A) Context it would otherwise guess
- B) New data
- C) More compute
- D) Your password

**Answer:** A — A role supplies context the model would otherwise have to guess.

3. Which pattern sets up a professional response?
- A) 'Act as a [role]... produce [task] with [constraints]'
- B) 'I need help with stuff'
- C) 'Make this professional'
- D) 'Try really hard'

**Answer:** A — 'Act as a [role]... [task] with [constraints]' is the professional pattern.

---
### Module 2 · Name the Audience and Constraints

Audience and constraints are the two details professionals forget most. Include them:

- **Audience:** 'written for non-finance managers' - changes every word choice.
- **Constraints:** 'under one page', 'no jargon', 'numbers in a table', 'tone: direct and respectful'.

Without constraints, the AI chooses its own length, complexity, and structure - usually wrong for your context.

**Try it now:** rewrite a generic prompt you use and add one audience and two constraints.

**Example Quiz**

1. Which two details do professionals forget most?
- A) Audience and constraints
- B) Greeting and sign-off
- C) Punctuation and grammar
- D) Fonts and margins

**Answer:** A — Audience and constraints - without them the AI sets its own length and tone.

2. Why does naming the audience matter?
- A) It changes wording, tone, and level of detail
- B) It increases word count
- C) It confuses the model
- D) It is optional formality

**Answer:** A — Knowing who reads it changes every word choice - say it explicitly.

3. What can constraints control?
- A) Length, jargon, structure, and tone
- B) The AI's memory
- C) Your calendar
- D) The number of replies

**Answer:** A — Constraints - 'under a page', 'no jargon', 'as a table' - control the output shape.

---
### Module 3 · Ask for Structure and Format

Never accept an unstructured wall of text when you need something usable. Ask for format:

'Deliver as: 1) a summary paragraph, 2) five bullet points, 3) a comparison table.'

Table requests are especially powerful: 'Put the pros and cons in a table with columns: Option, Benefit, Risk, Effort.'

**Rule of thumb:** if you are going to copy-paste the answer into a document, ask for the format that document already uses.

**Example Quiz**

1. What is the professional way to control output shape?
- A) Ask for a specific structure or format
- B) Accept the first answer
- C) Generate several times
- D) Live without structure

**Answer:** A — Requesting structure - paragraph, bullets, table - makes output directly usable.

2. Why are table requests powerful?
- A) They organise comparisons clearly
- B) They look pretty
- C) They confuse readers
- D) They are longer

**Answer:** A — Tables organise pros/cons and comparisons so decisions are easy to read.

3. What format should you request for a task?
- A) The format your document already uses
- B) The longest possible
- C) Only paragraphs
- D) Emoji-heavy text

**Answer:** A — Ask for the format you will actually use; paste-ready output saves editing time.

---
### Module 4 · Iterate Like a Professional

The first answer is a draft, not a result. Professional iteration is one revision at a time:

- 'Make it shorter and more practical.'
- 'Tone it down - less formal, more approachable.'
- 'Use numbers where possible.'
- 'Give me three options instead, with costs.'

One instruction per message lets you track what changed. If you overload the AI with four instructions, it silently drops half of them.

**The habit:** always read the draft before you write the revision instruction.

**Example Quiz**

1. How should you treat the first AI answer?
- A) As a draft to be improved
- B) As final
- C) As a suggestion only
- D) As an error

**Answer:** A — Treat the first answer as a draft - then check and improve it.

2. Why iterate one instruction at a time?
- A) Overloading causes the model to drop instructions
- B) It is faster to type
- C) The AI gets confused with too few
- D) It avoids repeat requests

**Answer:** A — One instruction per message lets you track changes; overloaded prompts drop instructions.

3. What should you do before writing a revision instruction?
- A) Read the draft carefully
- B) Delete the draft
- C) Reply to everyone
- D) Ask twice

**Answer:** A — Read the draft first - your revision should target a real gap.

---
### Module 5 · The Classic Prompt Mistakes

Avoid the five most common wastes of time:

1. **'Write something professional'** - no audience, task, or format.
2. **One giant paragraph** - no structure or line breaks; hard for AI to parse.
3. **No constraints** - the model guesses length and tone.
4. **No check step** - shipping a raw draft with errors.
5. **Changing tools** when the real fix is a better prompt.

Each mistake costs a round-trip. Fixing them is free - which is why prompting skill is the highest-ROI habit in this course.

**Example Quiz**

1. Which is a classic prompt mistake?
- A) Giving a role and constraints
- B) 'Write something professional' with no context
- C) Asking for a table
- D) Iterating once

**Answer:** B — Vague asks with no audience, task, or format waste round-trips.

2. Why do vague prompts waste time?
- A) The model guesses length and tone wrong
- B) They are too short
- C) They crash the tool
- D) They are too polite

**Answer:** A — Without constraints the model guesses wrong - then you iterate until it fits.

3. What is the real fix when output is poor?
- A) Improve the prompt
- B) Switch to a paid tool
- C) Blame the internet
- D) Retry the same prompt

**Answer:** A — Prompt quality - not the tool - is usually the real fix for poor output.

---
### Module 6 · Your Reusable Prompt Patterns

By now you should have several patterns in your toolkit:

- **Role prompt** - 'Act as a [role] for an audience of [audience].'
- **Repurpose prompt** - 'Convert [content] into [format], keeping the facts identical.'
- **Summary prompt** - 'Extract decisions, actions with owners and dates, and open items.'
- **Iteration instruction** - 'Make it shorter and more practical.'

This collection is the real output of this whole mission. Keep it where you can reach it - the more you reuse it, the faster your work becomes.

**Example Quiz**

1. What is the real output of this mission?
- A) A reusable set of prompt patterns
- B) More AI tokens
- C) A new laptop
- D) More followers

**Answer:** A — The toolkit of reusable patterns - role, repurpose, summary - is the real output.

2. Which pattern keeps facts identical?
- A) The repurpose prompt
- B) The role prompt
- C) The guess prompt
- D) The greeting

**Answer:** A — Repurpose prompts - convert to a new format keeping facts identical - preserve accuracy.

3. Where should your patterns live?
- A) Somewhere you can reach at work every day
- B) In your private diary
- C) On a stick
- D) Only in your head

**Answer:** A — Keep patterns where you can reach them daily - reuse is the point.

---

## Real-World Examples

**The role that changed the answer —** Asking for 'a senior consultant's briefing for a non-technical board' instead of 'explain this strategy' produced a one-page summary with a decision table and recommended options - usable directly in the board pack.
**The table request win —** A product manager asked for feature comparison 'as a table with columns Option, Benefit, Risk, Effort'. The AI's first free-form paragraph became a tidy table that made the build-vs-buy choice obvious in minutes.
**The one-instruction iteration —** A marketer ran three rounds of one instruction each - 'shorter', 'more practical', 'with numbers' - and landed a final snippet in under ten minutes, instead of rewriting prose five times.

---

## Key Takeaways

- Give the AI a role; it sets depth, tone, and vocabulary immediately.
- Name the audience and constraints; otherwise the model guesses them.
- Ask for structure and format so output is paste-ready, not a rewrite project.
- Iterate one instruction at a time after reading the draft.
- Vague prompts are the #1 time waster; fix the prompt, not the tool.
- Collect every pattern that works into a reachable toolkit.

---

## Practice Challenge

1. Pick a routine work output you create (email, update, memo).
2. Write a role-based prompt with audience, task, format, and two constraints.
3. Run it, read the draft, then improve it with exactly one revision instruction.
4. Add the final prompt to your toolkit with a note on when it works.
