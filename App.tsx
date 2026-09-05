import React, { useState, useMemo, useEffect } from "react";
import {
  Sparkles,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  LogIn,
  Zap,
  ShieldCheck,
  Layers,
  Cpu,
  Award,
  HelpCircle,
  School,
  GraduationCap,
  Briefcase,
  Users,
  Laptop,
  Rocket,
  Crown,
  Camera,
  BookOpen,
  Stethoscope,
  Scale,
  Sprout,
  Settings,
  Target,
  Gem,
  Compass,
  TrendingUp,
  Newspaper,
  HeartHandshake,
  Timer,
  Check,
  CheckCircle2,
  BadgeCheck,
  Landmark,
  Building2,
  Bot,
  FolderKanban,
  Network,
  LineChart,
  Handshake,
  Coins,
  Mail,
  KeyRound,
  MapPin,
  Phone,
  Globe2,
} from "lucide-react";

/* ------------------------------------------------------------------------------------------------
   FONTS — injected at runtime so this file has zero external CSS dependencies.
   Display: "Sora" (headlines, nav, buttons) · Body: "Inter" (paragraphs, labels)
------------------------------------------------------------------------------------------------ */
const DISPLAY_FONT: React.CSSProperties = { fontFamily: "'Sora', system-ui, sans-serif" };
const BODY_FONT: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };

/* ------------------------------------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------------------------------ */
type PersonaId =
  | "school"
  | "college"
  | "jobseeker"
  | "professional"
  | "freelancer"
  | "entrepreneur"
  | "leader"
  | "creator"
  | "educator"
  | "doctor"
  | "lawyer"
  | "farmer";

type GoalId = "learn" | "job" | "freelance" | "business" | "automate" | "leadership";

type CourseCategory = "Students & Youth" | "Professionals & Leaders" | "Specialized Sectors";

type CourseId =
  | "school"
  | "college"
  | "jobseeker"
  | "entrepreneur"
  | "professional"
  | "leader"
  | "journalist"
  | "lawyer"
  | "doctor"
  | "creator"
  | "homemaker"
  | "farmer";

type PortalId = "student" | "partner" | "hq";

interface Course {
  id: CourseId;
  index: string;
  title: string;
  category: CourseCategory;
  persona: string;
  outcomes: string[];
  duration: string;
  badges: string[];
  icon: React.ElementType;
}

interface Programme {
  id: string;
  title: string;
  duration: string;
  description: string;
  features: string[];
  icon: React.ElementType;
}

interface ValueLayer {
  index: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  examples: string[];
  icon: React.ElementType;
}

interface Portal {
  id: PortalId;
  title: string;
  tagline: string;
  features: string[];
  icon: React.ElementType;
  accent: "violet" | "cyan" | "amber";
}

interface Faq {
  question: string;
  answer: string;
}

interface Stage {
  title: string;
  description: string;
  icon: React.ElementType;
}

/* ------------------------------------------------------------------------------------------------
   DATA
------------------------------------------------------------------------------------------------ */
const NAV_LINKS: { label: string; id: string }[] = [
  { label: "AI Advisor", id: "ai-advisor" },
  { label: "Courses", id: "courses" },
  { label: "12X Value", id: "value-system" },
  { label: "Opportunity Hub", id: "opportunity-hub" },
  { label: "Programmes", id: "programmes" },
  { label: "Ecosystem", id: "ecosystem" },
];

const PERSONAS: { id: PersonaId; label: string; icon: React.ElementType }[] = [
  { id: "school", label: "School Student", icon: School },
  { id: "college", label: "College Student", icon: GraduationCap },
  { id: "jobseeker", label: "Job Seeker", icon: Briefcase },
  { id: "professional", label: "Professional", icon: Users },
  { id: "freelancer", label: "Freelancer", icon: Laptop },
  { id: "entrepreneur", label: "Aspiring Entrepreneur", icon: Rocket },
  { id: "leader", label: "Business Leader", icon: Crown },
  { id: "creator", label: "Creator", icon: Camera },
  { id: "educator", label: "Teacher / Educator", icon: BookOpen },
  { id: "doctor", label: "Doctor", icon: Stethoscope },
  { id: "lawyer", label: "Lawyer", icon: Scale },
  { id: "farmer", label: "Farmer", icon: Sprout },
];

const GOALS: { id: GoalId; label: string; icon: React.ElementType }[] = [
  { id: "learn", label: "Learn AI", icon: BookOpen },
  { id: "job", label: "Get a Job", icon: Briefcase },
  { id: "freelance", label: "Start Freelancing", icon: Laptop },
  { id: "business", label: "Launch AI Business", icon: Rocket },
  { id: "automate", label: "Automate Work", icon: Settings },
  { id: "leadership", label: "Lead AI Transformation", icon: Crown },
];

const PERSONA_PROFILES: Record<
  PersonaId,
  { track: string; courseId: CourseId; baseWeeks: number }
> = {
  school: { track: "Young AI Explorer Track", courseId: "school", baseWeeks: 8 },
  college: { track: "Campus-to-Career AI Track", courseId: "college", baseWeeks: 10 },
  jobseeker: { track: "Career Reboot AI Track", courseId: "jobseeker", baseWeeks: 6 },
  professional: { track: "Workplace AI Mastery Track", courseId: "professional", baseWeeks: 6 },
  freelancer: { track: "Independent AI Practitioner Track", courseId: "creator", baseWeeks: 6 },
  entrepreneur: { track: "Founder AI Track", courseId: "entrepreneur", baseWeeks: 8 },
  leader: { track: "Executive AI Transformation Track", courseId: "leader", baseWeeks: 4 },
  creator: { track: "Creator Economy AI Track", courseId: "creator", baseWeeks: 6 },
  educator: { track: "Educator AI Enablement Track", courseId: "professional", baseWeeks: 6 },
  doctor: { track: "Clinical AI Practice Track", courseId: "doctor", baseWeeks: 6 },
  lawyer: { track: "Legal AI Practice Track", courseId: "lawyer", baseWeeks: 6 },
  farmer: { track: "Agri AI Growth Track", courseId: "farmer", baseWeeks: 6 },
};

