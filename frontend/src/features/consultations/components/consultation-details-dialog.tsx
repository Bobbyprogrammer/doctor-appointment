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
import ConsultationStatusBadge from "./consultation-status-badge";
import PaymentStatusBadge from "./payment-status-badge";

interface ConsultationDetailsDialogProps {
  consultation: Consultation;
}

const currency = process.env.NEXT_PUBLIC_CURRENCY;

export default function ConsultationDetailsDialog({
  consultation,
}: ConsultationDetailsDialogProps) {
  const service =
    typeof consultation.serviceId === "object" ? consultation.serviceId : null;
  const questionnaireAnswers = consultation.questionnaireAnswers || [];
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

      <DialogContent className="max-h-[90vh] max-w-2xl sm:max-w-5xl lg:max-w-2xl overflow-y-auto border-white/10 bg-[#24303d] text-white">
        <DialogHeader>
          <DialogTitle>Consultation Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-semibold text-white">Overview</h3>

              <div className="space-y-3 text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">Reference: </span>
                  {consultation.reference}
                </p>

                <p>
                  <span className="text-slate-400">Patient Type: </span>
                  <span className="capitalize">{consultation.patientType}</span>
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

                <p>
                  <span className="text-slate-400">Created At: </span>
                  {consultation.createdAt
                    ? new Date(consultation.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-semibold text-white">Status</h3>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm text-slate-400">
                    Consultation Status
                  </p>
                  <ConsultationStatusBadge status={consultation.status} />
                </div>

                <div>
                  <p className="mb-2 text-sm text-slate-400">Payment Status</p>
                  <PaymentStatusBadge status={consultation.paymentStatus} />
                </div>
              </div>
            </div>
          </div>

          {service && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-semibold text-white">Service Details</h3>

              <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                <p>
                  <span className="text-slate-400">Service Name: </span>
                  {service.name}
                </p>

                {service.price !== undefined && (
                  <p>
                    <span className="text-slate-400">Price: </span>
                    {currency}
                    {service.price}
                  </p>
                )}

                {service.durationMinutes !== undefined && (
                  <p>
                    <span className="text-slate-400">Duration: </span>
                    {service.durationMinutes} minutes
                  </p>
                )}

                {service.category && (
                  <p>
                    <span className="text-slate-400">Category: </span>
                    {service.category}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-3 font-semibold text-white">Notes</h3>
            <p className="text-sm text-slate-300">
              {consultation.notes || "No notes provided."}
            </p>
          </div>

          {consultation.questionnaireAnswers?.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-semibold text-white">
                Questionnaire Answers
              </h3>

              <div className="space-y-4">
                {consultation.questionnaireAnswers.map((item, index) => {
                  const answer = item.answer;

                  let displayAnswer = "No answer";

                  if (Array.isArray(answer)) {
                    displayAnswer = answer.length > 0 ? answer.join(", ") : "No answer";
                  } else if (typeof answer === "boolean") {
                    displayAnswer = answer ? "Yes" : "No";
                  } else if (answer !== null && answer !== undefined && answer !== "") {
                    displayAnswer = String(answer);
                  }

                  return (
                    <div
                      key={item.questionId || index}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-sm font-medium text-white">
                        {item.questionText}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        {displayAnswer}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {consultation.files?.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-3 font-semibold text-white">Uploaded Files</h3>

              <div className="space-y-2">
                {consultation.files.map((file, index) => (
                  <a
                    key={file.public_id || index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.name}
                    className="block rounded-xl bg-white/5 px-4 py-3 text-sm text-blue-300 transition hover:bg-white/10"
                  >
                    {file.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}