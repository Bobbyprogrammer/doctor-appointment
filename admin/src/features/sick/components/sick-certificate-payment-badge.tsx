"use client";

import clsx from "clsx";
import type { PaymentStatus } from "@/types/sick-certificate";

export default function SickCertificatePaymentBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const styles: Record<PaymentStatus, string> = {
    unpaid: "bg-red-500/20 text-red-300 border-red-500/20",
    paid: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
    refunded: "bg-slate-500/20 text-slate-300 border-slate-500/20",
  };

  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}