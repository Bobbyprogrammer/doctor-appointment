"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import type {
  AdminUser,
  AuthContextType,
  LoginResponse,
  MeResponse,
} from "@/types/auth"
import toast, { Toast } from "react-hot-toast";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getMe = async (): Promise<void> => {
    try {
      const { data } = await api.get<MeResponse>("/auth/me");

      if (
        data.success &&
        (data.user.role === "admin" || data.user.role === "super_admin")
      ) {
        setAdmin(data.user);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    
    const { data } = await api.post<LoginResponse>("/auth/admin/login", {
      email,
      password,
    });

    if (data.success) {
      setAdmin(data.user);
      router.push("/dashboard");
      toast.success("admin LoggedIn")
    }
    else{
      toast.error("invalid credentials")
    }

    return data;
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } finally {
      setAdmin(null);
      router.push("/login");
      toast.success("admin logdedOut")
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        getMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};