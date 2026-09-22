"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  Users,
  ArrowRight,
  Coins,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  RefreshCw,
  Filter,
  Clock,
  TrendingUp,
} from "lucide-react";
import { api, type AdminUserSummary, type AdminUserDetail } from "@/lib/api";

function AdminUsersPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [users, setUsers] = React.useState<AdminUserSummary[] | null>(null);
  const [detail, setDetail] = React.useState<AdminUserDetail | null>(null);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [retryKey, setRetryKey] = React.useState(0);

  const load = React.useCallback(() => {
    Promise.all([
      api.get<{ users: AdminUserSummary[] }>("/admin/users"),
      id ? api.get<AdminUserDetail>(`/admin/users?id=${id}`) : Promise.resolve(null),
    ])
      .then(([u, d]) => {
        setUsers(u.users);
        setDetail(d);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load users"));
  }, [id]);

  React.useEffect(load, [load, retryKey]);

  const filtered = React.useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  const u = detail?.user ?? null;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
          <Users className="h-3.5 w-3.5" />
          User Manager
        </div>
        <div className="mt-1 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {u ? u.name : "Users"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              {u
                ? `${u.email} · ${u.role} · ${u.credits.balance} credits / ${u.credits.totalEarned} earned`
                : "Every learner and admin — enrollments, progress, quiz scores and credit balances."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {id && (
              <Link
                href="/admin/users"
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

      {/* ── User detail ── */}
      {u && detail && (
        <section className="space-y-6">
          {/* Header stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { label: "Balance", value: u.credits.balance, icon: Coins, color: "#fbbf24" },
              { label: "Total Earned", value: u.credits.totalEarned, icon: TrendingUp, color: "#f59e0b" },
              { label: "Enrolled", value: detail.enrolledCourses.length, icon: BookOpen, color: "#8b5cf6" },
              { label: "Completed", value: detail.progress.completed, icon: CheckCircle2, color: "#10b981" },
              { label: "Quizzes Passed", value: detail.quizzes.passed, icon: ClipboardList, color: "#06b6d4" },
              { label: "Assignments", value: detail.assignments.submitted, icon: ClipboardList, color: "#22d3ee" },
              { label: "Avg. Best Quiz", value: `${detail.quizzes.bestScoreAvg}%`, icon: TrendingUp, color: "#a78bfa" },
              { label: "Pending Review", value: detail.assignments.pending, icon: Clock, color: "#f472b6" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
                <div className="mt-2 font-display text-xl font-bold text-white">{s.value.toLocaleString()}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Enrollments */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-white">
              <BookOpen className="h-4 w-4 text-violet-300" /> Enrolled Courses
            </h2>
            <div className="space-y-2">
              {detail.enrolledCourses.map((c) => {
                const pct = c.totalMissions ? Math.round((c.completedMissions / c.totalMissions) * 100) : 0;
                return (
                  <div key={c.courseId} className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{c.title}</div>
                        <div className="text-[11px] text-slate-500">
                          Started {new Date(c.startedAt).toLocaleDateString()} · {c.completedMissions}/{c.totalMissions} missions
                        </div>
                      </div>
                      <span className="text-xs font-bold text-violet-300">{pct}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {detail.enrolledCourses.length === 0 && (
                <p className="py-4 text-center text-xs text-slate-500">Not enrolled in any course yet.</p>
              )}
            </div>
          </section>

          {/* Recent progress */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
              <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Recent Activity
              </h2>
              <div className="space-y-2">
                {detail.progress.recent.slice(0, 10).map((p) => (
                  <div key={p.moduleId} className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">{p.title}</div>
                      <div className="truncate text-[11px] text-slate-500">{p.courseTitle ?? "—"}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span
                        className={`block text-[10px] font-bold ${
                          p.completed ? "text-emerald-300" : "text-slate-400"
                        }`}
                      >
                        {p.completed ? "COMPLETED" : "IN PROGRESS"}
                      </span>
                      <span className="text-[9px] text-slate-600">
                        {p.completedAt ? new Date(p.completedAt).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  </div>
                ))}
                {detail.progress.recent.length === 0 && (
                  <p className="py-4 text-center text-xs text-slate-500">No activity yet.</p>
                )}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6">
              {/* Credit transactions */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-white">
                  <Coins className="h-4 w-4 text-amber-300" /> Credit Ledger
                </h2>
                {detail.creditTransactions && detail.creditTransactions.length > 0 ? (
                  <div className="space-y-1.5">
                    {detail.creditTransactions.slice(0, 8).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3.5 py-2 text-sm">
                        <div className="min-w-0">
                          <div className="truncate text-xs text-slate-200">{tx.description}</div>
                          <div className="text-[10px] text-slate-600">
                            {tx.type} · {new Date(tx.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`shrink-0 font-bold ${tx.amount >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                          {tx.amount >= 0 ? "+" : ""}{tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-xs text-slate-500">
                    No credit transactions yet (legacy credits show only totals).
                  </p>
                )}
              </section>

              {/* Quiz history */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-white">
                  <ClipboardList className="h-4 w-4 text-cyan-300" /> Recent Quiz Attempts
                </h2>
                {detail.quizzes.recent.length > 0 ? (
                  <div className="space-y-1.5">
                    {detail.quizzes.recent.slice(0, 8).map((q) => (
                      <div key={q.quizId + q.submittedAt} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3.5 py-2 text-sm">
                        <span className="text-[11px] text-slate-500">{new Date(q.submittedAt).toLocaleString()}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">{q.score}%</span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                              q.passed
                                ? "border-emerald-400/25 text-emerald-300"
                                : "border-rose-400/25 text-rose-300"
                            }`}
                          >
                            {q.passed ? "PASS" : "FAIL"}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-xs text-slate-500">No quiz attempts.</p>
                )}
              </section>
            </div>
          </div>
        </section>
      )}

      {/* ── User list ── */}
      {!id && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-violet-400/60"
              />
            </div>
          </div>

          {!users ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Enrolled</th>
                      <th className="px-4 py-3">Completed</th>
                      <th className="px-4 py-3">Quizzes</th>
                      <th className="px-4 py-3">Assignments</th>
                      <th className="px-4 py-3">Credits</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <Link href={`/admin/users?id=${u.id}`} className="block">
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-[11px] text-slate-500">{u.email}</div>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
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
                        <td className="px-4 py-3 text-slate-300">{u.enrolledCourses}</td>
                        <td className="px-4 py-3 text-slate-300">{u.completedMissions}</td>
                        <td className="px-4 py-3 text-slate-300">{u.quizzesPassed}</td>
                        <td className="px-4 py-3 text-slate-300">{u.assignmentsSubmitted}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-amber-300">
                            <Coins className="h-3 w-3" /> {u.credits.balance}
                            <span className="text-[10px] text-slate-600">/ {u.credits.totalEarned}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/users?id=${u.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-violet-300 hover:text-violet-200"
                          >
                            View <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <React.Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-violet-400" /></div>}>
      <AdminUsersPageInner />
    </React.Suspense>
  );
}