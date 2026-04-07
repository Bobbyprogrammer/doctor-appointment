"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SickCertificatePaymentCancelledPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-3xl border border-white/10 bg-[#24303d] p-10 text-center text-white shadow-xl">
        <h1 className="text-3xl font-bold text-red-400">Payment Cancelled</h1>
        <p className="mt-3 text-slate-300">
          Your payment was cancelled. You can try again from your sick certificate requests page.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/sick-certificates">
            <Button>Back to Requests</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}