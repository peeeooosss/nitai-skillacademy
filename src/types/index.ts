export type PersonaId =
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

export type GoalId = "learn" | "job" | "freelance" | "business" | "automate" | "leadership";

export type CourseCategory = "Students & Youth" | "Professionals & Leaders" | "Specialized Sectors";

export type CourseId =
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

export type PortalId = "student" | "partner" | "hq";

export interface Course {
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

export interface Programme {
  id: string;
  title: string;
  duration: string;
  description: string;
  features: string[];
  icon: React.ElementType;
}

export interface ValueLayer {
  index: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  examples: string[];
  icon: React.ElementType;
}

export interface Portal {
  id: PortalId;
  title: string;
  tagline: string;
  features: string[];
  icon: React.ElementType;
  accent: "violet" | "cyan" | "amber";
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Stage {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface NavLink {
  label: string;
  id: string;
}

export interface Persona {
  id: PersonaId;
  label: string;
  icon: React.ElementType;
}

export interface Goal {
  id: GoalId;
  label: string;
  icon: React.ElementType;
}

export interface PersonaProfile {
  track: string;
  courseId: CourseId;
  baseWeeks: number;
}

export interface GoalProfile {
  phaseLabel: string;
  addWeeks: number;
  focus: string;
}

export interface CreditTask {
  id: string;
  task: string;
  credits: number;
}

export interface AccentMap {
  violet: AccentColors;
  cyan: AccentColors;
  amber: AccentColors;
}

export interface AccentColors {
  ring: string;
  text: string;
  bg: string;
  border: string;
  glow: string;
}

export interface AIAdvisorResult {
  course: Course;
  phaseLabel: string;
  focus: string;
  weeks: number;
  track: string;
}