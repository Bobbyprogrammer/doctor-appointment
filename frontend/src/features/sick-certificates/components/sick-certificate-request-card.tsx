"use client";

import { Button } from "@/components/ui/button";
import type { SickCertificate } from "@/types/sick-certificate";

interface Props {
  request: SickCertificate;
}

const currency = process.env.NEXT_PUBLIC_CURRENCY || "€";

export default function SickCertificateRequestCard({ request }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#24303d] p-6 text-white shadow-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400">Reference</p>
            <h3 className="text-xl font-bold">{request.reference}</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <p className="text-sm">
              <span className="text-slate-400">Purpose: </span>
              <span className="capitalize">
                {request.certificatePurpose.replaceAll("_", " ")}
              </span>
            </p>

            <p className="text-sm">
              <span className="text-slate-400">Variation: </span>
              <span className="capitalize">{request.variationType}</span>
            </p>

            <p className="text-sm">
              <span className="text-slate-400">Amount: </span>
              {currency}
              {request.amount}
            </p>

            <p className="text-sm">
              <span className="text-slate-400">Dates: </span>
              {request.startDate
                ? `${new Date(request.startDate).toLocaleDateString()} → ${new Date(
                    request.endDate
                  ).toLocaleDateString()}`
                : "-"}
            </p>
          </div>

          <p className="line-clamp-2 text-sm text-slate-300">
            {request.illnessDescription || "No illness description provided."}
          </p>
        </div>

        <div className="flex min-w-[220px] flex-col gap-3 lg:items-end">
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
            {request.status.replaceAll("_", " ")}
          </span>

          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-300">
            {request.paymentStatus}
          </span>

          {request.certificatePdfUrl ? (
            <a href={request.certificatePdfUrl} target="_blank" rel="noreferrer">
              <Button className="w-full sm:w-auto">Download PDF</Button>
            </a>
          ) : (
            <Button disabled className="w-full sm:w-auto">
              Awaiting Certificate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}