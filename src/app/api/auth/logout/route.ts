export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.delete(TOKEN_COOKIE);
  return res;
}
