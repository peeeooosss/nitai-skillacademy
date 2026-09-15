"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Lightbulb,
  FileQuestion,
  CheckCircle2,
  Lock,
  RotateCcw,
  Trophy,
  Award,
  Video,
  ExternalLink,
  Check,
  PlayCircle,
} from "lucide-react";
import { api, type MissionDetail, type QuizQuestion, type ExampleQuizItem } from "@/lib/api";
import { renderMarkdown, extractExamples } from "@/lib/markdown";
import SlideViewer from "@/components/portal/SlideViewer";
import { courseIcon, hexToRgba } from "@/lib/courseIcons";
import { useAuth } from "@/context/AuthContext";

type Step = "theory" | "slides" | "examples" | "live" | "quiz" | "complete";

const STEPS: { id: Step; label: string; icon: typeof BookOpen }[] = [
  { id: "theory", label: "Theory", icon: BookOpen },
  { id: "slides", label: "Slides", icon: Layers },
  { id: "examples", label: "Examples", icon: Lightbulb },
  { id: "live", label: "Live", icon: Video },
  { id: "quiz", label: "Quiz", icon: FileQuestion },
  { id: "complete", label: "Complete", icon: CheckCircle2 },
];

function buildSteps(hasLive: boolean): Step[] {
  if (hasLive) return STEPS.map((s) => s.id);
  return STEPS.filter((s) => s.id !== "live").map((s) => s.id);
}

