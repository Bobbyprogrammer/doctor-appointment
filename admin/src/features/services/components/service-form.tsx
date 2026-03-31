"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  BadgeDollarSign,
  Clock3,
  FileText,
  ListTree,
  Stethoscope,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  CreateServicePayload,
  UpdateServicePayload,
  Service,
} from "@/types/service";
import { Label } from "@/components/ui/label";

type ServiceFormValues = {
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discountedPrice: number | null;
  durationMinutes: number;
  doctorType: string;
  minAge: number | null;
  maxAge: number | null;
  allowForChild: boolean;
  allowForSomeoneElse: boolean;
  isActive: boolean;
};

interface ServiceFormProps {
  onSubmit: (
    payload: CreateServicePayload | UpdateServicePayload
  ) => Promise<void>;
  submitting?: boolean;
  defaultValues?: Partial<Service>;
  submitLabel?: string;
  isEdit?: boolean;
}

const ServiceForm = ({
  onSubmit,
  submitting = false,
  defaultValues,
  submitLabel = "Create Service",
  isEdit = false,
}: ServiceFormProps) => {
  const [formData, setFormData] = useState<ServiceFormValues>({
    name: defaultValues?.name || "",
    slug: defaultValues?.slug || "",
    description: defaultValues?.description || "",
    category: defaultValues?.category || "general",
    price: defaultValues?.price ?? 0,
    discountedPrice: defaultValues?.discountedPrice ?? null,
    durationMinutes: defaultValues?.durationMinutes ?? 15,
    doctorType: defaultValues?.doctorType || "gp",
    minAge: defaultValues?.minAge ?? null,
    maxAge: defaultValues?.maxAge ?? null,
    allowForChild: defaultValues?.allowForChild ?? true,
    allowForSomeoneElse: defaultValues?.allowForSomeoneElse ?? false,
    isActive: defaultValues?.isActive ?? true,
  });

  useEffect(() => {
    setFormData({
      name: defaultValues?.name || "",
      slug: defaultValues?.slug || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || "general",
      price: defaultValues?.price ?? 0,
      discountedPrice: defaultValues?.discountedPrice ?? null,
      durationMinutes: defaultValues?.durationMinutes ?? 15,
      doctorType: defaultValues?.doctorType || "gp",
      minAge: defaultValues?.minAge ?? null,
      maxAge: defaultValues?.maxAge ?? null,
      allowForChild: defaultValues?.allowForChild ?? true,
      allowForSomeoneElse: defaultValues?.allowForSomeoneElse ?? false,
      isActive: defaultValues?.isActive ?? true,
    });
  }, [defaultValues]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        ["price", "discountedPrice", "durationMinutes", "minAge", "maxAge"].includes(name)
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      discountedPrice: formData.discountedPrice != null ? Number(formData.discountedPrice) : null,
      durationMinutes: Number(formData.durationMinutes),
      doctorType: formData.doctorType,
      minAge: formData.minAge,
      maxAge: formData.maxAge,
      allowForChild: formData.allowForChild,
      allowForSomeoneElse: formData.allowForSomeoneElse,
      ...(isEdit ? { isActive: formData.isActive } : {}),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="relative">
          <Label className="mb-1">Service name</Label>
          <Stethoscope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="name"
            placeholder="Service name"
            value={formData.name}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <div className="relative">
          <Label className="mb-1">Slug (optional)</Label>
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="slug"
            placeholder="generated on backend "
            value={formData.slug}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
            
          />
        </div>

        <div className="relative">
          <Label className="mb-1">Enter Category</Label>
          <ListTree className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <Label className="mb-1">Enter Price</Label>
          <BadgeDollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <div className="relative">
          <Label className="mb-1">Discounted price (optional)</Label>
          <BadgeDollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="discountedPrice"
            type="number"
            min={0}
            placeholder="Leave empty for no discount"
            value={formData.discountedPrice ?? ""}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <Label className="mb-1">Enter duration</Label>
          <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="durationMinutes"
            type="number"
            placeholder="Duration (minutes)"
            value={formData.durationMinutes}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <Label className="mb-1">Doctor type</Label>
          <Stethoscope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="doctorType"
            placeholder="Doctor type"
            value={formData.doctorType}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
        <Label className="mb-1">Min Age</Label>
       
          <Input
            name="minAge"
            type="number"
            placeholder="Min age"
            value={formData.minAge ?? ""}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
        <Label className="mb-1">Max Age</Label>
          <Input
            name="maxAge"
            type="number"
            placeholder="Max age"
            value={formData.maxAge ?? ""}
            onChange={handleChange}
            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-400"
          />
        </div>

        {isEdit && (
          <label className="flex h-11 items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 text-white">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Active Service
          </label>
        )}

        <label className="flex h-11 items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 text-white">
          <input
            type="checkbox"
            name="allowForChild"
            checked={formData.allowForChild}
            onChange={handleChange}
          />
          Allow For Child
        </label>

        <label className="flex h-11 items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 text-white">
          <input
            type="checkbox"
            name="allowForSomeoneElse"
            checked={formData.allowForSomeoneElse}
            onChange={handleChange}
          />
          Allow For Someone Else
        </label>
      </div>

      <div className="relative">
        <FileText className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-slate-400" />
        <textarea
          name="description"
          placeholder="Service description"
          value={formData.description}
          onChange={handleChange}
          className="min-h-[120px] w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-3 pt-3 text-white outline-none placeholder:text-slate-400"
        />
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

export default ServiceForm;