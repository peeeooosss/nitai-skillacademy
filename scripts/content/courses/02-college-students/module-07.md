# Mission 7: AI Agents & Automation Basics

---
### Module 1 · From Chat to Action: What Is an Agent?

Until now, AI *talked*. **Agents** let AI *act* - call tools, fetch web pages, read files, send messages, and chain steps to finish a task on their own. This is where AI goes from a study tool to a productivity engine.

The difference is simple: a chat answers, while an agent plans and executes steps toward a goal, asking you only when it is blocked. Think of it as delegation with supervision - like giving a junior assistant a checklist and spot-checking their work.

## Learning Objectives

- Define an AI agent and its core capability
- Distinguish chat from agent behaviour
- Treat agents as delegation with supervision
- Identify the tasks best suited to agents

## Chat Versus Agent

- **Chat:** you ask, it answers
- **Agent:** you give it a goal and the tools, and it plans plus executes steps
- An agent asks you only when it is blocked
### The core difference
- Agents execute steps; chats only converse
- Agents call tools and chain actions toward a goal

## Delegation With Supervision

```text
Managing an agent like a junior:
1. Give it a clear goal and the tools
2. Let it plan and execute the steps
3. Spot-check the outputs as they arrive
4. Intervene when anything drifts
```
- Supervision, like managing a junior, is the key discipline
- Trust it fully, or never - you always verify the work

## What Agents Are For

### Best-suited tasks
- Goals with clear steps and reversible actions
- Automate dull rule-based digital work
### Wrong tasks
- Creative brainstorming and final academic judgment
- High-stakes irreversible calls
- Keep the thinking work human-led; let agents eat the boring parts

## Key Takeaways

- An agent acts; a chat only talks
- Agents plan and execute steps toward a goal
- Manage agents like a junior: delegate then spot-check
- Best for clear-step reversible tasks
- Keep thinking work human-led

## Practice Challenge

1. Describe one task where an agent beats a chat and why
2. Write the goal and the step list you would give an agent
3. Identify one task you would never automate and explain why

**Example Quiz**

1. What is the core difference between a chat and an agent?
- A) An agent acts, calling tools and chaining steps toward a goal
- B) Chat is faster
- C) Agents are chats with emojis
- D) Chat uses APIs

**Answer:** A — Agents execute steps; chats only converse.

2. How should you treat an agent?
- A) Delegate then spot-check its work
- B) Trust it fully
- C) Ignore it
- D) Run it unattended always

**Answer:** A — Supervision, like managing a junior, is the key discipline.

3. Which tasks are best suited to agents?
- A) Goals with clear steps and reversible actions
- B) Creative brainstorming
- C) Final academic judgment
- D) High-stakes irreversible calls

**Answer:** A — Automate dull rule-based work; keep thinking human-led.

4. When does an agent ask you for help?
- A) When it is blocked
- B) Never
- C) Every step
- D) At the end only

**Answer:** A — Agents ask only when they cannot proceed on their own.

---
### Module 2 · The Automation Mindset: Find the Bot-Able Task

The automation mindset is a filter you run over your own work to find what should be automated. Look for work that is **repetitive, rule-based, and digital**. The signs are concrete: you have done it five times this month, it follows a template, it touches files or forms, and mistakes are recoverable.

Great student candidates include sorting email, summarising daily lectures, formatting data, drafting routine replies, and organising files. Reserve agent power for the dull work - not the thinking work.

## Learning Objectives

- Define the three signs of a bot-able task
- Scan your own week for automation candidates
- Choose dull templated work over creative work for agents
- Explain the recoverability test

## The Three Signs

- **Repetitive:** you have done the same thing five or more times this month
- **Rule-based:** it follows clear rules or a template
- **Digital:** the input and output are files, forms, or messages
### The bonus test
- A mistake is recoverable - nothing irreversible or high-stakes

## Scan Your Week

```text
The weekly scan:
1. List everything you did twice or more
2. Mark which followed a template
3. Mark which touched files or forms
4. Batch the marked ones as candidates
```
- Candidates are usually staring at you in your inbox and folders
- The duller it looks, the better the automation candidate

## Dull Work, Not Thinking Work

### Where to point agents
- Sorting email, summarising lectures, formatting data
- Drafting routine replies, organising files
### Where not to point them
- Exam essays, academic judgment, creative strategy
- Let agents eat the boring parts; keep cognition human
- Automation compounds when it frees your judgment for judgment

