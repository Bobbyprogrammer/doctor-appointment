"use client";

import { useState } from "react";
import { Pencil, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import PatientForm from "./patient-form";
import { usePatients } from "@/features/patients/context/PatientsContext";
import type { Patient, UpdatePatientPayload } from "@/types/patient";

interface UpdatePatientDialogProps {
  patient: Patient;
}

const UpdatePatientDialog = ({ patient }: UpdatePatientDialogProps) => {
  const { editPatient } = usePatients();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async (payload: UpdatePatientPayload | any) => {
    try {
      setSubmitting(true);

      const success = await editPatient(patient._id || patient.id || "", payload);

      if (success) {
        toast.success("Patient updated successfully");
        setOpen(false);
      } else {
        toast.error("Failed to update patient");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button
          size="icon"
          variant="ghost"
          className="text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl border-white/10 bg-[#24303d] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-blue-400" />
            Update Patient
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Update patient profile information.
          </DialogDescription>
        </DialogHeader>

        <PatientForm
          defaultValues={patient}
          submitting={submitting}
          onSubmit={handleUpdate}
          submitLabel="Update Patient"
          isEdit
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePatientDialog;