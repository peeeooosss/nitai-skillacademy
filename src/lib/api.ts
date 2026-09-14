"use client";

const API_BASE = "/api";

// ── Shared API response types ──────────────────────────────────────────────

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  avatar?: string;
  credits: number;
  totalEarned?: number;
  createdAt?: string;
}

export interface CourseMeta {
  id: string;
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  trackName: string;
  audience: string;
  category: string;
  outcomes: string[];
  duration: string;
  icon: string;
  accentColor: string;
  moduleCount: number;
  totalXp: number;
  position: number;
}

export interface EnrolledCourse extends CourseMeta {
  enrolled: boolean;
  progress: {
    completedMissions: number;
    totalMissions: number;
    percent: number;
  };
}

export interface MissionItem {
  id: number;
  missionNumber: number;
  title: string;
  description: string;
  sessionType: string;
  creditsReward: number;
  videoWatched: boolean;
  quizPassed: boolean;
  assignmentSubmitted: boolean;
  completed: boolean;
  unlocked: boolean;
}

export interface CourseDetail {
  course: CourseMeta;
  enrolled: boolean;
  progress: {
    completedMissions: number;
    totalMissions: number;
    percent: number;
  };
  currentMission: { missionNumber: number; title: string } | null;
  missions: MissionItem[];
}

export interface MissionDetail {
  course: {
    id: string;
    slug: string;
    title: string;
    shortTitle: string;
    icon: string;
    accentColor: string;
  };
  module: {
    id: number;
    dayNumber: number;
    missionNumber: number;
    sessionType: string;
    title: string;
    description: string;
    contentMarkdown: string;
    videoUrl: string | null;
    creditsReward: number;
  };
  quiz: {
    id: string;
    questions: QuizQuestion[];
    passScore: number;
    timeLimit: number;
  } | null;
  assignment: {
    id: string;
    prompt: string;
    type: string;
    maxCredits: number;
  } | null;
  progress: {
    videoWatched: boolean;
    quizPassed: boolean;
    assignmentSubmitted: boolean;
    completed: boolean;
  };
  gating: {
    unlocked: boolean;
    firstMission: boolean;
    previousMissionNumber: number | null;
    previousMissionTitle: string | null;
    previousCompleted: boolean;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DashboardData {
  stats: {
    totalCredits: number;
    currentStreak: number;
    completedMissions: number;
    totalHours: number;
    enrolledCourses: number;
  };
  enrolledCourses: Array<{
    courseId: string;
    slug: string;
    title: string;
    shortTitle: string;
    trackName: string;
    icon: string;
    accentColor: string;
    moduleCount: number;
    progress: { completedMissions: number; totalMissions: number; percent: number };
    currentMission: { missionNumber: number; title: string } | null;
    startedAt: string;
  }>;
  nextMission: {
    courseSlug: string;
    courseTitle: string;
    missionNumber: number;
    missionTitle: string;
    isFirst: boolean;
    previousCompleted: boolean;
  } | null;
  recentActivity: Array<{
    moduleId: number;
    missionNumber: number;
    title: string;
    courseTitle: string | null;
    courseSlug: string | null;
    completedAt: string | null;
  }>;
}

// ── API client ─────────────────────────────────────────────────────────────

export const TOKEN_KEY = "nitai_token";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError((data as { error?: string }).error || `Request failed (${response.status})`, response.status);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(path: string) => request<T>("GET", path),
  post: <T = unknown>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T = unknown>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T = unknown>(path: string) => request<T>("DELETE", path),
};