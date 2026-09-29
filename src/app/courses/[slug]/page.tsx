import type { Metadata } from "next";
import { COURSES_INDEX, COURSE_SLUGS } from "@/data/portal";
import { COURSES } from "@/data/courses";
import { CourseLanding } from "@/components/homepage/CourseLanding";

export const dynamicParams = false;

export function generateStaticParams() {
  return COURSES_INDEX.map((c) => ({ slug: c.slug }));
}

const SLUG_TO_COURSE = COURSES.reduce((acc, c) => {
  const slug = COURSE_SLUGS[c.id];
  if (slug) acc[slug] = c;
  return acc;
}, {} as Record<string, (typeof COURSES)[number]>);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = SLUG_TO_COURSE[params.slug];
  return {
    title: `${course?.title ?? "NITAI AI Skill Academy Course"} | NITAI Skill Academy`,
    description: course
      ? `${course.persona}. Complete ${COURSES_INDEX.find((c) => c.slug === params.slug)?.missions ?? "the"} self-paced missions, earn credits, and unlock a verifiable certificate.`
      : "Explore the NITAI AI Skill Academy flagship courses and request access.",
  };
}

export default function CourseLandingPage({ params }: { params: { slug: string } }) {
  return <CourseLanding slug={params.slug} />;
}