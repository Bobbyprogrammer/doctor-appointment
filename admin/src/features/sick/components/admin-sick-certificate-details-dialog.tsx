"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SickCertificateRequest } from "@/types/sick-certificate";
import { useAdminSickCertificates } from "../context/AdminSickCertificatesContext";
import SickCertificateStatusBadge from "./sick-certificate-status-badge";
import SickCertificatePaymentBadge from "./sick-certificate-payment-badge";

interface Props {
  request: SickCertificateRequest;
}

const currency = process.env.NEXT_PUBLIC_CURRENCY || "€";

export default function AdminSickCertificateDetailsDialog({ request }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const { doctors, assignDoctorToRequest } = useAdminSickCertificates();

  const patient =
    typeof request.patientId === "object" ? request.patientId : null;

  const doctor =
    typeof request.doctorId === "object" ? request.doctorId : null;

  const handleAssignDoctor = async () => {
    if (!selectedDoctorId) {
      toast.error("Please select a doctor");
      return;
    }

    try {
      setAssigning(true);

      const result = await assignDoctorToRequest(
        request._id || request.id || "",
        selectedDoctorId
      );

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">View Details</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-white/10 bg-[#24303d] text-white">
        <DialogHeader>
          <DialogTitle>Sick Certificate Details</DialogTitle>
          <DialogDescription className="text-slate-400">
            Review request details and assign doctor.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Reference</p>
              <p className="font-semibold">{request.reference}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Amount</p>
              <p className="font-semibold">
                {currency}
                {Number(request.amount || 0).toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Status</p>
              <SickCertificateStatusBadge status={request.status} />
            </div>

            <div>
              <p className="text-sm text-slate-400">Payment</p>
              <SickCertificatePaymentBadge status={request.paymentStatus} />
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Patient Name</p>
              <p className="font-semibold">
                {patient
                  ? `${patient.firstName} ${patient.lastName}`
                  : request.fullName || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Patient Email</p>
              <p>{patient?.email || request.email || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Phone</p>
              <p>{request.phone || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">DOB</p>
              <p>
                {request.dateOfBirth
                  ? new Date(request.dateOfBirth).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Reason</p>
              <p>{request.reason || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Symptoms</p>
              <p>{request.symptoms || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Start Date</p>
              <p>
                {request.startDate
                  ? new Date(request.startDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">End Date</p>
              <p>
                {request.endDate
                  ? new Date(request.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-2 text-sm text-slate-400">Additional Notes</p>
            <p>{request.additionalNotes || "No additional notes provided."}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-3 text-sm text-slate-400">Assigned Doctor</p>

            {doctor ? (
              <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="font-semibold">
                  {doctor.firstName} {doctor.lastName}
                </p>
                <p className="text-sm text-slate-300">{doctor.email}</p>
              </div>
            ) : (
              <p className="mb-4 text-sm text-slate-400">No doctor assigned yet.</p>
            )}

            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
                    Dr. {doctor.firstName} {doctor.lastName}
                    {doctor.specialization ? ` — ${doctor.specialization}` : ""}
                  </option>
                ))}
              </select>

              <Button
                onClick={handleAssignDoctor}
                disabled={assigning}
                className="bg-[#ff8f80] text-white hover:bg-[#ff7d6c]"
              >
                {assigning ? "Assigning..." : "Assign Doctor"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}