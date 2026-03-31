"use client";

import type { PatientType } from "@/types/consultation";

interface PatientTypeSelectorProps {
  value: PatientType;
  onChange: (value: PatientType) => void;
}

const patientTypes: { label: string; value: PatientType; description: string }[] = [
  {
    label: "Self",
    value: "self",
    description: "Book a consultation for yourself.",
  },
  {
    label: "Child",
    value: "child",
    description: "Book for your child if the service allows it.",
  },
  {
    label: "Other",
    value: "other",
    description: "Book for another person if supported.",
  },
];

export default function PatientTypeSelector({
  value,
  onChange,
}: PatientTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Patient Type</label>

      <div className="grid gap-4 md:grid-cols-3">
        {patientTypes.map((type) => {
          const active = value === type.value;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? " bg-primary/5"
                  : " border-black/30 bg-white text-black"
              }`}
            >
              <p className="font-semibold">{type.label}</p>
              <p className="mt-1 text-sm ">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}