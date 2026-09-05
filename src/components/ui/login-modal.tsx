"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, ShieldCheck, Mail, KeyRound, GraduationCap, Handshake, Building2, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface LoginModalProps {
  open: boolean;
  selectedPortal: PortalId | null;
  onSelectPortal: (id: PortalId | null) => void;
  onClose: () => void;
}

export function LoginModal({ open, selectedPortal, onSelectPortal, onClose }: LoginModalProps) {
  const [stage, setStage] = React.useState<"select" | "form" | "success">(
    selectedPortal ? "form" : "select"
  );
  const [portalId, setPortalId] = React.useState<PortalId | null>(selectedPortal);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setStage(selectedPortal ? "form" : "select");
      setPortalId(selectedPortal);
      setEmail("");
      setPassword("");
      setError("");
      setIsLoading(false);
    }
  }, [open, selectedPortal]);

  const portal = portalId ? PORTALS.find((p) => p.id === portalId) : null;
  const accent = portal ? ACCENT_MAP[portal.accent] : null;

  const handlePortalSelect = (id: PortalId) => {
    setPortalId(id);
    setStage("form");
    setError("");
    onSelectPortal(id);
  };

  const handleBackToSelect = () => {
    setStage("select");
    setPortalId(null);
    setEmail("");
    setPassword("");
    setError("");
    onSelectPortal(null);
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {stage === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl"
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500 p-1.5">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold text-white">Choose Your Portal</h2>
              <p className="mt-2 text-sm text-slate-400">Select where you'd like to sign in</p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {PORTALS.map((p) => {
                const portalAccent = ACCENT_MAP[p.accent];
                const Icon = PORTAL_ICONS[p.id];
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePortalSelect(p.id)}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-white/25"
                  >
                    <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-white/10", portalAccent.text)}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-white">{p.title}</span>
                      <span className="block text-[11px] text-slate-400">{p.tagline}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
                  </button>
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
            className="relative w-full max-w-md"
          >
            <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-7 shadow-2xl backdrop-blur-xl">
              <button
                onClick={handleBackToSelect}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Back"
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
                  <h3 className="font-display text-base font-bold text-white">{portal.title}</h3>
                  <p className="text-[11px] text-slate-400">{portal.tagline}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Label htmlFor="email" className="flex flex-col gap-1.5 text-xs text-slate-300">
                  Email
                  <span className="input-wrapper">
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
                  </span>
                </Label>
                <Label htmlFor="password" className="flex flex-col gap-1.5 text-xs text-slate-300">
                  Password
                  <span className="input-wrapper">
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
                  </span>
                </Label>

                {error && <p className="text-xs text-rose-400">{error}</p>}

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
            className="relative w-full max-w-md text-center"
          >
            <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-7 shadow-2xl backdrop-blur-xl">
              <button
                onClick={onClose}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                  <ShieldCheck className="h-7 w-7 text-emerald-400" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-white">Access Granted</h3>
                <span className={cn("mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium", accent?.border, accent?.text)}>
                  {(() => {
                    const PortalIcon = PORTAL_ICONS[portal.id];
                    return <PortalIcon className="h-3.5 w-3.5" />;
                  })()}
                  {portal.title}
                </span>
                <p className="mt-4 text-xs text-slate-400">This is a demo sign-in. Your dashboard includes:</p>
                <ul className="mt-3 flex flex-col gap-1.5 text-left">
                  {portal.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={onClose} className="mt-6 w-full rounded-full border border-white/15 py-3 text-sm font-semibold text-white hover:bg-white/5">
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}