export default function MissionPlayerPage({ params }: { params: { slug: string; id: string } }) {
  const { refreshUser } = useAuth();
  const missionNumber = parseInt(params.id, 10);
  const [data, setData] = React.useState<MissionDetail | null>(null);
  const [error, setError] = React.useState("");
  const [step, setStep] = React.useState<Step>("theory");
  const [credited, setCredited] = React.useState(false);
  const [completing, setCompleting] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Module-sequential flow state
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [modTab, setModTab] = React.useState<"theory" | "slides" | "quiz">("theory");
  const [celebrating, setCelebrating] = React.useState(false);
  const [moduleError, setModuleError] = React.useState("");

  React.useEffect(() => {
    setData(null);
    setError("");
    setStep("theory");
    setCredited(false);
    setActiveIndex(null);
    setModTab("theory");
    setCelebrating(false);
    setModuleError("");
    api
      .get<MissionDetail>(`/missions?courseSlug=${params.slug}&mission=${missionNumber}`)
      .then((d) => {
        setData(d);
        const modParam = new URLSearchParams(window.location.search).get("module");
        if (modParam) {
          const target = d.module.submodules.find((s) => s.index === parseInt(modParam, 10));
          if (target && target.unlocked) setActiveIndex(target.index);
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load mission"));
  }, [params.slug, missionNumber, refreshKey]);

  // Keep the active module in sync with unlock/completion data.
  React.useEffect(() => {
    if (!data || data.module.submodules.length === 0) return;
    const subs = data.module.submodules;
    const target = subs.find((s) => s.unlocked && !s.completed);
    setActiveIndex((prev) => {
      const cur = subs.find((s) => s.index === prev);
      if (!target) return prev;
      if (prev == null) return target.index;
      if (cur && !cur.completed) return prev;
      return target.index;
    });
  }, [data]);

  const completeMission = async () => {
    if (!data || credited || data.progress.completed) {
      setCredited(true);
      return;
    }
    setCompleting(true);
    try {
      await api.post("/progress", { moduleId: data.module.id });
      setCredited(true);
      await refreshUser();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save progress");
    } finally {
      setCompleting(false);
    }
  };

  const markModuleComplete = async (sub: { index: number }) => {
    if (!data || completing) return;
    setCompleting(true);
    setModuleError("");
    try {
      const res = await api.post<{ completed: boolean; creditsEarned: number }>("/progress", {
        moduleId: data.module.id,
        submoduleIndex: sub.index,
      });
      await refreshUser();
      if (res.completed) {
        setCelebrating(true);
        setCredited(true);
      } else {
        setActiveIndex(null);
      }
      setRefreshKey((k) => k + 1);
    } catch (e) {
      setModuleError(e instanceof Error ? e.message : "Failed to save module progress");
    } finally {
      setCompleting(false);
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

  const { course, module, quiz } = data;
  const Icon = courseIcon(course.icon);
  const accent = course.accentColor || "#a78bfa";

  if (!data.gating.unlocked) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
          <Lock className="h-6 w-6 text-slate-500" />
        </div>
        <h1 className="mt-5 font-display text-xl font-bold text-white">Mission {missionNumber} is locked</h1>
        <p className="mt-2 text-sm text-slate-400">
          {data.gating.firstMission
            ? "This is the first mission. If you're seeing this, enroll in the course first."
            : `Complete "${data.gating.previousMissionTitle ?? "the previous mission"}" to unlock this one.`}
        </p>
        <Link
          href={`/portal/courses/${course.slug}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: `linear-gradient(to right, ${accent}, #06b6d4)` }}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Course
        </Link>
      </div>
    );
  }

  const hasSubmodules = module.submodules.length > 0;
  const allDone = data.progress.completed;

  return (
    <div className="space-y-6">
      {/* Breadcrumb / header */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/portal/courses/${course.slug}`} className="text-xs text-slate-400 hover:text-white">
          {course.title}
        </Link>
        <span className="text-slate-600">/</span>
        <span className="flex items-center gap-2 text-xs font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: hexToRgba(accent, 0.15) }}>
            <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
          </span>
          Mission {module.missionNumber} — {module.title}
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
          <Award className="h-3.5 w-3.5" />
          +{module.creditsReward} credits
        </span>
      </div>

      {hasSubmodules ? (
        <ModuleFlow
          course={course}
          module={module}
          data={data}
          accent={accent}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          modTab={modTab}
          setModTab={setModTab}
          allDone={allDone}
          celebrating={celebrating}
          completing={completing}
          moduleError={moduleError}
          onMarkComplete={markModuleComplete}
        />
      ) : (
        <LegacyFlow
          course={course}
          module={module}
          quiz={quiz}
          data={data}
          step={step}
          setStep={setStep}
          accent={accent}
          completing={completing}
          onComplete={completeMission}
        />
      )}
    </div>
  );
}

/* ── Module-sequential flow (missions with sub-modules) ─────────────────── */

const MOD_TABS = [
  { id: "theory" as const, label: "Theory", icon: BookOpen },
  { id: "slides" as const, label: "Slides", icon: Layers },
  { id: "quiz" as const, label: "Example Quiz", icon: FileQuestion },
];

function ModuleFlow({
  course,
  module: mod,
  data,
  accent,
  activeIndex,
  setActiveIndex,
  modTab,
  setModTab,
  allDone,
  celebrating,
  completing,
  moduleError,
  onMarkComplete,
}: {
  course: MissionDetail["course"];
  module: MissionDetail["module"];
  data: MissionDetail;
  accent: string;
  activeIndex: number | null;
  setActiveIndex: (n: number) => void;
  modTab: "theory" | "slides" | "quiz";
  setModTab: (t: "theory" | "slides" | "quiz") => void;
  allDone: boolean;
  celebrating: boolean;
  completing: boolean;
  moduleError: string;
  onMarkComplete: (sub: { index: number }) => void;
}) {
  const subs = mod.submodules.slice().sort((a, b) => a.index - b.index);
  const doneCount = subs.filter((s) => s.completed).length;
  const total = subs.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const active = subs.find((s) => s.index === activeIndex) ?? null;
  const lockedActive = active && !active.unlocked;

  const openModule = (s: (typeof subs)[number]) => {
    if (!s.unlocked) return;
    setActiveIndex(s.index);
    setModTab("theory");
  };

  return (
    <div className="space-y-6">
      {/* Module progress */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white">
            {allDone ? "Mission Complete!" : "Mission Progress"}
          </span>
          <span className="text-slate-400">
            {doneCount}/{total} modules · {pct}%
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: `linear-gradient(to right, ${accent}, #06b6d4)` }}
          />
        </div>
      </div>

      {/* Module stepper */}
      <div className="space-y-2">
        {subs.map((s) => {
          const isActive = s.index === activeIndex;
          const isDone = s.completed;
          return (
            <button
              key={s.index}
              onClick={() => openModule(s)}
              disabled={!s.unlocked}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                isActive
                  ? "border-white/20 bg-white/[0.06]"
                  : isDone
                    ? "border-emerald-500/15 bg-emerald-500/[0.03]"
                    : s.unlocked
                      ? "border-white/10 bg-white/[0.02] hover:border-white/25"
                      : "border-white/5 bg-white/[0.01] opacity-50"
              } ${!s.unlocked ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isDone
                    ? "bg-emerald-500/15 text-emerald-400"
                    : s.unlocked
                      ? "text-white"
                      : "bg-white/5 text-white/30"
                }`}
                style={s.unlocked && !isDone ? { background: hexToRgba(accent, 0.18), color: accent } : undefined}
              >
                {isDone ? <Check className="h-4 w-4" /> : s.index}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-xs font-semibold ${isDone || s.unlocked ? "text-slate-200" : "text-slate-500"}`}>
                  Module {s.index} · {s.title}
                </p>
                <p className="text-[10px] text-slate-500">
                  {isDone ? "Completed" : s.unlocked ? "Available now" : `Complete Module ${s.index - 1} to unlock`}
                </p>
              </div>
              {s.unlocked && (isActive || isDone) && !allDone && (
                <span className="shrink-0 text-[10px] font-semibold" style={{ color: accent }}>
                  {isActive ? (isDone ? "Done" : "Open") : "Review"}
                </span>
              )}
              {!s.unlocked && <Lock className="h-3.5 w-3.5 shrink-0 text-white/20" />}
            </button>
          );
        })}
      </div>

      {/* Completion card when everything is done */}
      {allDone && (
        <CompletionCard
          accent={accent}
          courseSlug={course.slug}
          missionNumber={mod.missionNumber}
          courseTitle={course.title}
          credits={mod.creditsReward}
          busy={completing}
          alreadyDone={!celebrating}
        />
      )}

      {/* Live session banner */}
      {data.liveSession && (
        <a
          href={data.liveSession.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/25"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
            <Video className="h-4 w-4" style={{ color: accent }} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white">{data.liveSession.title}</p>
            <p className="text-[10px] text-slate-500">
              Live · {new Date(data.liveSession.scheduledAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
        </a>
      )}

      {/* Active module content */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-2 pb-4">
              <h2 className="font-display text-base font-bold text-white sm:text-lg">
                Module {active.index} — {active.title}
              </h2>
              {active.completed && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                  <Check className="h-3 w-3" /> Completed
                </span>
              )}
              {!active.unlocked && (
                <span className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              )}
            </div>

            {lockedActive ? (
              <p className="py-6 text-center text-sm text-slate-400">
                Complete Module {active.index - 1} to unlock this module.
              </p>
            ) : (
              <>
                {/* Module tabs */}
                <div className="flex gap-1 overflow-x-auto pb-4">
                  {MOD_TABS.map((t) => {
                    const IconCmp = t.icon;
                    const isCurrent = modTab === t.id;
                    if (t.id === "quiz" && !(active.exampleQuiz && active.exampleQuiz.length > 0)) return null;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setModTab(t.id)}
                        className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[11px] font-semibold transition-all ${
                          isCurrent ? "text-white" : "text-slate-500 hover:bg-white/5"
                        }`}
                        style={isCurrent ? { background: hexToRgba(accent, 0.15) } : undefined}
                      >
                        <IconCmp className="h-3.5 w-3.5" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={modTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {modTab === "theory" && (
                      <div
                        className="prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(active.markdown) }}
                      />
                    )}
                    {modTab === "slides" && (
                      <SlideViewer
                        missionNumber={mod.missionNumber}
                        title={`Module ${active.index} · ${active.title}`}
                        contentMarkdown={active.markdown}
                        accent={accent}
                        compact
                      />
                    )}
                    {modTab === "quiz" && active.exampleQuiz && active.exampleQuiz.length > 0 && (
                      <ExampleQuizStep questions={active.exampleQuiz} accent={accent} />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Module complete action */}
                {!active.completed && active.unlocked && (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    {moduleError && <p className="mb-3 text-xs text-rose-400">{moduleError}</p>}
                    <button
                      onClick={() => onMarkComplete(active)}
                      disabled={completing}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-8"
                      style={{ background: `linear-gradient(to right, ${accent}, #06b6d4)` }}
                    >
                      {completing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      {completing ? "Saving..." : `Mark Module ${active.index} Complete`}
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Example quiz (module self-check, not graded) ──────────────────────── */

function ExampleQuizStep({ questions, accent }: { questions: ExampleQuizItem[]; accent: string }) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-400">
        A quick self-check to make sure the key idea stuck. Tap an option to reveal the answer.
      </p>
      {questions.map((q, qi) => (
        <ExampleQuizQuestion key={qi} q={q} qi={qi} accent={accent} />
      ))}
    </div>
  );
}

function ExampleQuizQuestion({ q, qi, accent }: { q: ExampleQuizItem; qi: number; accent: string }) {
  const [picked, setPicked] = React.useState<number | null>(null);
  const revealed = picked !== null;
  return (
    <div className={`rounded-xl border p-4 ${revealed && picked !== q.answerIndex ? "border-rose-500/30" : "border-white/10"}`}>
      <p className="text-sm font-semibold text-white">
        {qi + 1}. {q.question}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {q.options.map((opt, oi) => {
          const selected = picked === oi;
          let state: "idle" | "selected" | "correct" | "wrong" = "idle";
          if (revealed) {
            if (oi === q.answerIndex) state = "correct";
            else if (selected) state = "wrong";
          } else if (selected) {
            state = "selected";
          }
          return (
            <button
              key={oi}
              onClick={() => setPicked(oi)}
              disabled={revealed}
              className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-xs transition-all ${
                state === "correct"
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
                  : state === "wrong"
                    ? "border-rose-400/50 bg-rose-400/10 text-rose-200"
                    : state === "selected"
                      ? "text-white"
                      : "border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/5"
              }`}
              style={state === "selected" ? { background: hexToRgba(accent, 0.12), borderColor: `${accent}66` } : undefined}
            >
              <span className="font-mono text-[10px] uppercase" style={{ color: state === "selected" && !revealed ? accent : undefined }}>
                {String.fromCharCode(65 + oi)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && (
        <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400">
          <strong className={picked === q.answerIndex ? "text-emerald-400" : "text-rose-300"}>
            {picked === q.answerIndex ? "Correct — " : "Hint: "}
          </strong>
          {q.explanation}
        </p>
      )}
    </div>
  );
}

/* ── Legacy one-shot flow (missions without sub-modules) ───────────────── */

function LegacyFlow({
  course,
  module,
  quiz,
  data,
  step,
  setStep,
  accent,
  completing,
  onComplete,
}: {
  course: MissionDetail["course"];
  module: MissionDetail["module"];
  quiz: MissionDetail["quiz"];
  data: MissionDetail;
  step: Step;
  setStep: (s: Step) => void;
  accent: string;
  completing: boolean;
  onComplete: () => void;
}) {
  const [openModules, setOpenModules] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    setOpenModules(new Set());
    const modParam = new URLSearchParams(window.location.search).get("module");
    if (module.submodules.length > 0) {
      const ids = new Set<number>();
      ids.add(parseInt(modParam ?? "1", 10) >= 1 ? parseInt(modParam ?? "1", 10) : 1);
      setOpenModules(ids);
    }
  }, [module.id]);

  const toggleModule = (n: number) =>
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  const steps = buildSteps(!!data.liveSession);
  const stepIndex = steps.findIndex((id) => id === step);
  const isLast = step === "complete";

  const handleNext = () => {
    if (step === "complete") return;
    const next = steps[stepIndex + 1];
    if (!next) return;
    if (next === "complete") {
      void onComplete();
    }
    setStep(next);
  };

  const examples = extractExamples(module.contentMarkdown);

  return (
    <div className="space-y-6">
      {/* Step nav */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {steps.map((id, i) => {
          const s = STEPS.find((x) => x.id === id)!;
          const IconCmp = s.icon;
          const activeState = i < stepIndex ? "done" : i === stepIndex ? "current" : "todo";
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[11px] font-semibold transition-all ${
                activeState === "current"
                  ? "text-white"
                  : activeState === "done"
                    ? "text-emerald-300/70 hover:bg-white/5"
                    : "text-slate-500 hover:bg-white/5"
              }`}
              style={activeState === "current" ? { background: hexToRgba(accent, 0.15) } : undefined}
            >
              {activeState === "done" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <IconCmp className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {step === "theory" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                <div className="prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(module.contentMarkdown) }} />
              </div>

              {module.submodules.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" style={{ color: accent }} />
                    <h3 className="font-display text-sm font-bold text-white">Lesson Modules</h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Tap a topic to expand the full lesson.</p>
                  <div className="mt-4 space-y-2">
                    {module.submodules.map((s) => {
                      const open = openModules.has(s.index);
                      return (
                        <div key={s.index} className="overflow-hidden rounded-xl border border-white/10">
                          <button
                            onClick={() => toggleModule(s.index)}
                            className="flex w-full items-center gap-3 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:bg-white/[0.05]"
                          >
                            <span
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                              style={{ background: hexToRgba(accent, 0.15), color: accent }}
                            >
                              {s.index}
                            </span>
                            <span className="min-w-0 flex-1 text-xs font-semibold text-slate-200">{s.title}</span>
                            <ChevronRight
                              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {open && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden border-t border-white/5"
                              >
                                <div className="px-4 py-4 sm:px-5">
                                  <div
                                    className="prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(s.markdown) }}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "slides" && (
            <SlideViewer missionNumber={module.missionNumber} title={module.title} contentMarkdown={module.contentMarkdown} accent={accent} />
          )}

          {step === "examples" && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              {examples.html ? (
                <div className="prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: examples.html }} />
              ) : (
                <div className="py-10 text-center">
                  <Lightbulb className="mx-auto h-8 w-8 text-amber-300/60" />
                  <p className="mt-3 text-sm text-slate-400">
                    No separate examples section for this mission — the theory above is your guide. Move on to the quiz.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === "live" && data.liveSession && (
            <LiveStep accent={accent} live={data.liveSession} />
          )}

          {step === "quiz" && (
            <QuizStep
              accent={accent}
              moduleId={module.id}
              quiz={quiz}
              onPassed={() => void onComplete()}
            />
          )}

          {step === "complete" && (
            <CompletionCard
              accent={accent}
              courseSlug={course.slug}
              missionNumber={module.missionNumber}
              courseTitle={course.title}
              credits={module.creditsReward}
              busy={completing}
              alreadyDone={data.progress.completed}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom controls */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <button
          onClick={() => stepIndex > 0 && setStep(steps[stepIndex - 1])}
          disabled={stepIndex === 0}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-20"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        {!isLast && (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ background: `linear-gradient(to right, ${accent}, #06b6d4)` }}
          >
            {step === "quiz"
              ? "Finish Mission"
              : `Next: ${STEPS.find((x) => x.id === steps[stepIndex + 1])!.label}`}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Live step ── */

const PLATFORM_META: Record<string, { label: string; color: string }> = {
  ZOOM: { label: "Zoom", color: "#2D8CFF" },
  MEET: { label: "Google Meet", color: "#0F9D58" },
  TEAMS: { label: "Microsoft Teams", color: "#5B5FC7" },
  OTHER: { label: "External link", color: "#94a3b8" },
};

function LiveStep({ accent, live }: { accent: string; live: NonNullable<MissionDetail["liveSession"]> }) {
  const meta = PLATFORM_META[live.platform] ?? PLATFORM_META.OTHER;
  const when = new Date(live.scheduledAt);
  const localized = when.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-white/10 p-8 text-center"
      style={{ background: `linear-gradient(145deg, ${hexToRgba(accent, 0.14)}, rgba(10,13,20,0.8) 60%, ${hexToRgba(accent, 0.06)})` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 50% 0%, ${accent}, transparent 60%)` }} />
      <div className="relative">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
          <Video className="h-6 w-6" style={{ color: accent }} />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-white">{live.title}</h2>
        {live.description && (
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-300">{live.description}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span
            className="rounded-full border px-3 py-1 text-[11px] font-semibold"
            style={{ borderColor: `${meta.color}55`, background: `${meta.color}1a`, color: meta.color }}
          >
            {meta.label}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">
            {localized}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">
            {live.durationMins} min
          </span>
        </div>

        <a
          href={live.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          style={{ background: `linear-gradient(to right, ${accent}, #06b6d4)` }}
        >
          Join Live Session
          <ExternalLink className="h-4 w-4" />
        </a>
        <p className="mt-4 text-[11px] text-slate-400">
          The join link opens in a new tab. Make sure you&apos;re signed in with your Nitai account on the platform.
        </p>
      </div>
    </motion.div>
  );
}

/* ── Quiz step ── */

function QuizStep({
  accent,
  moduleId,
  quiz,
  onPassed,
}: {
  accent: string;
  moduleId: number;
  quiz: MissionDetail["quiz"];
  onPassed: () => void;
}) {
  const [answers, setAnswers] = React.useState<(number | null)[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<{ score: number; passed: boolean; correct: number; total: number } | null>(null);
  const [error, setError] = React.useState("");

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
        <p className="text-sm text-slate-400">No quiz for this mission. Complete the lesson to earn your credits.</p>
      </div>
    );
  }

  const questions: QuizQuestion[] = quiz.questions;
  void moduleId;

  const select = (qi: number, oi: number) => {
    if (result) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post<{ submission: { score: number; passed: boolean; correctCount: number; totalQuestions: number } }>(
        "/quizzes",
        { quizId: quiz.id, answers }
      );
      setResult({
        score: res.submission.score,
        passed: res.submission.passed,
        correct: res.submission.correctCount,
        total: res.submission.totalQuestions,
      });
      if (res.submission.passed) onPassed();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const answered = answers.filter((a) => a !== null && a !== undefined).length;

  return (
    <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-white">
          Quiz <span className="text-sm font-normal text-slate-500">· pass score {quiz.passScore}%</span>
        </h2>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-400">
          {answered}/{questions.length} answered
        </span>
      </div>

      {questions.map((q, qi) => {
        const revealed = result !== null;
        const correctIdx = revealed ? q.correctIndex : -1;
        return (
          <div key={qi} className={`rounded-xl border p-4 ${revealed && answers[qi] !== q.correctIndex ? "border-rose-500/30" : "border-white/10"}`}>
            <p className="text-sm font-semibold text-white">
              {qi + 1}. {q.question}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                let state: "idle" | "selected" | "correct" | "wrong" | "reveal" = "idle";
                if (revealed) {
                  if (oi === correctIdx) state = "correct";
                  else if (selected) state = "wrong";
                } else if (selected) {
                  state = "selected";
                }
                return (
                  <button
                    key={oi}
                    onClick={() => select(qi, oi)}
                    disabled={revealed}
                    className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-xs transition-all ${
                      state === "correct"
                        ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
                        : state === "wrong"
                          ? "border-rose-400/50 bg-rose-400/10 text-rose-200"
                          : state === "selected"
                            ? "text-white"
                            : "border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/5"
                    }`}
                    style={state === "selected" ? { background: hexToRgba(accent, 0.12), borderColor: `${accent}66` } : undefined}
                  >
                    <span className="font-mono text-[10px] uppercase" style={{ color: state === "selected" && !revealed ? accent : undefined }}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {revealed && q.explanation && (
              <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400">
                <strong className={answers[qi] === q.correctIndex ? "text-emerald-400" : "text-rose-300"}>
                  {answers[qi] === q.correctIndex ? "Correct — " : "Hint: "}
                </strong>
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {error && <p className="text-xs text-rose-400">{error}</p>}

      {result ? (
        <div className={`flex items-center justify-between rounded-xl border p-4 ${result.passed ? "border-emerald-400/30 bg-emerald-400/5" : "border-amber-400/30 bg-amber-400/5"}`}>
          <div>
            <p className={`text-sm font-bold ${result.passed ? "text-emerald-400" : "text-amber-300"}`}>
              {result.passed ? "Passed!" : "Not quite — " + quiz.passScore + "% needed"}
            </p>
            <p className="text-[11px] text-slate-400">
              Score: {result.score}% ({result.correct}/{result.total} correct)
            </p>
          </div>
          {result.passed ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          ) : (
            <button
              onClick={() => {
                setAnswers([]);
                setResult(null);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={submit}
          disabled={submitting || answered < questions.length}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: `linear-gradient(to right, ${accent}, #06b6d4)` }}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileQuestion className="h-4 w-4" />}
          {submitting ? "Submitting..." : answered < questions.length ? `Answer all questions (${answered}/${questions.length})` : "Submit Quiz"}
        </button>
      )}
    </div>
  );
}

/* ── Completion card ── */

function CompletionCard({
  accent,
  courseSlug,
  missionNumber,
  courseTitle,
  credits,
  busy,
  alreadyDone,
}: {
  accent: string;
  courseSlug: string;
  missionNumber: number;
  courseTitle: string;
  credits: number;
  busy: boolean;
  alreadyDone: boolean;
}) {
  const active = !busy && !alreadyDone;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-white/10 p-8 text-center"
      style={{ background: `linear-gradient(145deg, ${hexToRgba(accent, 0.14)}, rgba(10,13,20,0.8) 60%, ${hexToRgba(accent, 0.06)})` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 50% 0%, ${accent}, transparent 60%)` }} />
      <div className="relative">
        {alreadyDone ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
        ) : !busy ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: hexToRgba(accent, 0.2) }}
          >
            <Trophy className="h-7 w-7" style={{ color: accent }} />
          </motion.div>
        ) : (
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-white/60" />
        )}

        <h2 className="mt-5 font-display text-2xl font-bold text-white">
          {alreadyDone ? "Mission already complete" : busy ? "Awarding credits..." : "Mission Complete!"}
        </h2>

        {!busy && (
          <>
            <p className="mt-2 text-sm text-slate-300">
              {alreadyDone
                ? "You earned these credits before — great work."
                : `Mission ${missionNumber} finished. You earned `}
              {!alreadyDone && (
                <span className="font-bold" style={{ color: accent }}>
                  +{credits} credits
                </span>
              )}
              {!alreadyDone && "!"}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href={`/portal/courses/${courseSlug}`}
                className="inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                style={{ background: `linear-gradient(to right, ${accent}, #06b6d4)` }}
              >
                {courseTitle && (
                  <>
                    <PlayCircle className="h-4 w-4" />
                  </>
                )}
                Continue in {courseTitle}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link href={`/portal/courses/${courseSlug}`} className="text-xs text-slate-400 hover:text-white">
                Back to {courseTitle}
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}