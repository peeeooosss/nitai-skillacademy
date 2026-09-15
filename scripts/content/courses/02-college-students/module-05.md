# Mission 5: Data Analysis & Visualisation with AI

## Learning Objectives
- Clean and explore a real dataset using AI-assisted workflows
- Write basic analysis scripts without being a programmer yet
- Create and interpret charts with AI
- Ask data questions that are precise and answerable
- Avoid the classic AI-data traps (fake numbers, mismatched tests)

---
### Module 1 · Data Literacy Is a Career Fuel
Almost every job now involves reading numbers — sales figures, survey results, costs, experiments, student data. Data literacy sets you apart in every field, not just "tech" ones.

With AI you can now:

- **Clean and inspect** messy data without a stats degree.
- **Choose the right visual** instead of guessing.
- **Write the analysis** your professor or manager actually wants.

But the judgment — what the numbers mean, what's trustworthy, what the story is — remains yours. AI is your analyst-buddy, not your auditor.

**Example Quiz**

1. Why does data literacy matter beyond 'tech' jobs?
- A) Reading numbers is now part of almost every role
- B) Only data scientists use numbers
- C) It is a hobby
- D) It fills resumes

**Answer:** A — Sales, surveys, costs and experiments all require number judgment.

2. What is AI's safe role in data work?
- A) Analyst-buddy: describe, clean, analyse under your control
- B) Your auditor for everything
- C) A replacement for readers
- D) The decision maker

**Answer:** A — You stay the analyst; AI accelerates the mechanical parts.

3. Which stays YOUR job in data with AI?
- A) Judgment about meaning, trust, and story
- B) Writing the syntax
- C) Renaming columns
- D) Shading charts

**Answer:** A — Numbers' meaning and trustworthiness are human calls.

### Module 2 · The Data Workflow (With AI as Analyst-Buddy)
Follow a repeatable pipeline:

1. **Describe:** give AI the columns and sample rows; ask it to describe the dataset's structure and quality issues.
2. **Clean:** ask for a short checklist of missing-data and outlier decisions before you touch anything.
3. **Analyse:** ask targeted questions ("What's the trend in column X over time?"), not open-ended "analyse this".
4. **Visualise:** ask which chart type fits which question, then let it generate the chart.
5. **Explain:** ask it to write the *interpretation*, then check every claim against your own numbers.

Document each step — your analysis becomes reproducible, which markers and managers love.

**Example Quiz**

1. What is the correct pipeline order?
- A) Describe → Clean → Analyse → Visualise → Explain
- B) Analyse → Clean → Describe
- C) Visualise → Explain first
- D) Skip straight to charts

**Answer:** A — Understand and clean data before any analysis or chart.

2. What question style gives better analysis?
- A) Targeted questions per column/trend
- B) Open-ended 'analyse this'
- C) Vague feelings
- D) Copy-paste prompts

**Answer:** A — Specific questions yield specific, checkable answers.

3. Why document each data step?
- A) Reproducibility that markers and managers reward
- B) It is faster
- C) To fill pages
- D) Because software requires it

**Answer:** A — A documented pipeline turns analysis into evidence.

### Module 3 · The Code Buddy Method (No Prior Coding Needed)
You don't need to be a programmer to analyse data with AI:

1. Ask a chat tool to write a small analysis script in **Python (pandas)** for a specific task.
2. **Run the code step by step** in a free environment (Google Colab works in a browser).
3. When it errors, paste the error back: *"Here's the error, fix it and explain what was wrong."*

This "copy → run → fix with the AI" loop is how thousands of students now analyse real data. You're still the analyst — you decide the questions and check the answers — but the syntax is someone else's problem.

**Example Quiz**

1. What is the copy → run → fix loop?
- A) Take AI code, run it, paste errors back until it works
- B) Skip to ChatGPT's final file
- C) Only read the code
- D) Frame the errors

**Answer:** A — Running and fixing builds intuition without syntax pain.

2. What environment runs browser-based Python for analysis?
- A) Google Colab
- B) A printer
- C) Photoshop
- D) A spreadsheet macro

**Answer:** A — Colab runs pandas notebooks straight from a browser.