## Key Takeaways

- Bot-able work is repetitive, rule-based, and digital
- Five-plus repetitions in a month is the repetition signal
- Recoverability makes automation safe
- Scan your week to spot the candidates
- Agents take the dull work; your judgment takes the thinking

## Practice Challenge

1. Run the weekly scan and list five automation candidates
2. Score each candidate on the three signs
3. Pick one candidate you will automate in this mission

**Example Quiz**

1. 'Find the bot-able task' means spotting work that is ________.
- A) repetitive, rule-based, and digital
- B) short, loud, and social
- C) creative, vague, and emotional
- D) strategic, novel, and risky

**Answer:** A — Bot-able work is dull, templated, and digital.

2. Which sign shows a task is bot-able?
- A) You have done it five-plus times this month
- B) It is your favourite task
- C) It changes daily
- D) It is irreversible

**Answer:** A — Repetition plus fixed rules make great automation candidates.

3. Where should you reserve agent power?
- A) For the dull work, not the thinking work
- B) For exam essays
- C) For academic judgment
- D) For creative strategy

**Answer:** A — Let agents eat the boring parts; keep cognition human.

4. What does the recoverability test check?
- A) A mistake must be recoverable and low-stakes
- B) The task must be fast
- C) The task must pay
- D) The task must be fun

**Answer:** A — Reversible, low-risk actions are safe to automate.

---
### Module 3 · Map the Workflow First

Agents fail when you skip planning. Before you build anything, **map the workflow**: write the task as a checklist of concrete steps, define the trigger and the stop rule, and note every tool the agent will touch. The map is the strategy; the tool is just the executor.

Then prompt the AI with your map and ask for the simplest agent that executes it step by step. A one-page map beats an hour of agent configuration every time - because mapping first halves failure rates and debugging.

## Learning Objectives

- Write a task as a checklist of concrete steps
- Define the trigger and the stop rule
- Note the tools the agent will touch
- Prompt AI to build the simplest executing agent

## Write the Checklist

- Write the task as concrete steps - what exactly happens each time?
- Be specific: 'open email X', 'extract the deadline', 'add to sheet Y'
### The level that works
- Steps your new intern could follow without asking
- That is the level of clarity an agent needs

## Trigger and Stop Rules

```text
The workflow map template:
Task: {one sentence}
Trigger: {what starts it}
Steps: 1. .. 2. .. 3. ..
Stop rule: {when is it done}
Tools: {email, files, sites}
```
- The trigger defines what starts the task
- The stop rule defines what counts as done
- Triggers and stop rules bound the automation

## Let the AI Propose the Build

### The promotion prompt
- 'Here is my workflow map - propose the simplest agent that executes it step by step'
- The map is the strategy; the tool is the executor
### Why mapping wins
- A one-page map beats an hour of agent config
- Mapping first halves failure rates and debugging
- The map is also your audit trail later

## Key Takeaways

- Map the workflow before building anything
- A map is a checklist, trigger, stop rule, and tool list
- The map is the strategy; the tool is the executor
- Prompt AI to propose the simplest agent for your map
- Mapping first halves failure rates and debugging

## Practice Challenge

1. Write a one-page workflow map for your chosen task
2. Define the trigger and stop rule precisely
3. Run the AI proposal prompt and review its simplest design

**Example Quiz**

1. What must come before building an agent?
- A) Mapping the workflow as a concrete checklist
- B) Choosing the fanciest tool
- C) Writing prompts forever
- D) Buying a license

**Answer:** A — A one-page workflow map is the strategy an agent executes.

2. What does the trigger define in a workflow map?
- A) What starts the task
- B) The colours
- C) The output file name
- D) The platform

**Answer:** A — Triggers and stop rules bound the automation.

3. Why not skip straight to agent configuration?
- A) The map prevents failure before tooling
- B) It is faster to tools first
- C) Maps are outdated
- D) Tools define the workflow

**Answer:** A — Mapping first halves failure rates and debugging.

4. What does the stop rule define?
- A) When the task is done
- B) Where it runs
- C) Who owns it
- D) What it costs

**Answer:** A — The stop rule is what counts as completion.

---
### Module 4 · Build With No-Code First

