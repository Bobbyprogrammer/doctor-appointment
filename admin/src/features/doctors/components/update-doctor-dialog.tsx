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
import DoctorForm from "./doctor-form";
import { useDoctors } from "@/features/doctors/context/DoctorsContext";
import type { Doctor, UpdateDoctorPayload } from "@/types/doctor";

interface UpdateDoctorDialogProps {
  doctor: Doctor;
}

const UpdateDoctorDialog = ({ doctor }: UpdateDoctorDialogProps) => {
  const { editDoctor } = useDoctors();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async (payload: UpdateDoctorPayload | any) => {
    try {
      setSubmitting(true);

      const success = await editDoctor(doctor._id || doctor.id || "", payload);

      if (success) {
        toast.success("Doctor updated successfully");
        setOpen(false);
      } else {
        toast.error("Failed to update doctor");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white">
          <Pencil className="h-4 w-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl  max-h-[90vh] overflow-y-auto border-white/10 bg-[#24303d] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-blue-400" />
            Update Doctor
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Update doctor profile information.
          </DialogDescription>
        </DialogHeader>

        <DoctorForm
          defaultValues={doctor}
          submitting={submitting}
          onSubmit={handleUpdate}
          submitLabel="Update Doctor"
          isEdit
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDoctorDialog;