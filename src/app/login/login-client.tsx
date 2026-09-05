"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  X,
  LogIn,
  ShieldCheck,
  Mail,
  KeyRound,
  GraduationCap,
  Handshake,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PORTALS, ACCENT_MAP } from "@/data/portals";
import type { PortalId } from "@/types";

const PORTAL_ICONS: Record<PortalId, React.ElementType> = {
  student: GraduationCap,
  partner: Handshake,
  hq: Building2,
};

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPortal = (searchParams.get("portal") as PortalId | null) || null;

  const [stage, setStage] = React.useState<"select" | "form" | "success">(
    initialPortal ? "form" : "select"
  );
  const [selectedPortal, setSelectedPortal] = React.useState<PortalId | null>(initialPortal);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const portal = selectedPortal ? PORTALS.find((p) => p.id === selectedPortal) : null;
  const accent = portal ? ACCENT_MAP[portal.accent] : null;

  const handlePortalSelect = (id: PortalId) => {
    setSelectedPortal(id);
    setStage("form");
    setError("");
    router.replace(`/login?portal=${id}`, { scroll: false });
  };

  const handleBackToSelect = () => {
    setStage("select");
    setSelectedPortal(null);
    setEmail("");
    setPassword("");
    setError("");
    router.replace("/login", { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password to continue.");
      return;
    }
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setStage("success");
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 antialiased flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.15)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      <AnimatePresence mode="wait">
        {stage === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl"
          >
            <motion.div className="text-center mb-10">
              <motion.div
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500 p-1.5"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Sparkles className="h-10 w-10 text-white" />
              </motion.div>
              <h1 className="mt-6 font-display text-3xl font-bold text-white md:text-4xl">
                Choose Your Portal
              </h1>
              <p className="mt-3 text-slate-400">Select where you'd like to sign in</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {PORTALS.map((p, index) => {
                const portalAccent = ACCENT_MAP[p.accent];
                const Icon = PORTAL_ICONS[p.id];
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => handlePortalSelect(p.id)}
                    className="relative flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 text-left group"
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", `bg-${p.accent}-500/20`)}>
                      <Icon className={cn("h-7 w-7", portalAccent.text)} />
                    </div>
                    <div className="text-center w-full">
                      <h3 className="font-display text-lg font-bold text-white">{p.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className={cn("h-5 w-5", portalAccent.text)} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.features.slice(0, 3).map((f) => (
                        <span key={f} className="badge-base text-[9px]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {stage === "form" && portal && (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md"
          >
            <div className="card-base relative">
              <button
                onClick={handleBackToSelect}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Back to portal selection"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-white/10", accent?.text)}>
                  {(() => {
                    const PortalIcon = PORTAL_ICONS[portal.id];
                    return <PortalIcon className="h-5 w-5" />;
                  })()}
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-white">{portal.title}</h2>
                  <p className="text-[11px] text-slate-400">{portal.tagline}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="mb-1.5 block text-xs text-slate-300">
                    Email
                  </Label>
                  <div className="input-wrapper">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-field"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="mb-1.5 block text-xs text-slate-300">
                    Password
                  </Label>
                  <div className="input-wrapper">
                    <KeyRound className="h-4 w-4 text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    className="text-xs text-rose-400 flex items-center gap-1.5"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  className={cn("w-full", accent?.bg)}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In to {portal.title.replace("NITAI AI ", "")}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-xs"
                  onClick={handleBackToSelect}
                  disabled={isLoading}
                >
                  Choose a different portal
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {stage === "success" && portal && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md text-center"
          >
            <div className="card-base">
              <motion.div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              >
                <ShieldCheck className="h-7 w-7 text-emerald-400" />
              </motion.div>

              <motion.h2
                className="mt-4 font-display text-lg font-bold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Access Granted
              </motion.h2>

              <motion.span
                className={cn(
                  "mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium",
                  accent?.border,
                  accent?.text
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {(() => {
                  const PortalIcon = PORTAL_ICONS[portal.id];
                  return <PortalIcon className="h-3.5 w-3.5" />;
                })()}
                {portal.title}
              </motion.span>

              <motion.p
                className="mt-4 text-xs text-slate-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                This is a demo sign-in. Your dashboard includes:
              </motion.p>

              <motion.ul
                className="mt-3 flex flex-col gap-1.5 text-left"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {portal.features.map((f) => (
                  <motion.li
                    key={f}
                    className="flex items-center gap-2 text-xs text-slate-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    {f}
                  </motion.li>
                ))}
              </motion.ul>

              <motion.button
                onClick={() => router.push("/")}
                className="mt-6 w-full rounded-full border border-white/15 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Continue to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}