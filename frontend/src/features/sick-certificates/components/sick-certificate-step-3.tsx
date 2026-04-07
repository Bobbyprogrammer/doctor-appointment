"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { CreateSickCertificatePayload } from "@/types/sick-certificate";

interface Props {
  form: CreateSickCertificatePayload;
  updateForm: (data: Partial<CreateSickCertificatePayload>) => void;
  onPrev: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

const currency = process.env.NEXT_PUBLIC_CURRENCY || "€";

export default function SickCertificateStep3({
  form,
  updateForm,
  onPrev,
  onSubmit,
  submitting,
}: Props) {
  useEffect(() => {
    // always force one fixed package
    updateForm({
      variationType: "express",
      amount: 20,
    });
  }, [updateForm]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Review & Checkout</h2>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[1fr_160px] bg-[#2c3947] px-4 py-3 text-sm font-semibold">
          <p>Service</p>
          <p>Price</p>
        </div>

        <div className="grid grid-cols-[1fr_160px] items-center border-t border-white/10 px-4 py-4">
          <div>
            <p className="font-medium">Sick Certificate</p>
            <p className="text-sm text-slate-400">
              Standard medical certificate request
            </p>
          </div>
          <p className="font-semibold">{currency}20.00</p>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
        Total payable amount: <span className="font-bold">{currency}20.00</span>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrev} className="text-black">
          Previous
        </Button>

        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-[#ff8f80] text-white hover:bg-[#ff7d6c]"
        >
          {submitting ? "Processing..." : `Submit & Pay ${currency}20.00`}
        </Button>
      </div>
    </div>
  );
}