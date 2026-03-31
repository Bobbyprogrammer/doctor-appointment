"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Prescription } from "@/types/prescription";

interface DoctorPrescriptionDetailsDialogProps {
  prescription: Prescription;
}

export default function DoctorPrescriptionDetailsDialog({
  prescription,
}: DoctorPrescriptionDetailsDialogProps) {
  const patient =
    typeof prescription.patientId === "object" ? prescription.patientId : null;

  const consultation =
    typeof prescription.consultationId === "object"
      ? prescription.consultationId
      : null;

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

      <DialogContent className="w-full max-w-2xl sm:max-w-5xl lg:max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#24303d] text-white">
        <DialogHeader>
          <DialogTitle>Prescription Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Overview</h3>

              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">Reference: </span>
                  {prescription.reference || "-"}
                </p>
                <p>
                  <span className="text-slate-400">Issued At: </span>
                  {prescription.issuedAt
                    ? new Date(prescription.issuedAt).toLocaleString()
                    : prescription.createdAt
                    ? new Date(prescription.createdAt).toLocaleString()
                    : "-"}
                </p>
                <p>
                  <span className="text-slate-400">Consultation: </span>
                  {consultation?.reference || "-"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Patient</h3>

              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">Name: </span>
                  {patient
                    ? `${patient.firstName} ${patient.lastName}`
                    : "N/A"}
                </p>
                <p>
                  <span className="text-slate-400">Email: </span>
                  {patient?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 font-semibold">Diagnosis</h3>
            <p className="text-sm text-slate-300">
              {prescription.diagnosis || "No diagnosis added."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 font-semibold">Doctor Notes</h3>
            <p className="text-sm text-slate-300">
              {prescription.notes || "No notes available."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 font-semibold">Medicines</h3>

            {prescription.medicines?.length > 0 ? (
              <div className="space-y-3">
                {prescription.medicines.map((medicine, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-medium text-white">{medicine.name}</p>

                    <div className="mt-2 grid gap-2 md:grid-cols-2 text-sm text-slate-300">
                      {medicine.dosage && (
                        <p>
                          <span className="text-slate-400">Dosage: </span>
                          {medicine.dosage}
                        </p>
                      )}
                      {medicine.frequency && (
                        <p>
                          <span className="text-slate-400">Frequency: </span>
                          {medicine.frequency}
                        </p>
                      )}
                      {medicine.duration && (
                        <p>
                          <span className="text-slate-400">Duration: </span>
                          {medicine.duration}
                        </p>
                      )}
                      {medicine.instructions && (
                        <p>
                          <span className="text-slate-400">Instructions: </span>
                          {medicine.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No medicines added.</p>
            )}
          </div>

          {prescription.files?.length ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 font-semibold">Files</h3>
              <div className="space-y-2">
                {prescription.files.map((file, index) => (
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
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}