const GOAL_PROFILES: Record<GoalId, { phaseLabel: string; addWeeks: number; focus: string }> = {
  learn: {
    phaseLabel: "Foundation Phase",
    addWeeks: 0,
    focus: "building core AI literacy and confident daily-use skills",
  },
  job: {
    phaseLabel: "Career Launch Phase",
    addWeeks: 3,
    focus: "building a job-ready portfolio and interview-ready AI skills",
  },
  freelance: {
    phaseLabel: "Freelance Launch Phase",
    addWeeks: 4,
    focus: "building a gig-ready service stack and landing your first paid projects",
  },
  business: {
    phaseLabel: "Business Build Phase",
    addWeeks: 6,
    focus: "validating and building an AI-powered business or offer",
  },
  automate: {
    phaseLabel: "Automation Phase",
    addWeeks: 2,
    focus: "automating repetitive work using AI agents and workflows",
  },
  leadership: {
    phaseLabel: "Transformation Leadership Phase",
    addWeeks: 8,
    focus: "leading AI adoption and transformation across a team or organisation",
  },
};

const STAGES: Stage[] = [
  {
    title: "I Don't Know AI",
    description:
      "You've heard about AI everywhere but haven't started using it yet. Every single learner on this platform began exactly here.",
    icon: HelpCircle,
  },
  {
    title: "I Am Learning AI",
    description:
      "You're building core AI literacy — understanding tools, prompts, and the basic mental models of how AI actually works.",
    icon: BookOpen,
  },
  {
    title: "I Am Practising AI",
    description:
      "You're using AI daily on real, low-stakes tasks — building muscle memory, speed, and confidence.",
    icon: Cpu,
  },
  {
    title: "I Am Applying AI",
    description:
      "You're applying AI directly to your studies, job, or business, and starting to see measurable results.",
    icon: Target,
  },
  {
    title: "I Am Creating Value",
    description:
      "You're producing AI-powered work — content, automations, or products — that other people rely on or pay for.",
    icon: Gem,
  },
  {
    title: "I Am Exploring Opportunities",
    description:
      "You're actively exploring freelancing, jobs, and ventures through the AI Opportunity Hub.",
    icon: Compass,
  },
  {
    title: "I Am Growing with AI",
    description:
      "You're scaling your income, career, or business with AI as a core, dependable capability.",
    icon: TrendingUp,
  },
  {
    title: "I Am Leading with AI",
    description:
      "You're leading AI adoption for your team, institution, or community — mentoring the next stage of learners behind you.",
    icon: Crown,
  },
];

const COURSES: Course[] = [
  {
    id: "school",
    index: "01",
    title: "AI for School Students (Class 6–12)",
    category: "Students & Youth",
    persona: "Class 6–12 school students exploring AI for the first time",
    outcomes: [
      "Use AI tools safely and confidently for schoolwork and projects",
      "Build simple AI-assisted presentations, stories, and science projects",
      "Understand AI ethics and responsible use from an early age",
    ],
    duration: "8 Weeks · Weekend Batches",
    badges: ["AI Literacy", "Safe AI Use", "Creative Projects"],
    icon: School,
  },
  {
    id: "college",
    index: "02",
    title: "AI for College Students (UG & PG)",
    category: "Students & Youth",
    persona: "Undergraduate and postgraduate students across streams",
    outcomes: [
      "Apply AI tools across assignments, research, and campus projects",
      "Build a personal AI project portfolio for internships and placements",
      "Get introduced to prompt engineering, automation, and AI agents",
    ],
    duration: "10 Weeks · Live + Self-Paced",
    badges: ["Portfolio Building", "Prompt Engineering", "Placement Ready"],
    icon: GraduationCap,
  },
  {
    id: "jobseeker",
    index: "03",
    title: "AI for Job Seekers & Career Transitioners",
    category: "Students & Youth",
    persona: "Job seekers and professionals switching into AI-enabled roles",
    outcomes: [
      "Rebuild your resume and LinkedIn profile using AI tools",
      "Practice AI-powered mock interviews and live case studies",
      "Identify AI-augmented roles that match your existing experience",
    ],
    duration: "6 Weeks · Career Sprint",
    badges: ["Resume AI", "Interview Prep", "Role Mapping"],
    icon: Briefcase,
  },
  {
    id: "entrepreneur",
    index: "04",
    title: "AI for Aspiring Entrepreneurs",
    category: "Students & Youth",
    persona: "First-time founders validating an idea before building a company",
    outcomes: [
      "Validate a business idea using AI-powered market research",
      "Build MVPs, landing pages, and pitch decks using AI tools",
      "Design a lean, AI-first operating model for a new venture",
    ],
    duration: "8 Weeks · Founder Track",
    badges: ["MVP Building", "Market Research", "Pitch Ready"],
    icon: Rocket,
  },
  {
    id: "professional",
    index: "05",
    title: "AI for Working Professionals",
    category: "Professionals & Leaders",
    persona: "Employees across functions who want to stay relevant with AI",
    outcomes: [
      "Automate repetitive tasks inside your current role using AI",
      "Build department-specific AI workflows for reporting and communication",
      "Present measurable AI-led productivity gains to your manager",
    ],
    duration: "6 Weeks · Evenings & Weekends",
    badges: ["Workflow Automation", "Productivity", "Career Growth"],
    icon: Users,
  },
  {
    id: "leader",
    index: "06",
    title: "AI for Business Leaders & Executives",
    category: "Professionals & Leaders",
    persona: "Founders, CXOs, and senior leaders driving AI transformation",
    outcomes: [
      "Design an AI adoption roadmap for your organisation",
      "Evaluate AI vendors, tools, and build-vs-buy decisions",
      "Lead change management for AI-enabled teams",
    ],
    duration: "4 Weeks · Executive Format",
    badges: ["AI Strategy", "Change Leadership", "ROI Planning"],
    icon: Crown,
  },
  {
    id: "journalist",
    index: "07",
    title: "AI for Journalists & Media Creators",
    category: "Professionals & Leaders",
    persona: "Journalists, editors, and media professionals producing content faster",
    outcomes: [
      "Use AI for research, fact-checking, and story structuring",
      "Produce AI-assisted video, audio, and visual content",
      "Build an ethical framework for AI use in journalism",
    ],
    duration: "5 Weeks · Newsroom Track",
    badges: ["Content AI", "Fact-Checking", "Media Production"],
    icon: Newspaper,
  },
  {
    id: "lawyer",
    index: "08",
    title: "AI for Lawyers & Legal Professionals",
    category: "Specialized Sectors",
    persona: "Advocates, in-house counsel, and legal researchers",
    outcomes: [
      "Use AI for legal research, drafting, and case summarisation",
      "Review contracts faster with AI-assisted analysis",
      "Understand AI governance and confidentiality in legal practice",
    ],
    duration: "6 Weeks · Legal Practice Track",
    badges: ["Legal Research", "Contract AI", "Confidentiality"],
    icon: Scale,
  },
  {
    id: "doctor",
    index: "09",
    title: "AI for Doctors & Healthcare Practitioners",
    category: "Specialized Sectors",
    persona: "Doctors, clinicians, and healthcare administrators",
    outcomes: [
      "Use AI for clinical documentation and patient communication",
      "Explore AI-assisted diagnostics support and literature review",
      "Apply AI safely within healthcare data and privacy norms",
    ],
    duration: "6 Weeks · Clinical Practice Track",
    badges: ["Clinical AI", "Documentation", "Health Data Ethics"],
    icon: Stethoscope,
  },
  {
    id: "creator",
    index: "10",
    title: "AI for Creators & Digital Influencers",
    category: "Professionals & Leaders",
    persona: "Content creators, YouTubers, and digital influencers",
    outcomes: [
      "Script, shoot, and edit content faster with AI tools",
      "Build an AI-powered content calendar and repurposing system",
      "Grow and monetise an audience using AI-driven insights",
    ],
    duration: "6 Weeks · Creator Track",
    badges: ["Content AI", "Growth", "Monetisation"],
    icon: Camera,
  },
  {
    id: "homemaker",
    index: "11",
    title: "AI for Women & Homemakers (AI Didi)",
    category: "Specialized Sectors",
    persona: "Homemakers and women exploring flexible, AI-powered income",
    outcomes: [
      "Learn AI basics in simple, everyday language",
      "Start a flexible micro-business or freelance service using AI",
      "Build the confidence to teach AI to family and community",
    ],
    duration: "6 Weeks · Flexible Timing",
    badges: ["Micro-Business", "Flexible Income", "Community Leadership"],
    icon: HeartHandshake,
  },
  {
    id: "farmer",
    index: "12",
    title: "AI for Farmers & Agri-Entrepreneurs",
    category: "Specialized Sectors",
    persona: "Farmers and agri-entrepreneurs improving yield and income",
    outcomes: [
      "Use AI apps for weather, soil, and crop advisory",
      "Access government schemes and mandi prices using AI assistants",
      "Explore AI-powered agri-business and value-addition opportunities",
    ],
    duration: "6 Weeks · Farm-Season Aligned",
    badges: ["Crop Advisory", "Agri-Business", "Local Language Support"],
    icon: Sprout,
  },
];

