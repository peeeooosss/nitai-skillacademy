"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Loader2,
  LayoutDashboard,
  BookOpen,
  Users,
  Coins,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  ClipboardList,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { api, type AdminCourseSummary, type AdminUserSummary } from "@/lib/api";

export default function AdminOverviewPage() {
  const [courses, setCourses] = React.useState<AdminCourseSummary[] | null>(null);
  const [users, setUsers] = React.useState<AdminUserSummary[] | null>(null);
  const [error, setError] = React.useState("");
  const [retryKey, setRetryKey] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const load = React.useCallback(() => {
    Promise.all([
      api.get<{ courses: AdminCourseSummary[] }>("/admin/courses"),
      api.get<{ users: AdminUserSummary[] }>("/admin/users"),
    ])
      .then(([c, u]) => {
        setCourses(c.courses);
        setUsers(u.users);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load admin overview"));
  }, []);

  React.useEffect(load, [load, retryKey]);

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).slice(0, 8);
  }, [users, search]);

  const statCards = React.useMemo(() => {
    if (!courses || !users) return [];
    const aggregate = {
      totalUsers: users.length,
      students: users.filter((u) => u.role === "STUDENT").length,
      totalMissions: courses.reduce((s, c) => s + c.missionCount, 0),
      totalSubmodules: courses.reduce((s, c) => s + c.submoduleCount, 0),
      totalQuizQuestions: courses.reduce((s, c) => s + c.quizQuestionCount, 0),
      totalEnrollments: courses.reduce((s, c) => s + c.enrollmentCount, 0),
      totalCompletions: courses.reduce((s, c) => s + c.completionCount, 0),
      totalXp: courses.reduce((s, c) => s + c.totalXp, 0),
      creditsIssued: users.reduce((s, u) => s + u.credits.totalEarned, 0),
    };
    return [
      {
        label: "Users",
        value: aggregate.totalUsers,
        sub: `${aggregate.students} students`,
        icon: Users,
        color: "#8b5cf6",
        href: "/admin/users",
      },
      {
        label: "Courses",
        value: aggregate.totalMissions,
        sub: `${courses.length} courses · ${aggregate.totalSubmodules} sub-modules`,
        icon: BookOpen,
        color: "#06b6d4",
        href: "/admin/courses",
      },
      {
        label: "Quiz Questions",
        value: aggregate.totalQuizQuestions,
        sub: `across all missions`,
        icon: ClipboardList,
        color: "#f59e0b",
        href: "/admin/courses",
      },
      {
        label: "Missions Completed",
        value: aggregate.totalCompletions,
        sub: `${aggregate.totalEnrollments} enrollments`,
        icon: CheckCircle2,
        color: "#10b981",
        href: "/admin/users",
      },
      {
        label: "Credits Issued",
        value: aggregate.creditsIssued,
        sub: `of ${aggregate.totalXp} XP available`,
        icon: Coins,
        color: "#fbbf24",
        href: "/admin/users",
      },
    ];
  }, [courses, users]);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
          <LayoutDashboard className="h-3.5 w-3.5" />
          Admin Overview
        </div>
        <div className="mt-1 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Academy at a glance</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Courses, users, progress and credit activity across the entire Nitai Skill Academy.
            </p>
          </div>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="shrink-0 rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Refresh"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-300">{error}</div>
      )}

      {!courses || !users ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={card.href}
                  className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: `${card.color}1a` }}
                  >
                    <card.icon className="h-4.5 w-4.5" style={{ color: card.color }} />
                  </span>
                  <div className="mt-4 font-display text-2xl font-bold text-white">{card.value.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{card.label}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{card.sub}</div>
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-violet-300 opacity-0 transition-opacity group-hover:opacity-100">
                    View <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent users */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-white">
                <GraduationCap className="h-4 w-4 text-violet-300" />
                Recent Users
              </h2>
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email…"
                  className="w-56 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-violet-400/60"
                />
                <Link
                  href="/admin/users"
                  className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  All users <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="pb-2 pr-4">User</th>
                    <th className="pb-2 pr-4">Role</th>
                    <th className="pb-2 pr-4">Enrolled</th>
                    <th className="pb-2 pr-4">Completed</th>
                    <th className="pb-2 pr-4">Credits</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.slice(0, 8).map((u) => (
                    <tr key={u.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                      <td className="py-2.5 pr-4">
                        <Link href={`/admin/users?id=${u.id}`} className="block">
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </Link>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                            u.role === "ADMIN"
                              ? "border-violet-400/40 text-violet-300"
                              : "border-white/10 text-slate-400"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-300">{u.enrolledCourses}</td>
                      <td className="py-2.5 pr-4 text-slate-300">{u.completedMissions}</td>
                      <td className="py-2.5 pr-4 text-amber-300">
                        <span className="inline-flex items-center gap-1">
                          <Coins className="h-3 w-3" /> {u.credits.balance}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <Link
                          href={`/admin/users?id=${u.id}`}
                          className="text-xs font-semibold text-violet-300 hover:text-violet-200"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No users match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Course completion summary */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-white">
                <TrendingUp className="h-4 w-4 text-cyan-300" />
                Course Engagement
              </h2>
              <Link
                href="/admin/courses"
                className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                All courses <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {courses.slice(0, 6).map((c) => {
                const pct = c.completionRate;
                return (
                  <Link
                    key={c.id}
                    href={`/admin/courses?slug=${c.slug}`}
                    className="block rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-sm font-bold text-slate-400">{c.index}</span>
                        <div>
                          <div className="text-sm font-semibold text-white">{c.title}</div>
                          <div className="text-[11px] text-slate-500">
                            {c.missionCount} missions · {c.submoduleCount} sub-modules · {c.enrollmentCount} enrolled
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          <span className="font-semibold text-white">{c.completionCount}</span> completed
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                            c.isActive
                              ? "border-emerald-400/25 text-emerald-300"
                              : "border-rose-400/25 text-rose-300"
                          }`}
                        >
                          {c.isActive ? "Active" : "Archived"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}