"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  GraduationCap,
  Handshake,
  Building2,
  Check,
} from "lucide-react";
import { PORTALS, ACCENT_MAP } from "@/data/portals";
import { Button } from "@/components/ui/button";
import type { PortalId } from "@/types";

interface EcosystemShowcaseProps {
  onEnterPortal: (id: PortalId) => void;
}

export function EcosystemShowcase({ onEnterPortal }: EcosystemShowcaseProps) {
  return (
    <section id="ecosystem" className="section-container border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-heading">
          One Ecosystem. Three Command Centers.
        </h2>
        <p className="mt-4 text-slate-400">
          Every learner, partner, and administrator has a dedicated, secure portal.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PORTALS.map((portal, index) => {
          const accent = ACCENT_MAP[portal.accent];
          return (
            <motion.div
              key={portal.id}
              className={cn(
                "portal-card",
                accent.border,
                "hover:shadow-[0_0_40px_-10px_rgba(124,58,237,0.3)]"
              )}
              whileHover={{ y: -6, scale: 1.01 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <portal.icon className={cn("h-6 w-6", accent.text)} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-white">
                {portal.title}
              </h3>
              <p className="mt-1 text-xs text-slate-400">{portal.tagline}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2">
                {portal.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", accent.text)} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => onEnterPortal(portal.id)}
                className={cn("mt-6 w-full", accent.bg)}
              >
                Enter Portal
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}