"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { LoginInput, RegisterInput } from "@/lib/validations";

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: () => router.push("/dashboard"),
  });
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: () => router.push("/dashboard"),
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => router.push("/login"),
  });
}