const COURSE_TABS: ("All" | CourseCategory)[] = [
  "All",
  "Students & Youth",
  "Professionals & Leaders",
  "Specialized Sectors",
];

const PROGRAMMES: Programme[] = [
  {
    id: "cert",
    title: "Certification in AI",
    duration: "30–90 Days",
    description: "A fast, focused credential for anyone who wants a recognised starting point in AI.",
    features: [
      "WAIO-recognised certificate",
      "Beginner-friendly, no prerequisites",
      "Stackable into the Diploma pathway",
    ],
    icon: Award,
  },
  {
    id: "diploma",
    title: "Diploma in AI",
    duration: "6 Months",
    description: "A deeper, project-based diploma for learners ready to specialise.",
    features: [
      "Specialisation tracks by persona",
      "Capstone project & portfolio",
      "Credit-eligible toward the UG pathway",
    ],
    icon: BadgeCheck,
  },
  {
    id: "ug",
    title: "UG in AI",
    duration: "3–4 Years Pathway",
    description: "A full undergraduate pathway in Artificial Intelligence, aligned to global credit-transfer standards.",
    features: [
      "UK Pathway & credit transfer alignment",
      "Industry-integrated curriculum",
      "Global exchange & fellowship access",
    ],
    icon: GraduationCap,
  },
  {
    id: "pg",
    title: "PG in AI",
    duration: "2 Years",
    description: "An advanced postgraduate programme for specialists and future AI leaders.",
    features: [
      "Research & applied specialisation tracks",
      "Industry capstone & thesis options",
      "WAIO institutional credentialing",
    ],
    icon: Landmark,
  },
  {
    id: "phd",
    title: "PhD in AI",
    duration: "Research & Global Fellowships",
    description:
      "A research pathway for scholars pursuing original contributions to AI, in partnership with global fellowship programmes.",
    features: [
      "Global research fellowship access",
      "Faculty & institutional mentorship",
      "WAIO research credentialing",
    ],
    icon: Building2,
  },
];

