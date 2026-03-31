"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { User, Mail, Lock, Phone, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RegisterForm = () => {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const previewUrl = useMemo(() => {
    if (!profilePic) return "";
    return URL.createObjectURL(profilePic);
  }, [profilePic]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const res = await register(formData);

      if (!res.success) {
        toast.error(res.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm">
          <Upload className="h-4 w-4" />
          Upload Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="First Name"
            className="h-11 pl-10"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Last Name"
            className="h-11 pl-10"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Email"
          className="h-11 pl-10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="relative">
        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Phone"
          className="h-11 pl-10"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="password"
          placeholder="Password"
          className="h-11 pl-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="h-11 w-full">
        {submitting ? "Creating account..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;