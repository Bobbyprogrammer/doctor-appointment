"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  Upload,
  User,
  Mail,
  Phone,
  Lock,
  BriefcaseMedical,
  FileBadge,
  DollarSign,
  MapPin,
  Calendar,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  CreateDoctorPayload,
  UpdateDoctorPayload,
  Doctor,
  DoctorQualification,
  DoctorStatus,
  DoctorGender,
  AvailableDay,
} from "@/types/doctor";
import { Label } from "@/components/ui/label";

type DoctorFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  profilePic: File | null;
  isActive: boolean;

  specialization: string;
  licenseNumber: string;
  experienceYears: number;
  consultationFee: number;
  gender: DoctorGender;
  dateOfBirth: string;
  address: string;
  bio: string;
  status: DoctorStatus;
  availableDays: AvailableDay[];
  qualification: DoctorQualification[];
  documents: File[];
  workStartTime: string;
  workEndTime: string;
};

interface DoctorFormProps {
  onSubmit: (
    payload: CreateDoctorPayload | UpdateDoctorPayload
  ) => Promise<void>;
  submitting?: boolean;
  defaultValues?: Partial<Doctor>;
  submitLabel?: string;
  isEdit?: boolean;
}

const allDays: AvailableDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DoctorForm = ({
  onSubmit,
  submitting = false,
  defaultValues,
  submitLabel = "Create Doctor",
  isEdit = false,
}: DoctorFormProps) => {
  const [formData, setFormData] = useState<DoctorFormValues>({
    firstName: defaultValues?.firstName || "",
    lastName: defaultValues?.lastName || "",
    email: defaultValues?.email || "",
    password: "",
    phone: defaultValues?.phone || "",

    profilePic: null,

    specialization: defaultValues?.doctorProfile?.specialization || "",
    licenseNumber: defaultValues?.doctorProfile?.licenseNumber || "",
    experienceYears: defaultValues?.doctorProfile?.experienceYears || 0,
    consultationFee: defaultValues?.doctorProfile?.consultationFee || 0,
    gender: defaultValues?.doctorProfile?.gender || "other",
    dateOfBirth: defaultValues?.doctorProfile?.dateOfBirth
      ? new Date(defaultValues.doctorProfile.dateOfBirth)
          .toISOString()
          .split("T")[0]
      : "",
    address: defaultValues?.doctorProfile?.address || "",
    bio: defaultValues?.doctorProfile?.bio || "",
    status: defaultValues?.doctorProfile?.status || "approved",
    availableDays: defaultValues?.doctorProfile?.availableDays || [],
    qualification:
      defaultValues?.doctorProfile?.qualification?.length
        ? defaultValues.doctorProfile.qualification
        : [{ degree: "", institute: "", year: null }],
    documents: [],
    workStartTime: defaultValues?.doctorProfile?.workStartTime || "",
    workEndTime: defaultValues?.doctorProfile?.workEndTime || "",
    isActive: defaultValues?.isActive ?? true,
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

      specialization: defaultValues?.doctorProfile?.specialization || "",
      licenseNumber: defaultValues?.doctorProfile?.licenseNumber || "",
      experienceYears: defaultValues?.doctorProfile?.experienceYears || 0,
      consultationFee: defaultValues?.doctorProfile?.consultationFee || 0,
      gender: defaultValues?.doctorProfile?.gender || "other",
      dateOfBirth: defaultValues?.doctorProfile?.dateOfBirth
        ? new Date(defaultValues.doctorProfile.dateOfBirth)
            .toISOString()
            .split("T")[0]
        : "",
      address: defaultValues?.doctorProfile?.address || "",
      bio: defaultValues?.doctorProfile?.bio || "",
      status: defaultValues?.doctorProfile?.status || "approved",
      availableDays: defaultValues?.doctorProfile?.availableDays || [],
      qualification:
        defaultValues?.doctorProfile?.qualification?.length
          ? defaultValues.doctorProfile.qualification
          : [{ degree: "", institute: "", year: null }],
      documents: [],
      workStartTime: defaultValues?.doctorProfile?.workStartTime || "",
      workEndTime: defaultValues?.doctorProfile?.workEndTime || "",
      isActive: defaultValues?.isActive ?? true,
    });

    setExistingImage(defaultValues?.profilePic?.url || "");
    setPreviewUrl("");
  }, [defaultValues]);

  const objectUrl = useMemo(() => {
    if (!formData.profilePic) return "";
    return URL.createObjectURL(formData.profilePic);
  }, [formData.profilePic]);

  useEffect(() => {
    if (objectUrl) setPreviewUrl(objectUrl);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? (e.target as HTMLInputElement).checked
          : name === "experienceYears" || name === "consultationFee"
            ? Number(value)
            : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      profilePic: file,
    }));
  };

  const handleDocumentsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    setFormData((prev) => ({
      ...prev,
      documents: files,
    }));
  };

  const handleQualificationChange = (
    index: number,
    field: keyof DoctorQualification,
    value: string | number | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      qualification: prev.qualification.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualification: [
        ...prev.qualification,
        { degree: "", institute: "", year: null },
      ],
    }));
  };

  const removeQualification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      qualification: prev.qualification.filter((_, i) => i !== index),
    }));
  };

  const toggleAvailableDay = (day: AvailableDay) => {
    setFormData((prev) => {
      const exists = prev.availableDays.includes(day);

      return {
        ...prev,
        availableDays: exists
          ? prev.availableDays.filter((d) => d !== day)
          : [...prev.availableDays, day],
      };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commonPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      profilePic: formData.profilePic,
      specialization: formData.specialization,
      licenseNumber: formData.licenseNumber,
      experienceYears: formData.experienceYears,
      consultationFee: formData.consultationFee,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth || null,
      address: formData.address,
      bio: formData.bio,
      qualification: formData.qualification,
      documents: formData.documents,
      status: formData.status,
      availableDays: formData.availableDays,
      workStartTime: formData.workStartTime || null,
      workEndTime: formData.workEndTime || null,
    };

    if (isEdit) {
      const updatePayload: UpdateDoctorPayload = {
        ...commonPayload,
        isActive: formData.isActive,
      };

      if (formData.password.trim()) {
        updatePayload.password = formData.password;
      }

      await onSubmit(updatePayload);
      return;
    }

    const createPayload: CreateDoctorPayload = {
      ...commonPayload,
      password: formData.password,
    };

    await onSubmit(createPayload);
  };

  const imageToShow = previewUrl || existingImage;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-white/5">
          {imageToShow ? (
            <Image
              src={imageToShow}
              alt="Doctor preview"
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
          Upload Profile Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Basic Information</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Professional Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <BriefcaseMedical className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
              required
            />
          </div>

          <div className="relative">
            <FileBadge className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="licenseNumber"
              placeholder="License number"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
              required
            />
          </div>

          <div className="relative">
            <Label htmlFor="" className="mb-1">Enter Experience</Label>
            <BriefcaseMedical className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="experienceYears"
              type="number"
              placeholder="Experience years"
              value={formData.experienceYears}
              onChange={handleChange}
              className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="relative">
            <Label htmlFor="" className="mb-1">Enter Consultation Fee</Label>
            <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="consultationFee"
              type="number"
              placeholder="Consultation fee"
              value={formData.consultationFee}
              onChange={handleChange}
              className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
            />
          </div>
 <div className="relative"> 
    <Label htmlFor="" className="mb-1">Select Gender</Label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-white outline-none"
          >
            
            <option value="male" className="bg-[#24303d]">
              Male
            </option>
            <option value="female" className="bg-[#24303d]">
              Female
            </option>
            <option value="other" className="bg-[#24303d]">
              Other
            </option>
          </select>
</div>
          <div className="relative">
            <Label htmlFor="" className="mb-1">Enter DOB</Label>
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="h-11 border-white/10 bg-white/5 pl-10 text-white"
            />
          </div>
            <div className="relative">
            <Label htmlFor="" className="mb-1">Select Status</Label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-white outline-none md:col-span-2"
          >
            <option value="pending" className="bg-[#24303d]">
              Pending
            </option>
            <option value="approved" className="bg-[#24303d]">
              Approved
            </option>
            <option value="rejected" className="bg-[#24303d]">
              Rejected
            </option>
            <option value="suspended" className="bg-[#24303d]">
              Suspended
            </option>
          </select>
          </div>

          {isEdit && (
          
            <label className="flex h-11 items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 text-white mt-4 ">  
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Account Active
              </label>
              
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-slate-400" />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="min-h-[90px] w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-3 pt-3 text-white outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="relative">
            <FileText className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-slate-400" />
            <textarea
              name="bio"
              placeholder="Doctor bio"
              value={formData.bio}
              onChange={handleChange}
              className="min-h-[120px] w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-3 pt-3 text-white outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Available Days</h3>

        <div className="flex flex-wrap gap-3">
          {allDays.map((day) => {
            const selected = formData.availableDays.includes(day);

            return (
              <button
                type="button"
                key={day}
                onClick={() => toggleAvailableDay(day)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <Label htmlFor="" className="mb-1">
              Work start time
            </Label>
            <Input
              name="workStartTime"
              type="time"
              value={formData.workStartTime}
              onChange={handleChange}
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <Label htmlFor="" className="mb-1">
              Work end time
            </Label>
            <Input
              name="workEndTime"
              type="time"
              value={formData.workEndTime}
              onChange={handleChange}
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Qualifications</h3>

          <Button
            type="button"
            onClick={addQualification}
            className="bg-white/10 text-white hover:bg-white/15"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Qualification
          </Button>
        </div>

        <div className="space-y-4">
          {formData.qualification.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-white">
                  Qualification {index + 1}
                </p>

                {formData.qualification.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQualification(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Input
                  placeholder="Degree"
                  value={item.degree}
                  onChange={(e) =>
                    handleQualificationChange(index, "degree", e.target.value)
                  }
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-400"
                />

                <Input
                  placeholder="Institute"
                  value={item.institute}
                  onChange={(e) =>
                    handleQualificationChange(
                      index,
                      "institute",
                      e.target.value
                    )
                  }
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-400"
                />

                <Input
                  type="number"
                  placeholder="Year"
                  value={item.year ?? ""}
                  onChange={(e) =>
                    handleQualificationChange(
                      index,
                      "year",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Documents</h3>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-8 text-center transition hover:bg-white/10">
          <Upload className="mb-3 h-6 w-6 text-slate-400" />
          <span className="text-sm font-medium text-white">
            Upload doctor documents
          </span>
          <span className="mt-1 text-xs text-slate-400">
            You can select multiple files
          </span>

          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleDocumentsChange}
          />
        </label>

        {formData.documents.length > 0 && (
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            {formData.documents.map((file, index) => (
              <div
                key={index}
                className="text-sm text-slate-300"
              >
                {file.name}
              </div>
            ))}
          </div>
        )}
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

export default DoctorForm;