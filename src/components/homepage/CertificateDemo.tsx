"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Award,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  Link2,
  FileBadge,
} from "lucide-react";

const DEMO_STATS = [
  { label: "Missions", value: "10", color: "#fbbf24" },
  { label: "XP Earned", value: "500", color: "#34d399" },
  { label: "Quiz Avg.", value: "92%", color: "#22d3ee" },
  { label: "Weeks", value: "10", color: "#a78bfa" },
];

const VERIFY_ID = "NITAI-2026-7K3QXP";

export function CertificateDemo() {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <section id="certificate-demo" className="section-container border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow">
          <Award className="eyebrow-icon" />
          Verifiable Credentials
        </span>
        <h2 className="section-heading">
          Earn a Certificate Worth Showing Off
        </h2>
        <p className="mt-4 text-slate-400">
          Complete a course and unlock a shareable, instantly verifiable certificate —
          download it as PDF, add it to LinkedIn, or send the QR link to any employer.
        </p>
      </div>

      <div className="relative mx-auto mt-14 max-w-3xl">
        {/* Glow behind the certificate */}
        <div
          className="pointer-events-none absolute -inset-8 rounded-[3rem] opacity-40 blur-3xl"
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.35), transparent 65%)" }}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 6 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Demo wallet chip */}
          <button
            onClick={() => setRevealed((v) => !v)}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-400/15"
          >
            <Award className="h-3.5 w-3.5" />
            {revealed ? "Certificate unlocked — tap to hide" : "Tap to see how it's earned"}
          </button>

          {/* Certificate mockup */}
          <motion.div
            className="card-base p-0 backdrop-blur-xl"
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <div
              className="h-2 w-full rounded-t-3xl"
              style={{ background: "linear-gradient(90deg, #a78bfa, #22d3ee, #fbbf24)" }}
            />
            <div className="p-7 sm:p-12">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_30px_-8px_rgba(124,58,237,0.8)]">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Nitai Skill Academy
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                  Certificate of Completion
                </h3>

                <p className="mt-6 text-sm text-slate-500">This certifies that</p>
                <p className="font-display text-4xl font-extrabold text-white">
                  Priya <span className="italic" style={{ color: "#a78bfa" }}>Sharma</span>
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  has successfully completed
                </p>
                <p className="mx-auto mt-1 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white">
                  AI for College Students (UG &amp; PG)
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-500">
                  Campus-to-Career AI Track
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {DEMO_STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center"
                  >
                    <div className="font-display text-2xl font-extrabold" style={{ color: s.color }}>
                      {s.value}
                    </div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex h-full w-full items-center justify-center rounded-lg bg-white"
                    >
                      <QrCode className="h-full w-full p-1 text-slate-900" />
                    </motion.div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Verify online
                    </p>
                    <p className="font-mono text-sm text-white">{VERIFY_ID}</p>
                    <p className="text-[10px] text-slate-500">
                      nitai-skillacademy.netlify.app/verify
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300">
                    <Download className="h-4 w-4 text-cyan-300" />
                    PDF
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300">
                    <Share2 className="h-4 w-4 text-sky-300" />
                    LinkedIn
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300">
                    <BadgeCheck className="h-4 w-4 text-violet-300" />
                    Badge
                  </span>
                </div>
              </div>

              {/* Decorative signatures */}
              <div className="mt-8 flex items-end justify-between gap-6">
                <div className="text-center">
                  <div className="font-serif text-lg italic text-slate-400/60">M. Patel</div>
                  <div className="mt-0.5 border-t border-white/15 pt-1 text-[9px] uppercase tracking-widest text-slate-600">
                    Director, Nitai
                  </div>
                </div>
                <div className="text-center">
                  <div className="rounded-full border-2 border-white/15 p-1.5">
                    <ShieldCheck className="h-5 w-5 text-emerald-400/70" />
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-widest text-slate-600">
                    Tamper-proof
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-serif text-lg italic text-slate-400/60">A. Rao</div>
                  <div className="mt-0.5 border-t border-white/15 pt-1 text-[9px] uppercase tracking-widest text-slate-600">
                    Head of Learning
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* How it's earned steps */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {[
            { icon: CheckCircle2, text: "Complete every mission" },
            { icon: FileBadge, text: "Pass the graded quiz" },
            { icon: Award, text: "Certificate auto-issued" },
            { icon: Link2, text: "Share anywhere" },
          ].map((step, i) => (
            <React.Fragment key={step.text}>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-slate-300"
              >
                <step.icon className="h-3.5 w-3.5 text-emerald-400" />
                {step.text}
              </motion.span>
              {i < 3 && <span className="hidden text-slate-600 sm:inline">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}