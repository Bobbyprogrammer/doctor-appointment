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

interface CreatePrescriptionDialogProps {
  consultationId: string;
}

export default function CreatePrescriptionDialog({
  consultationId,
}: CreatePrescriptionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Add Prescription
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-2xl sm:max-w-5xl lg:max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#24303d] text-white">
        <DialogHeader>
          <DialogTitle>Create Prescription</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add diagnosis, medicines, notes, and files for this consultation.
          </DialogDescription>
        </DialogHeader>

        <CreatePrescriptionForm
          consultationId={consultationId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}