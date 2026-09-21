# Mission 6: Health Data Privacy & Responsible AI Use

---
### Module 1 · Patient Data Is Not Training Data

Patient data is protected, confidential, and belongs in approved systems only. It is not material to feed public AI models.

A single paste into the wrong tool can be a privacy breach. Treat every patient detail as protected.

## Learning Objectives

- Treat patient data as protected
- Avoid feeding data to public models
- Use approved systems only
- Prevent privacy breaches

## The Rule

- Patient data is confidential by default
- It belongs in approved systems only
- It is never training data for public models
### Why
- A wrong paste is a breach
- Public tools may retain inputs
- Confidentiality is a legal and ethical duty

## Safe Practice

- Use only approved, contracted tools
- Never paste identifiable data into consumer AI
- When in doubt, leave it out
### The rule
- Approved tools only
- No identifiable data in consumer AI
- Ask before you assume

## The Data-Boundary Prompt

```text
Explain the rules for using patient data with AI in
[setting]: what may and may not be entered into tools,
and the approved channels to use.
```
- What may be entered
- What must never be entered
- Approved channels

## Key Takeaways

- Patient data is protected and confidential by default
- It belongs in approved systems, not public AI tools
- It is never training data for public models
- A single wrong paste can be a privacy breach
- Use approved tools and never paste identifiable data

## Practice Challenge

1. List the approved tools in your setting
2. Identify where a breach could happen
3. Write your no-paste rule

**Example Quiz**

1. What is patient data?
- A) Protected and confidential
- B) Public
- C) Free to share
- D) Training data

**Answer:** A — Patient data is protected and confidential by default.

2. Where does patient data belong?
- A) In approved systems
- B) In public AI tools
- C) In chats
- D) In emails

**Answer:** A — Patient data belongs only in approved, contracted systems.

3. What can a wrong paste cause?
- A) A privacy breach
- B) A faster note
- C) A better diagnosis
- D) Nothing

**Answer:** A — Pasting patient data into the wrong tool can be a breach.

4. What is the safe rule?
- A) Never paste identifiable data
- B) Paste when busy
- C) Paste if anonymised only
- D) Paste always

**Answer:** A — Never paste identifiable patient data into consumer AI tools.

---
### Module 2 · De-identification and What It Misses

De-identification removes names and identifiers, but it is not perfect. Combinations of details can still identify a patient.

Understanding the limits of de-identification keeps you from a false sense of safety.

## Learning Objectives

- Understand de-identification
- Recognise its limits
- Avoid re-identification risks
- Apply it carefully

## What De-identification Does

- Removes names, dates, and identifiers
- Reduces privacy risk
- Is required before many uses
### Why
- It lowers risk but does not remove it
- Rare details can re-identify
- Context can give people away

## What It Misses

- Rare conditions plus location plus age
- Unusual combinations of details
- Free-text that includes identifiers
### The rule
- De-identify, then double-check
- Watch rare combinations
- When unsure, do not paste

## The De-identification Prompt

```text
Review this text [paste] for identifiers that could
re-identify a patient, including rare combinations, and
list what to remove before use.
```
- Identifiers found
- Re-identification risks
- What to remove

## Key Takeaways

- De-identification removes identifiers but is not perfect
- Rare details can re-identify a patient
- Free-text often contains hidden identifiers
- Always de-identify and then double-check
- When unsure, do not paste the data

## Practice Challenge

1. De-identify one sample text
2. Look for rare combinations
3. List any remaining risks

**Example Quiz**

1. What does de-identification do?
- A) Removes identifiers
- B) Removes all risk
- C) Deletes the record
- D) Encrypts data

**Answer:** A — It removes identifiers and lowers risk but does not remove it entirely.

2. What can re-identify a patient?
- A) Rare combinations of details
- B) Common names
- C) Generic ages
- D) Normal results

**Answer:** A — Unusual combinations of details can still identify someone.

3. Where do hidden identifiers hide?
- A) In free-text
- B) In nothing
- C) In titles only
- D) In dates only

**Answer:** A — Free-text notes often contain identifiers that must be removed.

4. What if you are unsure?
- A) Do not paste
- B) Paste anyway
- C) Paste a little
- D) Ask the AI

