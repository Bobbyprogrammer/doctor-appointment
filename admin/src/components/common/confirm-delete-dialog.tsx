"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
  title?: string;
  description?: string;
  onConfirm: () => void;
}

const ConfirmDeleteDialog = ({
  title = "Delete Record",
  description = "Are you sure you want to delete this record? This action cannot be undone.",
  onConfirm,
}: ConfirmDeleteDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          size="icon"
          variant="ghost"
          className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-white/10 bg-[#24303d] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-slate-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-[#24303d] text-white hover:bg-[#24303d]">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-500"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;