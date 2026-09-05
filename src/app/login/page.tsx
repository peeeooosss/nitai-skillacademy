import * as React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginClient } from "./login-client";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Portal Login",
  description:
    "Access your NITAI AI Skill Academy portal — Student, Partner, or HQ Command Center.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-950">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}