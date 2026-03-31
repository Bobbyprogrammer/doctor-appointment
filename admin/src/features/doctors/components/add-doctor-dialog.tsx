"use client";

import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DoctorForm from "./doctor-form";
import { useDoctors } from "@/features/doctors/context/DoctorsContext";
import type { CreateDoctorPayload } from "@/types/doctor";

const AddDoctorDialog = () => {
  const { addDoctor } = useDoctors();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateDoctor = async (payload: CreateDoctorPayload | any) => {
    try {
      setSubmitting(true);

      const success = await addDoctor(payload);

      if (success) {
        toast.success("Doctor created successfully");
        setOpen(false);
      } else {
        toast.error("Failed to create doctor");
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
        <Button className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 text-white hover:from-blue-500 hover:to-purple-500">
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#24303d] p-0 text-white">
        <div className="border-b border-white/10 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                <UserPlus className="h-5 w-5 text-blue-300" />
              </div>
              Add New Doctor
            </DialogTitle>

            <DialogDescription className="pt-1 text-slate-400">
              Create a new doctor account with profile details.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-6">
          <DoctorForm onSubmit={handleCreateDoctor} submitting={submitting} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorDialog;