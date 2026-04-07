"use client";

import type { SickCertificateRequest } from "@/types/sick-certificate";
import DoctorSickCertificateDialog from "./doctor-sick-certificate-dialog";

const currency = process.env.NEXT_PUBLIC_CURRENCY || "€";

export default function DoctorSickCertificateCard({
  request,
}: {
  request: SickCertificateRequest;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#24303d] p-6 text-white">
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-bold">{request.reference}</h3>
          <p className="text-sm text-slate-400">{request.firstName} {request.lastName}</p>
          <p className="text-sm text-slate-400">{request.reason}</p>
        </div>

        <div className="text-right">
          <p>{currency}{request.amount}</p>
          <DoctorSickCertificateDialog request={request} />
        </div>
      </div>
    </div>
  );
}