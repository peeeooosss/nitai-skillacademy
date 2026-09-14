# Mission 5: Data Analysis & Visualisation with AI

## Learning Objectives
- Clean and explore a real dataset using AI-assisted workflows
- Write basic analysis scripts without being a programmer yet
- Create and interpret charts with AI
- Ask data questions that are precise and answerable
- Avoid the classic AI-data traps (fake numbers, mismatched tests)

---

## Data Literacy Is a Career Fuel

Every department — science, commerce, humanities, design — increasingly runs on data. You don't need to become a data scientist. You need to become a **data-fluent professional**: someone who can ask good questions, get trustworthy answers, and explain them visually.

## The Data Workflow (With AI as Analyst-Buddy)

1. **Understand** your data: "Here's my CSV/notebook — what columns, what types, what's the story?"
2. **Clean** it: "Find missing values, duplicates, and obvious errors. Suggest a cleaning plan. Do NOT run code yet — show me what you'd check."
3. **Explore** it: "For each column, suggest 2 things worth analysing and 1 chart that fits."
4. **Analyse** it: get AI to *write the code* you then run (or run AI-assisted in a notebook).
5. **Visualise** it: charts with labels, titles, and honest captions.
6. **Explain** it: "Interpret this result for a non-technical reader in 3 sentences."

## The Code Buddy Method (No Prior Coding Needed)

- **Let AI write the script** to a clear spec: "Write Python (pandas/matplotlib) code that: loads [file], handles missing values in [columns], plots a bar chart of [A] by [B], and prints basic stats. Do not show output — just working code."
- **Run it yourself** in Google Colab or Jupyter (paste, press play). Never claim results you didn't run.
- **Debug loop:** paste the error back to AI ("fix this"), acknowledge version/context, and re-run.
- **Own the result:** read the output numbers out loud. If you can't explain them, ask AI to explain *the result*, then re-explain it in your own words.

## Choosing the Right Chart

Ask AI, then apply judgment:

- **Comparisons** → bar chart.
- **Change over time** → line chart.
- **Parts of a whole** → pie/donut (use sparingly) or stacked bar.
- **Relationship between two things** → scatter plot.
- **Distribution** → histogram/box plot.
- **Geographic** → map.

Prompt: "Given columns [X] and [Y] and question [Q], which chart type is best and why?"

## Interpreting Results Honestly

The hard part isn't making charts — it's **not overclaiming**:

- **Correlation ≠ causation.** "Ice cream sales and drowning deaths rise together" — that's summer, not cause.
- **Small samples aren't conclusions.** Ask AI: "Is my sample size enough to make this claim? What's the weakness?"
- **Aggregates hide detail.** Totals can mask big differences between groups.
- **Outliers matter.** "Show me the min/max and any extreme values before I conclude."

## The AI-Data Trap List

- ❌ **Fake summary stats:** AI may *invent* a correlation coefficient. Rule: never report a number the AI didn't compute from your real data. Either run the code or recompute manually.
- ❌ **Wrong test for the question:** "Use a t-test/chi-square/regression" only on AI's say-so, then ask "why this test?" If the justification is shaky, verify with your stats course or textbook.
- ❌ **Pretty but wrong chart:** a chart with misleading axes misleads people. Check labels, titles, and scales.

## Key Takeaways

- Data-fluent beats data-scientist for most careers: ask well, verify, explain simply.
- Use AES/DES with AI: Understand → Clean → Explore → Analyse → Visualise → Explain.
- Let AI write scripts, run them yourself, and own every number you report.
- Choose charts by question type; always label honestly.
- Never report a statistic AI didn't compute from your actual data.

## Practice Challenge

1. **Get a small real dataset** — your class attendance, marks, spending, or a public dataset from your field.
2. **Clean & explore:** ask AI to audit it, then apply a 3-step cleaning plan.
3. **Two analyses, two charts:** make one comparison chart and one trend/relationship chart with code AI helped you write — run them yourself.
4. **Explain it:** write a 3-sentence WRITTEN explanation (for a non-technical reader) of each chart, then have a roommate/classmate read it and confirm they understood.