"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  BookOpen,
  ArrowRight,
  Users,
  CheckCircle2,
  ClipboardList,
  Coins,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { api, type AdminCourseSummary, type AdminCourseDetail } from "@/lib/api";

function AdminCoursesPageInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [courses, setCourses] = React.useState<AdminCourseSummary[] | null>(null);
  const [detail, setDetail] = React.useState<AdminCourseDetail | null>(null);
  const [error, setError] = React.useState("");
  const [retryKey, setRetryKey] = React.useState(0);

  const load = React.useCallback(() => {
    Promise.all([
      api.get<{ courses: AdminCourseSummary[] }>("/admin/courses"),
      slug ? api.get<AdminCourseDetail>(`/admin/courses?slug=${slug}`) : Promise.resolve(null),
    ])
      .then(([c, d]) => {
        setCourses(c.courses);
        setDetail(d);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load courses"));
  }, [slug]);

  React.useEffect(load, [load, retryKey]);

  const current = detail?.course ?? null;
  const modules = detail?.modules ?? [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
          <BookOpen className="h-3.5 w-3.5" />
          Course Manager
        </div>
        <div className="mt-1 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {current ? current.title : "Courses"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              {current
                ? `${current.shortTitle} · ${current.trackName} · ${current.moduleCount} modules, ${current.totalXp} XP`
                : "Every course, mission and module in the academy — with content, quiz and completion stats."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {slug && (
              <Link
                href="/admin/courses"
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Back to all
              </Link>
            )}
            <button
              onClick={() => setRetryKey((k) => k + 1)}
              className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-300">{error}</div>
      )}

      {/* ── Course detail (single) ── */}
      {slug && current && (
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Enrollments", value: current.enrollmentCount, icon: Users, color: "#8b5cf6" },
              { label: "Missions", value: modules.length, icon: BookOpen, color: "#06b6d4" },
              { label: "Completions", value: modules.reduce((s, m) => s + m.completions, 0), icon: CheckCircle2, color: "#10b981" },
              { label: "Total XP", value: current.totalXp, icon: Coins, color: "#fbbf24" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
                <div className="mt-2 font-display text-xl font-bold text-white">{s.value.toLocaleString()}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Mission</th>
                    <th className="px-4 py-3">Sub-modules</th>
                    <th className="px-4 py-3">Quiz</th>
                    <th className="px-4 py-3">XP</th>
                    <th className="px-4 py-3">Completions</th>
                    <th className="px-4 py-3 text-right">Content</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((m) => (
                    <tr key={m.missionNumber ?? m.title} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-300">
                            {m.missionNumber}
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-white">{m.title}</div>
                            <div className="max-w-md truncate text-[11px] text-slate-500">{m.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{m.submodules}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <ClipboardList className="h-3 w-3 text-amber-300" />
                          {m.quizQuestions}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-amber-300">{m.creditsReward}</td>
                      <td className="px-4 py-3 text-slate-300">{m.completions}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                          Detail
                        </span>
                      </td>
                    </tr>
                  ))}
                  {modules.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No missions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Course list (all) ── */}
      {!slug && (
        <>
          {!courses ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {courses.map((c) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Link
                    href={`/admin/courses?slug=${c.slug}`}
                    className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
                          <BookOpen className="h-4.5 w-4.5 text-white" />
                        </span>
                        <div>
                          <div className="text-sm font-bold text-white">{c.title}</div>
                          <div className="text-[11px] text-slate-500">{c.shortTitle} · {c.trackName}</div>
                        </div>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                          c.isActive ? "border-emerald-400/25 text-emerald-300" : "border-rose-400/25 text-rose-300"
                        }`}
                      >
                        {c.isActive ? "Active" : "Archived"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-white/[0.03] px-2 py-2">
                        <div className="font-display text-lg font-bold text-white">{c.missionCount}</div>
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Missions</div>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] px-2 py-2">
                        <div className="font-display text-lg font-bold text-white">{c.submoduleCount}</div>
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Sub-modules</div>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] px-2 py-2">
                        <div className="font-display text-lg font-bold text-white">{c.enrollmentCount}</div>
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Enrolled</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <ClipboardList className="h-3 w-3 text-amber-300" />
                        {c.quizQuestionCount} quiz questions
                        <span className="mx-1 text-slate-600">·</span>
                        <Users className="h-3 w-3 text-cyan-300" />
                        {c.completionRate}% completion
                        <span className="mx-1 text-slate-600">·</span>
                        <Coins className="h-3 w-3 text-amber-300" />
                        {c.totalXp} XP
                      </span>
                      <ArrowRight className="h-4 w-4 text-violet-300 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Placeholder note for module editor */}
      {slug && current && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200/90">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />
          <p>
            Mission-level content editing is next. For now this page gives a full read-only breakdown of every mission —
            sub-module counts, quiz sizes, XP rewards and learner completions. Content itself is authored in
            <span className="mx-1 font-semibold text-amber-100">scripts/content/courses/{current.slug}/</span> and applied
            via the seeder.
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminCoursesPage() {
  return (
    <React.Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-violet-400" /></div>}>
      <AdminCoursesPageInner />
    </React.Suspense>
  );
}