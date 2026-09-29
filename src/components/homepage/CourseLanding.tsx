"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  Check,
  ArrowRight,
  Timer,
  Target,
  Award,
  Sparkles,
  PlayCircle,
  ChevronDown,
  Clock,
  PhoneCall,
  GraduationCap,
  ShieldCheck,
  QrCode,
  BadgeCheck,
  FileBadge,
  Type,
  Video,
  ListChecks,
  Zap,
} from "lucide-react";
import {
  api,
  type PublicCourseDetail,
  type CourseRequestItem,
  type CourseRequestStatus,
} from "@/lib/api";
import { courseIcon, hexToRgba } from "@/lib/courseIcons";
import { useAuth } from "@/context/AuthContext";
import { RequestAccessModal } from "./RequestAccessModal";

const SESSION_ICONS: Record<string, typeof Video> = {
  TUTORIAL: Video,
  WORKSHOP: Zap,
  WEBINAR: Video,
  LIVE: Video,
  MENTORSHIP: Type,
  LECTURE: Video,
  LAB: ListChecks,
};

function useLandingData(slug: string) {
  const { user } = useAuth();
  const [data, setData] = React.useState<PublicCourseDetail | null>(null);
  const [authState, setAuthState] = React.useState<{
    enrolled: boolean;
    progress: { percent: number; completedMissions: number; totalMissions: number };
    currentMission: { missionNumber: number; title: string } | null;
  } | null>(null);
  const [requests, setRequests] = React.useState<CourseRequestItem[]>([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    setData(null);
    setAuthState(null);
    setError("");

    api
      .get<PublicCourseDetail>(`/public/courses?slug=${encodeURIComponent(slug)}`)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load course"));

    if (user) {
      api
        .get<{ enrolled: boolean; percent: number }>(`/courses?slug=${encodeURIComponent(slug)}`)
        .then((d) => {
          if (cancelled) return;
          setAuthState({
            enrolled: d.enrolled,
            progress: { percent: 0, completedMissions: 0, totalMissions: 0 },
            currentMission: null,
          });
        })
        .catch(() => {
          if (!cancelled) setAuthState(null);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [slug, user]);

  return { data, authState, requests, setRequests, error };
}

export function CourseLanding({ slug }: { slug: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { data, authState, requests, setRequests, error } = useLandingData(slug);
  const [requestOpen, setRequestOpen] = React.useState(false);
  const [enrolling, setEnrolling] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set([1]));
  const [actionError, setActionError] = React.useState("");

  const requestForCourse = requests.find((r) => r.course?.slug === slug);
  const enrolled = authState?.enrolled ?? false;
  const isPending = requestForCourse?.status === "PENDING" || requestForCourse?.status === "WAITLISTED";
  const isRejected = requestForCourse?.status === "REJECTED";

  const toggleExpand = (n: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  const handleEnrollAfterApproval = async () => {
    if (!data) return;
    setEnrolling(true);
    setActionError("");
    try {
      await api.post("/enrollments", { courseId: data.course.id });
      router.push(`/portal/courses/${slug}`);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to start course");
    } finally {
      setEnrolling(false);
    }
  };

  const handlePrimary = () => {
    if (!data) return;
    if (!user) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }
    if (enrolled) {
      router.push(`/portal/courses/${slug}`);
      return;
    }
    if (isPending || isRejected) return;
    setRequestOpen(true);
  };

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-24 text-center">
        <p className="text-sm text-rose-300">{error}</p>
        <p className="mt-2 text-xs text-slate-500">The course you&apos;re looking for could not be found.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  const course = data.course;
  const iconColor = course.accentColor || "#a78bfa";
  const Icon = courseIcon(course.icon);

  const primaryLabel = !user
    ? "Get This Course"
    : enrolled
      ? "Continue Learning"
      : isPending
        ? "Request Pending Approval"
        : isRejected
          ? "Request Request Again"
          : "Request Access";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% -10%, ${hexToRgba(iconColor, 0.14)} 0%, transparent 55%), radial-gradient(ellipse at bottom right, rgba(6,182,212,0.06) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-white/10"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(iconColor, 0.22)}, rgba(2,6,23,0.85) 48%, ${hexToRgba(iconColor, 0.08)})`,
          }}
        >
          <div className="p-7 sm:p-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: iconColor, background: hexToRgba(iconColor, 0.14) }}
                  >
                    <Sparkles className="h-3 w-3" />
                    Track {course.index} · {course.trackName}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    <GraduationCap className="h-3 w-3" />
                    {course.audience}
                  </span>
                </div>

                <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  {course.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  {course.description}
                </p>

                <p className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-300">
                  <Timer className="h-3.5 w-3.5" style={{ color: iconColor }} />
                  {course.duration}
                  <span className="mx-1 text-slate-600">·</span>
                  {course.moduleCount} Missions
                  <span className="mx-1 text-slate-600">·</span>
                  {course.totalXp} XP · {course.totalXp / (course.moduleCount || 1) >= 10 ? "+" : ""}
                  {course.outcomes.length} outcomes
                </p>
              </div>

              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: hexToRgba(iconColor, 0.2) }}
              >
                <Icon className="h-8 w-8" style={{ color: iconColor }} />
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
              <button
                onClick={handlePrimary}
                disabled={enrolling || isPending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_-10px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {enrolling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : enrolled ? (
                  <PlayCircle className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {enrolling ? "Starting..." : primaryLabel}
              </button>
              {!enrolled && !user && (
                <span className="text-xs text-slate-400">
                  Free to request · Our team calls you to confirm · Then you start immediately
                </span>
              )}
              {isRejected && (
                <span className="text-xs text-amber-300">Your previous request wasn&apos;t approved — try again.</span>
              )}
              {actionError && <span className="text-xs text-rose-300">{actionError}</span>}
            </div>
          </div>
        </motion.div>

        {/* ── Outcomes ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 sm:p-10"
        >
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <Target className="h-5 w-5" style={{ color: iconColor }} />
            What you&apos;ll be able to do
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {course.outcomes.map((o, i) => (
              <motion.li
                key={o}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm leading-relaxed text-slate-200"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15">
                  <Check className="h-3.5 w-3.5 text-cyan-400" />
                </span>
                {o}
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* ── Curriculum ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <h2 className="font-display text-xl font-bold text-white">Your learning journey</h2>
          <p className="mt-1 text-sm text-slate-400">
            {course.moduleCount} missions, each with bite-size interactive topics, a graded quiz, and credits for every
            mission you complete.
          </p>

          <div className="mt-6 space-y-3">
            {data.missions.map((m) => {
              const SessionIcon = SESSION_ICONS[m.sessionType] ?? Video;
              const open = expanded.has(m.missionNumber);
              return (
                <div
                  key={m.id}
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    open ? "border-white/20 bg-white/[0.04]" : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(m.missionNumber)}
                    className="flex w-full items-center gap-4 p-4 sm:p-5"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${iconColor}, #06b6d4)` }}
                    >
                      {m.missionNumber}
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-sm font-semibold text-white">{m.title}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <SessionIcon className="h-3 w-3" />
                          {(m.sessionType || "SELF-PACED").replace("_", " ")}
                        </span>
                        <span>· {m.submodules.length} topics</span>
                        <span className="inline-flex items-center gap-1 text-emerald-300/80">
                          <Award className="h-3 w-3" />+{m.creditsReward} credits
                        </span>
                      </span>
                    </span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>

                  {open && (
                    <div className="grid gap-2 border-t border-white/5 p-4 sm:grid-cols-2 sm:p-5">
                      {m.submodules.map((s) => (
                        <div
                          key={s.index}
                          className="flex items-start gap-2.5 rounded-xl bg-white/[0.03] px-3 py-2.5"
                        >
                          <span
                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
                            style={{ background: hexToRgba(iconColor, 0.16), color: iconColor }}
                          >
                            {s.index}
                          </span>
                          <span className="flex-1 text-xs leading-relaxed text-slate-300">{s.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Certificate preview ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 sm:p-10"
        >
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <Award className="h-5 w-5 text-amber-300" />
            Earn a verifiable certificate
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Complete every mission in this course and you&apos;ll unlock a shareable certificate of completion —
            instantly verifiable online, downloadable as PDF, and recognised on LinkedIn.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="card-base p-0">
              <div className="h-1.5 w-full rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${iconColor}, #22d3ee, #fbbf24)` }} />
              <div className="p-7 sm:p-10">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Nitai Skill Academy
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">Certificate of Completion</h3>
                  <p className="mt-5 text-xs text-slate-500">This certifies that</p>
                  <p className="font-display text-3xl font-extrabold text-white">
                    Your <span className="italic" style={{ color: iconColor }}>Name</span>
                  </p>
                  <p className="mt-1.5 text-xs text-slate-400">has successfully completed</p>
                  <p className="mx-auto mt-2 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white">
                    {course.title}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-500">{course.trackName}</p>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { label: "Missions", value: String(course.moduleCount), color: "#fbbf24" },
                    { label: "Topics", value: String(data.missions.reduce((acc, m) => acc + m.submodules.length, 0)), color: "#34d399" },
                    { label: "XP Earned", value: String(course.totalXp), color: "#22d3ee" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                      <div className="font-display text-xl font-extrabold" style={{ color: s.color }}>
                        {s.value || "—"}
                      </div>
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 bg-white p-2">
                      <QrCode className="h-full w-full text-slate-900" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Verify online</p>
                      <p className="font-mono text-xs text-white">NITAI-2026-000000</p>
                      <p className="text-[10px] text-slate-500">Sample · yours when you finish</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: FileBadge, label: "PDF" },
                      { icon: BadgeCheck, label: "LinkedIn" },
                      { icon: ShieldCheck, label: "Tamper-proof" },
                    ].map((c) => (
                      <span key={c.label} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-slate-300">
                        <c.icon className="h-3.5 w-3.5 text-cyan-300" />
                        {c.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* How access works */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-7">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
                <PhoneCall className="h-4 w-4" style={{ color: iconColor }} />
                How you get access
              </h3>
              <ol className="mt-5 space-y-5">
                {[
                  {
                    icon: FileBadge,
                    title: "Request access",
                    text: "Submit a short form with your mobile & email. It takes under a minute and is completely free.",
                  },
                  {
                    icon: PhoneCall,
                    title: "Our team calls you",
                    text: "An academy counsellor reviews your request and talks to you about the right cohort and schedule.",
                  },
                  {
                    icon: PlayCircle,
                    title: "Start learning",
                    text: "Once approved, the course unlocks automatically in your dashboard — start mission one the same day.",
                  },
                ].map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: hexToRgba(iconColor, 0.16) }}
                      >
                        <step.icon className="h-4 w-4" style={{ color: iconColor }} />
                      </span>
                      {i < 2 && <span className="mt-1 h-full w-px bg-white/10" />}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-semibold text-white">
                        {i + 1}. {step.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/5 p-3 text-[11px] leading-relaxed text-amber-200/80">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                In-demand courses can fill up. Requests are reviewed in the order they arrive.
              </div>

              <button
                onClick={handlePrimary}
                disabled={enrolling || isPending}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {enrolling ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {enrolling ? "Starting..." : primaryLabel}
              </button>
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            Already have access?{" "}
            <button onClick={() => router.push("/portal")} className="font-semibold text-cyan-300 hover:text-cyan-200">
              Go to your dashboard
            </button>
          </p>
        </div>
      </div>

      <RequestAccessModal
        slug={slug}
        courseId={course.id}
        courseTitle={course.title}
        open={requestOpen}
        onClose={(status?: CourseRequestStatus) => {
          setRequestOpen(false);
          if (status === "PENDING" || status === "WAITLISTED") {
            setRequests([
              { id: "new", courseId: course.id, mobile: "", email: "", message: null, status, createdAt: new Date().toISOString(), course: { id: course.id, slug, title: course.title, shortTitle: course.shortTitle } },
              ...requests,
            ]);
          }
        }}
      />
    </div>
  );
}