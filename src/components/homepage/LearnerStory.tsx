"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  HelpCircle,
  BookOpen,
  Cpu,
  Target,
  Gem,
  Compass,
  TrendingUp,
  Crown,
} from "lucide-react";
import { STAGES } from "@/data/stages";

export function LearnerStory() {
  const [active, setActive] = React.useState(0);

  return (
    <section id="journey" className="section-container border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-heading">
          From Consumer to AI Leader: The 8-Stage Progression
        </h2>
        <p className="mt-4 text-slate-400">
          Tap any stage to see what it feels like, and what comes next.
        </p>
      </div>

      <div className="mt-12 flex gap-3 overflow-x-auto pb-4 md:justify-between">
        {STAGES.map((stage, i) => {
          const isActive = i === active;
          const isCompleted = i < active;
          return (
            <motion.button
              key={stage.title}
              onClick={() => setActive(i)}
              className="timeline-step group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                  isActive
                    ? "border-transparent bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-[0_0_25px_-6px_rgba(124,58,237,0.9)]"
                    : isCompleted
                    ? "border-violet-400/60 bg-violet-500/10 text-violet-300"
                    : "border-white/15 bg-white/5 text-slate-400 group-hover:border-white/30"
                )}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {i + 1}
              </motion.span>
              <motion.span
                className={cn(
                  "text-center text-[11px] leading-tight transition-colors",
                  isActive ? "font-semibold text-white" : "text-slate-400"
                )}
                animate={{ opacity: isActive ? 1 : 0.7 }}
              >
                {stage.title}
              </motion.span>
              {i < STAGES.length - 1 && (
                <span className="hidden h-px w-full bg-white/10 md:block" aria-hidden="true" />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mt-8 flex max-w-2xl items-start gap-5 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-cyan-500/30">
            {React.createElement(STAGES[active].icon, { className: "h-6 w-6 text-white" })}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
              Stage {active + 1} of {STAGES.length}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-white">
              {STAGES[active].title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{STAGES[active].description}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}