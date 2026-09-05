import type { Stage } from "@/types";
import {
  HelpCircle,
  BookOpen,
  Cpu,
  Target,
  Gem,
  Compass,
  TrendingUp,
  Crown,
} from "lucide-react";

export const STAGES: Stage[] = [
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