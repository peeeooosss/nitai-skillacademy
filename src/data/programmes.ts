import type { Programme } from "@/types";
import { Award, BadgeCheck, GraduationCap, Landmark, Building2 } from "lucide-react";

export const PROGRAMMES: Programme[] = [
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