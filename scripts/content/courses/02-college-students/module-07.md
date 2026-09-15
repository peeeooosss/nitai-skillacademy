# Mission 7: AI Agents & Automation Basics

## Learning Objectives
- Understand what an AI agent is and when to use one
- Map a repetitive task into an automation workflow
- Build a small agent or workflow with no-code tools
- Know the limits: when automation and agents are risky
- Complete one working automation end to end

---
### Module 1 · From Chat to Action: What Is an Agent?
Until now, AI *talked*. **Agents** let AI *act* — call tools, fetch web pages, read files, send messages, and chain steps to finish a task on their own.

How it differs:

- **Chat:** you ask, it answers.
- **Agent:** you give it a goal and the tools, and it plans + executes steps, asking you only when it's blocked.

Think of it as **delegation with supervision** — like giving a junior assistant a checklist and spot-checking their work. Agents are where AI goes from a study tool to a productivity engine.

**Example Quiz**

1. What is the core difference between a chat and an agent?
- A) An agent acts — calling tools and chaining steps toward a goal
- B) Chat is faster
- C) Agents are chat with emojis
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

### Module 2 · The Automation Mindset: Find the "Bot-Able" Task
Look for work that is **repetitive, rule-based, and digital**. Signs a task is bot-able:

- You've done the same thing 5+ times this month.
- It follows clear rules or a template.
- The input and output are files, forms, or messages.
- A mistake is recoverable (nothing irreversible or high-stakes).

Great student candidates: sorting email, summarising daily lectures, formatting data, drafting routine replies, organising files. Reserve agent power for the dull work, not the thinking work.

**Example Quiz**

1. "The Automation Mindset: Find the Bot-Able Task" teaches you to spot work that is ________.
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

### Module 3 · Map the Workflow First
Agents fail when you skip planning. **Map the workflow before you build:**

1. Write the task as a checklist of concrete steps (what exactly happens each time?).
2. Define the **trigger** (what starts it) and the **stop rule** (when is it done?).
3. Note each **tool or source** the agent will touch (email, files, a website).

Then prompt the AI: *"Here's my workflow map — propose the simplest agent that executes it, step by step."* The map is the strategy; the tool is just the executor. A one-page map beats an hour of agent config.

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

3. Why skip straight to agent config?
- A) Because the map prevents failure before tooling
- B) It is faster to tools first
- C) Maps are outdated
- D) Tools define the workflow

**Answer:** A — Mapping first halves failure rates and debugging.

### Module 4 · Build With No-Code First
Start agents without writing much code:

- Use **automation platforms** (Make, n8n, Zapier) where you visually wire steps: trigger → AI step → output step.
- Use **browser assistants** (ChatGPT with tools, Claude computer use, or browser agents) for tasks that live in web pages.
- Use **free tiers** — a college workflow rarely needs a paid plan.

Rough logic: build the simplest thing that automates the dullest 20 minutes. If it survives a week, upgrade it. If not, you've still learned where agents pay off.

**Example Quiz**

1. What is the benefit of no-code automation platforms?
- A) Visual wiring of trigger → AI step → output
- B) Free GPUs
- C) No internet needed
- D) They write reports for final grades

**Answer:** A — No-code builders prototype agents without engineering.

2. How should you start building your first agent?
- A) Smallest tool for the dullest 20 minutes
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

### Module 5 · Rules for Trustworthy Agents
Agents act in your name — supervise like a manager:

- **Least privilege:** give the agent only the accounts/folders the task needs.
- **Human-in-the-loop:** require approval for anything irreversible (sending, deleting, paying).
- **Logs:** keep the agent's steps so you can audit what happened.
- **Time-box:** set run limits so a runaway agent can't spin forever.
- **Secrets:** never embed passwords or tokens in prompts or scripts.

The question isn't "can it do the task?" — it's "what happens when it does it wrong?" Design for the failure case and you can trust your automation.

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

**Answer:** A — Gating sends/delete/pay actions keeps control.

3. How should you design for the failure case?
- A) Require approval, time-box, and inspect the logs
- B) Assume it never fails
- C) Add more features to mask it
- D) Run without limits

**Answer:** A — Failure design (not faith) makes automation trustworthy.

### Module 6 · Agents That Go Wrong (And How to Catch It)
Common failure modes and their checkpoints:

- **Hallucinated intermediate steps** → require it to cite the actual data it used.
- **Scope creep** → one task per agent, clear stop rules.
- **Runaway loops** → time-box and step limits you set.
- **Wrong tool use** → watch the logs, pause and redirect the first time it drifts.

Cautionary tale: an agent "summarising emails" started replying to spam with polite thank-yous after a misconfigured step. The fix wasn't more AI — it was a review rule ("read-only, no send"). **Auditing beats faith.**

## Real-World Examples

- A student automates sorting internship-spam emails into a folder so real offers don't drown.
- A group automates collecting everyone's report sections by deadline into one shared folder with a summary.
- A course rep uses a no-code flow to turn new announcements into a daily digest for the class group.
- A junior intern automates daily file downloads and renames, reviewed weekly by the supervisor.

## Key Takeaways
- An agent = model + memory + tools + a loop; it *acts*, not just answers.
- Automate tasks that are repeated, rule-based, and predictable.
- Map Trigger → Inputs → Steps → Output → Fallbacks before building.
- Start no-code (Zapier/Make/n8n); test with fake data; keep a human in the loop.
- Least privilege + no secrets + spot-checking keep automation safe.

## Practice Challenge
1. **Spot a task:** Find one repetitive task in your week. Map it using the five-part workflow sketch.
2. **Build it:** Create a working automation (no-code first) that completes your task — even a mini version. Run it once successfully.
3. **Test + verify:** Run it twice: once with realistic fake data, once with real data on a copy. Confirm every output step manually.
4. **Document it:** Write a 4-line user guide for your automation (what triggers it, what it does, what to check). This becomes a portfolio bullet point.

**Example Quiz**

1. What is the most common agent failure mode?
- A) Hallucinated intermediate steps that need citation checks
- B) Being too fast
- C) Too little output
- D) Perfect accuracy

**Answer:** A — Verify the data/steps the agent claims it used.

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

