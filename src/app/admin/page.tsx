"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Video,
  Calendar,
  Power,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { api, type AdminLiveSession, type EnrolledCourse, type LivePlatform } from "@/lib/api";

const PLATFORMS: { value: LivePlatform; label: string }[] = [
  { value: "ZOOM", label: "Zoom" },
  { value: "MEET", label: "Google Meet" },
  { value: "TEAMS", label: "Microsoft Teams" },
  { value: "OTHER", label: "Other link" },
];

const PLATFORM_COLOR: Record<string, string> = {
  ZOOM: "#2D8CFF",
  MEET: "#0F9D58",
  TEAMS: "#5B5FC7",
  OTHER: "#94a3b8",
};

interface FormState {
  id?: string;
  title: string;
  description: string;
  platform: LivePlatform;
  link: string;
  scheduledAt: string;
  durationMins: number;
  courseId: string;
  missionNumber: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  platform: "ZOOM",
  link: "",
  scheduledAt: "",
  durationMins: 60,
  courseId: "",
  missionNumber: "",
  isActive: true,
};

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminLiveSessionsPage() {
  const [sessions, setSessions] = React.useState<AdminLiveSession[] | null>(null);
  const [courses, setCourses] = React.useState<EnrolledCourse[]>([]);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [retryKey, setRetryKey] = React.useState(0);

  const load = React.useCallback(() => {
    Promise.all([
      api.get<{ sessions: AdminLiveSession[] }>("/admin/live-sessions"),
      api.get<{ courses: EnrolledCourse[] }>("/courses"),
    ])
      .then(([s, c]) => {
        setSessions(s.sessions);
        setCourses(c.courses);
        setForm((f) => (f.courseId ? f : { ...f, courseId: c.courses[0]?.id ?? "" }));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load live sessions"));
  }, []);

  React.useEffect(load, [load, retryKey]);

  const field = (key: keyof FormState) =>
    (v: string | boolean | number) => setForm((f) => ({ ...f, [key]: v }));

  const startEdit = (s: AdminLiveSession) => {
    setNotice("");
    setForm({
      id: s.id,
      title: s.title,
      description: s.description ?? "",
      platform: s.platform,
      link: s.link,
      scheduledAt: toLocalInput(s.scheduledAt),
      durationMins: s.durationMins,
      courseId: s.courseId,
      missionNumber: s.missionNumber != null ? String(s.missionNumber) : "",
      isActive: s.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setNotice("");
    setForm({ ...EMPTY_FORM, courseId: courses[0]?.id ?? "" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const body = {
        title: form.title,
        description: form.description || undefined,
        platform: form.platform,
        link: form.link,
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
        durationMins: form.durationMins,
        courseId: form.courseId,
        missionNumber: form.missionNumber ? parseInt(form.missionNumber, 10) : undefined,
        isActive: form.isActive,
      };
      if (form.id) {
        await api.put(`/admin/live-sessions?id=${form.id}`, body);
        setNotice("Session updated.");
      } else {
        await api.post("/admin/live-sessions", body);
        setNotice("Session created.");
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: AdminLiveSession) => {
    if (!window.confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    setBusyId(s.id);
    setError("");
    try {
      await api.delete(`/admin/live-sessions?id=${s.id}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete session");
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (s: AdminLiveSession) => {
    setBusyId(s.id);
    setError("");
    try {
      await api.put(`/admin/live-sessions?id=${s.id}`, { isActive: !s.isActive });
      setSessions((prev) =>
        prev ? prev.map((x) => (x.id === s.id ? { ...x, isActive: !s.isActive } : x)) : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update session");
    } finally {
      setBusyId(null);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-violet-400/60 focus:bg-white/[0.07]";
  const labelCls = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400";

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
          <Video className="h-3.5 w-3.5" />
          Live Session Manager
        </div>
        <div className="mt-1 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Live Sessions</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Post Zoom / Google Meet / Teams links. They appear in enrolled students&apos; Live Sessions page and —
              when linked to a mission — as a Live step inside that mission.
            </p>
          </div>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="shrink-0 rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-300">{error}</div>
      )}
      {notice && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          {notice}
        </div>
      )}

      {/* Editor */}
      <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-white">
            <Plus className="h-4 w-4 text-violet-300" />
            {form.id ? "Edit Session" : "New Session"}
          </h2>
          {form.id && (
            <button type="button" onClick={resetForm} className="text-xs text-slate-400 hover:text-white">
              Cancel editing
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className={labelCls}>Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => field("title")(e.target.value)}
              className={inputCls}
              placeholder="e.g. Live Q&A: Mission 3 — AI for Study"
            />
          </div>

          <div>
            <label className={labelCls}>Course</label>
            <select value={form.courseId} onChange={(e) => field("courseId")(e.target.value)} className={inputCls}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Mission (optional)</label>
            <input
              value={form.missionNumber}
              onChange={(e) => field("missionNumber")(e.target.value)}
              className={inputCls}
              placeholder="e.g. 3 — attached to that mission's Live step"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className={labelCls}>Platform</label>
            <select value={form.platform} onChange={(e) => field("platform")(e.target.value)} className={inputCls}>
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Starts at</label>
            <input
              required
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => field("scheduledAt")(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Link</label>
            <input
              required
              value={form.link}
              onChange={(e) => field("link")(e.target.value)}
              className={inputCls}
              placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            />
          </div>

          <div>
            <label className={labelCls}>Duration (minutes)</label>
            <input
              type="number"
              min={5}
              max={600}
              value={form.durationMins}
              onChange={(e) => field("durationMins")(parseInt(e.target.value, 10) || 60)}
              className={inputCls}
            />
          </div>

          <div className="lg:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => field("description")(e.target.value)}
              className={`${inputCls} min-h-[70px] resize-y`}
              placeholder="What students will do in this live session (optional)"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 lg:col-span-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => field("isActive")(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 accent-violet-500"
            />
            <span className="text-xs text-slate-300">Active (visible to students)</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_-8px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {saving ? "Saving..." : form.id ? "Save Changes" : "Create Session"}
        </button>
      </form>

      {/* List */}
      {!sessions ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 text-center">
          <Calendar className="mx-auto h-8 w-8 text-slate-500" />
          <p className="mt-3 text-sm text-slate-400">No sessions yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const color = PLATFORM_COLOR[s.platform] ?? "#94a3b8";
            const when = new Date(s.scheduledAt);
            return (
              <div
                key={s.id}
                className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-5 ${
                  s.isActive ? "border-white/10 bg-white/[0.03]" : "border-white/5 bg-white/[0.01] opacity-60"
                }`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${color}1a` }}
                >
                  <Video className="h-5 w-5" style={{ color }} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                    <span
                      className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                      style={{ borderColor: `${color}55`, color }}
                    >
                      {s.platform}
                    </span>
                    {!s.isActive && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {s.course?.title ?? s.courseId}
                    {s.missionNumber ? ` · Mission ${s.missionNumber}` : ""}
                    {" · "}
                    {when.toLocaleString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {" · "}
                    {s.durationMins} min
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggleActive(s)}
                    disabled={busyId === s.id}
                    className="rounded-lg border border-white/10 p-2 text-slate-300 transition-colors hover:bg-white/5 disabled:opacity-50"
                    aria-label={s.isActive ? "Hide session" : "Show session"}
                    title={s.isActive ? "Hide" : "Show"}
                  >
                    {busyId === s.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Power className={`h-4 w-4 ${s.isActive ? "text-emerald-400" : ""}`} />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(s)}
                    className="rounded-lg border border-white/10 p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                    aria-label="Edit session"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(s)}
                    disabled={busyId === s.id}
                    className="rounded-lg border border-rose-500/20 p-2 text-rose-300 transition-colors hover:bg-rose-500/10 disabled:opacity-50"
                    aria-label="Delete session"
                  >
                    {busyId === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}