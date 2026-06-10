"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { TaskCard } from "./task-card";
import { TaskFormDialog } from "./task-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskStatus } from "@/types";

export function TaskList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const { data: tasks, isLoading, error } = useTasks({ search, status });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus | "all")}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-destructive">Failed to load tasks. Please try again.</div>
      )}

      {!isLoading && tasks && tasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No tasks found</p>
          <p className="text-sm mt-1">
            {search || status !== "all" ? "Try adjusting your filters" : "Create your first task to get started"}
          </p>
        </div>
      )}

      {tasks && (
        <div className="space-y-3">
          {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </div>
      )}

      <TaskFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
