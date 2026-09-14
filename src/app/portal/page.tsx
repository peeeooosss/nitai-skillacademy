"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  PlayCircle,
  Sparkles,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { api, type DashboardData } from "@/lib/api";
import { courseIcon, hexToRgba } from "@/lib/courseIcons";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    refreshUser();
    api
      .get<DashboardData>("/dashboard")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load dashboard"));
  }, [refreshUser]);

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <p className="text-sm text-rose-300">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-xs text-slate-400 hover:text-white">
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

  const { stats, nextMission, enrolledCourses, recentActivity } = data;

  const statCards = [
    { label: "Credits Earned", value: String(stats.totalCredits), icon: Award, color: "text-amber-300", bg: "bg-amber-400/10 border-amber-400/20" },
    { label: "Day Streak", value: `${stats.currentStreak}`, icon: Flame, color: "text-orange-300", bg: "bg-orange-400/10 border-orange-400/20" },
    { label: "Missions Done", value: String(stats.completedMissions), icon: CheckCircle2, color: "text-emerald-300", bg: "bg-emerald-400/10 border-emerald-400/20" },
    { label: "Hours Invested", value: String(stats.totalHours), icon: Clock, color: "text-cyan-300", bg: "bg-cyan-400/10 border-cyan-400/20" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
          <Sparkles className="h-3.5 w-3.5" />
          My Dashboard
        </div>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Welcome back, {user?.name?.split(" ")[0] || "Learner"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          {stats.enrolledCourses === 0
            ? "You haven't enrolled in a course yet — pick a track below and start earning credits today."
            : "Your next mission is ready. Keep the streak alive!"}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl border ${s.bg} p-4 sm:p-5`}
            >
              <Icon className={`h-5 w-5 ${s.color}`} />
              <p className="mt-3 text-2xl font-bold text-white sm:text-3xl">{s.value}</p>
              <p className="mt-0.5 text-xs text-slate-400">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Continue learning */}
      {nextMission ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-600/15 via-slate-900/40 to-cyan-500/10 p-6 sm:p-7"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                <PlayCircle className="h-3.5 w-3.5" />
                Continue Learning
              </div>
              <h2 className="mt-2 font-display text-lg font-bold text-white sm:text-xl">{nextMission.missionTitle}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {nextMission.courseTitle} · Mission {nextMission.missionNumber}
                {nextMission.previousCompleted ? " · Unlocked" : ""}
              </p>
            </div>
            <Link
              href={`/portal/courses/${nextMission.courseSlug}/mission/${nextMission.missionNumber}`}
              className="inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_-8px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.03] sm:self-auto"
            >
              Resume Mission
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      ) : enrolledCourses.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-7"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15">
              <Award className="h-5 w-5 text-emerald-400" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-white">All missions complete!</h2>
              <p className="text-sm text-slate-400">You finished every enrolled course. Explore another course below.</p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Enrolled courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">My Courses</h2>
          <Link href="/portal/courses" className="flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200">
            Browse all courses <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/25 to-cyan-500/25">
              <BookOpen className="h-7 w-7 text-white" />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-white">No courses yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
              Browse the full catalog of 12 flagship courses and enroll in the one built for you.
            </p>
            <Link
              href="/portal/courses"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Explore Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {enrolledCourses.map((c) => {
              const Icon = courseIcon(c.icon);
              const accent = c.accentColor || "#a78bfa";
              const { percent, completedMissions, totalMissions } = c.progress;
              const resumeNum = c.currentMission?.missionNumber;
              return (
                <Link
                  key={c.courseId}
                  href={`/portal/courses/${c.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: hexToRgba(accent, 0.15) }}
                    >
                      <Icon className="h-5 w-5" style={{ color: accent }} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-white">{c.title}</h3>
                      <p className="text-[11px] text-slate-400">
                        {completedMissions}/{totalMissions} missions · {percent}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%`, background: accent }}
                    />
                  </div>
                  {resumeNum ? (
                    <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-cyan-300 group-hover:text-cyan-200">
                      <TrendingUp className="h-3 w-3" />
                      Up next: Mission {resumeNum} · {c.currentMission?.title}
                    </p>
                  ) : (
                    <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Course complete
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold text-white">Recent Activity</h2>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            {recentActivity.map((a, i) => (
              <div
                key={a.moduleId + "-" + i}
                className={`flex items-center gap-3 px-5 py-3.5 ${i > 0 ? "border-t border-white/5" : ""}`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">{a.title}</p>
                  <p className="text-[11px] text-slate-500">
                    {a.courseTitle} · Mission {a.missionNumber}
                  </p>
                </div>
                {a.completedAt && (
                  <span className="shrink-0 text-[11px] text-slate-500">
                    {new Date(a.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}