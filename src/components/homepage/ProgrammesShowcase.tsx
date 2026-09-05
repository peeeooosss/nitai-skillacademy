"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Award, BadgeCheck, GraduationCap, Landmark, Building2 } from "lucide-react";
import { PROGRAMMES } from "@/data/programmes";

export function ProgrammesShowcase() {
  return (
    <section id="programmes" className="section-container border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-heading">
          Academic & Advanced Education Programmes
        </h2>
        <p className="mt-4 text-slate-400">
          Institutional WAIO credentialing with UK Pathway & credit-transfer alignment, from your first
          certificate to a research doctorate.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PROGRAMMES.map((p, index) => (
          <motion.div
            key={p.id}
            className="card-base hover:border-amber-400/50 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]"
            whileHover={{ y: -4, scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/25 to-violet-600/25">
              <p.icon className="h-5 w-5 text-amber-300" />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-white">
              {p.title}
            </h3>
            <span className="mt-1 text-xs font-medium text-cyan-300">{p.duration}</span>
            <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-400">{p.description}</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}