Start agents without writing much code. Use no-code automation platforms where you visually wire steps, browser assistants for tasks that live in web pages, and free tiers for almost everything a college workflow needs.

Rough logic: build the simplest thing that automates the dullest twenty minutes of your week. If it survives a week, upgrade it. If not, you have still learned where agents do and do not pay off.

## Learning Objectives

- Choose the right no-code platform for a task
- Wire a trigger-to-output flow visually
- Use free tiers for college workflows
- Build the simplest thing that automates the dullest twenty minutes

## The No-Code Arsenal

- **Automation platforms:** Make, n8n, Zapier - visually wire trigger, AI step, output step
- **Browser assistants:** ChatGPT with tools, Claude with computer use, browser agents
- **Free tiers:** a college workflow rarely needs a paid plan
### The matching rule
- File and data flows: automation platforms
- Web-page tasks: browser assistants

## The Simplest Thing That Works

```text
The scaling rule:
1. Build the smallest flow for the dullest 20 minutes
2. Run it once for real
3. If it survives a week, upgrade it
4. If it dies, you still learned where agents pay off
```
- Minimal scopes ship and teach
- Over-build dies under its own weight

## Read the Wiring

### The three nodes to learn
- Trigger: what starts the flow
- AI step: what the model does in the middle
- Output step: where the result lands
### Why visual wiring wins early
- You see the whole pipeline at once
- Debugging is dragging a wire, not reading a stack trace
- No-code first means faster first successes

## Key Takeaways

- No-code platforms wire trigger, AI step, and output visually
- Browser assistants handle web-page tasks
- Free tiers cover almost all college workflows
- Build the smallest flow for the dullest twenty minutes
- Surviving a week earns an upgrade; failing still teaches

## Practice Challenge

1. Choose a no-code platform and wire one trigger-to-output flow
2. Run it once and note where the plan met reality
3. Decide the upgrade or kill call after a trial run

**Example Quiz**

1. What is the benefit of no-code automation platforms?
- A) Visual wiring of trigger, AI step, and output
- B) Free GPUs
- C) No internet needed
- D) They write final reports

**Answer:** A — No-code builders prototype agents without engineering.

2. How should you start building your first agent?
- A) Smallest tool for the dullest twenty minutes
- B) The biggest stack possible
- C) All paid plans at once
- D) A custom fine-tune

**Answer:** A — Minimal scopes ship and teach; over-build dies.

3. If a minimal agent survives a week, what should you do?
- A) Upgrade it based on what worked
- B) Delete it
- C) Ignore it
- D) Reuse someone else's

**Answer:** A — Survival signals real value; iterate upward.

4. What are the three nodes of a no-code automation flow?
- A) Trigger, AI step, output step
- B) Input, colour, theme
- C) Name, path, size
- D) Start, middle, archive

**Answer:** A — Those three nodes are the whole visual pipeline.

---
### Module 5 · Rules for Trustworthy Agents

Agents act in your name, so you must supervise them like a manager. The five rules are least privilege, human-in-the-loop, logs, time-boxing, and secrets. Together they convert 'can it do the task?' into the question that actually matters: what happens when it does it wrong?

Design for the failure case and you can trust your automation. The rules are cheap to apply at build time and expensive to ignore after something goes wrong.

## Learning Objectives

- Apply the least-privilege principle to agent access
- Require human approval for irreversible actions
- Keep logs and time-box agent runs
- Never embed secrets in prompts or scripts

## Least Privilege and Human in the Loop

- **Least privilege:** give the agent only the accounts and folders the task needs
- **Human-in-the-loop:** require approval for anything irreversible - sending, deleting, paying
- Restricting access limits damage when agents err
### The behavior check
- Would the agent's permissions raise questions in an audit?
- If yes, tighten them

## Logs and Time-Boxes

```text
The supervision stack:
1. Logs: keep the agent's steps so you can audit
2. Time-box: set run limits, not infinite loops
3. Spot-check: verify outputs you depend on
```
- Logs are your audit trail for every automation
- Run limits catch runaway agents before they spin forever

## Secrets and Failure Design

### The secrets rule
- Never embed passwords or tokens in prompts or scripts
- Use environment variables or secret managers
### The failure question
- Design for failure: what happens when the agent does it wrong?
- Approval gates, log inspection, and limits make automation trustworthy
- Faith is not a safeguard; auditing is

