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
} from "lucide-react";
import { api, type MissionDetail, type QuizQuestion } from "@/lib/api";
import { renderMarkdown, extractExamples } from "@/lib/markdown";
import SlideViewer from "@/components/portal/SlideViewer";
import { courseIcon, hexToRgba } from "@/lib/courseIcons";
import { useAuth } from "@/context/AuthContext";

type Step = "theory" | "slides" | "examples" | "quiz" | "complete";

const STEPS: { id: Step; label: string; icon: typeof BookOpen }[] = [
  { id: "theory", label: "Theory", icon: BookOpen },
  { id: "slides", label: "Slides", icon: Layers },
  { id: "examples", label: "Examples", icon: Lightbulb },
  { id: "quiz", label: "Quiz", icon: FileQuestion },
  { id: "complete", label: "Complete", icon: CheckCircle2 },
];

export default function MissionPlayerPage({ params }: { params: { slug: string; id: string } }) {
  const { refreshUser } = useAuth();
  const missionNumber = parseInt(params.id, 10);
  const [data, setData] = React.useState<MissionDetail | null>(null);
  const [error, setError] = React.useState("");
  const [step, setStep] = React.useState<Step>("theory");
  const [credited, setCredited] = React.useState(false);
  const [completing, setCompleting] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    setData(null);
    setError("");
    setStep("theory");
    setCredited(false);
    api
      .get<MissionDetail>(`/missions?courseSlug=${params.slug}&mission=${missionNumber}`)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load mission"));
  }, [params.slug, missionNumber, refreshKey]);

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

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const isLast = step === "complete";

  const handleNext = () => {
    if (step === "complete") return;
    const next = STEPS[stepIndex + 1].id;
    if (next === "complete") {
      void completeMission();
    }
    setStep(next);
  };

  const examples = extractExamples(module.contentMarkdown);

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

      {/* Step nav */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((s, i) => {
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

      {/* Step body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {step === "theory" && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(module.contentMarkdown) }} />
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

          {step === "quiz" && (
            <QuizStep
              accent={accent}
              moduleId={module.id}
              quiz={quiz}
              onPassed={() => void completeMission()}
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
          onClick={() => stepIndex > 0 && setStep(STEPS[stepIndex - 1].id)}
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
            {step === "quiz" ? "Finish Mission" : `Next: ${STEPS[stepIndex + 1].label}`}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
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
                Continue to Next Mission
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