import type { Portal, AccentMap, AccentColors } from "@/types";
import { GraduationCap, Handshake, Building2 } from "lucide-react";

export const PORTALS: Portal[] = [
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

export const ACCENT_MAP: AccentMap = {
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