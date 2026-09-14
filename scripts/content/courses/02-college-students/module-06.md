# Mission 6: AI Coding Assistants & Simple Scripts

## Learning Objectives
- Use AI to read, explain, and debug code confidently
- Write small scripts that automate real college tasks
- Learn the copy-run-understand loop for code
- Use best practices: read first, test always, commit often
- Turn a manual task in your life into a 20-line script

---

## Code is a Superpower — and AI is Your Co-Pilot

You don't need to be a CS major to write useful scripts. With an AI coding assistant, you can automate boring parts of student life: renaming files, downloading a list of pages, merging spreadsheets, or formatting bibliographies.

## The Three Modes of an AI Coding Assistant

1. **EXPLAIN** — "Explain this code line by line, as if I'm new." (Great for reading your lab handouts.)
2. **WRITE** — "Write a Python script that [task], with comments, handling errors gracefully."
3. **DEBUG** — "Here's my code and the error. Find the bug, explain the cause in one sentence, and give a minimal fix."

Best practice: **explain before write, debug after write.** Never run code you don't understand — at university scale, "it worked on my machine" is only the beginning.

## Recommended Stack for This Course

- **Python** — the lingua franca of automation and data.
- **Google Colab** (free, no install) for notebooks; or **VS Code** for real projects.
- **Copilot / Cursor / Code Whisperer / AI chat** — any coding assistant you like; free student tiers exist.

## The Copy → Run → Understand Loop

1. **Copy** the AI's script into your editor/Colab.
2. **Run** it. Observe output and errors.
3. **Understand** it — ask AI: "Explain each of the 3 main functions and where they touch the input file."
4. **Change** one small thing (a filename, a value) and run again. If you can fix one thing, you own the script.

Repeat until you can predict what the script will do before you run it. That's programming.

## Writing a Script That Actually Helps You

Pick a real task and spec it like a pro:

**Example spec:**
> "Write a Python script that reads `marks.csv` (columns: name, subject, marks), adds a 'grade' column using this scale [scale], sorts by marks descending, and saves `graded.csv`. Add comments and handle a missing file with a friendly message."

Notice: clear inputs, clear rules, clear output, error handling, comments. That's an 85/100 script spec — and it's most of the battle.

## Automation Ideas for Student Life

- 📁 Organise downloaded files into folders by type.
- 📊 Turn multiple attendance/expense sheets into one summary.
- 🔖 Convert a reference list into a clean table.
- ⏰ Set reminders / read a timetable file.
- 🌐 Download the text of a reading list page.

Automating one task saves you minutes the first time — and hours every semester.

## Best Practices (Low Cost, High Value)

- **Read it before you run it.** At least skim for anything that looks dangerous (deleting files, sending data somewhere).
- **Never paste secrets** (passwords, tokens, API keys) into AI chat. Use environment variables.
- **Test on a copy** of your real data first, not the original.
- **Commit early & often** with git — even for classwork, version control is a CV skill.
- **Prefer libraries, not reinvented wheels** — ask AI "which standard library function does this?" Pandas, os, pathlib, requests, datetime cover 90% of student automation.

## Key Takeaways

- AI triples your coding power: EXPLAIN, WRITE, DEBUG.
- Never run code you don't understand — use Copy → Run → Understand.
- Spec scripts cleanly: input, rules, output, error handling, comments.
- Automate real tasks in your life — small wins compound.
- Protect secrets, test on copies, and use version control.

## Practice Challenge

1. **Explain mode:** Paste one code block from a lab handout into AI and get a line-by-line explanation. Note 2 things you now understand better.
2. **First automation:** Write (with AI) a Python script that solves one real task from the idea list above. Run it on a COPY of data.
3. **Debug drill:** Introduce one bug on purpose (wrong column name), run it, and use AI to find and fix it. Explain the fix in one sentence.
4. **Git init:** Create a git repo for your script, make 2 commits, and attach the repo URL to your portfolio notes.