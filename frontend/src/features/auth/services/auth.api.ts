import api from "@/lib/axios";
import type { AuthResponse, MeResponse } from "@/types/auth";

export const loginApi = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
};

export const registerApi = async (formData: FormData) => {
  const { data } = await api.post<AuthResponse>("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const logoutApi = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const getMeApi = async () => {
  const { data } = await api.get<MeResponse>("/auth/me");
  return data;
};