const VALUE_LAYERS: ValueLayer[] = [
  { index: "01", title: "AI Knowledge", description: "Core concepts, terminology, and mental models for how AI actually works.", icon: BookOpen },
  { index: "02", title: "AI Skills", description: "Hands-on, practical skills you can use the same day you learn them.", icon: Cpu },
  { index: "03", title: "AI Tools (120+ Sandbox)", description: "A live sandbox of 120+ AI tools to practise on, with zero setup.", icon: Layers },
  { index: "04", title: "AI Agents", description: "Building and directing AI agents that complete multi-step tasks for you.", icon: Bot },
  { index: "05", title: "AI Automation", description: "Connecting tools and agents into workflows that save hours every week.", icon: Settings },
  { index: "06", title: "AI Projects & Portfolio", description: "Real projects that become a portfolio you can show employers or clients.", icon: FolderKanban },
  { index: "07", title: "AI Career Readiness", description: "Resume, interview, and role-mapping support to land AI-enabled roles.", icon: Briefcase },
  { index: "08", title: "AI Freelancing", description: "A path to your first paid AI gigs, from proposal to delivery.", icon: Laptop },
  { index: "09", title: "AI Entrepreneurship", description: "Turning an AI skill or tool into a micro-business or venture.", icon: Rocket },
  { index: "10", title: "AI Network & Community", description: "A community of learners, mentors, and partners to grow alongside.", icon: Network },
  { index: "11", title: "AI Business Growth", description: "Using AI to grow revenue, reach, and efficiency in an existing business.", icon: LineChart },
  { index: "12", title: "AI Leadership", description: "Leading AI adoption and change for a team, institution, or community.", icon: Crown },
];

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "freelancer",
    title: "AI Freelancer",
    description: "Earn through prompting, AI video/ad production, and custom automation gigs.",
    examples: ["AI prompt writing for brands", "Short-form AI video ads", "Custom automation for small businesses"],
    icon: Laptop,
  },
  {
    id: "careers",
    title: "AI Career & Jobs",
    description: "Step into AI-enabled roles like AI Operations, Prompt Engineer, or AI Business Analyst.",
    examples: ["AI Operations Associate", "Prompt Engineer", "AI Business Analyst"],
    icon: Briefcase,
  },
  {
    id: "partner",
    title: "AI Ecosystem Partner",
    description: "Partner with Nitai as a trainer, implementation partner, institutional collaborator, or franchise owner.",
    examples: ["Certified AI Trainer", "Implementation Partner", "Institutional & Franchise Partner"],
    icon: Handshake,
  },
  {
    id: "entrepreneur",
    title: "AI Entrepreneur",
    description: "Build an AI automation agency or a micro-SaaS wrapper on top of existing AI models.",
    examples: ["AI Automation Agency", "Micro-SaaS Product", "AI-Powered Service Business"],
    icon: Rocket,
  },
  {
    id: "bizleader",
    title: "AI Business Leader",
    description: "Lead enterprise AI transformation and scale productivity across your organisation.",
    examples: ["Enterprise AI Transformation", "Productivity Scaling", "AI Governance Leadership"],
    icon: Crown,
  },
];

const CREDIT_TASKS: { id: string; task: string; credits: number }[] = [
  { id: "t1", task: "Complete your first AI sandbox project", credits: 50 },
  { id: "t2", task: "Write and publish 5 tested AI prompts", credits: 30 },
  { id: "t3", task: "Refer a friend who enrols in any course", credits: 100 },
  { id: "t4", task: "Mentor a junior learner for one week", credits: 75 },
  { id: "t5", task: "Build a working AI automation workflow", credits: 120 },
];

const PORTALS: Portal[] = [
  {
    id: "student",
    title: "NITAI AI Student Portal",
    tagline: "Your personal AI learning dashboard",
    features: ["Dashboard & My Courses", "90-Day Progress Grid", "AI Didi Tutor (24x7 AI mentor)", "Nitai Credits Wallet", "Verified Certificates"],
    icon: GraduationCap,
    accent: "violet",
  },
  {
    id: "partner",
    title: "NITAI AI Partner Portal",
    tagline: "Grow your own AI training business",
    features: ["Lead & Enrollment CRM", "Student Enrollments Tracker", "Commission Tracking", "Marketing Kits & Assets", "Sub-Franchise Management"],
    icon: Handshake,
    accent: "cyan",
  },
  {
    id: "hq",
    title: "NITAI AI HQ Command Center",
    tagline: "Institutional command & control",
    features: ["Super Admin Console", "Global Analytics", "Course CMS", "RBAC Engine", "Zero-Trust Access Controls"],
    icon: Building2,
    accent: "amber",
  },
];

const FAQS: Faq[] = [
  {
    question: "Do I need any technical or coding knowledge?",
    answer:
      "No. Every course is designed for zero technical background. You'll learn to use AI tools through plain-language prompts and guided practice — coding is never a prerequisite anywhere in the academy.",
  },
  {
    question: "How does the 'Earn While You Learn' model actually work?",
    answer:
      "As you complete modules and real tasks, you earn Nitai Credits inside the Student Portal. Those credits unlock the AI Opportunity Hub, where you can convert skills into freelance gigs, jobs, entrepreneurship, or partner income — often before you finish the full course.",
  },
  {
    question: "What is WAIO certification and where is it recognized?",
    answer:
      "WAIO (World AI Organization) certification is the institutional credential issued across every Nitai course and programme. It is recognised across the Nitai AI & Digital Empire Ecosystem's partner network, and academic programmes additionally carry UK Pathway and credit-transfer alignment.",
  },
  {
    question: "Can working professionals and educators balance this with their jobs?",
    answer:
      "Yes. Courses for professionals, leaders, and educators run in evening, weekend, or fully self-paced formats, and are scoped in short, focused sprints of 4–6 weeks so you can apply what you learn without pausing your job.",
  },
  {
    question: "How do partners and franchise owners collaborate with Nitai Academy?",
    answer:
      "Partners join through the NITAI AI Partner Portal, where they access a lead CRM, enrollment tracking, commission payouts, ready-made marketing kits, and — for larger collaborators — a sub-franchise structure to run their own regional training hub.",
  },
];

