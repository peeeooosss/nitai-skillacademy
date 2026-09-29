"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/portal/AuthCard";
import { useAuth } from "@/context/AuthContext";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const redirect = searchParams.get("redirect");

  const safeReturn = React.useMemo(() => {
    if (!redirect) return "/portal";
    if (redirect.startsWith("/") && !redirect.startsWith("//")) return redirect;
    return "/portal";
  }, [redirect]);

  React.useEffect(() => {
    if (user) router.replace(safeReturn);
  }, [user, router, safeReturn]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-950 p-4 text-slate-100 antialiased">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.15)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7 backdrop-blur-xl shadow-2xl">
          <AuthCard
            onSuccess={() => {
              setTimeout(() => router.push(safeReturn), 500);
            }}
          />
        </div>
        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-slate-300"
        >
          <Home className="h-3 w-3" />
          Back to site
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export function LoginClient() {
  return (
    <React.Suspense fallback={null}>
      <LoginInner />
    </React.Suspense>
  );
}