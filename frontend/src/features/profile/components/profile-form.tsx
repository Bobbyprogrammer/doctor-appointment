"use client";

import { useEffect, useState } from "react";
import { useProfile } from "../context/ProfileContext";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import ProfileAvatarUpload from "./profile-avatar-upload";

export default function ProfileForm() {
  const { profile, fetchProfile, updateProfile } = useProfile();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email:"",
    phone: "",
  });

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);

    if (file) {
      formData.append("profilePic", file);
    }

    const success = await updateProfile(formData);

    if (success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border bg-[#24303d] p-6 text-white shadow-xl">
      <h2 className="text-2xl font-bold">Profile Information</h2>

      <ProfileAvatarUpload
        image={profile?.profilePic?.url}
        onChange={setFile}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.firstName}
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
          placeholder="First Name"
          className="h-11 rounded-xl border bg-white/5 px-4"
        />

        <input
          value={form.lastName}
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
          placeholder="Last Name"
          className="h-11 rounded-xl border bg-white/5 px-4"
        />
      </div>

<div className="grid gap-4 md:grid-cols-2">
  <input
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          placeholder="Email"
          className="h-11 rounded-xl border bg-white/5 px-4"
        />
<input
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Phone"
        className="h-11 w-full rounded-xl border bg-white/5 px-4"
      />
</div>
      

      <Button onClick={handleSubmit} className="w-full">
        Save Changes
      </Button>
    </div>
  );
}