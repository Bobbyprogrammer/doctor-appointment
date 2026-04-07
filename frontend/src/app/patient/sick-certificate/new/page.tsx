"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSickCertificates } from "@/features/sick-certificates/context/SickCertificatesContext";
import SickCertificateStep1 from "@/features/sick-certificates/components/sick-certificate-step-1";
import SickCertificateStep2 from "@/features/sick-certificates/components/sick-certificate-step-2";
import SickCertificateStep3 from "@/features/sick-certificates/components/sick-certificate-step-3"
import type { CreateSickCertificatePayload } from "@/types/sick-certificate";

const initialForm: CreateSickCertificatePayload = {
  certificatePurpose: "work",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "male",

  addressLine1: "",
  addressLine2: "",
  city: "",
  stateRegion: "",
  postalCode: "",
  country: "Ireland",

  employerOrOrganization: "",
  consultationReason: "",
  hasMedicalEmergency: false,
  canTravelToClinic: true,
  isPregnant: false,
  awareOfRedFlags: true,
  symptoms: [],
  illnessDescription: "",

  startDate: "",
  endDate: "",

  variationType: "standard",
  amount: 26.99,

  proofFiles: [],
};

export default function NewSickCertificatePage() {
  const router = useRouter();
  const { createSickCertificateRequest, startSickCertificatePayment } =
    useSickCertificates();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateSickCertificatePayload>(initialForm);

  const updateForm = (data: Partial<CreateSickCertificatePayload>) => {
    setForm((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const res = await createSickCertificateRequest(form);

      if (!res.success || !res.request?._id) {
        toast.error(res.message || "Failed to create request");
        return;
      }

      const paymentRes = await startSickCertificatePayment(res.request._id);

      if (!paymentRes.success || !paymentRes.url) {
        toast.error(paymentRes.message || "Failed to start payment");
        return;
      }

      window.location.href = paymentRes.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="rounded-3xl border border-white/10 bg-[#24303d] p-6 text-white shadow-xl">
        <div className="mb-6">
          <p className="text-sm text-slate-400">Step {step} of 3</p>
          <div className="mt-2 h-2 w-full rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-[#ff8f80] transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <SickCertificateStep1
            form={form}
            updateForm={updateForm}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <SickCertificateStep2
            form={form}
            updateForm={updateForm}
            onPrev={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <SickCertificateStep3
            form={form}
            updateForm={updateForm}
            onPrev={() => setStep(2)}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}