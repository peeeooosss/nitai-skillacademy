"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  Lock,
  PlayCircle,
  Check,
  ArrowRight,
  Timer,
  Quote,
  Sparkles,
} from "lucide-react";
import { api, type CourseDetail } from "@/lib/api";
import { courseIcon, hexToRgba } from "@/lib/courseIcons";
import { useAuth } from "@/context/AuthContext";

export default function CourseHomePage({ params }: { params: { slug: string } }) {
  const { refreshUser } = useAuth();
  const [data, setData] = React.useState<CourseDetail | null>(null);
  const [error, setError] = React.useState("");
  const [enrolling, setEnrolling] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    api
      .get<CourseDetail>(`/courses?slug=${params.slug}`)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load course"));
  }, [params.slug, refreshKey]);

  const handleEnroll = async () => {
    if (!data || data.enrolled) return;
    setEnrolling(true);
    try {
      await api.post("/enrollments", { courseId: data.course.id });
      await refreshUser();
      setRefreshKey((k) => k + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <p className="text-sm text-rose-300">{error}</p>
        <button onClick={() => setRefreshKey((k) => k + 1)} className="mt-4 text-xs text-slate-400 hover:text-white">
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  const course = data.course;
  const Icon = courseIcon(course.icon);
  const accentHead = course.accentColor || "#a78bfa";
  const { missions } = data;
  const completedMissions = missions.filter((m) => m.completed).length;

  const nextUnlocked = missions.find((m) => !m.completed && m.unlocked);
  const resumeTarget = nextUnlocked
    ? { missionNumber: nextUnlocked.missionNumber, title: nextUnlocked.title }
    : data.currentMission;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-white/10"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(accentHead, 0.18)}, rgba(15,23,42,0.6) 45%, ${hexToRgba(accentHead, 0.08)})`,
        }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: accentHead }}>
            <Sparkles className="h-3.5 w-3.5" />
            {course.trackName}
          </div>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{course.title}</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{course.description}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <Timer className="h-3.5 w-3.5" style={{ color: accentHead }} />
                {course.duration} · {course.moduleCount} Missions · {String(course.totalXp)} XP
              </p>
            </div>
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: hexToRgba(accentHead, 0.2) }}
            >
              <Icon className="h-7 w-7" style={{ color: accentHead }} />
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-white">
                  {data.enrolled ? `${completedMissions}/${missions.length} missions completed` : "Not enrolled yet"}
                </span>
                <span className="text-slate-400">{data.progress.percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${data.progress.percent}%`, background: accentHead }}
                />
              </div>
            </div>
            {data.enrolled ? (
              <Link
                href={
                  resumeTarget
                    ? `/portal/courses/${course.slug}/mission/${resumeTarget.missionNumber}`
                    : `/portal/courses/${course.slug}`
                }
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_-8px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.03]"
              >
                <PlayCircle className="h-4 w-4" />
                {completedMissions === 0 ? "Start First Mission" : "Resume Learning"}
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_-8px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.03] disabled:opacity-60"
              >
                {enrolling ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {enrolling ? "Enrolling..." : "Enroll Now — Open Enrollment"}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mission roadmap */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-white">Mission Roadmap</h2>
        <div className="space-y-3">
          {missions.map((m) => {
            const isUnlocked = m.unlocked;
            const isDone = m.completed;
            const isCurrent = !isDone && isUnlocked;
            return (
              <div
                key={m.id}
                className={`flex items-center gap-4 rounded-2xl border p-4 transition-all sm:p-5 ${
                  isCurrent
                    ? "border-violet-500/30 bg-violet-500/5 ring-1 ring-violet-500/20"
                    : isDone
                      ? "border-emerald-500/15 bg-emerald-500/[0.03]"
                      : isUnlocked
                        ? "border-white/10 bg-white/[0.03] hover:border-white/20"
                        : "border-white/5 bg-white/[0.01] opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      isDone
                        ? "bg-emerald-500/15 text-emerald-400"
                        : isCurrent
                          ? "bg-gradient-to-br from-violet-600 to-cyan-500 text-white"
                          : "bg-white/5 text-white/30"
                    }`}
                  >
                    {m.missionNumber}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-white">{m.title}</h3>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                    {isDone ? "Completed" : isUnlocked ? "Available now" : `Complete Mission ${m.missionNumber - 1} to unlock`}
                    {" · "}+{m.creditsReward} credits
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {isDone && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                  {isUnlocked && !isDone && (
                    <Link
                      href={`/portal/courses/${course.slug}/mission/${m.missionNumber}`}
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-3.5 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.03]"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      {isCurrent ? "Continue" : "Start"}
                    </Link>
                  )}
                  {!isUnlocked && <Lock className="h-4 w-4 text-white/20" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outcomes */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-white">
          <Quote className="h-4 w-4" style={{ color: accentHead }} />
          What you&apos;ll walk away with
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {course.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2 text-xs leading-relaxed text-slate-300">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              {o}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}