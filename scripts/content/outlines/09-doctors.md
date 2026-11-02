# Course Outline — AI for Doctors & Healthcare Practitioners

## Course Meta
- **Folder:** `09-doctors` (content dir: `scripts/content/courses/09-doctors/`)
- **Tier:** ₹3,000
- **Duration:** ~45 hours · 24 missions
- **Earning Math:** Save 1-2 hrs/day → 2-3 extra patients/day (₹20,000–₹40,000/month)
- **Top 5 Unique Assets:**
  - PHI stripping checklist before AI use
  - Vernacular medical explanation prompt pack (Hindi/Tamil/etc.)
  - SOAP note voice-to-text workflow guide
  - Differential diagnosis blind-spot checker (with disclaimers)
  - Clinic staff AI safety training mini-module
- **India Context Hooks:**
  - DPDP Act for health data
  - Explaining diagnoses in regional languages
  - High-volume OPD paperwork

## Phase / Mission Map (24 missions)

### Phase 1: Clinical Orientation
**Promise:** AI as assistant, not replacement.

**Mission:** The AI Co-Pilot: Assistant vs. Diagnosis
Submodules:
  - Why Boundary Matters
  - The Co-Pilot Role
  - Practice: Define 5 Boundaries
  - Red Flags
  - Building Team Awareness

**Mission:** Tool Selection: HIPAA/DPDP-Compliant Platforms
Submodules:
  - Why Compliance Matters
  - The Compliance Audit
  - Practice: Audit 2 Tools
  - Vendor Policies
  - Building a Safe Stack

**Mission:** The Prompting Clinic: Structuring Medical Queries
Submodules:
  - Why Structure Matters
  - The Medical Prompt
  - Practice: 5 Medical Prompts
  - Verifying Outputs
  - Building a Prompt Bank

**Mission:** Limitation Awareness: When AI Hallucinates
Submodules:
  - Why Limits Matter
  - The Hallucination Guide
  - Practice: Spot 5 Risks
  - Red Flags
  - Building Verification Habits

### Phase 2: Documentation Efficiency
**Promise:** Cut charting time by 50%.

**Mission:** Voice-to-Text Charting: SOAP Notes
Submodules:
  - Why Voice Matters
  - The SOAP Workflow
  - Practice: Dictate 3 Notes
  - Cleaning and Verifying
  - Building the Habit

**Mission:** Discharge Summary Generator
Submodules:
  - Why Discharge Summaries Matter
  - The Summary Prompt
  - Practice: Draft 2 Summaries
  - Patient-Friendly Language
  - Quality Checklist

**Mission:** Referral Letter Drafting
Submodules:
  - Why Referrals Matter
  - The Referral Prompt
  - Practice: Draft 2 Letters
  - Professional Tone
  - Tracking Referrals

**Mission:** Inbox Management: Patient Portal Triage
Submodules:
  - Why Triage Matters
  - The Triage Prompt
  - Practice: Triage 20 Messages
  - Template Responses
  - Escalation Rules

### Phase 3: Literature & CME
**Promise:** Rapidly stay updated.

**Mission:** Research Summarization: Dense Journals
Submodules:
  - Why Summaries Matter
  - The Summarize Prompt
  - Practice: Summarize 2 Papers
  - Extracting Key Findings
  - Building a Reading Habit

**Mission:** Differential Diagnosis Brainstorming
Submodules:
  - Why Brainstorming Helps
  - The Brainstorm Prompt
  - Practice: 3 Cases
  - Checking Blind Spots
  - Heavy Disclaimers

**Mission:** CME Accelerator: Personalized Learning Plans
Submodules:
  - Why CME Matters
  - The Plan Prompt
  - Practice: Build a 3-Month Plan
  - Curating Sources
  - Tracking Completion

**Mission:** Drug Interaction Checker: Supplementary Verify
Submodules:
  - Why Verification Matters
  - The Checker Workflow
  - Practice: Verify 5 Interactions
  - Cross-Referencing
  - Building Safety Habits

### Phase 4: Patient Communication
**Promise:** Explain complex diagnoses simply.

**Mission:** The Empathy Engine: Sensitive News with Compassion
Submodules:
  - Why Empathy Matters
  - The Empathy Prompt
  - Practice: Draft 3 Messages
  - Tone and Clarity
  - Reviewing with Peers

**Mission:** Vernacular Translation: Medical Terms in Hindi/Tamil
Submodules:
  - Why Vernacular Matters
  - The Translation Prompt
  - Practice: Translate 10 Terms
  - Preserving Accuracy
  - Building a Term Bank

**Mission:** Post-Visit Instructions: Customized Care Plans
Submodules:
  - Why Instructions Matter
  - The Care Plan Prompt
  - Practice: Draft 2 Plans
  - Patient-Friendly Language
  - Follow-Up Basics

**Mission:** FAQ Generator: Clinic Handouts for Common Conditions
Submodules:
  - Why Handouts Matter
  - The FAQ Prompt
  - Practice: Create 1 Handout
  - Reviewing for Accuracy
  - Distributing to Patients

### Phase 5: Diagnostics Support & Safety
**Promise:** AI as second-opinion checklist.

**Mission:** Imaging Context: Highlighting Areas of Interest
Submodules:
  - Why Context Matters
  - The Context Prompt
  - Practice: Review 3 Cases
  - Avoiding Over-Reliance
  - Building Verification Habits

**Mission:** The Safety Net: Mandatory Human Verification
Submodules:
  - Why Verification Matters
  - The Verification Protocol
  - Practice: Apply to 5 Cases
  - Red Flags
  - Team Adoption

**Mission:** Error Reporting: Documenting Near Misses
Submodules:
  - Why Reporting Matters
  - The Report Template
  - Practice: Document 1 Near Miss
  - Learning from Errors
  - Building a Culture

**Mission:** Malpractice Awareness: Liability with AI
Submodules:
  - Why Liability Matters
  - The Liability Guide
  - Practice: Review 2 Scenarios
  - Protecting Yourself
  - Insurance Basics

### Phase 6: Data Privacy & Governance
**Promise:** Ironclad compliance with patient data.

**Mission:** Data Anonymization: Stripping PHI Before Prompting
Submodules:
  - Why Anonymization Matters
  - The Stripping Checklist
  - Practice: Anonymize 3 Notes
  - Common Mistakes
  - Building the Habit

**Mission:** Clinic Security: Wi-Fi and Device Safety
Submodules:
  - Why Security Matters
  - The Security Checklist
  - Practice: Audit Your Clinic
  - Common Vulnerabilities
  - Building a Security Routine

**Mission:** Staff Training: Nurses and Receptionists
Submodules:
  - Why Staff Training Matters
  - The Training Module
  - Practice: Train 2 Staff
  - Measuring Compliance
  - Building a Culture

**Mission:** The Future Clinic: Patients First, Not Screens
Submodules:
  - Why the Future Matters
  - The Future Vision
  - Practice: Design 1 Workflow
  - Balancing Tech and Care
  - Measuring Impact

---

## Notes for Content Generation
- Each mission file = `module-NN.md` (NN = mission number, zero-padded).
- Each mission expands every sub-module in its outline (typically 5) using `### Sub-module K · Title`.
- Every submodule ends with a `**Example Quiz**` block (6 questions).
- Tone: simple English, Indian examples, warm Hinglish, ₹ earning angle.
- See `scripts/content/prompts/{slug}-prompt.md` for the full generation prompt.