## Key Takeaways

- Give agents only the access the task needs
- Require approval for irreversible actions
- Keep logs and time-box every run
- Never embed secrets in prompts or scripts
- Design for the failure case - auditing beats faith

## Practice Challenge

1. Write the least-privilege list for your automation
2. Add a human-approval step to any irreversible action
3. Review every prompt and script for embedded secrets

**Example Quiz**

1. What does least privilege mean for agents?
- A) Give the agent only the accounts and folders it needs
- B) Give it full admin
- C) Hide all passwords
- D) Let it browse freely

**Answer:** A — Restricting access limits damage when agents err.

2. What does human-in-the-loop mean?
- A) Require approval for irreversible actions
- B) Ask for permission on every step
- C) Ignore the agent
- D) Only work with humans

**Answer:** A — Gating send, delete, and pay actions keeps control.

3. How should you design for the failure case?
- A) Require approval, time-box, and inspect the logs
- B) Assume it never fails
- C) Add more features to mask it
- D) Run without limits

**Answer:** A — Failure design - not faith - makes automation trustworthy.

4. Where should secrets live?
- A) Environment variables or secret managers
- B) Inside prompts
- C) In the script body
- D) In chat history

**Answer:** A — Prompts and scripts are the wrong home for passwords and tokens.

---
### Module 6 · Agents That Go Wrong (and How to Catch It)

Agents fail in predictable ways, and each failure mode has a checkpoint. Hallucinated intermediate steps need citation checks. Scope creep needs one-task agents with stop rules. Runaway loops need time-boxes. Wrong tool use needs log watching.

The cautionary tale is instructive: an agent summarising email started replying to spam with polite thank-yous after a misconfigured step. The fix was not more AI - it was a review rule that made the agent read-only. Auditing beats faith.

## Learning Objectives

- Name the four common agent failure modes
- Match each failure to its checkpoint
- Explain the read-only review rule example
- Apply auditing as the core safety mechanism

## The Four Failure Modes

- **Hallucinated intermediate steps** - require it to cite the data it actually used
- **Scope creep** - one task per agent, clear stop rules
- **Runaway loops** - time-box and step limits you set
- **Wrong tool use** - watch the logs, pause and redirect at the first drift
### The matching rule
- Each failure mode has a specific checkpoint built in

## The Email Agent Cautionary Tale

```text
What went wrong:
1. Agent was set to summarise emails
2. A step was misconfigured with send rights
3. It replied to spam with polite thank-yous
4. The fix was a review rule, not more AI
```
- The rule became: read-only, no send
- The lesson: design constraints, not just capabilities

## Auditing Beats Faith

### The core discipline
- Review logs and pause at the first sign of drift
- Visible auditing, not blind trust, is the safety mechanism
### The permanent playbook
- Verify the data the agent claims it used
- One focused task per agent with clear stop rules
- Time-box every run and inspect every log
- Pause and redirect the first time it drifts

## Key Takeaways

- Common failures: hallucination, scope creep, runaway loops, wrong tool use
- Each failure mode has a matching checkpoint
- Read-only constraints prevent whole classes of blunders
- Auditing beats faith as the core safety mechanism
- Pause and redirect at the first sign of drift

## Practice Challenge

1. List the four failure modes and their checkpoints from memory
2. Add a read-only constraint to a test automation you build
3. Review one agent's logs and note the first sign of any drift

**Example Quiz**

1. What is a common agent failure mode?
- A) Hallucinated intermediate steps that need citation checks
- B) Being too fast
- C) Too little output
- D) Perfect accuracy

**Answer:** A — Verify the data and steps the agent claims it used.

2. How do you prevent scope creep in agents?
- A) One task per agent with clear stop rules
- B) Add more tasks for efficiency
- C) Longer prompts
- D) More steps per goal

**Answer:** A — Focused agents stay predictable.

3. What does the 'auditing beats faith' lesson teach?
- A) Review logs and pause on drift
- B) Trust model outputs
- C) Never look at logs
- D) Scale blind

**Answer:** A — Visible auditing, not blind trust, is the safety mechanism.

4. How was the misconfigured email agent fixed?
- A) A read-only, no-send review rule
- B) A bigger model
- C) More AI steps
- D) A faster server

**Answer:** A — Constraints, not capability, were the fix.

---
