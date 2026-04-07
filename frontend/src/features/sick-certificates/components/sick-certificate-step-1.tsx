"use client";

import { Button } from "@/components/ui/button";
import type { CreateSickCertificatePayload } from "@/types/sick-certificate";

interface Props {
  form: CreateSickCertificatePayload;
  updateForm: (data: Partial<CreateSickCertificatePayload>) => void;
  onNext: () => void;
}

export default function SickCertificateStep1({
  form,
  updateForm,
  onNext,
}: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Personal Information</h2>

      <div className="rounded-2xl border border-green-200/20 bg-green-50/10 p-4">
        <p className="mb-3 text-sm font-medium">
          I am seeking Sick Leave from <span className="text-red-400">*</span>
        </p>

        <div className="flex flex-wrap gap-4">
          {[
            { label: "Studies", value: "studies" },
            { label: "Work", value: "work" },
            { label: "Travel", value: "travel" },
            { label: "Work from Home", value: "work_from_home" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="certificatePurpose"
                checked={form.certificatePurpose === item.value}
                onChange={() =>
                  updateForm({ certificatePurpose: item.value as any })
                }
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => updateForm({ firstName: e.target.value })}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        />
        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => updateForm({ lastName: e.target.value })}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => updateForm({ email: e.target.value })}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => updateForm({ phone: e.target.value })}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="">DOB</label>
 <input
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => updateForm({ dateOfBirth: e.target.value })}
          placeholder="date of birth"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        />
        </div>
       
       
        
        <div className="flex flex-col gap-1">
          <label htmlFor="">Gender</label>
<select
          value={form.gender}
          onChange={(e) => updateForm({ gender: e.target.value as any })}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <option value="male" className="bg-black">Male</option>
          <option value="female" className="bg-black">Female</option>
          <option value="other" className="bg-black">Other</option>
        </select>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-green-200/20 bg-green-50/10 p-4">
        <h3 className="font-semibold">Address</h3>
        <input
          placeholder="Street Address"
          value={form.addressLine1}
          onChange={(e) => updateForm({ addressLine1: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        />
        <input
          placeholder="Address Line 2"
          value={form.addressLine2}
          onChange={(e) => updateForm({ addressLine2: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => updateForm({ city: e.target.value })}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          />
          <input
            placeholder="State / Province / Region"
            value={form.stateRegion}
            onChange={(e) => updateForm({ stateRegion: e.target.value })}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          />
          <input
            placeholder="ZIP / Postal Code"
            value={form.postalCode}
            onChange={(e) => updateForm({ postalCode: e.target.value })}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          />
          <select
            value={form.country}
            onChange={(e) => updateForm({ country: e.target.value })}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <option value="Ireland">Ireland</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} className="bg-[#ff8f80] text-white hover:bg-[#ff7d6c]">
          Next
        </Button>
      </div>
    </div>
  );
}