**Answer:** A — When unsure whether data is safe, do not paste it.

---
### Module 3 · Consent, Transparency, and the Patient

Patients have a right to know how their data is used, including when AI is involved. Transparency builds trust and is often a legal requirement.

Consent and transparency should be built into how you use AI, not added as an afterthought.

## Learning Objectives

- Respect patient consent
- Be transparent about AI use
- Explain data use clearly
- Build patient trust

## Consent and Transparency

- Patients should know when AI is used
- Explain how their data is protected
- Follow your jurisdiction's rules
### Why
- It is a legal and ethical duty
- Transparency builds trust
- Patients may object, and that matters

## Explaining Clearly

- Use plain language about AI's role
- Explain what is and is not shared
- Respect a patient's choice
### The rule
- Be transparent by default
- Explain in plain language
- Respect patient choice

## The Transparency Prompt

```text
Help me write a plain-language explanation for patients
about how AI is used in [setting], what data is involved,
how it is protected, and how to ask questions.
```
- A plain-language explanation
- What data is involved
- How patients can ask questions

## Key Takeaways

- Patients have a right to know when AI is used
- Transparency is a legal and ethical duty
- Explain AI's role and data protection in plain language
- Respect a patient's choice to object
- Build transparency into how you use AI from the start

## Practice Challenge

1. Draft a patient AI transparency note
2. Explain what data is shared
3. Note how patients can ask questions

**Example Quiz**

1. What do patients have a right to know?
- A) When AI is used
- B) Your schedule
- C) Your fees
- D) Nothing

**Answer:** A — Patients should know when AI is involved in their care.

2. What does transparency build?
- A) Trust
- B) Speed
- C) Profit
- D) Distance

**Answer:** A — Transparency about AI use builds patient trust.

3. How should you explain?
- A) In plain language
- B) In jargon
- C) Briefly only
- D) In writing only

**Answer:** A — Explain AI's role and data use in plain language.

4. What if a patient objects?
- A) Respect their choice
- B) Ignore it
- C) Proceed anyway
- D) Discharge them

**Answer:** A — Respect a patient's choice to object to AI involvement.

---
### Module 4 · Vendor Risk and Clinical Tool Approval

Not every AI vendor handles health data safely. Before a tool touches patient information, it needs scrutiny and approval.

Vendor risk is clinical risk: weak data handling, unclear retention, or poor security can harm patients and the practice.

## Learning Objectives

- Assess vendor risk
- Understand approval requirements
- Check data handling and security
- Approve tools properly

## What to Check

- Data handling, storage, and retention
- Security and breach history
- Whether data trains their models
- Compliance with health data rules
### Why
- Weak vendors create clinical risk
- Unclear retention is a liability
- Approval protects patients

## The Approval Process

- Require a data processing agreement
- Confirm the tool is approved for clinical use
- Review again as terms change
### The rule
- No patient data without approval
- Check the contract, not the marketing
- Re-review regularly

## The Vendor Prompt

```text
Help me assess an AI vendor for clinical use: the data
handling, security, retention, and compliance questions I
should ask, and the red flags that should block approval.
```
- Questions to ask the vendor
- Compliance checks
- Red flags

## Key Takeaways

- Vendor risk is clinical risk
- Check data handling, retention, security, and training use
- Require a data processing agreement
- Only approved tools may touch patient data
- Re-review vendors as terms and tools change

## Practice Challenge

1. List the questions you would ask a vendor
2. Identify three red flags
3. Draft your approval criteria

**Example Quiz**

1. What is vendor risk?
- A) Clinical risk
- B) A billing issue
- C) A marketing problem
- D) An IT task

**Answer:** A — Weak vendor data handling creates clinical and privacy risk.

2. What should you check?
- A) Data handling, security, retention
- B) Only the price
- C) Only the demo
- D) Only the logo

**Answer:** A — Check data handling, security, retention, and model training use.

3. What should be required?
- A) A data processing agreement
- B) A verbal promise
- C) A discount
- D) A testimonial

**Answer:** A — Require a data processing agreement before using a vendor.

4. When should you re-review?
- A) As terms and tools change
- B) Never
- C) Only at purchase
- D) Only after a breach

