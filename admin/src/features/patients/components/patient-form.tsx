"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { Upload, User, Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  CreatePatientPayload,
  UpdatePatientPayload,
  Patient,
} from "@/types/patient";

type PatientFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  profilePic?: File | null;
};

interface PatientFormProps {
  onSubmit: (
    payload: CreatePatientPayload | UpdatePatientPayload
  ) => Promise<void>;
  submitting?: boolean;
  defaultValues?: Partial<Patient>;
  submitLabel?: string;
  isEdit?: boolean;
}

const PatientForm = ({
  onSubmit,
  submitting = false,
  defaultValues,
  submitLabel = "Create Patient",
  isEdit = false,
}: PatientFormProps) => {
  const [formData, setFormData] = useState<PatientFormValues>({
    firstName: defaultValues?.firstName || "",
    lastName: defaultValues?.lastName || "",
    email: defaultValues?.email || "",
    password: "",
    phone: defaultValues?.phone || "",
    profilePic: null,
  });

  const [existingImage, setExistingImage] = useState<string>(
    defaultValues?.profilePic?.url || ""
  );
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    setFormData({
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      email: defaultValues?.email || "",
      password: "",
      phone: defaultValues?.phone || "",
      profilePic: null,
    });

    setExistingImage(defaultValues?.profilePic?.url || "");
    setPreviewUrl("");
  }, [defaultValues]);

  const objectUrl = useMemo(() => {
    if (!formData.profilePic) return "";
    return URL.createObjectURL(formData.profilePic);
  }, [formData.profilePic]);

  useEffect(() => {
    if (objectUrl) {
      setPreviewUrl(objectUrl);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      profilePic: file,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEdit) {
      const updatePayload: UpdatePatientPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        profilePic: formData.profilePic,
      };

      if (formData.password && formData.password.trim() !== "") {
        updatePayload.password = formData.password;
      }

      await onSubmit(updatePayload);
      return;
    }

    const createPayload: CreatePatientPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password || "",
      phone: formData.phone,
      profilePic: formData.profilePic,
    };

    await onSubmit(createPayload);
  };

  const imageToShow = previewUrl || existingImage;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-white/5">
          {imageToShow ? (
            <Image
              src={imageToShow}
              alt="Patient preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-10 w-10 text-slate-400" />
            </div>
          )}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
          <Upload className="h-4 w-4" />
          Upload Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <div className="relative md:col-span-2">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <div className="relative">
          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="password"
            type="password"
            placeholder={isEdit ? "New password (optional)" : "Password"}
            value={formData.password}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
            required={!isEdit}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting}
          className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-white hover:from-blue-500 hover:to-purple-500"
        >
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;