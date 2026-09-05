import type { Persona, PersonaProfile } from "@/types";
import {
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
} from "lucide-react";

export const PERSONAS: Persona[] = [
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

export const PERSONA_PROFILES: Record<string, PersonaProfile> = {
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