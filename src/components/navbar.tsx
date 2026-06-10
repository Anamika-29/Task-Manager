"use client";
import Link from "next/link";
import { CheckSquare, LogOut } from "lucide-react";
import { useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface Props { userName?: string }

export function Navbar({ userName }: Props) {
  const { mutate: logout, isPending } = useLogout();
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <CheckSquare className="h-5 w-5 text-primary" />
          <span>TaskFlow</span>
        </Link>
        <div className="flex items-center gap-3">
          {userName && <span className="text-sm text-muted-foreground hidden sm:block">Hi, {userName}</span>}
          <Button variant="outline" size="sm" onClick={() => logout()} disabled={isPending} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
