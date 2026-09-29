"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Loader2,
  Inbox,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MessageSquare,
  ChevronRight,
  UserRound,
  BookOpen,
  UserCheck,
  UserX,
  ListRestart,
} from "lucide-react";
import { api, type AdminCourseRequest, type CourseRequestStatus } from "@/lib/api";
import { courseIcon, hexToRgba } from "@/lib/courseIcons";

const STATUS_META: Record<CourseRequestStatus, { label: string; color: string; chip: string; icon: typeof Clock }> = {
  PENDING: { label: "Pending", color: "#f59e0b", chip: "bg-amber-400/15 border-amber-400/25 text-amber-300", icon: Clock },
  APPROVED: { label: "Approved", color: "#10b981", chip: "bg-emerald-500/15 border-emerald-500/25 text-emerald-300", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "#f43f5e", chip: "bg-rose-500/15 border-rose-500/25 text-rose-300", icon: XCircle },
  WAITLISTED: { label: "Waitlisted", color: "#06b6d4", chip: "bg-cyan-500/15 border-cyan-500/25 text-cyan-300", icon: ListRestart },
};

type Filter = "ALL" | CourseRequestStatus;

export default function AdminCourseRequestsPage() {
  const [requests, setRequests] = React.useState<AdminCourseRequest[] | null>(null);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [courses, setCourses] = React.useState<{ slug: string; title: string; shortTitle: string }[]>([]);
  const [filter, setFilter] = React.useState<Filter>("PENDING");
  const [courseFilter, setCourseFilter] = React.useState("ALL");
  const [error, setError] = React.useState("");
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [retryKey, setRetryKey] = React.useState(0);

  const load = React.useCallback(() => {
    const qs = new URLSearchParams({ status: filter, courseSlug: courseFilter === "ALL" ? "" : courseFilter });
    api
      .get<{ requests: AdminCourseRequest[]; courses: { slug: string; title: string; shortTitle: string }[]; counts: Record<string, number> }>(
        `/admin/course-requests?${qs.toString()}`,
      )
      .then((d) => {
        setRequests(d.requests);
        setCourses(d.courses);
        setCounts(d.counts);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load requests"));
  }, [filter, courseFilter]);

  React.useEffect(load, [load, retryKey]);

  const review = async (id: string, status: CourseRequestStatus) => {
    setBusyId(id);
    setError("");
    try {
      const prev = requests?.find((x) => x.id === id);
      const res = await api.put<{ message: string }>(`/admin/course-requests?id=${id}`, { status });
      setRequests((prevList) =>
        prevList ? prevList.map((r) => (r.id === id ? { ...r, status, reviewedAt: new Date().toISOString() } : r)) : prevList,
      );
      if (prev && prev.status !== status) {
        setCounts((c) => ({
          ...c,
          [status]: (c[status] ?? 0) + 1,
          [prev.status]: Math.max(0, (c[prev.status] ?? 1) - 1),
        }));
      }
      window.alert(res.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update request");
    } finally {
      setBusyId(null);
      load();
    }
  };

  const pendingCount = counts["PENDING"] ?? 0;
  const filtered = requests ?? [];

  const StatusIcon = ({ status }: { status: CourseRequestStatus }) => {
    const Icon = STATUS_META[status].icon;
    return <Icon className="h-3.5 w-3.5" style={{ color: STATUS_META[status].color }} />;
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
          <Inbox className="h-3.5 w-3.5" />
          Access Requests
        </div>
        <div className="mt-1 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Course Requests</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Review enrolment requests from students, contact them, and approve to auto-enrol.
            </p>
          </div>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Refresh"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["PENDING", "APPROVED", "WAITLISTED", "REJECTED"] as CourseRequestStatus[]).map((s) => {
            const meta = STATUS_META[s];
            return (
              <div key={s} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <meta.icon className="h-4 w-4" style={{ color: meta.color }} />
                <div className="mt-2 font-display text-xl font-bold text-white">{(counts[s] ?? 0).toLocaleString()}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{meta.label}</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-300">{error}</div>}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["ALL", "PENDING", "APPROVED", "WAITLISTED", "REJECTED"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === f
                  ? "border-violet-400/40 bg-violet-500/15 text-violet-200"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
              }`}
            >
              {f === "ALL" ? "All" : STATUS_META[f].label}
              {f !== "ALL" && <span className="ml-1 text-[10px] opacity-70">{(counts[f] ?? 0)}</span>}
            </button>
          ))}
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-violet-400/40"
        >
          <option value="ALL">All courses</option>
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {!requests ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
          <Inbox className="h-8 w-8 text-slate-600" />
          <p className="text-sm text-slate-400">No {filter === "ALL" ? "" : `${STATUS_META[filter].label.toLowerCase()} `}requests found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const meta = STATUS_META[r.status];
            const accent = r.course?.accentColor || "#a78bfa";
            const Icon = courseIcon(r.course?.icon ?? "");
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                        <UserRound className="h-4 w-4 text-slate-300" />
                      </span>
                      <span className="font-display text-sm font-bold text-white">{r.user?.name}</span>
                      <span className="text-xs text-slate-500">· {r.user?.email}</span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.chip}`}
                      >
                        <StatusIcon status={r.status} />
                        {meta.label}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <Link href={`/courses/${r.course?.slug}`} className="inline-flex items-center gap-1.5 hover:text-white">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md" style={{ background: hexToRgba(accent, 0.15) }}>
                          <Icon className="h-3 w-3" style={{ color: accent }} />
                        </span>
                        {r.course?.title ?? "Course"}
                      </Link>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {r.mobile}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {r.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        {new Date(r.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })} · {new Date(r.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {r.message && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-300">
                        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                        {r.message}
                      </div>
                    )}
                    {r.adminNotes && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-2.5 py-1 text-[11px] text-cyan-200/80">
                        <UserCheck className="h-3 w-3" />
                        Notes: {r.adminNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-2">
                    {r.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => review(r.id, "APPROVED")}
                          disabled={busyId === r.id}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve &amp; Enroll
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => review(r.id, "WAITLISTED")}
                            disabled={busyId === r.id}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5"
                          >
                            <Clock className="h-3.5 w-3.5" />
                            Waitlist
                          </button>
                          <button
                            onClick={() => review(r.id, "REJECTED")}
                            disabled={busyId === r.id}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20 disabled:opacity-60"
                          >
                            <UserX className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link
                        href="/admin/users"
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5"
                      >
                        View student
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {pendingCount > 0 && (
        <p className="text-center text-[11px] text-slate-500">
          <BookOpen className="mr-1 inline h-3 w-3" />
          Approving a request instantly unlocks the course in the student&apos;s dashboard.
        </p>
      )}
    </div>
  );
}