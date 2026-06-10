"use client";
import { useState } from "react";
import { CheckCircle2, Circle, Pencil, Trash2, Calendar, AlertCircle } from "lucide-react";
import { Task } from "@/types";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, isOverdue } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TaskFormDialog } from "./task-form-dialog";

interface Props { task: Task }

export function TaskCard({ task }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { toast } = useToast();
  const overdue = task.status === "pending" && isOverdue(task.dueDate);

  const toggleStatus = () => {
    updateTask(
      { id: task.id, data: { status: task.status === "pending" ? "completed" : "pending" } },
      { onError: () => toast({ title: "Failed to update task", variant: "destructive" }) }
    );
  };

  const handleDelete = () => {
    deleteTask(task.id, {
      onSuccess: () => toast({ title: "Task deleted" }),
      onError: () => toast({ title: "Failed to delete task", variant: "destructive" }),
    });
  };

  return (
    <>
      <Card className={`transition-all hover:shadow-md ${task.status === "completed" ? "opacity-75" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <button onClick={toggleStatus} disabled={isUpdating} className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors">
              {task.status === "completed"
                ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                : <Circle className="h-5 w-5" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-medium truncate ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditOpen(true)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <div className={`flex items-center gap-1 text-xs ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
                  {overdue ? <AlertCircle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                  <span>{formatDate(task.dueDate)}</span>
                </div>
                <Badge variant={task.status === "completed" ? "success" : overdue ? "destructive" : "warning"}>
                  {task.status === "completed" ? "Completed" : overdue ? "Overdue" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <TaskFormDialog open={editOpen} onOpenChange={setEditOpen} task={task} />
    </>
  );
}
