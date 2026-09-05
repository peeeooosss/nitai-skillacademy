"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Award,
  Layers,
  ShieldCheck,
  GraduationCap,
  TrendingUp,
  Briefcase,
  Building2,
  Users,
  Handshake,
  Rocket,
  Globe2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = ["LEARN AI", "EARN WHILE YOU LEARN", "GROW WITH AI", "BUILD WITH AI", "LEAD WITH AI"];

const trust = [
  { label: "WAIO Dual Certification", icon: Award },
  { label: "120+ AI Tools & Agents", icon: Layers },
  { label: "Zero Technical Knowledge Required", icon: ShieldCheck },
  { label: "12X Value System", icon: Sparkles },
];

const GATEWAYS = {
  b2c: {
    id: "learn-earn",
    badge: "B2C · Individual Path",
    title: "LEARN & EARN",
    subtitle: "Master AI for yourself — school, career, freelancing, and side income.",
    audiences: [
      { icon: GraduationCap, label: "Students & Youth" },
      { icon: TrendingUp, label: "Professionals" },
      { icon: Rocket, label: "Entrepreneurs" },
      { icon: Briefcase, label: "Job Seekers" },
    ],
    cta: "Start AI Journey",
    scrollTarget: "ai-advisor",
    accent: "violet-cyan",
  },
  b2b: {
    id: "build-scale",
    badge: "B2B · Organizational Path",
    title: "BUILD & SCALE",
    subtitle: "Deploy AI across your institution, franchise, workforce, and enterprise.",
    audiences: [
      { icon: Building2, label: "Enterprises" },
      { icon: Handshake, label: "Partners & Franchises" },
      { icon: Users, label: "Trainers & Teams" },
      { icon: Globe2, label: "Institutions" },
    ],
    cta: "Explore Partner Ecosystem",
    scrollTarget: "ecosystem",
    accent: "slate-blue",
  },
} as const;

interface SplitHeroProps {
  onOpenLogin: () => void;
}

export function SplitHero({ onOpenLogin }: SplitHeroProps) {
  const reducedMotion = useReducedMotion();
  const heroRef = React.useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const orb1Y = useTransform(scrollY, [0, 500], [0, 100]);
  const orb2Y = useTransform(scrollY, [0, 500], [0, -60]);
  const orb3Y = useTransform(scrollY, [0, 500], [0, 40]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div ref={heroRef} id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="left-[-8rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-violet-700/25 blur-3xl"
          style={{ y: reducedMotion ? 0 : orb1Y }}
          animate={reducedMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="right-[-6rem] top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"
          style={{ y: reducedMotion ? 0 : orb2Y }}
          animate={reducedMotion ? undefined : { scale: [1, 1.03, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
        />
        <motion.div
          className="bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"
          style={{ y: reducedMotion ? 0 : orb3Y }}
          animate={reducedMotion ? undefined : { scale: [1, 1.04, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 4 }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-16 md:pt-24">
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5, delay: 0.1 }}
          >
            <Sparkles className="eyebrow-icon" />
            Teachers&rsquo; Day Special Reveal · India&rsquo;s Leading AI Learning & Earning Platform
          </motion.div>

          <motion.h1
            className="display-heading max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.2 }}
          >
            THE AI ERA IS HERE.
            <br />
            ARE YOU READY?
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5, delay: 0.3 }}
          >
            NITAI AI Skill Academy helps you build practical AI capabilities and discover pathways to apply
            those skills in your career, freelancing, business, and entrepreneurship journey.
          </motion.p>
        </div>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, delay: 0.4 }}
        >
          {pillars.map((p, i) => (
            <span key={p} className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-200 md:text-sm">
                {p}
              </span>
              {i < pillars.length - 1 && <span className="text-violet-500/60">•</span>}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, delay: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Choose your path in under 10 seconds
          </p>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.55 }}
            className="group relative flex flex-col overflow-hidden rounded-4xl border border-violet-500/30 bg-gradient-to-br from-violet-600/20 via-white/[0.04] to-cyan-500/15 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/60 hover:shadow-[0_0_60px_-12px_rgba(124,58,237,0.6)]"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl transition-opacity group-hover:opacity-100" aria-hidden="true" />
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-violet-300">
              <Zap className="h-3 w-3" />
              {GATEWAYS.b2c.badge}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              <span className="text-gradient-violet-cyan">{GATEWAYS.b2c.title}</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              {GATEWAYS.b2c.subtitle}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {GATEWAYS.b2c.audiences.map((a) => (
                <div
                  key={a.label}
                  className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur-md transition-colors hover:border-violet-400/40 hover:bg-white/10"
                >
                  <a.icon className="h-4 w-4 shrink-0 text-cyan-300" />
                  <span className="text-xs font-medium text-slate-200">{a.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => scrollToId(GATEWAYS.b2c.scrollTarget)}
                className="group/btn relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_-8px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.03]"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover/btn:opacity-100" />
                {GATEWAYS.b2c.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.65 }}
            className="group relative flex flex-col overflow-hidden rounded-4xl border border-sky-500/30 bg-gradient-to-br from-slate-800/60 via-slate-900/50 to-sky-500/15 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/60 hover:shadow-[0_0_60px_-12px_rgba(56,189,248,0.5)]"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl transition-opacity group-hover:opacity-100" aria-hidden="true" />
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sky-300">
              <Building2 className="h-3 w-3" />
              {GATEWAYS.b2b.badge}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              {GATEWAYS.b2b.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              {GATEWAYS.b2b.subtitle}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {GATEWAYS.b2b.audiences.map((a) => (
                <div
                  key={a.label}
                  className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur-md transition-colors hover:border-sky-400/40 hover:bg-white/10"
                >
                  <a.icon className="h-4 w-4 shrink-0 text-sky-300" />
                  <span className="text-xs font-medium text-slate-200">{a.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => scrollToId(GATEWAYS.b2b.scrollTarget)}
                className="relative flex items-center gap-2 overflow-hidden rounded-full border border-sky-400/40 bg-sky-500/10 px-7 py-3.5 text-sm font-semibold text-sky-100 backdrop-blur-md transition-all hover:bg-sky-500/20 hover:border-sky-300/60 hover:scale-[1.03]"
              >
                {GATEWAYS.b2b.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, delay: 0.75 }}
        >
          <Button
            variant="ghost"
            onClick={onOpenLogin}
            className="text-slate-300 hover:text-white"
          >
            <Sparkles className="h-4 w-4" />
            Access All Portals
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div
          className="mt-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, delay: 0.85 }}
        >
          {trust.map((t) => (
            <div
              key={t.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center backdrop-blur-md transition-all hover:border-violet-500/30 hover:bg-white/10"
            >
              <t.icon className="h-5 w-5 text-cyan-300" />
              <span className="text-[11px] leading-snug text-slate-300 md:text-xs">{t.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}