import type {
  Admin,
  Course,
  CourseInput,
  CourseWithLectures,
  Lecture,
  LectureInput,
  LectureWithCourse,
} from "./types";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000/api";
const TOKEN_KEY = "lms_admin_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// Lets the auth context react when the server rejects a stored token.
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};

async function request<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (auth) {
    const token = tokenStore.get();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check that the API is running and try again.");
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && auth) onUnauthorized?.();
    throw new ApiError(res.status, body?.message ?? `Request failed (${res.status})`, body?.errors ?? {});
  }
  return body?.data as T;
}

const json = (data: unknown) => JSON.stringify(data);

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; admin: Admin }>("/auth/login", {
      method: "POST",
      body: json({ email, password }),
    }),
  me: () => request<Admin>("/auth/me", {}, true),

  // Courses
  getCourses: (search?: string) =>
    request<Course[]>(`/courses${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getCourse: (id: string) => request<CourseWithLectures>(`/courses/${id}`),
  getStats: () => request<{ courses: number; lectures: number }>("/courses/stats", {}, true),
  createCourse: (data: CourseInput) =>
    request<Course>("/courses", { method: "POST", body: json(data) }, true),
  updateCourse: (id: string, data: Partial<CourseInput>) =>
    request<Course>(`/courses/${id}`, { method: "PUT", body: json(data) }, true),
  deleteCourse: (id: string) => request<void>(`/courses/${id}`, { method: "DELETE" }, true),

  // Lectures
  getLecture: (id: string) => request<LectureWithCourse>(`/lectures/${id}`),
  createLecture: (courseId: string, data: LectureInput) =>
    request<Lecture>(`/courses/${courseId}/lectures`, { method: "POST", body: json(data) }, true),
  updateLecture: (id: string, data: Partial<LectureInput>) =>
    request<Lecture>(`/lectures/${id}`, { method: "PUT", body: json(data) }, true),
  deleteLecture: (id: string) => request<void>(`/lectures/${id}`, { method: "DELETE" }, true),
};
