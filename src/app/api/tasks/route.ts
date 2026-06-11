export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/auth";
import { createTaskSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.userId,
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(status && { status: status.toUpperCase() as "PENDING" | "COMPLETED" }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      tasks.map((t) => ({
        ...t,
        status: t.status.toLowerCase(),
        dueDate: t.dueDate.toISOString(),
        createdAt: t.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("[GET TASKS ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error", detail: process.env.NODE_ENV === "development" ? String(error) : undefined },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: { ...parsed.data, dueDate: new Date(parsed.data.dueDate), userId: user.userId },
    });

    return NextResponse.json(
      { ...task, status: task.status.toLowerCase(), dueDate: task.dueDate.toISOString(), createdAt: task.createdAt.toISOString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE TASK ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error", detail: process.env.NODE_ENV === "development" ? String(error) : undefined },
      { status: 500 }
    );
  }
}
