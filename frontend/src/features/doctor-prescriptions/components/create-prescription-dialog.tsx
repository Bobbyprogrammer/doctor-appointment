"use client";

import { useState } from "react";
import { FilePlus2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreatePrescriptionForm from "./create-prescription-form";
import PrescriptionActions from "./prescription-actions";

interface PharmacySnapshot {
  registrationNumber?: string;
  name?: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  street3?: string;
  town?: string;
  county?: string;
  eircode?: string;
}

interface CreatedPrescription {
  _id?: string;
  id?: string;
  reference: string;
  pdfUrl?: string;
  pharmacySnapshot?: PharmacySnapshot;
  sentToPharmacy?: boolean;
  sentToPatientEmail?: boolean;
}

interface CreatePrescriptionDialogProps {
  consultationId: string;
  patientEmail?: string;
  pharmacySnapshot?: PharmacySnapshot | null;
}

export default function CreatePrescriptionDialog({
  consultationId,
  patientEmail,
  pharmacySnapshot,
}: CreatePrescriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [createdPrescription, setCreatedPrescription] =
    useState<CreatedPrescription | null>(null);

  const prescriptionId =
    createdPrescription?._id || createdPrescription?.id || "";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setCreatedPrescription(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Add Prescription
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-white/10 bg-[#24303d] text-white sm:max-w-5xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Prescription</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add diagnosis, medicines, notes, and files for this consultation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!createdPrescription ? (
            <CreatePrescriptionForm
              consultationId={consultationId}
              pharmacySnapshot={pharmacySnapshot}
              onSuccess={(prescription) => {
                setCreatedPrescription(prescription);
              }}
            />
          ) : (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="mb-2 font-semibold text-white">
                  Prescription Created
                </h3>
                <p className="text-sm text-slate-300">
                  Reference: {createdPrescription.reference}
                </p>
              </div>

              <PrescriptionActions
                prescriptionId={prescriptionId}
                pdfUrl={createdPrescription.pdfUrl}
                pharmacySnapshot={
                  createdPrescription.pharmacySnapshot || pharmacySnapshot
                }
                patientEmail={patientEmail}
                sentToPharmacy={createdPrescription.sentToPharmacy}
                sentToPatientEmail={createdPrescription.sentToPatientEmail}
              />

              <div className="flex justify-end">
                <Button type="button" onClick={() => setOpen(false)}>
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}