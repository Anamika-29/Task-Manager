import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { TaskFilters } from "@/types";
import { CreateTaskInput, UpdateTaskInput } from "@/lib/validations";

export const TASKS_KEY = "tasks";

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: () => taskService.getAll(filters),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: [TASKS_KEY, id],
    queryFn: () => taskService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      taskService.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: [TASKS_KEY] });
      const prev = qc.getQueryData([TASKS_KEY]);
      qc.setQueriesData({ queryKey: [TASKS_KEY] }, (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((t) => (t.id === id ? { ...t, ...data } : t));
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData([TASKS_KEY], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [TASKS_KEY] });
      const prev = qc.getQueryData([TASKS_KEY]);
      qc.setQueriesData({ queryKey: [TASKS_KEY] }, (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.filter((t) => t.id !== id);
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData([TASKS_KEY], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}
