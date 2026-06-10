import { LoginInput, RegisterInput } from "@/lib/validations";
import { AuthResponse } from "@/types";

const BASE_URL = "/api/auth";

export const authService = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }
    return res.json();
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch(`${BASE_URL}/logout`, { method: "POST" });
  },
};
