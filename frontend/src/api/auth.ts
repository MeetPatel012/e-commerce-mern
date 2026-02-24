import { api } from "@/lib/axios";
import type { ApiResponse, AuthResponse, User } from "@/types";

export async function login(email: string, password: string) {
  const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

export async function getProfile() {
  const { data } = await api.get<ApiResponse<User>>("/auth/profile");
  return data;
}
