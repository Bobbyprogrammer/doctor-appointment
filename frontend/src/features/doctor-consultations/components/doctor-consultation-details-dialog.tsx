"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Consultation } from "@/types/consultation";
import DoctorConsultationStatusBadge from "./doctor-consultation-status-badge";
import DoctorPaymentStatusBadge from "./doctor-payment-status-badge";
import CreatePrescriptionDialog from "@/features/doctor-prescriptions/components/create-prescription-dialog";

interface DoctorConsultationDetailsDialogProps {
  consultation: Consultation;
}

const currency = process.env.NEXT_PUBLIC_CURRENCY;

export default function DoctorConsultationDetailsDialog({
  consultation,
}: DoctorConsultationDetailsDialogProps) {
  const patient =
    typeof consultation.patientId === "object" ? consultation.patientId : null;

  const service =
    typeof consultation.serviceId === "object" ? consultation.serviceId : null;

  const hasQuestionnaire =
    Array.isArray(consultation.questionnaireAnswers) &&
    consultation.questionnaireAnswers.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl sm:max-w-5xl lg:max-w-2xl overflow-y-auto overflow-y-auto border-white/10 bg-[#24303d] text-white">
        <DialogHeader>
          <DialogTitle>Consultation Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Patient</h3>

              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">Name: </span>
                  {patient ? `${patient.firstName} ${patient.lastName}` : "N/A"}
                </p>
                <p>
                  <span className="text-slate-400">Email: </span>
                  {patient?.email || "N/A"}
                </p>
                <p>
                  <span className="text-slate-400">Patient Type: </span>
                  <span className="capitalize">{consultation.patientType}</span>
                </p>
                <p>
                  <span className="text-slate-400">DOB: </span>
                  {consultation.patientDob
                    ? new Date(consultation.patientDob).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Service</h3>

              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">Reference: </span>
                  {consultation.reference}
                </p>
                <p>
                  <span className="text-slate-400">Service: </span>
                  {service?.name || "N/A"}
                </p>
                <p>
                  <span className="text-slate-400">Amount: </span>
                  {currency}
                  {consultation.amount}
                </p>
                <p>
                  <span className="text-slate-400">Scheduled At: </span>
                  {consultation.scheduledAt
                    ? new Date(consultation.scheduledAt).toLocaleString()
                    : "Not scheduled"}
                </p>
                {service?.durationMinutes !== undefined && (
                  <p>
                    <span className="text-slate-400">Duration: </span>
                    {service.durationMinutes} minutes
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Status</h3>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm text-slate-400">
                    Consultation Status
                  </p>
                  <DoctorConsultationStatusBadge status={consultation.status} />
                </div>

                <div>
                  <p className="mb-2 text-sm text-slate-400">Payment Status</p>
                  <DoctorPaymentStatusBadge status={consultation.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Notes</h3>
              <p className="text-sm text-slate-300">
                {consultation.notes || "No notes provided."}
              </p>
            </div>
          </div>

          {hasQuestionnaire && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Questionnaire Answers</h3>

              <div className="grid gap-3 md:grid-cols-2">
                {consultation.questionnaireAnswers.map((item, index) => {
                  let displayValue = "—";

                  if (Array.isArray(item.answer)) {
                    displayValue = item.answer.length
                      ? item.answer.join(", ")
                      : "—";
                  } else if (typeof item.answer === "boolean") {
                    displayValue = item.answer ? "Yes" : "No";
                  } else if (
                    item.answer !== null &&
                    item.answer !== undefined &&
                    item.answer !== ""
                  ) {
                    displayValue = String(item.answer);
                  }

                  return (
                    <div
                      key={`${item.questionId}-${index}`}
                      className="rounded-xl bg-black/30 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {item.questionType?.replaceAll("_", " ") || "Question"}
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {item.questionText}
                      </p>
                      <p className="mt-2 text-sm text-slate-200">
                        {displayValue}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {consultation.files?.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 font-semibold">Uploaded Files</h3>

              <div className="space-y-2">
                {consultation.files.map((file, index) => (
                  <a
                    key={file.public_id || index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.name}
                    className="block rounded-xl bg-white/5 px-4 py-3 text-sm text-blue-300 hover:bg-white/10"
                  >
                    {file.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <CreatePrescriptionDialog consultationId={consultation._id!} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}