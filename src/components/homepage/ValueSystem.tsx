"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BookOpen, Cpu, Layers, Bot, Settings, FolderKanban, Briefcase, Laptop, Rocket, Network, LineChart, Crown } from "lucide-react";
import { VALUE_LAYERS } from "@/data/values";

export function ValueSystem() {
  return (
    <section id="value-system" className="section-container border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-heading">
          ONE ACADEMY. 12 LAYERS OF VALUE.
        </h2>
        <p className="mt-4 text-slate-400">
          Every course draws from the same 12-layer system — knowledge that compounds into income and impact.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {VALUE_LAYERS.map((v, index) => (
          <motion.div
            key={v.index}
            className="group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]"
            whileHover={{ y: -4, scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <span className="icon-wrapper-sm">
                <v.icon className="h-4.5 w-4.5 text-cyan-300" />
              </span>
              <span className="font-display text-xs font-bold text-slate-500">
                {v.index}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">{v.title}</h3>
            <p className="text-xs leading-relaxed text-slate-400">{v.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}