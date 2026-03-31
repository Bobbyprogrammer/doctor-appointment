export type UserRole = "admin" | "super_admin" | "doctor" | "patient";

export interface ProfilePic {
  url: string;
  public_id: string;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  profilePic?: ProfilePic;
  lastLoginAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: AdminUser;
}

export interface MeResponse {
  success: boolean;
  user: AdminUser;
}

export interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
}