"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, LogIn, UserPlus, Mail, KeyRound, User as UserIcon, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

interface AuthCardProps {
  onSuccess?: () => void;
  className?: string;
}

export function AuthCard({ onSuccess, className }: AuthCardProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password to continue.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      if (mode === "register") {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      setSuccess(true);
      if (onSuccess) setTimeout(onSuccess, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-center", className)}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <ShieldCheck className="h-7 w-7 text-emerald-400" />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-white">Welcome to your Portal</h3>
        <p className="mt-2 text-xs text-slate-400">
          {mode === "register" ? "Your account is ready — taking you to your dashboard." : "Sign-in successful — taking you to your dashboard."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_20px_-6px_rgba(124,58,237,0.8)]">
          <Sparkles className="h-5 w-5 text-white" />
        </span>
        <div>
          <h3 className="font-display text-base font-bold text-white">
            NITAI AI Student Portal
          </h3>
          <p className="text-[11px] text-slate-400">
            {mode === "login" ? "Sign in to continue learning" : "Create your account to start learning"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => switchMode("login")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all",
            mode === "login" ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow" : "text-slate-400 hover:text-white"
          )}
        >
          <LogIn className="h-3.5 w-3.5" />
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchMode("register")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all",
            mode === "register" ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow" : "text-slate-400 hover:text-white"
          )}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        {mode === "register" && (
          <div>
            <Label htmlFor="auth-name" className="mb-1.5 block text-xs text-slate-300">
              Full Name
            </Label>
            <div className="input-wrapper">
              <UserIcon className="h-4 w-4 text-slate-500" />
              <Input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="input-field"
                autoComplete="name"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="auth-email" className="mb-1.5 block text-xs text-slate-300">
            Email
          </Label>
          <div className="input-wrapper">
            <Mail className="h-4 w-4 text-slate-500" />
            <Input
              id="auth-email"
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
          <Label htmlFor="auth-password" className="mb-1.5 block text-xs text-slate-300">
            Password
          </Label>
          <div className="input-wrapper">
            <KeyRound className="h-4 w-4 text-slate-500" />
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              disabled={isLoading}
            />
          </div>
        </div>

        {error && <p className="text-xs text-rose-400">{error}</p>}

        <Button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-[0_0_25px_-8px_rgba(124,58,237,0.9)] hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : mode === "login" ? (
            <LogIn className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {mode === "login" ? "Sign In & Continue" : "Create Account & Start"}
        </Button>

        {mode === "login" && (
          <p className="pt-1 text-center text-[11px] text-slate-500">
            New to NITAI AI Skill Academy?{" "}
            <button type="button" onClick={() => switchMode("register")} className="font-semibold text-cyan-300 hover:text-cyan-200">
              Create a free account
            </button>
          </p>
        )}
      </form>
    </div>
  );
}