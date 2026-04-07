"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

interface PharmacySnapshot {
  name?: string;
  email?: string;
  phone?: string;
  town?: string;
  county?: string;
  eircode?: string;
}

interface Props {
  prescriptionId: string;
  pdfUrl?: string;
  pharmacySnapshot?: PharmacySnapshot | null;
  patientEmail?: string;
  sentToPharmacy?: boolean;
  sentToPatientEmail?: boolean;
}

export default function PrescriptionActions({
  prescriptionId,
  pdfUrl,
  pharmacySnapshot,
  patientEmail,
  sentToPharmacy = false,
  sentToPatientEmail = false,
}: Props) {
  const [sendingPharmacy, setSendingPharmacy] = useState(false);
  const [sendingPatient, setSendingPatient] = useState(false);

  const canSendToPharmacy = !!pharmacySnapshot?.email;
  const canSendToPatient = !!patientEmail;
  const canDownload = !!pdfUrl;

  const handleSendToPharmacy = async () => {
    try {
      setSendingPharmacy(true);

      const { data } = await api.post(
        `/prescriptions/${prescriptionId}/send-to-pharmacy`
      );

      if (data.success) {
        toast.success(data.message || "Prescription sent to pharmacy");
        return;
      }

      toast.error(data.message || "Failed to send prescription to pharmacy");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send prescription to pharmacy"
      );
    } finally {
      setSendingPharmacy(false);
    }
  };

  const handleSendToPatient = async () => {
    try {
      setSendingPatient(true);

      const { data } = await api.post(
        `/prescriptions/${prescriptionId}/send-to-patient-email`
      );

      if (data.success) {
        toast.success(data.message || "Prescription sent to patient email");
        return;
      }

      toast.error(data.message || "Failed to send prescription to patient");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send prescription to patient"
      );
    } finally {
      setSendingPatient(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
      return;
    }

    window.open(`/api/prescriptions/${prescriptionId}/download`, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-3 font-semibold text-white">Prescription Actions</h3>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            type="button"
            onClick={handleSendToPharmacy}
            disabled={!canSendToPharmacy || sendingPharmacy}
            className="bg-blue-600 text-white hover:bg-blue-500"
          >
            {sendingPharmacy
              ? "Sending..."
              : sentToPharmacy
              ? "Sent to Pharmacy"
              : "Send to Pharmacy"}
          </Button>

          <Button
            type="button"
            onClick={handleSendToPatient}
            disabled={!canSendToPatient || sendingPatient}
            className="bg-emerald-600 text-white hover:bg-emerald-500"
          >
            {sendingPatient
              ? "Sending..."
              : sentToPatientEmail
              ? "Sent to Patient"
              : "Send to Patient Email"}
          </Button>

          <Button
            type="button"
            onClick={handleDownload}
            disabled={!canDownload}
            className="bg-amber-600 text-white hover:bg-amber-500"
          >
            Download PDF
          </Button>
        </div>

        <div className="mt-4 space-y-1 text-xs text-slate-400">
          <p>
            Pharmacy email: {pharmacySnapshot?.email || "Not available"}
          </p>
          <p>
            Patient email: {patientEmail || "Not available"}
          </p>
          {!pdfUrl && (
            <p className="text-red-400">
              PDF abhi available nahi hai. Backend generate hone ke baad button work karega.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}