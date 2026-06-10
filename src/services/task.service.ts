import { CreateTaskInput, UpdateTaskInput } from "@/lib/validations";
import { Task, TaskFilters } from "@/types";

const BASE_URL = "/api/tasks";

export const taskService = {
  async getAll(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.status && filters.status !== "all") params.set("status", filters.status);
    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  },

  async getById(id: string): Promise<Task> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Task not found");
    return res.json();
  },

  async create(data: CreateTaskInput): Promise<Task> {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create task");
    }
    return res.json();
  },

  async update(id: string, data: UpdateTaskInput): Promise<Task> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update task");
    }
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task");
  },

  async toggleStatus(id: string, currentStatus: string): Promise<Task> {
    return taskService.update(id, {
      status: currentStatus === "pending" ? "completed" : "pending",
    });
  },
};
