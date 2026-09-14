"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  BookOpen,
  Award,
  LogOut,
  ExternalLink,
  Loader2,
  Menu,
  X,
  ChevronRight,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { AuthCard } from "./AuthCard";

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/courses", label: "Courses", icon: BookOpen },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, refreshUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setSigningOut(true);
    logout();
    router.push("/");
  };

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
                router.push("/portal");
              }}
            />
            <Link
              href="/"
              className="mt-5 flex items-center justify-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Home className="h-3 w-3" />
              Back to site
            </Link>
          </div>
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
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Back to NITAI AI Academy">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500 shadow-[0_0_20px_-4px_rgba(124,58,237,0.8)]">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <span className="hidden flex-col leading-none sm:flex">
                <span className="font-display text-sm font-bold tracking-tight text-white">NITAI AI Portal</span>
                <span className="mt-0.5 text-[10px] text-slate-400">Learn · Earn · Lead</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Portal navigation">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 sm:flex">
              <Award className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-xs font-semibold text-amber-200">{user.credits} Credits</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 text-[11px] font-bold text-white uppercase">
                {(user.name || "U").slice(0, 2)}
              </span>
              <span className="hidden text-xs font-medium text-slate-200 sm:block">{user.name}</span>
              <button
                onClick={handleLogout}
                disabled={signingOut}
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-rose-300 disabled:opacity-50"
                aria-label="Sign out"
                title="Sign out"
              >
                {signingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
              </button>
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle portal menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile portal navigation">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                      active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5">
                <ExternalLink className="h-4 w-4" />
                Back to Website
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>

      <footer className="relative z-10 border-t border-white/5 py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} NITAI AI Skill Academy · All rights reserved</p>
          <Link href="/" className="flex items-center gap-1 transition-colors hover:text-slate-300">
            Back to main site <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </footer>
    </div>
  );
}