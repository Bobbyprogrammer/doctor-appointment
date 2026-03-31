"use client";

import type { PatientType } from "@/types/consultation";

interface ConsultationSummaryCardProps {
  serviceName: string;
  amount: number;
  patientType: PatientType;
  scheduledAt?: string | null;
}
const currnecy=process.env.NEXT_PUBLIC_CURRENCY
export default function ConsultationSummaryCard({
  serviceName,
  amount,
  patientType,
  scheduledAt,
}: ConsultationSummaryCardProps) {

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
      <h3 className="text-xl font-bold">Consultation Summary</h3>

      <div className="mt-5 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Service</span>
          <span className="font-medium">{serviceName}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Patient Type</span>
          <span className="font-medium capitalize">{patientType}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Preferred Schedule</span>
          <span className="font-medium">
            {scheduledAt
              ? new Date(scheduledAt).toLocaleString()
              : "Not selected"}
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="text-2xl font-bold text-primary">{currnecy}{amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}