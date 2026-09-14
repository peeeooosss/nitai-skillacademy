# Mission 7: AI Agents & Automation Basics

## Learning Objectives
- Understand what an AI agent is and when to use one
- Map a repetitive task into an automation workflow
- Build a small agent or workflow with no-code tools
- Know the limits: when automation and agents are risky
- Complete one working automation end to end

---

## From Chat to Action: What Is an Agent?

So far AI has answered questions. An **agent** is AI that *does things*: reads inputs, makes decisions, calls tools, and completes a task — like an assistant who doesn't just advise you but also files the paperwork.

Real-world agents students meet:
- A **research agent** that collects papers on a topic and drafts an annotated bibliography.
- A **form filler** that reads a spreadsheet and drafts letters or emails from a template.
- A **notification bot** that checks a timetable or page and messages you when something changes.

Agents = **model + memory + tools + a loop** (plan → act → observe → adjust).

## The Automation Mindset: Find the "Bot-Able" Task

Repetitive tasks with clear rules are automation's sweet spot:

Ask of any task: *Do I repeat it? Are the steps identical? Is the output predictable?* If yes to all three, it's bot-able. Examples: sorting files, generating similar emails, formatting data, checking a routine webpage, generating weekly summaries.

**Don't automate** tasks that need your judgment (drafting final decisions, personal messages, anything with ethical stakes) — or anything on devices you don't control.

## Map the Workflow First

Before touching tools, draw the pipeline on paper:

1. **Trigger** — what starts it? (new file, schedule, email, button?)
2. **Inputs** — what data does it read? Where from?
3. **Steps** — the exact rules it applies (2-5 steps max for a first version).
4. **Output** — where does the result go? (file, sheet, folder, message?)
5. **Fallbacks** — what happens on error? Does it stop and tell you?

Sketch it as: `Trigger → Input → Step → Step → Output`. A clear map makes the build 10x faster.

## Build With No-Code First

You don't need code to ship your first agent. Options (student/free tiers exist):

- **Zapier / Make** — connect apps: "When a new row is added to my Google Sheet → generate a summary with AI → email it to me."
- **n8n (self-hosted)** — more powerful, still visual; great for learning.
- **Explain-to-prompt agents** (like ChatGPT "Tasks"/custom GPTs) — give it a system prompt with rules + tools, and it runs in chat with you.

**First build (recommended):** a weekly "course digest" automation — pulls new items from one app (notifications, a shared doc, a reading feed), asks AI to summarise into 3 bullet points, and delivers it to your inbox or notes. Assemble the recipe in Zapier/Make; no code needed.

## Rules for Trustworthy Agents

- **Least privilege:** give the agent only the access it needs — a copy of one sheet, not your whole Drive.
- **Human-in-the-loop:** first versions should *propose* actions and ask you to confirm before sending anything to anyone.
- **No secrets:** never paste passwords, API keys, or personal IDs into prompts or agents.
- **Test with fake data:** run it against sample inputs before touching real data.
- **Log & review:** keep a copy of what it did. If output changes, you'll catch it.

## Agents That Go Wrong (And How to Catch It)

- **Drift:** an agent quietly changes behaviour or tone. → Spot-check outputs every few runs.
- **Overreach:** it did more than asked (deleted, moved, emailed). → Least privilege + confirm-gates.
- **Hallucination at action time:** it "successfully" emailed a summary that was wrong. → Read the first few outputs carefully.

The rule that saves you: **automate the boring, verify the important.**

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