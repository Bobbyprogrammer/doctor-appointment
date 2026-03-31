"use client";

import type { Prescription } from "@/types/prescription";
import DoctorPrescriptionDetailsDialog from "./doctor-prescription-details"

interface DoctorPrescriptionCardProps {
  prescription: Prescription;
}

export default function DoctorPrescriptionCard({
  prescription,
}: DoctorPrescriptionCardProps) {
  const patient =
    typeof prescription.patientId === "object" ? prescription.patientId : null;

  const consultation =
    typeof prescription.consultationId === "object"
      ? prescription.consultationId
      : null;

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
              <span className="text-slate-400">Patient: </span>
              {patient
                ? `${patient.firstName} ${patient.lastName}`
                : "N/A"}
            </p>

            <p className="text-sm">
              <span className="text-slate-400">Consultation: </span>
              {consultation?.reference || "-"}
            </p>

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
          <DoctorPrescriptionDetailsDialog prescription={prescription} />
        </div>
      </div>
    </div>
  );
}