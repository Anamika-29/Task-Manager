"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "@/types";
import { createTaskSchema, CreateTaskInput } from "@/lib/validations";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

export function TaskFormDialog({ open, onOpenChange, task }: Props) {
  const isEdit = !!task;
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split("T")[0],
    } : undefined,
  });

  useEffect(() => {
    if (open && task) {
      reset({ title: task.title, description: task.description, dueDate: task.dueDate.split("T")[0] });
    } else if (open && !task) {
      reset({ title: "", description: "", dueDate: "" });
    }
  }, [open, task, reset]);

  const onSubmit = (data: CreateTaskInput) => {
    if (isEdit) {
      updateTask({ id: task.id, data }, {
        onSuccess: () => { toast({ title: "Task updated" }); onOpenChange(false); },
        onError: (err) => toast({ title: "Failed to update", description: err.message, variant: "destructive" }),
      });
    } else {
      createTask(data, {
        onSuccess: () => { toast({ title: "Task created" }); onOpenChange(false); reset(); },
        onError: (err) => toast({ title: "Failed to create", description: err.message, variant: "destructive" }),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Task title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe the task..." rows={3} {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register("dueDate")} />
            {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? "Saving..." : isEdit ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
