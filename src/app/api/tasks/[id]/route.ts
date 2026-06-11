export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/auth";
import { updateTaskSchema } from "@/lib/validations";

async function getTaskOrFail(id: string, userId: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task || task.userId !== userId) return null;
  return task;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const task = await getTaskOrFail(params.id, user.userId);
    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });
    return NextResponse.json({ ...task, status: task.status.toLowerCase(), dueDate: task.dueDate.toISOString(), createdAt: task.createdAt.toISOString() });
  } catch (error) {
    console.error("[GET TASK ERROR]", error);
    return NextResponse.json({ message: "Internal server error", detail: process.env.NODE_ENV === "development" ? String(error) : undefined }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const existing = await getTaskOrFail(params.id, user.userId);
    if (!existing) return NextResponse.json({ message: "Task not found" }, { status: 404 });

    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { status, dueDate, ...rest } = parsed.data;
    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(status && { status: status.toUpperCase() as "PENDING" | "COMPLETED" }),
      },
    });
    return NextResponse.json({ ...task, status: task.status.toLowerCase(), dueDate: task.dueDate.toISOString(), createdAt: task.createdAt.toISOString() });
  } catch (error) {
    console.error("[UPDATE TASK ERROR]", error);
    return NextResponse.json({ message: "Internal server error", detail: process.env.NODE_ENV === "development" ? String(error) : undefined }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const existing = await getTaskOrFail(params.id, user.userId);
    if (!existing) return NextResponse.json({ message: "Task not found" }, { status: 404 });
    await prisma.task.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE TASK ERROR]", error);
    return NextResponse.json({ message: "Internal server error", detail: process.env.NODE_ENV === "development" ? String(error) : undefined }, { status: 500 });
  }
}
