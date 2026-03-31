"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useConsultations } from "../context/ConsultationsContext";
import type { ConsultationQuestionnaireAnswerInput, PatientType } from "@/types/consultation";
import PatientTypeSelector from "./patient-type-selector";

import ConsultationFileUpload from "./consultation-file-upload";
import DynamicQuestionnaire from "./consultation-dynamic-questionnaire";

interface ConsultationBookingFormProps {
  serviceId: string;
  serviceName: string;
  amount: number;
}

const currency=process.env.NEXT_PUBLIC_CURRENCY

export default function ConsultationBookingForm({
  serviceId,
  serviceName,
  amount,
}: ConsultationBookingFormProps) {
  const router = useRouter();
  const { createConsultation } = useConsultations();

  const [patientType, setPatientType] = useState<PatientType>("self");
  const [patientDob, setPatientDob] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<
  ConsultationQuestionnaireAnswerInput[]
>([]);

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  try {
    setSubmitting(true);

    const filteredAnswers = questionnaireAnswers.filter(
      (item) =>
        item.questionId &&
        item.answer !== undefined &&
        item.answer !== null &&
        !(typeof item.answer === "string" && item.answer.trim() === "") &&
        !(Array.isArray(item.answer) && item.answer.length === 0)
    );

    const res = await createConsultation({
      serviceId,
      patientType,
      patientDob: patientDob || null,
      scheduledAt: scheduledAt || null,
      notes,
      questionnaireAnswers: filteredAnswers,
      redFlags: {
        chestPain: false,
        severeBreathingDifficulty: false,
        confusion: false,
        severeAbdominalPain: false,
        fainting: false,
      },
      files,
    });

    if (res.success) {
      toast.success("Consultation created successfully");
      router.push("/patient/consultations");
    } else {
      toast.error(res.message || "Failed to create consultation");
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    toast.error(message);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-3xl border  p-8 shadow-sm border-white/10 bg-white text-black">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide ">
              Consultation Booking
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">{serviceName}</h1>
            <p className="">
              Complete the form below to request your consultation. Please fill
              in accurate details so the doctor can review your case properly.
            </p>

            <div className="pt-2">
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium ">
                Consultation Fee: {currency}{amount}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border  p-8 shadow-sm  border-white/10 bg-white text-black">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Patient Information</h2>
            <p className="mt-2 text-sm ">
              Tell us who this consultation is for and provide the required
              patient details.
            </p>
          </div>

          <PatientTypeSelector value={patientType} onChange={setPatientType} />

          <div className="mt-6 grid gap-5 md:grid-cols-2 ">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Date of Birth</label>
              <input
                type="date"
                value={patientDob}
                onChange={(e) => setPatientDob(e.target.value)}
                className="h-12 w-full rounded-xl border  border-black/30 bg-white text-black  px-4 outline-none transition "
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Schedule</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="h-12 w-full rounded-xl border  border-black/30 bg-white text-black px-4 outline-none transition "
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border  border-black/10 bg-white text-black p-8 shadow-sm">
         <DynamicQuestionnaire
  serviceId={serviceId}
  answers={questionnaireAnswers}
  setAnswers={setQuestionnaireAnswers}
/>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white text-black p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Additional Notes</h2>
            <p className="mt-2 text-sm ">
              Add any important symptoms, concerns, or context that may help the
              doctor review your case.
            </p>
          </div>

          <div className="space-y-2 ">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[180px] w-full rounded-2xl border border-white/20 bg-white text-black px-4 py-3 outline-none transition "
              placeholder="Describe symptoms, duration, severity, or any other important details"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white text-black p-8 shadow-sm">
          <ConsultationFileUpload files={files} onChange={setFiles} />
        </div>

        <div className="rounded-3xl border border-white/20 bg-white text-black p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold">Ready to submit?</h3>
              <p className="mt-1 text-sm ">
                Review your details before sending the consultation request.
              </p>
            </div>

            <Button type="submit" size="lg" className="h-12 px-8">
              {submitting ? "Submitting..." : "Submit Consultation"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}