3. Who decides the questions and checks the answers in this loop?
- A) You — the analyst
- B) The AI
- C) The platform
- D) No one

**Answer:** A — The analyst owns questions and verification; AI owns syntax.

### Module 4 · Choosing the Right Chart
The chart must fit the **question**, not your mood:

- **Comparison (A vs B):** bar chart.
- **Trend over time:** line chart.
- **Parts of a whole:** pie or stacked bar (sparingly!).
- **Distribution:** histogram or box plot.
- **Relationship between two variables:** scatter plot.

Ask AI: *"Given my data and question, which one chart tells the story best, and why?"* Then generate it with AI and label axes properly. A well-labelled simple chart beats a confusing fancy one every time.

**Example Quiz**

1. Which chart fits a trend over time?
- A) Line chart
- B) Pie chart
- C) Scatter for means
- D) Bar for mapping

**Answer:** A — Lines show change across time; pie fits parts of a whole.

2. Which chart is best for comparing two groups?
- A) Bar chart
- B) Line for months
- C) Pie for totals
- D) Table for 10 bars

**Answer:** A — Bars make group comparison intuitive.

3. Why must axes always be labelled?
- A) An unlabelled chart is interpretation, not evidence
- B) It looks artistic
- C) It is a style rule
- D) To pass spell-check

**Answer:** A — Labels are what make the visualisation trustworthy.

### Module 5 · Interpreting Results Honestly
The most common data mistake isn't technical — it's **over-claiming**:

- **Correlation ≠ causation:** "sales rose with ad spend" is not "ads caused sales".
- **Small samples lie:** an n of 5 is a pattern you can't defend.
- **Compare like for like:** never compare totals from different groups without saying so.
- **Check your own conclusion:** ask AI to play devil's advocate — *"Attack my interpretation; what could alternatively explain this pattern?"*

Present what the data *supports* and say what it doesn't. Honest limitations are the mark of a mature analyst.

**Example Quiz**

1. Why is correlation not causation?
- A) Two trends rising together can be coincidental
- B) Correlation is always stronger
- C) Causation is a myth
- D) Numbers cannot relate

**Answer:** A — Co-occurrence alone never proves one causes the other.

2. What is the danger with a sample of 5?
- A) It is a pattern you cannot defend
- B) It is too expensive
- C) It is too large
- D) It guarantees significance

**Answer:** A — Small samples can't support general claims.

3. How do you pressure-test your own interpretation?
- A) Ask AI to attack it and find alternative explanations
- B) Ask AI to agree
- C) Present it louder
- D) Never revisit it

**Answer:** A — Adversarial review catches over-claims early.

### Module 6 · The AI-Data Trap List
Watch for these classic traps when trusting AI with numbers:

- **Made-up stats:** AI can invent means, percentages, and even chart data. Demand that numbers come from your dataset.
- **Wrong columns:** AI may "analyse" a column that doesn't exist — check names first.
- **Selective stories:** AI will happily garnish your conclusion with facts not in the data.
- **Overconfidence:** a neat chart doesn't make the analysis sound — your validation does.

Rule of thumb: *any number you can't trace to your own data — kill it.* Run this checklist before submitting any data assignment.

## Real-World Examples

- A business student analyses a store's monthly sales in a Colab notebook built by AI, then defends it in class.
- A psychology student uses AI to choose a box plot for experimental groups instead of a misleading bar chart.
- A final-year engineer asks AI to 'attack' his interpretation of sensor data and catches a false causation early.
- A marketing intern turns a messy export into a clean one-page chart pack for their manager.

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

**Example Quiz**

1. What should you do with any number you can't trace to your data?
- A) Kill it
- B) Keep it for flair
- C) Bold it
- D) Double it

**Answer:** A — Untraceable numbers are fiction — remove them.

2. How can AI invent data in charts?
- A) It may generate plausible numbers not in your dataset
- B) Charts are always accurate
- C) It checks your columns
- D) It verifies sources

**Answer:** A — Demand numbers come from your actual dataset.

3. Why check column names before trusting an AI analysis?
- A) AI may 'analyse' columns that don't exist
- B) Columns are decorative
- C) It fails on big files
- D) It is a performance issue

**Answer:** A — Verify names, then trust outputs built on them.

