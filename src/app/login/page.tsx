import type { Metadata } from "next";
import { LoginClient } from "./login-client";

export const metadata: Metadata = {
  title: "Student Portal Login",
  description:
    "Sign in to your NITAI AI Skill Academy student portal. New here? Create a free account and start earning credits mission by mission.",
};

export default function LoginPage() {
  return <LoginClient />;
}