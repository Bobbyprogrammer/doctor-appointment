"use client";

import { Button } from "@/components/ui/button";
import type { CreateSickCertificatePayload } from "@/types/sick-certificate";

interface Props {
  form: CreateSickCertificatePayload;
  updateForm: (data: Partial<CreateSickCertificatePayload>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const SYMPTOMS = [
  "Common cold or flu",
  "Chest infection",
  "Vomiting",
  "Cough",
  "General malaise",
  "Stomach upset",
  "Diarrhoea",
  "Rash",
  "Coldsores",
  "Back ache",
  "Pain",
  "Ear infection",
  "Headache",
  "Migraine",
  "Hay fever",
  "Sinusitis",
];

export default function SickCertificateStep2({
  form,
  updateForm,
  onPrev,
  onNext,
}: Props) {
  const toggleSymptom = (symptom: string) => {
    const exists = form.symptoms.includes(symptom);

    if (exists) {
      updateForm({
        symptoms: form.symptoms.filter((s) => s !== symptom),
      });
    } else {
      updateForm({
        symptoms: [...form.symptoms, symptom],
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Medical Questions</h2>

      <input
        placeholder="Employer / Organization Name"
        value={form.employerOrOrganization}
        onChange={(e) =>
          updateForm({ employerOrOrganization: e.target.value })
        }
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
      />

      <input
        placeholder="Reason for certificate"
        value={form.consultationReason}
        onChange={(e) => updateForm({ consultationReason: e.target.value })}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["hasMedicalEmergency", "Do you have a medical emergency?"],
          ["canTravelToClinic", "Can you travel to clinic if needed?"],
          ["isPregnant", "Are you pregnant?"],
          ["awareOfRedFlags", "Are you aware of serious symptoms / red flags?"],
        ].map(([field, label]) => (
          <div
            key={field}
            className="rounded-2xl border border-green-200/20 bg-green-50/10 p-4"
          >
            <p className="mb-3 text-sm font-medium">{label}</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={(form as any)[field] === true}
                  onChange={() => updateForm({ [field]: true } as any)}
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={(form as any)[field] === false}
                  onChange={() => updateForm({ [field]: false } as any)}
                />
                No
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-green-200/20 bg-green-50/10 p-4">
        <p className="mb-4 font-medium">Select symptoms</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SYMPTOMS.map((symptom) => (
            <label key={symptom} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.symptoms.includes(symptom)}
                onChange={() => toggleSymptom(symptom)}
              />
              {symptom}
            </label>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Please describe in detail your symptoms and illness"
        value={form.illnessDescription}
        onChange={(e) => updateForm({ illnessDescription: e.target.value })}
        className="min-h-[130px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => updateForm({ startDate: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">End Date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => updateForm({ endDate: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Proof of Identification / Passport / Driving Licence
        </label>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              updateForm({ proofFiles: Array.from(e.target.files) });
            }
          }}
          className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2"
        />
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrev} className="text-black">
          Previous
        </Button>
        <Button onClick={onNext} className="bg-[#ff8f80] text-white hover:bg-[#ff7d6c]">
          Next
        </Button>
      </div>
    </div>
  );
}