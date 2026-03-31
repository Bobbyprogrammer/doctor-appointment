"use client";

import { ProfileProvider } from "@/features/profile/context/ProfileContext"
import ProfileForm from "@/features/profile/components/profile-form";

export default function ProfilePage() {
  return (
    <ProfileProvider>
      <div className="mx-auto max-w-3xl">
        <ProfileForm />
      </div>
    </ProfileProvider>
  );
}