import type { ValueLayer } from "@/types";
import { BookOpen, Cpu, Layers, Bot, Settings, FolderKanban, Briefcase, Laptop, Rocket, Network, LineChart, Crown } from "lucide-react";

export const VALUE_LAYERS: ValueLayer[] = [
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