import MissionPlayerPage from "@/components/portal/MissionPlayer";
import { COURSES_INDEX } from "@/data/portal";

export function generateStaticParams() {
  const params: { slug: string; id: string }[] = [];
  for (const course of COURSES_INDEX) {
    for (let m = 1; m <= course.missions; m++) {
      params.push({ slug: course.slug, id: String(m) });
    }
  }
  return params;
}

export default function Page({ params }: { params: { slug: string; id: string } }) {
  return <MissionPlayerPage params={params} />;
}