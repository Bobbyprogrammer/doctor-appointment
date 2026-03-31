"use client";

import { useState } from "react";
import { Pencil, BriefcaseBusiness } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import ServiceForm from "./service-form";
import { useServices } from "@/features/services/context/ServicesContext";
import type { Service, UpdateServicePayload } from "@/types/service";

interface UpdateServiceDialogProps {
  service: Service;
}

const UpdateServiceDialog = ({ service }: UpdateServiceDialogProps) => {
  const { editService } = useServices();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async (payload: UpdateServicePayload | any) => {
    try {
      setSubmitting(true);

      const success = await editService(service._id || service.id || "", payload);

      if (success) {
        toast.success("Service updated successfully");
        setOpen(false);
      } else {
        toast.error("Failed to update service");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white">
          <Pencil className="h-4 w-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl border-white/10 bg-[#24303d] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-blue-400" />
            Update Service
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Update service details and availability settings.
          </DialogDescription>
        </DialogHeader>

        <ServiceForm
          defaultValues={service}
          submitting={submitting}
          onSubmit={handleUpdate}
          submitLabel="Update Service"
          isEdit
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateServiceDialog;