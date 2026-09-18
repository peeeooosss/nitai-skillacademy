# Mission 3: Prompting Like a Pro at Work

---
### Module 1 · Give the AI a Role

The single biggest upgrade you can make to any prompt is to give the AI a role. Saying 'Act as a senior financial analyst...' or 'You are an experienced HR partner...' changes the depth, tone, and vocabulary of the answer more than almost anything else you can type.

Role prompts work because they give the model context it would otherwise have to guess. A guessing model produces a generic answer; a role sets the standard from the very first sentence and saves you an entire round-trip.

## Learning Objectives

- Write role prompts that set depth and tone in the first line
- Explain why role prompts reduce guessing and wasted round-trips
- Apply the pattern - role, audience, task, constraints - to your own work

## Why a Role Changes the Answer

- A role tells the model who it is, so it applies the right vocabulary and standards
- 'Act as a senior analyst' instantly raises rigour versus an unanchored ask
- The model stops guessing your context and starts answering as the expert you named

## The Role Pattern

The pattern fits on one line and extends to nearly any task.
```text
Act as a [role]. Your audience is [audience]. Produce [task]
with [constraints].
```
- Role: the expert you want the AI to imitate - senior analyst, HR partner, copy-editor
- Audience: who will use or read the output
- Task plus constraints: exactly what to produce and under which limits

## Good Role Prompts

### Senior financial analyst
- Budget commentary, variance notes, and board-style summaries
### Experienced HR partner
- Job descriptions, feedback drafts, and onboarding plans
### Copy-editor and proof-reader
- Cleaning drafts for clarity, consistency, and tone

## Key Takeaways

- A role is the single biggest upgrade to any prompt
- Roles supply context the model would otherwise guess - saving a round-trip
- The pattern: Act as a [role] for [audience], produce [task] with [constraints]
- Different roles raise or lower rigour, vocabulary, and style automatically
- One line of role context shapes an entire answer

## Practice Challenge

1. Take a prompt you use and add a specific role at the start.
2. Run it with and without the role and compare the two answers.
3. Save the better version with a note on why the role helped.

**Example Quiz**

1. What is the single biggest upgrade to a prompt?
- A) Adding a role for the AI
- B) Typing faster
- C) Using CAPS LOCK
- D) Adding more questions

**Answer:** A — A role - such as 'Act as a senior financial analyst' - sets depth and tone immediately.

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

**Answer:** A — Role plus task and constraints is the professional pattern.

---
### Module 2 · Name the Audience and Constraints

Audience and constraints are the two details professionals forget most in their prompts. Without them, the AI silently chooses its own length, complexity, and structure - and usually picks something that does not fit your situation.

The fix is cheap: name who the output is for, and set the limits you care about. Two small sentences change the entire shape of the result.

## Learning Objectives

- Add audience and constraints to every work prompt
- Explain why the model otherwise guesses length, tone, and complexity
- Rewrite a generic prompt with one audience and at least two constraints

## Audience - Who Reads It

- An audience line such as 'written for non-finance managers' changes every word choice
- The same facts read differently to leadership, a technical team, or a client
- State the audience plainly - do not make the AI infer it from the topic

## Constraints - The Limits

### Length
- 'Under one page', 'no more than 120 words', 'five bullet points'
### Complexity
- 'No jargon', 'plain language', 'explain as if to a new hire'
### Structure and tone
- 'Numbers in a table', 'tone: direct and respectful', 'lead with the recommendation'

## The Fixed Version

Notice the difference constraints make on the same task.
```text
Generic: Summarise this proposal.

Constrained: Summarise this proposal for non-technical managers. Keep
it under one page, avoid jargon, put the budget in a table, and lead
with the recommendation and the decision needed.
```
- The constrained version produces output you could paste into a board pack

## Key Takeaways

- Audience and constraints are the two details professionals forget most
- Naming the audience changes wording, tone, and level of detail
- Constraints control length, complexity, structure, and tone
- Without them the model guesses - and usually guesses wrong for your context
- One audience line plus two constraints turn generic output into usable output

## Practice Challenge

1. Rewrite a generic prompt you use and add one audience and two constraints.
2. Run both versions and compare where the constraints changed the output.
3. Keep the constrained version in your toolkit as a reference.

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

**Answer:** A — Constraints - under a page, no jargon, as a table - control the output shape.

---
### Module 3 · Ask for Structure and Format

Never accept an unstructured wall of text when you need something usable. The AI will happily produce a long paragraph where you needed a table, bullets, or a numbered list - unless you ask for the structure you want.

Asking for format is one of the highest-leverage moves in prompting, because the usual next step is copy-pasting the output into a document. Ask for the format that document already uses, and the copy-paste job mostly disappears.

## Learning Objectives

- Request explicit structures - paragraphs, bullets, tables - in prompts
- Use table requests to organise comparisons and options clearly
- Match the requested format to the document the output will be pasted into

## Naming the Output Shape

```text
Deliver as: 1) a summary paragraph, 2) five bullet points, 3) a
comparison table with columns: Option, Benefit, Risk, Effort.
```
- Specify the exact structure so the output is paste-ready
- Numbered delivery lists stop the AI from choosing its own layout

## Why Table Requests Are Powerful

- Tables organise pros, cons, and comparisons so decisions are easy to read
- A comparison table makes a build-versus-buy choice obvious in minutes
- Tables force the AI to separate fact from opinion cleanly
- They compress a lot of information into a small, scannable space

## Match the Format to the Destination

### Rule of thumb
- If the output goes into a report, ask for the format that report already uses
- Ask for a memo layout for a memo, an email layout for an email, slide bullets for a deck
### Why it works
- Paste-ready output removes editing time - the largest hidden cost after drafting

## Key Takeaways

- Ask for a specific structure or format instead of accepting any shape
- Table requests organise comparisons so decisions are easy to read
- Match the requested format to the document the output will live in
- Numbered delivery lists stop the AI from choosing its own layout
- Paste-ready output eliminates the silent hour of reformatting

## Practice Challenge

1. Take the next document you will create and identify its real format.
2. Write a prompt that requests exactly that structure for the output.
3. Run it and check whether the output lands in the document with minimal edits.

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

**Answer:** A — Tables organise pros and cons so decisions are easy to read.

3. What format should you request for a task?
- A) The format your document already uses
- B) The longest possible
- C) Only paragraphs
- D) Emoji-heavy text

**Answer:** A — Ask for the format you will actually use; paste-ready output saves editing time.

---
### Module 4 · Iterate Like a Professional

The first AI answer is a draft, not a result. Professionals treat it that way and improve it deliberately - one revision instruction at a time. This small habit separates the people who get usable work from the people who keep starting over.

The reason for one instruction at a time is practical: if you overload the AI with four requests in a single message, it silently drops or blends half of them. One clear instruction per round lets you see exactly what changed and why.

## Learning Objectives

- Treat the first AI answer as a draft to be improved
- Iterate with one instruction per message for trackable changes
- Read the draft fully before writing the next revision instruction

## The Draft Mindset

- The first output is a starting point, not a promise - expect to shape it
- Good revisions are short, specific, and targeted at one thing
- Each round answers one question: is the draft closer to usable or not?

## One Instruction at a Time

```text
Round 1: Make it shorter and more practical.
Round 2: Tone it down - less formal, more approachable.
Round 3: Use numbers where possible.
Round 4: Give me three options instead, with costs.
```
- Four rounds of one instruction each beat one message with four demands
- You can always track which instruction produced which change

## Read Before You Revise

- Always read the draft before writing the revision instruction - aim it at a real gap
- Name the specific problem: the length, the tone, a missing detail
- If the draft is close, one polish instruction is enough - do not over-iterate

## Key Takeaways

- The first AI answer is a draft, not a result
- Iterate one instruction at a time - overloaded prompts drop instructions
- Track what changed between rounds by changing one thing at a time
- Read the draft before revising, and aim the revision at a real gap
- Iteration is the difference between a raw draft and a polished deliverable

## Practice Challenge

1. Run the one-instruction iteration on a real work draft this week.
2. Complete three rounds and note what changed at each one.
3. Save the final version and the instructions that got you there.

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

Most wasted time with AI comes from five repeatable mistakes, not from the tools themselves. Each mistake costs at least one extra round-trip - and the fix for every one of them is free. That is why prompting skill is the highest-ROI habit in this course.

Once you can spot these five mistakes in your own prompts, you will stop fighting the tool and start getting usable output on the first or second try.

## Learning Objectives

- Recognise the five classic prompt mistakes as they happen
- Explain why vague prompts cost extra round-trips
- Fix a poor result by improving the prompt rather than switching tools

## The Five Mistakes

### The vague ask
- 'Write something professional' - no audience, task, or format for the AI to aim at
### The wall of text
- One giant paragraph with no structure - hard for the AI to parse into action
### The missing constraints
- No length, tone, or format - so the model guesses them wrong
### The skipped check
- Shipping a raw draft with errors still in it
### The tool-chaser
- Changing tools when the real fix is a better prompt

## What the Vague Ask Costs You

- No audience means the model guesses formality and detail - usually wrong
- No task means generic, surface-level output instead of a deliverable
- No format means another round-trip to reshape what you got
- Each vagueness compounds into multiple wasted exchanges

## The Real Fix Is Cheaper Than the Tool

- Poor output almost always traces back to the prompt, not the product
- A free rewrite beats switching subscriptions and re-learning a tool
- When output fails, debug the prompt first: role, audience, constraints, format

## Key Takeaways

- Five mistakes cause most wasted round-trips: vague asks, walls of text, missing constraints, skipped checks, and tool-chasing
- Without constraints the model guesses length and tone wrong
- Vague prompts are the number one time waster in this course
- Debug the prompt before you switch tools - the fix is usually free
- Spotting the mistake early is the skill; fixing it is just a rewrite

## Practice Challenge

1. Collect three prompts you have used recently and score each against the five mistakes.
2. Fix the worst one with role, audience, constraints, and format.
3. Re-run it and note the difference in the output.

**Example Quiz**

1. Which is a classic prompt mistake?
- A) 'Write something professional' with no context
- B) Giving a role and constraints
- C) Asking for a table
- D) Iterating once

**Answer:** A — Vague asks with no audience, task, or format waste round-trips.

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

By now you should have several patterns in your toolkit. That collection - not any single answer - is the real output of this mission. Every pattern you write once and reuse ten times pays for itself many times over.

The four patterns in this module cover most of the professional prompting you will do: playing a role, repurposing content, summarising meetings, and guiding iteration. Keep them where you can reach them at work.

## Learning Objectives

- Assemble the four core prompt patterns into a reachable toolkit
- Choose the right pattern for a task on sight
- Explain why reusable patterns, not single answers, are the mission's real output

## The Four Patterns

### Role prompt
- 'Act as a [role] for an audience of [audience]'
### Repurpose prompt
- 'Convert [content] into [format], keeping the facts identical'
### Summary prompt
- 'Extract decisions, actions with owners and dates, and open items'
### Iteration instruction
- 'Make it shorter and more practical'

## Choosing the Pattern

- Starting from a blank page? Use the role prompt with audience and task
- Changing one format to another? Use the repurpose prompt
- Condensing notes or a thread? Use the summary prompt
- You have a draft that is close? Apply the iteration instruction

## Keeping the Toolkit Alive

- Add one pattern every week from your real work - not from theory
- Write one line per pattern: what it is for and when it works
- A toolkit you never open is worthless; keep it one click away

## Key Takeaways

- Reusable patterns, not single answers, are the real output of this mission
- The four core patterns cover role, repurpose, summary, and iteration
- Choose the pattern by the shape of the task, not the tool
- Write one line per pattern - its purpose and when it works
- Keep the toolkit where you can reach it daily; reuse is the point

## Practice Challenge

1. Write all four patterns into your toolkit in your own words.
2. Add one additional pattern from a task you actually did this week.
3. Mark which pattern saved you the most time and why.

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
