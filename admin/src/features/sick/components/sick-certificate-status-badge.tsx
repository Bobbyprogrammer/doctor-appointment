"use client";

import clsx from "clsx";
import type { SickCertificateStatus } from "@/types/sick-certificate";

export default function SickCertificateStatusBadge({
  status,
}: {
  status: SickCertificateStatus;
}) {
  const styles: Record<SickCertificateStatus, string> = {
    pending_payment: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20",
    waiting_for_review: "bg-blue-500/20 text-blue-300 border-blue-500/20",
    under_review: "bg-purple-500/20 text-purple-300 border-purple-500/20",
    approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
    rejected: "bg-red-500/20 text-red-300 border-red-500/20",
    completed: "bg-green-500/20 text-green-300 border-green-500/20",
  };

  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize",
        styles[status]
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}