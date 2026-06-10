export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  completionPercentage: number;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus | "all";
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: TaskStatus;
}
