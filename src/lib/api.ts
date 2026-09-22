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

export interface ExampleQuizItem {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Submodule {
  index: number;
  title: string;
  unlocked?: boolean;
  completed?: boolean;
}

export interface SubmoduleContent extends Submodule {
  markdown: string;
  exampleQuiz?: ExampleQuizItem[] | null;
}

export type LivePlatform = "ZOOM" | "MEET" | "TEAMS" | "OTHER";

export interface LiveSession {
  id: string;
  title: string;
  description: string | null;
  platform: LivePlatform;
  link: string;
  scheduledAt: string;
  durationMins: number;
  missionNumber: number | null;
  course: {
    slug: string;
    title: string;
    shortTitle: string;
    icon?: string;
    accentColor?: string;
  };
}

export interface AdminLiveSession extends LiveSession {
  courseId: string;
  isActive: boolean;
}

// ── Admin panel types ────────────────────────────────────────────────────────

export interface AdminCourseSummary {
  id: string;
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  tagline: string;
  trackName: string;
  audience: string;
  category: string | null;
  moduleCount: number;
  totalXp: number;
  isActive: boolean;
  position: number;
  missionCount: number;
  submoduleCount: number;
  quizQuestionCount: number;
  enrollmentCount: number;
  startedCount: number;
  completionCount: number;
  completionRate: number;
}

export interface AdminCourseDetail {
  course: {
    id: string;
    slug: string;
    index: string;
    title: string;
    shortTitle: string;
    tagline: string;
    trackName: string;
    audience: string;
    category: string | null;
    moduleCount: number;
    totalXp: number;
    isActive: boolean;
    position: number;
    enrollmentCount: number;
    createdAt: string;
  };
  modules: Array<{
    missionNumber: number | null;
    title: string;
    description: string;
    sessionType: string;
    creditsReward: number;
    submodules: number;
    quizQuestions: number;
    passScore: number | null;
    assignmentMaxCredits: number | null;
    completions: number;
  }>;
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  provider: string;
  createdAt: string;
  credits: { balance: number; totalEarned: number };
  enrolledCourses: number;
  completedMissions: number;
  quizzesPassed: number;
  assignmentsSubmitted: number;
  hasCredits: boolean;
}

export interface AdminUserDetail {
  user: {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "ADMIN";
    provider: string;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
    credits: { balance: number; totalEarned: number };
  };
  enrolledCourses: Array<{
    courseId: string;
    slug: string;
    title: string;
    shortTitle: string;
    icon: string | null;
    accentColor: string | null;
    moduleCount: number;
    startedAt: string;
    completedMissions: number;
    totalMissions: number;
  }>;
  progress: {
    completed: number;
    total: number;
    recent: Array<{
      moduleId: number;
      missionNumber: number | null;
      title: string;
      courseTitle: string | null;
      courseSlug: string | null;
      completed: boolean;
      videoWatched: boolean;
      quizPassed: boolean;
      assignmentSubmitted: boolean;
      completedAt: string | null;
      updatedAt: string;
    }>;
  };
  quizzes: {
    passed: number;
    total: number;
    bestScoreAvg: number;
    recent: Array<{ quizId: string; score: number; passed: boolean; submittedAt: string }>;
  };
  assignments: {
    submitted: number;
    pending: number;
    approved: number;
    recent: Array<{
      assignmentId: string;
      status: string;
      aiScore: number | null;
      submittedAt: string;
      reviewedAt: string | null;
    }>;
  };
  creditTransactions: Array<{
    id: string;
    userId: string;
    type: string;
    amount: number;
    description: string;
    referenceId: string | null;
    createdAt: string;
  }> | null;
}

export interface MissionItem {
  id: number;
  missionNumber: number;
  title: string;
  description: string;
  sessionType: string;
  creditsReward: number;
  submodules: Submodule[];
  submodulesCompleted: number;
  submodulesTotal: number;
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
    submodules: SubmoduleContent[];
    videoUrl: string | null;
    creditsReward: number;
  };
  liveSession: {
    id: string;
    title: string;
    description: string | null;
    platform: LivePlatform;
    link: string;
    scheduledAt: string;
    durationMins: number;
  } | null;
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
    submodulesCompleted?: number;
    submodulesTotal?: number;
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