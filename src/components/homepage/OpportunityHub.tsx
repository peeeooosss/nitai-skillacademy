"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Coins,
  CheckCircle2,
  Laptop,
  Briefcase,
  Handshake,
  Rocket,
  Crown,
} from "lucide-react";
import { OPPORTUNITIES, CREDIT_TASKS } from "@/data/opportunities";
import { Button } from "@/components/ui/button";

export function OpportunityHub() {
  const [done, setDone] = React.useState<Set<string>>(new Set());
  const walletRef = useRef<HTMLDivElement>(null);
  const walletInView = useInView(walletRef, { once: true, margin: "-100px" });

  const totalCredits = React.useMemo(
    () => CREDIT_TASKS.filter((t) => done.has(t.id)).reduce((sum, t) => sum + t.credits, 0),
    [done]
  );

  const toggleTask = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="opportunity-hub" className="section-container border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-heading">
          AI Opportunity Hub & &ldquo;Earn While You Learn&rdquo;
        </h2>
        <p className="mt-4 text-slate-400">
          Five monetisation engines, unlocked as you progress through your pathway.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {OPPORTUNITIES.map((o, index) => (
          <motion.div
            key={o.id}
            className="card-base"
            whileHover={{ y: -4, scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <span className="icon-wrapper">
              <o.icon className="h-5 w-5 text-white" />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-white">
              {o.title}
            </h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-400">{o.description}</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {o.examples.map((e) => (
                <li key={e} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                  {e}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        ref={walletRef}
        className="mx-auto mt-12 max-w-4xl rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-white/5 to-violet-600/10 p-8 backdrop-blur-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: walletInView ? 1 : 0, y: walletInView ? 0 : 30 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20">
              <Coins className="h-6 w-6 text-amber-300" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Nitai Credits
              </h3>
              <p className="text-xs text-slate-400">Earn credits by completing real, verifiable tasks.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-2.5 text-center">
            <p className="text-[10px] uppercase tracking-wide text-amber-300">Demo Wallet</p>
            <p className="font-display text-xl font-extrabold text-white">
              {totalCredits} Credits
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          {CREDIT_TASKS.map((t) => {
            const isDone = done.has(t.id);
            return (
              <motion.button
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-all",
                  isDone
                    ? "border-emerald-400/40 bg-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                layout
              >
                <span className="flex items-center gap-3">
                  <motion.div
                    initial={false}
                    animate={{ scale: isDone ? 1 : 0, rotate: isDone ? 0 : -180 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2
                      className={cn("h-4.5 w-4.5 shrink-0", isDone ? "text-emerald-400" : "text-slate-500")}
                    />
                  </motion.div>
                  <span className={cn(isDone ? "text-slate-300 line-through decoration-slate-500" : "text-slate-200")}>
                    {t.task}
                  </span>
                </span>
                <span className={cn("shrink-0 text-xs font-semibold", isDone ? "text-emerald-300" : "text-amber-300")}>
                  +{t.credits}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}