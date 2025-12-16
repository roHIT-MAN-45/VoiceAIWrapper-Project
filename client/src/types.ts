// organization type
export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
}

// project status type
export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD";

// project type
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate?: string | null;
  createdAt?: string;
  tasks?: Task[];
}

// task status type
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

// task type
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeEmail?: string | null;
  dueDate?: string | null;
  createdAt?: string;
  comments?: TaskComment[];
}

// task comment type
export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
}
