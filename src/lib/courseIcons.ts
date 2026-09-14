"use client";

import {
  School,
  GraduationCap,
  Briefcase,
  Rocket,
  Users,
  Crown,
  Newspaper,
  Scale,
  Stethoscope,
  Camera,
  HeartHandshake,
  Sprout,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  School,
  GraduationCap,
  Briefcase,
  Rocket,
  Users,
  Crown,
  Newspaper,
  Scale,
  Stethoscope,
  Camera,
  HeartHandshake,
  Sprout,
};

export function courseIcon(name?: string | null): LucideIcon {
  return ICON_MAP[name || ""] || BookOpen;
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int = parseInt(full || "22d3ee", 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}