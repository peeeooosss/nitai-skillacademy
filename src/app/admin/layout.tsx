"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldCheck, ShieldAlert, Home, Sparkles, LayoutDashboard, BookOpen, Users, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthCard } from "@/components/portal/AuthCard";

const ADMIN_NAV = [
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/live-sessions", label: "Live Sessions", icon: Video },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7 backdrop-blur-xl">
            <AuthCard
              onSuccess={() => {
                refreshUser();
                router.push("/admin");
              }}
            />
            <Link href="/" className="mt-5 flex items-center justify-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-slate-300">
              <Home className="h-3 w-3" />
              Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10">
            <ShieldAlert className="h-6 w-6 text-rose-400" />
          </div>
          <h1 className="mt-4 font-display text-lg font-bold text-white">Admin access required</h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Your account <span className="text-slate-200">{user.email}</span> is not registered as an admin. Ask your
            academy admin to add your email to the admin list.
          </p>
          <Link
            href="/portal"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <ShieldCheck className="h-4 w-4" />
            Go to Student Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 antialiased">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(124,58,237,0.12) 0%, transparent 55%), radial-gradient(ellipse at bottom right, rgba(6,182,212,0.08) 0%, transparent 50%)",
        }}
      />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500 shadow-[0_0_20px_-4px_rgba(124,58,237,0.8)]">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-sm font-bold tracking-tight text-white">NITAI Admin</span>
              <span className="mt-0.5 text-[10px] text-slate-400">Portal management</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1.5 sm:flex">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-300" />
              <span className="text-xs font-semibold text-violet-200">{user.name}</span>
            </span>
            <Link
              href="/portal"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Home className="h-3.5 w-3.5" />
              Portal
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex w-full max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6">
          <Link
            href="/admin"
            className={`flex shrink-0 items-center gap-1.5 rounded-t-lg border-b-2 px-3 py-2 text-xs font-semibold transition-colors ${
              pathname === "/admin"
                ? "border-violet-400 text-violet-200"
                : "border-transparent text-slate-500 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Overview
          </Link>
          {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-1.5 rounded-t-lg border-b-2 px-3 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? "border-violet-400 text-violet-200"
                    : "border-transparent text-slate-500 hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}