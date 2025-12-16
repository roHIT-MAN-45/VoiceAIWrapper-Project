// =====================
// Organization
// =====================
export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
}

// =====================
// Project
// =====================
export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate?: string | null;
  createdAt?: string;
}

// =====================
// Task
// =====================
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeEmail?: string | null;
  dueDate?: string | null;
  createdAt?: string;
}

// =====================
// Task Comment
// =====================
export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
}
