import type { Goal, GoalProfile } from "@/types";
import { BookOpen, Briefcase, Laptop, Rocket, Settings, Crown } from "lucide-react";

export const GOALS: Goal[] = [
  { id: "learn", label: "Learn AI", icon: BookOpen },
  { id: "job", label: "Get a Job", icon: Briefcase },
  { id: "freelance", label: "Start Freelancing", icon: Laptop },
  { id: "business", label: "Launch AI Business", icon: Rocket },
  { id: "automate", label: "Automate Work", icon: Settings },
  { id: "leadership", label: "Lead AI Transformation", icon: Crown },
];

export const GOAL_PROFILES: Record<string, GoalProfile> = {
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