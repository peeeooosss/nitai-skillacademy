import type { Opportunity, CreditTask } from "@/types";
import { Laptop, Briefcase, Handshake, Rocket, Crown } from "lucide-react";

export const OPPORTUNITIES: Opportunity[] = [
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

export const CREDIT_TASKS: CreditTask[] = [
  { id: "t1", task: "Complete your first AI sandbox project", credits: 50 },
  { id: "t2", task: "Write and publish 5 tested AI prompts", credits: 30 },
  { id: "t3", task: "Refer a friend who enrols in any course", credits: 100 },
  { id: "t4", task: "Mentor a junior learner for one week", credits: 75 },
  { id: "t5", task: "Build a working AI automation workflow", credits: 120 },
];