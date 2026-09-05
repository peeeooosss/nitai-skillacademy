"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  HelpCircle,
  BookOpen,
  Briefcase,
  Laptop,
  Rocket,
  Settings,
  Crown,
  School,
  GraduationCap,
  Users,
  Camera,
  Stethoscope,
  Scale,
  Sprout,
  Timer,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PERSONAS,
  PERSONA_PROFILES,
  GOALS,
  GOAL_PROFILES,
  COURSES,
} from "@/data";
import type { CourseId, CourseCategory } from "@/types";

interface AIAdvisorProps {
  onLaunchPathway: (courseId: CourseId, category: CourseCategory) => void;
}

interface AIAdvisorResult {
  course: typeof COURSES[0];
  phaseLabel: string;
  focus: string;
  weeks: number;
  track: string;
}

export function AIAdvisor({ onLaunchPathway }: AIAdvisorProps) {
  const [persona, setPersona] = React.useState<string | null>(null);
  const [goal, setGoal] = React.useState<string | null>(null);

  const result = useMemo((): AIAdvisorResult | null => {
    if (!persona || !goal) return null;
    const p = PERSONA_PROFILES[persona];
    const g = GOAL_PROFILES[goal];
    const course = COURSES.find((c) => c.id === p.courseId)!;
    const weeks = p.baseWeeks + g.addWeeks;
    return { course, phaseLabel: g.phaseLabel, focus: g.focus, weeks, track: p.track };
  }, [persona, goal]);

  return (
    <section id="ai-advisor" className="section-container border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-heading">
          Don&rsquo;t Know Where to Start? Let Your AI Learning Advisor Guide You.
        </h2>
        <p className="mt-5 flex items-start justify-center gap-2 text-base italic text-slate-400">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
          &ldquo;You don&rsquo;t need to know everything about AI today. You only need to know where to begin.&rdquo;
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-5xl">
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-400">
          Step 1 · Who are you?
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {PERSONAS.map((p) => {
            const active = persona === p.id;
            return (
              <motion.button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center backdrop-blur-md transition-all",
                  active
                    ? "border-violet-400/70 bg-violet-500/15 shadow-[0_0_25px_-8px_rgba(124,58,237,0.8)]"
                    : "border-white/10 bg-white/5 hover:border-violet-400/40 hover:bg-white/[0.08]"
                )}
                whileHover={active ? undefined : { scale: 1.02 }}
                whileTap={active ? undefined : { scale: 0.98 }}
              >
                <p.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    active ? "text-violet-300" : "text-slate-300"
                  )}
                />
                <span className="text-xs font-medium text-slate-200">{p.label}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {persona && (
            <motion.div
              key="goal-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-10"
            >
              <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-400">
                Step 2 · What is your AI goal?
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {GOALS.map((g) => {
                  const active = goal === g.id;
                  return (
                    <motion.button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center backdrop-blur-md transition-all",
                        active
                          ? "border-cyan-400/70 bg-cyan-500/15 shadow-[0_0_25px_-8px_rgba(6,182,212,0.8)]"
                          : "border-white/10 bg-white/5 hover:border-cyan-400/40 hover:bg-white/[0.08]"
                      )}
                      whileHover={active ? undefined : { scale: 1.02 }}
                      whileTap={active ? undefined : { scale: 0.98 }}
                    >
                      <g.icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          active ? "text-cyan-300" : "text-slate-300"
                        )}
                      />
                      <span className="text-xs font-medium text-slate-200">{g.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/15 via-white/5 to-cyan-500/10 p-8 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                    Your Recommended Pathway
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold text-white">
                    {result.track}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-slate-300">
                    Currently in the <span className="text-cyan-300">{result.phaseLabel}</span>, focused on{" "}
                    {result.focus}.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Timer className="h-4 w-4 text-violet-300" />
                      Estimated Duration: <strong className="text-white">{result.weeks} Weeks</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-cyan-300" />
                      Suggested Course: <strong className="text-white">{result.course.title}</strong>
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => onLaunchPathway(result.course.id, result.course.category)}
                  className="flex shrink-0 items-center justify-center gap-2"
                >
                  Launch This Pathway
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <button
                onClick={() => {
                  setPersona(null);
                  setGoal(null);
                }}
                className="mt-6 text-xs text-slate-400 underline decoration-dotted underline-offset-4 hover:text-slate-200"
              >
                Start over with a different selection
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}