"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Menu,
  X,
  LogIn,
  Zap,
  ChevronRight,
  ArrowRight,
  Award,
  LayoutDashboard,
} from "lucide-react";
import { NAV_LINKS } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAuth } from "@/context/AuthContext";

interface GlobalHeaderProps {
  onOpenLogin: () => void;
  onStartJourney: () => void;
}

export function GlobalHeader({ onOpenLogin, onStartJourney }: GlobalHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const { user } = useAuth();
  const router = useRouter();

  const handleJourney = () => {
    setMobileOpen(false);
    if (user) {
      router.push("/portal/courses");
    } else {
      onOpenLogin();
    }
  };

  const { scrollY } = useScroll();
  const navBgOpacity = useTransform(scrollY, [0, 100], [0.7, 0.95]);
  const navBlur = useTransform(scrollY, [0, 100], [24, 40]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10",
        "bg-slate-950/70 backdrop-blur-xl",
        scrolled && "bg-slate-950/90 backdrop-blur-2xl border-white/15"
      )}
      style={{
        backgroundColor: reducedMotion ? undefined : `rgba(15, 23, 42, ${navBgOpacity.get()})`,
        backdropFilter: reducedMotion ? undefined : `blur(${navBlur.get()}px)`,
      }}
      initial={false}
      animate={{ opacity: 1 }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNav("hero");
          }}
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-md"
          aria-label="NITAI AI Academy Home"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500 shadow-[0_0_20px_-4px_rgba(124,58,237,0.8)]">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </span>
          <span className="flex flex-col leading-none text-left">
            <span className="font-display text-sm font-bold tracking-tight text-white">
              NITAI AI Academy
            </span>
            <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-300">
              Powered by WAIO
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className="text-sm text-slate-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-sm"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <div className="flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5">
                <Award className="h-3.5 w-3.5 text-amber-300" />
                <span className="text-xs font-semibold text-amber-200">{user.credits} Credits</span>
              </div>
              <Button
                variant="glass"
                size="sm"
                onClick={() => router.push("/portal")}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                My Portal
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" size="sm">
                  <LogIn className="h-3.5 w-3.5" />
                  Portal Login
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={onOpenLogin} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                    <Sparkles className="h-4 w-4 text-violet-300" />
                  </span>
                  <span>Student Portal</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            onClick={handleJourney}
            className="group relative flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_25px_-6px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <span className="absolute inset-0 animate-pulse bg-white/10" />
            <Zap className="h-3.5 w-3.5 relative" />
            <span className="relative">{user ? "Explore Courses" : "Start AI Journey"}</span>
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          className="border-t border-white/10 bg-slate-950/95 px-6 py-5 lg:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-white/10 pt-4">
            {user ? (
              <>
                <div className="flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
                  <Award className="h-3.5 w-3.5 text-amber-300" />
                  {user.credits} Credits
                </div>
                <Button
                  variant="glass"
                  className="w-full justify-center"
                  onClick={() => { setMobileOpen(false); router.push("/portal"); }}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  My Portal
                </Button>
              </>
            ) : (
              <Button
                variant="glass"
                className="w-full justify-center"
                onClick={() => { setMobileOpen(false); onOpenLogin(); }}
              >
                <LogIn className="h-3.5 w-3.5" />
                Portal Login
              </Button>
            )}
            <Button
              className="w-full justify-center"
              onClick={handleJourney}
            >
              <Zap className="h-3.5 w-3.5" />
              {user ? "Explore Courses" : "Start AI Journey"}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}