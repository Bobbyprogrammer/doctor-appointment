"use client";

import type { Consultation } from "@/types/consultation";
import DoctorConsultationStatusBadge from "./doctor-consultation-status-badge";
import DoctorPaymentStatusBadge from "./doctor-payment-status-badge";
import DoctorConsultationDetailsDialog from "./doctor-consultation-details-dialog";

interface DoctorConsultationCardProps {
  consultation: Consultation;
}
const currency=process.env.NEXT_PUBLIC_CURRENCY

export default function DoctorConsultationCard({
  consultation,
}: DoctorConsultationCardProps) {
  const patient =
    typeof consultation.patientId === "object" ? consultation.patientId : null;

  const service =
    typeof consultation.serviceId === "object" ? consultation.serviceId : null;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#24303d] p-6 text-white shadow-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400">Reference</p>
            <h3 className="text-xl font-bold">{consultation.reference}</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <p className="text-sm">
              <span className="text-slate-400">Patient: </span>
              {patient
                ? `${patient.firstName} ${patient.lastName}`
                : "N/A"}
            </p>

            <p className="text-sm">
              <span className="text-slate-400">Service: </span>
              {service?.name || "N/A"}
            </p>

            <p className="text-sm">
              <span className="text-slate-400">Amount: </span>
              {currency}{consultation.amount}
            </p>

            <p className="text-sm">
              <span className="text-slate-400">Scheduled: </span>
              {consultation.scheduledAt
                ? new Date(consultation.scheduledAt).toLocaleString()
                : "Not scheduled"}
            </p>
          </div>

          <p className="line-clamp-2 text-sm text-slate-300">
            {consultation.notes || "No notes added."}
          </p>
        </div>

        <div className="flex min-w-[220px] flex-col gap-3 lg:items-end">
          <DoctorConsultationStatusBadge status={consultation.status} />
          <DoctorPaymentStatusBadge status={consultation.paymentStatus} />
          <DoctorConsultationDetailsDialog consultation={consultation} />
        </div>
      </div>
    </div>
  );
}