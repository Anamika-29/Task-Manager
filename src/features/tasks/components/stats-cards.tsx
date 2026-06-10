"use client";
import { CheckCircle2, Circle, ListTodo, TrendingUp } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards() {
  const { data: tasks, isLoading } = useTasks();

  const total = tasks?.length || 0;
  const completed = tasks?.filter((t) => t.status === "completed").length || 0;
  const pending = tasks?.filter((t) => t.status === "pending").length || 0;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { title: "Total Tasks", value: total, icon: ListTodo, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Completed", value: completed, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { title: "Pending", value: pending, icon: Circle, color: "text-yellow-600", bg: "bg-yellow-50" },
    { title: "Completion Rate", value: `${completionPct}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ title, value, icon: Icon, color, bg }) => (
        <Card key={title}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className={`p-2 rounded-lg ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
