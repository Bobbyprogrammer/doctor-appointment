"use client";
import {toast} from "react-hot-toast"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  loginApi,
  registerApi,
  logoutApi,
  getMeApi,
} from "../services/auth.api";
import type { AuthContextType, AuthUser, AuthResponse } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const redirectByRole = (role: string) => {
    if (role === "patient") {
      router.push("/");
    } else if (role === "doctor") {
      router.push("/doctor/dashboard");
    } else if (role === "admin" || role === "super_admin") {
      router.push("/login");
    } else {
      router.push("/");
    }
  };

  const getMe = async () => {
    try {
      const data = await getMeApi();

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const data = await loginApi(email, password);


    if (data.success) {
     toast.success("user loggedIn")
      setUser(data.user);
      redirectByRole(data.user.role);
    }

    return data;
  };

  const register = async (formData: FormData): Promise<AuthResponse> => {
    const data = await registerApi(formData);

    if (data.success) {
     toast.success("user registered")
      setUser(data.user);
      redirectByRole(data.user.role);
    }

    return data;
  };

  const logout = async () => {
    try {
      await logoutApi();
      toast.success("user logged Out")
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
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