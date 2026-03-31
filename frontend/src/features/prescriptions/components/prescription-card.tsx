"use client";

import type { Prescription } from "@/types/prescription";
import PrescriptionDetailsDialog from "./prescription-details-dialog";

interface PrescriptionCardProps {
  prescription: Prescription;
}

export default function PrescriptionCard({
  prescription,
}: PrescriptionCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#24303d] p-6 text-white shadow-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400">Prescription</p>
            <h3 className="text-xl font-bold">
              {prescription.reference || "Prescription Record"}
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <p className="text-sm">
              <span className="text-slate-400">Issued At: </span>
              {prescription.issuedAt
                ? new Date(prescription.issuedAt).toLocaleDateString()
                : prescription.createdAt
                ? new Date(prescription.createdAt).toLocaleDateString()
                : "-"}
            </p>

            <p className="text-sm">
              <span className="text-slate-400">Medicines: </span>
              {prescription.medicines?.length || 0}
            </p>
          </div>

          <p className="line-clamp-2 text-sm text-slate-300">
            {prescription.diagnosis || "No diagnosis added."}
          </p>
        </div>

        <div className="flex min-w-[180px] flex-col gap-3 lg:items-end">
          <PrescriptionDetailsDialog prescription={prescription} />
        </div>
      </div>
    </div>
  );
}