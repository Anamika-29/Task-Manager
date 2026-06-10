import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { StatsCards } from "@/features/tasks/components/stats-cards";
import { TaskList } from "@/features/tasks/components/task-list";

export default async function DashboardPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { name: true } });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name} />
      <main className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s an overview of your tasks</p>
        </div>
        <StatsCards />
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <TaskList />
        </div>
      </main>
    </div>
  );
}
