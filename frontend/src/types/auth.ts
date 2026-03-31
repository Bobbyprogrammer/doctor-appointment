export type UserRole = "patient" | "doctor" | "admin" | "super_admin";

export interface ProfilePic {
  url: string;
  public_id: string;
}

export interface AuthUser {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  profilePic?: ProfilePic;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
}

export interface MeResponse {
  success: boolean;
  user: AuthUser;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (payload: FormData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
}