/* ------------------------------------------------------------------------------------------------
   SMALL SHARED UI PIECES
------------------------------------------------------------------------------------------------ */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-6 py-20 md:py-28 ${className}`}>
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-violet-200/90 backdrop-blur-md">
      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
      {children}
    </div>
  );
}

function GlowOrb({ className }: { className: string }) {
  return <div className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} aria-hidden="true" />;
}

const ACCENT_MAP: Record<
  "violet" | "cyan" | "amber",
  { ring: string; text: string; bg: string; border: string; glow: string }
> = {
  violet: {
    ring: "ring-violet-500/50",
    text: "text-violet-300",
    bg: "bg-violet-600",
    border: "border-violet-500/40",
    glow: "shadow-[0_0_40px_-10px_rgba(124,58,237,0.55)]",
  },
  cyan: {
    ring: "ring-cyan-500/50",
    text: "text-cyan-300",
    bg: "bg-cyan-500",
    border: "border-cyan-500/40",
    glow: "shadow-[0_0_40px_-10px_rgba(6,182,212,0.55)]",
  },
  amber: {
    ring: "ring-amber-500/50",
    text: "text-amber-300",
    bg: "bg-amber-500",
    border: "border-amber-500/40",
    glow: "shadow-[0_0_40px_-10px_rgba(245,158,11,0.55)]",
  },
};

/* ------------------------------------------------------------------------------------------------
   NAVIGATION
------------------------------------------------------------------------------------------------ */
function Navbar({ onOpenLogin, onStartJourney }: { onOpenLogin: () => void; onStartJourney: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    scrollToId(id);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <button
          onClick={() => scrollToId("hero")}
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-md"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500 shadow-[0_0_20px_-4px_rgba(124,58,237,0.8)]">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </span>
          <span className="flex flex-col leading-none text-left">
            <span style={DISPLAY_FONT} className="text-sm font-bold tracking-tight text-white">
              NITAI AI Academy
            </span>
            <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-300">
              Powered by WAIO
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className="text-sm text-slate-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-sm"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-white/30 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <LogIn className="h-3.5 w-3.5" />
            Portal Login
          </button>
          <button
            onClick={onStartJourney}
            className="group relative flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_25px_-6px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <span className="absolute inset-0 animate-pulse bg-white/10" />
            <Zap className="h-3.5 w-3.5 relative" />
            <span className="relative">Start AI Journey</span>
          </button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-white/10 pt-4">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenLogin();
              }}
              className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-sm text-slate-200"
            >
              <LogIn className="h-3.5 w-3.5" />
              Portal Login
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                onStartJourney();
              }}
              className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Zap className="h-3.5 w-3.5" />
              Start AI Journey
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------------------------------------
   HERO
------------------------------------------------------------------------------------------------ */
function Hero({ onOpenLogin }: { onOpenLogin: () => void }) {
  const pillars = ["LEARN AI", "EARN WHILE YOU LEARN", "GROW WITH AI", "BUILD WITH AI", "LEAD WITH AI"];
  const trust = [
    { label: "WAIO Dual Certification", icon: Award },
    { label: "120+ AI Tools & Agents", icon: Layers },
    { label: "Zero Technical Knowledge Required", icon: ShieldCheck },
    { label: "12X Value System", icon: Sparkles },
  ];

  return (
    <div id="hero" className="relative overflow-hidden">
      <GlowOrb className="left-1/2 top-[-12rem] h-[36rem] w-[36rem] -translate-x-1/2 bg-violet-700/25" />
      <GlowOrb className="right-[-8rem] top-40 h-80 w-80 bg-cyan-500/20" />
      <GlowOrb className="left-[-6rem] bottom-0 h-72 w-72 bg-amber-500/10" />

      <Section className="flex flex-col items-center pb-16 pt-16 text-center md:pt-24 animate-hero-in">
        <Eyebrow>Teachers&rsquo; Day Special Reveal · India&rsquo;s Leading AI Learning &amp; Earning Platform</Eyebrow>

        <h1
          style={DISPLAY_FONT}
          className="max-w-4xl text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl md:text-6xl"
        >
          THE AI ERA IS HERE.
          <br />
          ARE YOU READY?
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
          NITAI AI Skill Academy helps you build practical AI capabilities and discover pathways to apply
          those skills in your career, freelancing, business, and entrepreneurship journey.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {pillars.map((p, i) => (
            <span key={p} className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-200 md:text-sm">
                {p}
              </span>
              {i < pillars.length - 1 && <span className="text-violet-500/60">•</span>}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={() => scrollToId("ai-advisor")}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_-8px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            Start My AI Journey
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollToId("courses")}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Discover My AI Course
          </button>
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
          >
            Access Portals
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {trust.map((t) => (
            <div
              key={t.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center backdrop-blur-md"
            >
              <t.icon className="h-5 w-5 text-cyan-300" />
              <span className="text-[11px] leading-snug text-slate-300 md:text-xs">{t.label}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
   AI LEARNING ADVISOR
------------------------------------------------------------------------------------------------ */
function AIAdvisor({
  onLaunchPathway,
}: {
  onLaunchPathway: (courseId: CourseId, category: CourseCategory) => void;
}) {
  const [persona, setPersona] = useState<PersonaId | null>(null);
  const [goal, setGoal] = useState<GoalId | null>(null);

  const result = useMemo(() => {
    if (!persona || !goal) return null;
    const p = PERSONA_PROFILES[persona];
    const g = GOAL_PROFILES[goal];
    const course = COURSES.find((c) => c.id === p.courseId)!;
    const weeks = p.baseWeeks + g.addWeeks;
    return { course, phaseLabel: g.phaseLabel, focus: g.focus, weeks, track: p.track };
  }, [persona, goal]);

  return (
    <Section id="ai-advisor">
      <div className="mx-auto max-w-3xl text-center">
        <h2 style={DISPLAY_FONT} className="text-3xl font-bold text-white md:text-4xl">
          Don&rsquo;t Know Where to Start? Let Your AI Learning Advisor Guide You.
        </h2>
        <p className="mt-5 flex items-start justify-center gap-2 text-base italic text-slate-400">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
          &ldquo;You don&rsquo;t need to know everything about AI today. You only need to know where to begin.&rdquo;
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-5xl">
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-400">
          Step 1 · Who are you?
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {PERSONAS.map((p) => {
            const active = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center backdrop-blur-md transition-all ${
                  active
                    ? "border-violet-400/70 bg-violet-500/15 shadow-[0_0_25px_-8px_rgba(124,58,237,0.8)]"
                    : "border-white/10 bg-white/5 hover:border-violet-400/40 hover:bg-white/[0.08]"
                }`}
              >
                <p.icon className={`h-5 w-5 ${active ? "text-violet-300" : "text-slate-300"}`} />
                <span className="text-xs font-medium text-slate-200">{p.label}</span>
              </button>
            );
          })}
        </div>

        {persona && (
          <div className="mt-10">
            <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-400">
              Step 2 · What is your AI goal?
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {GOALS.map((g) => {
                const active = goal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center backdrop-blur-md transition-all ${
                      active
                        ? "border-cyan-400/70 bg-cyan-500/15 shadow-[0_0_25px_-8px_rgba(6,182,212,0.8)]"
                        : "border-white/10 bg-white/5 hover:border-cyan-400/40 hover:bg-white/[0.08]"
                    }`}
                  >
                    <g.icon className={`h-5 w-5 ${active ? "text-cyan-300" : "text-slate-300"}`} />
                    <span className="text-xs font-medium text-slate-200">{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {result && (
          <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/15 via-white/5 to-cyan-500/10 p-8 backdrop-blur-xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                  Your Recommended Pathway
                </span>
                <h3 style={DISPLAY_FONT} className="mt-2 text-2xl font-bold text-white">
                  {result.track}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  Currently in the <span className="text-cyan-300">{result.phaseLabel}</span>, focused on{" "}
                  {result.focus}.
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Timer className="h-4 w-4 text-violet-300" />
                    Estimated Duration: <strong className="text-white">{result.weeks} Weeks</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-cyan-300" />
                    Suggested Course: <strong className="text-white">{result.course.title}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => onLaunchPathway(result.course.id, result.course.category)}
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_-8px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.03]"
              >
                Launch This Pathway
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                setPersona(null);
                setGoal(null);
              }}
              className="mt-6 text-xs text-slate-400 underline decoration-dotted underline-offset-4 hover:text-slate-200"
            >
              Start over with a different selection
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------------------------------
   LEARNER JOURNEY — 8 STAGE TIMELINE
------------------------------------------------------------------------------------------------ */
function LearnerJourney() {
  const [active, setActive] = useState(0);
  const ActiveIcon = STAGES[active].icon;

  return (
    <Section id="journey" className="border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 style={DISPLAY_FONT} className="text-3xl font-bold text-white md:text-4xl">
          From Consumer to AI Leader: The 8-Stage Progression
        </h2>
        <p className="mt-4 text-slate-400">
          Tap any stage to see what it feels like, and what comes next.
        </p>
      </div>

      <div className="mt-12 flex gap-3 overflow-x-auto pb-4 md:justify-between">
        {STAGES.map((stage, i) => {
          const isActive = i === active;
          return (
            <button
              key={stage.title}
              onClick={() => setActive(i)}
              className="group flex min-w-[7.5rem] flex-1 flex-col items-center gap-2"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                  isActive
                    ? "border-transparent bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-[0_0_25px_-6px_rgba(124,58,237,0.9)]"
                    : i < active
                    ? "border-violet-400/60 bg-violet-500/10 text-violet-300"
                    : "border-white/15 bg-white/5 text-slate-400 group-hover:border-white/30"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-center text-[11px] leading-tight ${
                  isActive ? "font-semibold text-white" : "text-slate-400"
                }`}
              >
                {stage.title}
              </span>
              {i < STAGES.length - 1 && (
                <span className="hidden h-px w-full bg-white/10 md:block" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl items-start gap-5 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-cyan-500/30">
          <ActiveIcon className="h-6 w-6 text-white" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Stage {active + 1} of {STAGES.length}
          </p>
          <h3 style={DISPLAY_FONT} className="mt-1 text-xl font-bold text-white">
            {STAGES[active].title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{STAGES[active].description}</p>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------------------------------
   COURSE MARKETPLACE
------------------------------------------------------------------------------------------------ */
function CourseMarketplace({
  highlightedId,
  activeTab,
  setActiveTab,
}: {
  highlightedId: CourseId | null;
  activeTab: "All" | CourseCategory;
  setActiveTab: (t: "All" | CourseCategory) => void;
}) {
  const [enrolled, setEnrolled] = useState<Set<CourseId>>(new Set());

  const filtered = activeTab === "All" ? COURSES : COURSES.filter((c) => c.category === activeTab);

  const toggleEnroll = (id: CourseId) => {
    setEnrolled((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <Section id="courses" className="border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 style={DISPLAY_FONT} className="text-3xl font-bold text-white md:text-4xl">
          12 Flagship AI Courses, Built for Who You Are
        </h2>
        <p className="mt-4 text-slate-400">Every course is persona-first: same AI, taught for your world.</p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {COURSE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-transparent bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                : "border-white/15 text-slate-300 hover:border-white/30 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => {
          const isEnrolled = enrolled.has(course.id);
          const isHighlighted = highlightedId === course.id;
          return (
            <div
              id={`course-${course.id}`}
              key={course.id}
              className={`flex flex-col rounded-3xl border bg-white/5 p-6 backdrop-blur-md transition-all hover:border-violet-500/50 ${
                isHighlighted
                  ? "border-amber-400/70 shadow-[0_0_35px_-8px_rgba(245,158,11,0.6)]"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/25 to-cyan-500/25">
                  <course.icon className="h-5 w-5 text-white" />
                </span>
                <span style={DISPLAY_FONT} className="text-xs font-bold text-slate-500">
                  {course.index}
                </span>
              </div>

              <h3 style={DISPLAY_FONT} className="mt-4 text-lg font-bold leading-snug text-white">
                {course.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{course.persona}</p>

              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    {o}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                <Timer className="h-3.5 w-3.5 text-violet-300" />
                {course.duration}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {course.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-slate-300"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <button
                onClick={() => toggleEnroll(course.id)}
                disabled={isEnrolled}
                className={`mt-5 flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                  isEnrolled
                    ? "cursor-default bg-emerald-500/15 text-emerald-300"
                    : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:scale-[1.02]"
                }`}
              >
                {isEnrolled ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Enrolled
                  </>
                ) : (
                  <>
                    Enroll Now
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------------------------------
   ACADEMIC PROGRAMMES
------------------------------------------------------------------------------------------------ */
function Programmes() {
  return (
    <Section id="programmes" className="border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 style={DISPLAY_FONT} className="text-3xl font-bold text-white md:text-4xl">
          Academic &amp; Advanced Education Programmes
        </h2>
        <p className="mt-4 text-slate-400">
          Institutional WAIO credentialing with UK Pathway &amp; credit-transfer alignment, from your first
          certificate to a research doctorate.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PROGRAMMES.map((p) => (
          <div
            key={p.id}
            className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-amber-400/50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/25 to-violet-600/25">
              <p.icon className="h-5 w-5 text-amber-300" />
            </span>
            <h3 style={DISPLAY_FONT} className="mt-4 text-base font-bold text-white">
              {p.title}
            </h3>
            <span className="mt-1 text-xs font-medium text-cyan-300">{p.duration}</span>
            <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-400">{p.description}</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------------------------------
   12X VALUE SYSTEM
------------------------------------------------------------------------------------------------ */
function ValueSystem() {
  return (
    <Section id="value-system" className="border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 style={DISPLAY_FONT} className="text-3xl font-bold text-white md:text-4xl">
          ONE ACADEMY. 12 LAYERS OF VALUE.
        </h2>
        <p className="mt-4 text-slate-400">
          Every course draws from the same 12-layer system — knowledge that compounds into income and impact.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {VALUE_LAYERS.map((v) => (
          <div
            key={v.index}
            className="group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all hover:border-cyan-400/50"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/25 to-cyan-500/25">
                <v.icon className="h-4.5 w-4.5 text-cyan-300" />
              </span>
              <span style={DISPLAY_FONT} className="text-xs font-bold text-slate-500">
                {v.index}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">{v.title}</h3>
            <p className="text-xs leading-relaxed text-slate-400">{v.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------------------------------
   OPPORTUNITY HUB
------------------------------------------------------------------------------------------------ */
function OpportunityHub() {
  const [done, setDone] = useState<Set<string>>(new Set());

  const totalCredits = useMemo(
    () => CREDIT_TASKS.filter((t) => done.has(t.id)).reduce((sum, t) => sum + t.credits, 0),
    [done]
  );

  const toggleTask = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Section id="opportunity-hub" className="border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 style={DISPLAY_FONT} className="text-3xl font-bold text-white md:text-4xl">
          AI Opportunity Hub &amp; &ldquo;Earn While You Learn&rdquo;
        </h2>
        <p className="mt-4 text-slate-400">
          Five monetisation engines, unlocked as you progress through your pathway.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {OPPORTUNITIES.map((o) => (
          <div
            key={o.id}
            className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-violet-500/50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/25 to-cyan-500/25">
              <o.icon className="h-5 w-5 text-white" />
            </span>
            <h3 style={DISPLAY_FONT} className="mt-4 text-base font-bold text-white">
              {o.title}
            </h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-400">{o.description}</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {o.examples.map((e) => (
                <li key={e} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-white/5 to-violet-600/10 p-8 backdrop-blur-xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20">
              <Coins className="h-6 w-6 text-amber-300" />
            </span>
            <div>
              <h3 style={DISPLAY_FONT} className="text-lg font-bold text-white">
                Nitai Credits
              </h3>
              <p className="text-xs text-slate-400">Earn credits by completing real, verifiable tasks.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-2.5 text-center">
            <p className="text-[10px] uppercase tracking-wide text-amber-300">Demo Wallet</p>
            <p style={DISPLAY_FONT} className="text-xl font-extrabold text-white">
              {totalCredits} Credits
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          {CREDIT_TASKS.map((t) => {
            const isDone = done.has(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                  isDone
                    ? "border-emerald-400/40 bg-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }`}
              >
                <span className="flex items-center gap-3">
                  <CheckCircle2
                    className={`h-4.5 w-4.5 shrink-0 ${isDone ? "text-emerald-400" : "text-slate-500"}`}
                  />
                  <span className={isDone ? "text-slate-300 line-through decoration-slate-500" : "text-slate-200"}>
                    {t.task}
                  </span>
                </span>
                <span className={`shrink-0 text-xs font-semibold ${isDone ? "text-emerald-300" : "text-amber-300"}`}>
                  +{t.credits}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------------------------------
   MULTI-LOGIN GATEWAY — SECTION + MODAL
------------------------------------------------------------------------------------------------ */
function EcosystemSection({ onEnterPortal }: { onEnterPortal: (id: PortalId) => void }) {
  return (
    <Section id="ecosystem" className="border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 style={DISPLAY_FONT} className="text-3xl font-bold text-white md:text-4xl">
          One Ecosystem. Three Command Centers.
        </h2>
        <p className="mt-4 text-slate-400">
          Every learner, partner, and administrator has a dedicated, secure portal.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PORTALS.map((portal) => {
          const accent = ACCENT_MAP[portal.accent];
          return (
            <div
              key={portal.id}
              className={`flex flex-col rounded-3xl border bg-white/5 p-7 backdrop-blur-md transition-all ${accent.border} hover:${accent.glow}`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10`}>
                <portal.icon className={`h-6 w-6 ${accent.text}`} />
              </span>
              <h3 style={DISPLAY_FONT} className="mt-5 text-lg font-bold text-white">
                {portal.title}
              </h3>
              <p className="mt-1 text-xs text-slate-400">{portal.tagline}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2">
                {portal.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accent.text}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onEnterPortal(portal.id)}
                className={`mt-6 flex items-center justify-center gap-1.5 rounded-full ${accent.bg} px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]`}
              >
                Enter Portal
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function LoginModal({
  open,
  selectedPortal,
  onSelectPortal,
  onClose,
}: {
  open: boolean;
  selectedPortal: PortalId | null;
  onSelectPortal: (id: PortalId) => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<"form" | "success">("form");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStage("form");
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [open, selectedPortal]);

  if (!open) return null;

  const portal = PORTALS.find((p) => p.id === selectedPortal) || null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password to continue.");
      return;
    }
    setError("");
    setStage("success");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-7 shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {!portal && (
          <div>
            <h3 style={DISPLAY_FONT} className="text-lg font-bold text-white">
              Choose Your Portal
            </h3>
            <p className="mt-1 text-xs text-slate-400">Select where you&rsquo;d like to sign in.</p>
            <div className="mt-6 flex flex-col gap-3">
              {PORTALS.map((p) => {
                const accent = ACCENT_MAP[p.accent];
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPortal(p.id)}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-white/25"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <p.icon className={`h-5 w-5 ${accent.text}`} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{p.title}</span>
                      <span className="block text-[11px] text-slate-400">{p.tagline}</span>
                    </span>
                    <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-500" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {portal && stage === "form" && (
          <div>
            <div className="flex items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/10`}>
                <portal.icon className={`h-5 w-5 ${ACCENT_MAP[portal.accent].text}`} />
              </span>
              <div>
                <h3 style={DISPLAY_FONT} className="text-base font-bold text-white">
                  {portal.title}
                </h3>
                <p className="text-[11px] text-slate-400">{portal.tagline}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <label className="flex flex-col gap-1.5 text-xs text-slate-300">
                Email
                <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </span>
              </label>
              <label className="flex flex-col gap-1.5 text-xs text-slate-300">
                Password
                <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                  <KeyRound className="h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </span>
              </label>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <button
                type="submit"
                className={`mt-2 flex items-center justify-center gap-1.5 rounded-full ${
                  ACCENT_MAP[portal.accent].bg
                } px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]`}
              >
                <LogIn className="h-4 w-4" />
                Sign In to {portal.title.replace("NITAI AI ", "")}
              </button>
              <button
                type="button"
                onClick={() => onSelectPortal(undefined as unknown as PortalId)}
                className="text-center text-xs text-slate-500 hover:text-slate-300"
              >
                Choose a different portal
              </button>
            </form>
          </div>
        )}

        {portal && stage === "success" && (
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
              <ShieldCheck className="h-7 w-7 text-emerald-400" />
            </span>
            <h3 style={DISPLAY_FONT} className="mt-4 text-lg font-bold text-white">
              Access Granted
            </h3>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${ACCENT_MAP[portal.accent].border} ${ACCENT_MAP[portal.accent].text}`}
            >
              <portal.icon className="h-3.5 w-3.5" />
              {portal.title}
            </span>
            <p className="mt-4 text-xs text-slate-400">This is a demo sign-in. Your dashboard includes:</p>
            <ul className="mt-3 flex flex-col gap-1.5 text-left">
              {portal.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full border border-white/15 py-3 text-sm font-semibold text-white hover:bg-white/5"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
   FAQ ACCORDION
------------------------------------------------------------------------------------------------ */
function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 style={DISPLAY_FONT} className="text-3xl font-bold text-white md:text-4xl">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={faq.question}
              className={`overflow-hidden rounded-2xl border backdrop-blur-md transition-colors ${
                isOpen ? "border-violet-400/40 bg-white/[0.07]" : "border-white/10 bg-white/5"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-white">
                  <HelpCircle className="h-4 w-4 shrink-0 text-cyan-300" />
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pl-13">
                  <p className="text-sm leading-relaxed text-slate-300">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------------------------------
   FOOTER
------------------------------------------------------------------------------------------------ */
function Footer({ onOpenLogin }: { onOpenLogin: (portal?: PortalId) => void }) {
  return (
    <footer id="footer" className="border-t border-white/10 bg-slate-950/80">
      <Section className="py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </span>
              <span style={DISPLAY_FONT} className="text-sm font-bold text-white">
                NITAI AI SKILL ACADEMY
              </span>
            </div>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-400">
              An Education &amp; Skill Development Unit of NITAI AI &amp; DIGITAL EMPIRE ECOSYSTEM.
              <br />
              Powered by WORLD AI ORGANIZATION.
            </p>
            <p style={DISPLAY_FONT} className="mt-5 text-xs font-semibold tracking-wide text-amber-300">
              AI FOR ALL • AI EVERYWHERE • AI FOR SOCIAL GOOD • ONE EARTH • ONE FAMILY • ONE FUTURE
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</h4>
            <ul className="mt-4 flex flex-col gap-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                NITAI AI Valley – 29, Umari, Damoh, MP, India
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                9340952324 · 9691204597
              </li>
              <li className="flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                www.nitaigroup.com · www.waio.in
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Links</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onOpenLogin("student")} className="hover:text-white">
                  Student Login
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLogin("partner")} className="hover:text-white">
                  Partner Login
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLogin("hq")} className="hover:text-white">
                  HQ Login
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} NITAI AI &amp; DIGITAL EMPIRE ECOSYSTEM. All rights reserved.</span>
          <span>Presented on Teachers&rsquo; Day · Powered by World AI Organization</span>
        </div>
      </Section>
    </footer>
  );
}

/* ------------------------------------------------------------------------------------------------
   ROOT APP
------------------------------------------------------------------------------------------------ */
export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<PortalId | null>(null);
  const [highlightedCourseId, setHighlightedCourseId] = useState<CourseId | null>(null);
  const [courseTab, setCourseTab] = useState<"All" | CourseCategory>("All");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const openLoginGateway = (portal?: PortalId) => {
    setSelectedPortal(portal ?? null);
    setLoginOpen(true);
  };

  const closeLoginGateway = () => {
    setLoginOpen(false);
    setSelectedPortal(null);
  };

  const handleLaunchPathway = (courseId: CourseId, category: CourseCategory) => {
    setCourseTab(category);
    setHighlightedCourseId(courseId);
    scrollToId("courses");
    window.setTimeout(() => {
      const el = document.getElementById(`course-${courseId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
    window.setTimeout(() => setHighlightedCourseId(null), 4000);
  };

  return (
    <div style={BODY_FONT} className="min-h-screen w-full bg-slate-950 text-slate-100 antialiased">
      <style>{`
        @keyframes heroIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .animate-hero-in { animation: heroIn 0.7s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .animate-hero-in { animation: none; }
          * { scroll-behavior: auto !important; }
        }
        ::selection { background: rgba(124,58,237,0.4); }
      `}</style>

      <Navbar onOpenLogin={() => openLoginGateway()} onStartJourney={() => scrollToId("ai-advisor")} />
      <Hero onOpenLogin={() => openLoginGateway()} />
      <AIAdvisor onLaunchPathway={handleLaunchPathway} />
      <LearnerJourney />
      <CourseMarketplace highlightedId={highlightedCourseId} activeTab={courseTab} setActiveTab={setCourseTab} />
      <Programmes />
      <ValueSystem />
      <OpportunityHub />
      <EcosystemSection onEnterPortal={(id) => openLoginGateway(id)} />
      <FaqSection />
      <Footer onOpenLogin={(portal) => openLoginGateway(portal)} />

      <LoginModal
        open={loginOpen}
        selectedPortal={selectedPortal}
        onSelectPortal={(id) => setSelectedPortal(id)}
        onClose={closeLoginGateway}
      />
    </div>
  );
}