**Answer:** A — Re-review vendors regularly as their terms and tools change.

---
### Module 5 · Your Practice's AI Use Policy

A practice AI policy sets the rules: which tools are approved, what data may be used, who reviews output, and who is accountable.

A clear policy turns good intentions into consistent, safe practice.

## Learning Objectives

- Write a practice AI use policy
- Define approved tools and data rules
- Set review and accountability
- Make safe use consistent

## What the Policy Covers

- Approved tools and their uses
- What data may and may not be entered
- Review and sign-off requirements
- Accountability and reporting
### Why
- A policy makes rules clear
- It protects staff and patients
- Consistency reduces risk

## Writing the Policy

- Keep it short and practical
- Train everyone on it
- Review it as tools and rules change
### The rule
- Approved tools only
- Clear data rules
- Named accountability

## The Policy Prompt

```text
Draft a one-page AI use policy for a [setting] practice:
approved tools, data rules, review and sign-off, and
accountability. Keep it practical and clear.
```
- Approved tools
- Data rules
- Review and accountability

## Key Takeaways

- A practice AI policy sets clear rules for safe use
- Define approved tools and what data may be entered
- Set review, sign-off, and accountability
- Train everyone on the policy
- Review the policy as tools and regulations change

## Practice Challenge

1. Draft a one-page AI use policy
2. Define your approved tools and data rules
3. Name who is accountable

**Example Quiz**

1. What does an AI policy set?
- A) Clear rules for safe use
- B) Prices
- C) Schedules
- D) Uniforms

**Answer:** A — A policy defines approved tools, data rules, and accountability.

2. What should the policy define?
- A) Approved tools and data rules
- B) Only tools
- C) Only data
- D) Nothing

**Answer:** A — Define approved tools, data rules, and review requirements.

3. What should happen with staff?
- A) Train them on the policy
- B) Keep it secret
- C) Share once
- D) Ignore it

**Answer:** A — Train everyone so the policy is followed consistently.

4. When should the policy be reviewed?
- A) As tools and rules change
- B) Never
- C) Once
- D) After an incident only

**Answer:** A — Review the policy as tools and regulations change.

---
### Module 6 · Accountability and Clinical Governance

AI does not change who is accountable: the clinician and the practice remain responsible for patient care and data.

Clinical governance means overseeing AI use, learning from incidents, and improving over time.

## Learning Objectives

- Keep accountability clear
- Set up clinical governance for AI
- Learn from incidents
- Improve continuously

## Who Is Accountable

- The clinician owns clinical decisions
- The practice owns data and tools
- Accountability does not shift to AI
### Why
- Patients need clear responsibility
- Governance catches problems early
- Learning prevents repeats

## Governing AI Use

- Monitor how AI is used
- Review incidents and near-misses
- Update policy and training
### The rule
- Accountability stays human
- Learn from incidents
- Improve continuously

## The Governance Prompt

```text
Help me set up clinical governance for AI use in [setting]:
who is accountable, how to monitor use, how to review
incidents, and how to feed learning back into policy.
```
- Accountability defined
- Monitoring approach
- Incident review and learning

## Key Takeaways

- AI does not shift accountability from clinician and practice
- The clinician owns clinical decisions; the practice owns data and tools
- Set up governance to monitor AI use
- Review incidents and near-misses to learn
- Feed learning back into policy and training

## Practice Challenge

1. Define who is accountable for AI use
2. Set a review process for incidents
3. Plan how learning updates policy

**Example Quiz**

1. Who owns clinical decisions?
- A) The clinician
- B) The AI
- C) The vendor
- D) The administrator

**Answer:** A — Clinicians remain accountable for clinical decisions made with AI.

2. Who owns data and tools?
- A) The practice
- B) The AI
- C) The patient
- D) The vendor

**Answer:** A — The practice is accountable for its data and approved tools.

3. What should you review?
- A) Incidents and near-misses
- B) Only successes
- C) Nothing
- D) Only complaints

**Answer:** A — Review incidents and near-misses to learn and prevent repeats.

4. What happens to learning?
- A) It updates policy and training
- B) It is ignored
- C) It is filed
- D) It is private

**Answer:** A — Feed learning back into policy and training to improve.

---
