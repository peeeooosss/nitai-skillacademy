export interface CourseParam {
  slug: string;
  missions: number;
}

// Static course map used by generateStaticParams for the static-exported
// portal routes. Mission counts must match what the seed populated in the DB.
export const COURSES_INDEX: CourseParam[] = [
  { slug: "school-students", missions: 8 },
  { slug: "college-students", missions: 10 },
  { slug: "job-seekers", missions: 6 },
  { slug: "entrepreneurs", missions: 8 },
  { slug: "working-professionals", missions: 6 },
  { slug: "business-leaders", missions: 4 },
  { slug: "journalists", missions: 5 },
  { slug: "lawyers", missions: 6 },
  { slug: "doctors", missions: 6 },
  { slug: "creators", missions: 6 },
  { slug: "homemakers", missions: 6 },
  { slug: "farmers", missions: 6 },
];

// Maps homepage CourseIds (src/data/courses.ts) to portal slugs.
export const COURSE_SLUGS: Record<string, string> = {
  school: "school-students",
  college: "college-students",
  jobseeker: "job-seekers",
  entrepreneur: "entrepreneurs",
  professional: "working-professionals",
  leader: "business-leaders",
  journalist: "journalists",
  lawyer: "lawyers",
  doctor: "doctors",
  creator: "creators",
  homemaker: "homemakers",
  farmer: "farmers",
};

export function missionCountFor(slug: string): number {
  const found = COURSES_INDEX.find((c) => c.slug === slug);
  return found?.missions ?? 6;
}