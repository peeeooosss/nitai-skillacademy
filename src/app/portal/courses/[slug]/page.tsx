import CourseHomePage from "@/components/portal/CourseHome";
import { COURSES_INDEX } from "@/data/portal";

export function generateStaticParams() {
  return COURSES_INDEX.map((c) => ({ slug: c.slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <CourseHomePage params={params} />;
}