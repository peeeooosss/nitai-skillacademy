"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2, Timer, Check, Sparkles, GraduationCap } from "lucide-react";
import { api, type EnrolledCourse } from "@/lib/api";
import { courseIcon, hexToRgba } from "@/lib/courseIcons";

export default function PortalCoursesPage() {
  const [courses, setCourses] = React.useState<EnrolledCourse[] | null>(null);
  const [error, setError] = React.useState("");

  const load = React.useCallback(() => {
    api
      .get<{ courses: EnrolledCourse[] }>("/courses")
      .then((d) => setCourses(d.courses))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load courses"));
  }, []);

  React.useEffect(load, [load]);

  const enrolledCourses = (courses ?? []).filter((c) => c.enrolled);

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <p className="text-sm text-rose-300">{error}</p>
        <button onClick={load} className="mt-4 text-xs text-slate-400 hover:text-white">
          Retry
        </button>
      </div>
    );
  }

  if (!courses) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
          <Sparkles className="h-3.5 w-3.5" />
          My Learning
        </div>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">Your Courses</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          {enrolledCourses.length > 0
            ? "Courses unlocked for you after approval. Pick one and start earning credits mission by mission."
            : "You don't have any unlocked courses yet."}
        </p>
      </motion.div>

      {courses && enrolledCourses.length === 0 && (
        <Link
          href="/#courses"
          className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center transition-colors hover:border-violet-400/30 hover:bg-white/[0.03]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
            <GraduationCap className="h-6 w-6 text-violet-300" />
          </span>
          <div>
            <p className="font-display text-base font-bold text-white">Explore the 12 flagship courses</p>
            <p className="mt-1 text-xs text-slate-400">
              Browse the homepage, choose your track, and request access — your courses unlock after approval.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2 text-xs font-semibold text-white">
            <ArrowRight className="h-3.5 w-3.5" />
            Browse Courses
          </span>
        </Link>
      )}

      {enrolledCourses.length > 0 && (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course, index) => {
          const Icon = courseIcon(course.icon);
          const accent = course.accentColor || "#a78bfa";
          const isEnrolled = course.enrolled;
          const percent = course.progress.percent;
          return (
            <motion.article
              key={course.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: hexToRgba(accent, 0.15) }}
                >
                  <Icon className="h-5 w-5" style={{ color: accent }} />
                </span>
                <span className="font-display text-xs font-bold text-slate-500">{course.index}</span>
              </div>

              <h3 className="mt-4 font-display text-base font-bold leading-snug text-white">{course.title}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">{course.description}</p>

              <ul className="mt-4 flex flex-1 flex-col gap-1.5">
                {course.outcomes.slice(0, 2).map((o) => (
                  <li key={o} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    {o}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                <Timer className="h-3.5 w-3.5 text-violet-300" />
                {course.duration} · {course.moduleCount} Missions
              </div>

              {isEnrolled && (
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      {course.progress.completedMissions}/{course.progress.totalMissions} missions
                    </span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, background: accent }} />
                  </div>
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <Link
                  href={`/portal/courses/${course.slug}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 py-2.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {percent > 0 ? "Continue Learning" : "Start Course"}
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
      )}
    </div>
  );
}