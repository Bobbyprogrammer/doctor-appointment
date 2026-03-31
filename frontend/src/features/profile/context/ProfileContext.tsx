"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import api from "@/lib/axios";

interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePic?: {
    url: string;
  };
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: FormData) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/me");
      if (data.success) {
        setProfile(data.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData: FormData) => {
    try {
      const { data } = await api.put("/patients/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setProfile(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profile, loading, fetchProfile, updateProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
};