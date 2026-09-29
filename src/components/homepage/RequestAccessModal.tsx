"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Send, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { api, type CourseRequestStatus } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface RequestAccessModalProps {
  slug: string;
  courseId: string;
  courseTitle: string;
  open: boolean;
  onClose: (requested?: CourseRequestStatus) => void;
}

export function RequestAccessModal({ slug, courseId, courseTitle, open, onClose }: RequestAccessModalProps) {
  const { user } = useAuth();
  const [mobile, setMobile] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState<CourseRequestStatus | null>(null);

  React.useEffect(() => {
    if (open && user) {
      setMobile("");
      setEmail(user.email || "");
      setMessage("");
      setStatus(null);
      setError("");
    }
  }, [open, user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post<{ id: string; status: CourseRequestStatus }>("/course-requests", {
        courseId,
        mobile,
        email,
        message: message || undefined,
      });
      setStatus(res.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => onClose(status ?? undefined)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-7 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onClose(status ?? undefined)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {status === "PENDING" || status === "WAITLISTED" ? (
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15">
                  <Clock className="h-7 w-7 text-amber-300" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">Request submitted</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Our academy team has received your request for <span className="text-white">{courseTitle}</span>.
                  They will contact you at <span className="text-slate-200">{email || "your email/mobile"}</span> to
                  confirm enrolment. Once approved, the course unlocks automatically in your dashboard.
                </p>
                <button
                  onClick={() => onClose(status)}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                >
                  Got it
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
                  <Send className="h-3.5 w-3.5" />
                  Request Access
                </div>
                <h3 className="mt-1 font-display text-lg font-bold text-white">{courseTitle}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  This course is instructor-curated. Share your contact details and our team will call you to
                  confirm your enrolment.
                </p>

                <form onSubmit={submit} className="mt-5 space-y-3">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Mobile number *
                    </span>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-violet-400/50"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Email *
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-violet-400/50"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      What are you hoping to achieve? (optional)
                    </span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="e.g. Final-year student preparing for AI placements..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-violet-400/50"
                    />
                  </label>

                  {error && (
                    <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-300">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_-8px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.02] disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {submitting ? "Submitting..." : "Submit Access Request"}
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-500">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400/70" />
                    Free to request · No obligation · Takes &lt; 1 minute
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type { CourseRequestStatus };