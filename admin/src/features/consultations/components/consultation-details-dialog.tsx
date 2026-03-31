"use client";

import { FileText, CalendarDays, UserRound, Stethoscope } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Consultation } from "@/types/consultation";
import ConsultationStatusBadge from "@/components/common/consultation-status-badge";
import PaymentStatusBadge from "@/components/common/payment-status-badge";

interface ConsultationDetailsDialogProps {
  consultation: Consultation;
}

const currency = process.env.NEXT_PUBLIC_CURRENCY;

const ConsultationDetailsDialog = ({
  consultation,
}: ConsultationDetailsDialogProps) => {
  const patient =
    typeof consultation.patientId === "object" ? consultation.patientId : null;
  const doctor =
    typeof consultation.doctorId === "object" ? consultation.doctorId : null;
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
          View
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto border-white/10 bg-[#24303d] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            Consultation Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-slate-300" />
              <h3 className="font-semibold text-white">Patient</h3>
            </div>

            <div className="space-y-2 text-sm text-slate-300">
              <p>
                <span className="font-medium text-white">Name:</span>{" "}
                {patient ? `${patient.firstName} ${patient.lastName}` : "N/A"}
              </p>
              <p>
                <span className="font-medium text-white">Email:</span>{" "}
                {patient?.email || "N/A"}
              </p>
              <p>
                <span className="font-medium text-white">Type:</span>{" "}
                <span className="capitalize">{consultation.patientType}</span>
              </p>
              <p>
                <span className="font-medium text-white">DOB:</span>{" "}
                {consultation.patientDob
                  ? new Date(consultation.patientDob).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-slate-300" />
              <h3 className="font-semibold text-white">Service / Doctor</h3>
            </div>

            <div className="space-y-2 text-sm text-slate-300">
              <p>
                <span className="font-medium text-white">Service:</span>{" "}
                {service?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium text-white">Doctor:</span>{" "}
                {doctor ? `${doctor.firstName} ${doctor.lastName}` : "Not assigned"}
              </p>
              <p>
                <span className="font-medium text-white">Amount:</span>{" "}
                {currency}
                {consultation.amount}
              </p>
              <p>
                <span className="font-medium text-white">Reference:</span>{" "}
                {consultation.reference}
              </p>
              {service?.durationMinutes !== undefined && (
                <p>
                  <span className="font-medium text-white">Duration:</span>{" "}
                  {service.durationMinutes} minutes
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-300" />
              <h3 className="font-semibold text-white">Status</h3>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div>
                <span className="mb-2 block font-medium text-white">
                  Consultation Status
                </span>
                <ConsultationStatusBadge status={consultation.status} />
              </div>

              <div>
                <span className="mb-2 block font-medium text-white">
                  Payment Status
                </span>
                <PaymentStatusBadge status={consultation.paymentStatus} />
              </div>

              <p>
                <span className="font-medium text-white">Scheduled At:</span>{" "}
                {consultation.scheduledAt
                  ? new Date(consultation.scheduledAt).toLocaleString()
                  : "Not scheduled"}
              </p>

              <p>
                <span className="font-medium text-white">Emergency Flag:</span>{" "}
                {consultation.hasEmergencyFlag ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-300" />
              <h3 className="font-semibold text-white">Notes</h3>
            </div>

            <p className="text-sm text-slate-300">
              {consultation.notes || "No notes added."}
            </p>
          </div>

          {hasQuestionnaire && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-300" />
                <h3 className="font-semibold text-white">
                  Questionnaire Answers
                </h3>
              </div>

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
        </div>

        {consultation.files?.length > 0 && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-4 font-semibold text-white">Files</h3>

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
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDetailsDialog;