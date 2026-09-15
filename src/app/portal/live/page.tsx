"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Video, Signal, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { api, type LiveSession } from "@/lib/api";
import { courseIcon, hexToRgba } from "@/lib/courseIcons";

const PLATFORM_META: Record<string, { label: string; color: string }> = {
  ZOOM: { label: "Zoom", color: "#2D8CFF" },
  MEET: { label: "Google Meet", color: "#0F9D58" },
  TEAMS: { label: "Microsoft Teams", color: "#5B5FC7" },
  OTHER: { label: "External link", color: "#94a3b8" },
};

function SessionCard({
  session,
  index,
  accent = "#a78bfa",
}: {
  session: LiveSession;
  index: number;
  accent?: string;
}) {
  const meta = PLATFORM_META[session.platform] ?? PLATFORM_META.OTHER;
  const when = new Date(session.scheduledAt);
  const Icon = courseIcon(session.course.icon || "");

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: hexToRgba(session.course.accentColor || accent, 0.15) }}
        >
          <Icon className="h-5 w-5" style={{ color: session.course.accentColor || accent }} />
        </span>
        <span
          className="rounded-full border px-2.5 py-1 text-[10px] font-semibold"
          style={{ borderColor: `${meta.color}55`, background: `${meta.color}1a`, color: meta.color }}
        >
          {meta.label}
        </span>
      </div>

      <div className="mt-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {session.course.shortTitle || session.course.title}
          {session.missionNumber ? ` · Mission ${session.missionNumber}` : ""}
        </div>
        <h3 className="mt-1 font-display text-base font-bold leading-snug text-white">{session.title}</h3>
        {session.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">{session.description}</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
        <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 font-semibold">
          <Calendar className="h-3 w-3 text-violet-300" />
          {when.toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
        <span className="rounded-full bg-white/5 px-3 py-1 font-semibold">{session.durationMins} min</span>
      </div>

      <div className="mt-5 flex flex-1 items-end gap-2">
        <a
          href={session.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_-8px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.02]"
        >
          Join Live
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        {session.missionNumber && (
          <Link
            href={`/portal/courses/${session.course.slug}/mission/${session.missionNumber}`}
            className="rounded-xl border border-white/10 px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            View Mission
          </Link>
        )}
      </div>
    </motion.article>
  );
}

export default function PortalLivePage() {
  const [data, setData] = React.useState<{ upcoming: LiveSession[]; past: LiveSession[] } | null>(null);
  const [error, setError] = React.useState("");
  const [retryKey, setRetryKey] = React.useState(0);

  React.useEffect(() => {
    api
      .get<{ upcoming: LiveSession[]; past: LiveSession[] }>("/live-sessions")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load live sessions"));
  }, [retryKey]);

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <p className="text-sm text-rose-300">{error}</p>
        <button onClick={() => setRetryKey((k) => k + 1)} className="mt-4 text-xs text-slate-400 hover:text-white">
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  const upcoming = data.upcoming ?? [];
  const past = data.past ?? [];

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
          <Video className="h-3.5 w-3.5" />
          Live Classes
        </div>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">Live Video Sessions</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Join your instructors live on Zoom, Google Meet, Teams or any link your academy shares — only for courses
          you&apos;ve enrolled in. Sessions that belong to a mission also appear inside that mission.
        </p>
      </motion.div>

      {upcoming.length > 0 ? (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-white">
            <Signal className="h-4 w-4 text-emerald-400" />
            Upcoming
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((s, i) => (
              <SessionCard key={s.id} session={s} index={i} />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
            <Calendar className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-white">No upcoming sessions yet</h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-400">
            Your academy shares live links from the admin panel. When they post one for an enrolled course, it will
            appear here and inside the relevant mission.
          </p>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-white">
            <CheckCircle2 className="h-4 w-4 text-slate-400" />
            Past Sessions
          </h2>
          <div className="grid grid-cols-1 gap-4 opacity-70 md:grid-cols-2 lg:grid-cols-3">
            {past.map((s, i) => (
              <SessionCard key={s.id} session={s} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}