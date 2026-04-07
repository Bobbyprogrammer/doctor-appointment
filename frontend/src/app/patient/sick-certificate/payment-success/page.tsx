"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

export default function SickCertificatePaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) return;

      try {
        const { data } = await api.get(
          `/sick-certificates/verify-payment/${sessionId}`
        );

        if (data.success) {
          toast.success("Payment verified successfully");
        } else {
          toast.error(data.message || "Payment verification failed");
        }
      } catch (error) {
        toast.error("Unable to verify payment");
      }
    };

    verify();
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-3xl border border-white/10 bg-[#24303d] p-10 text-center text-white shadow-xl">
        <h1 className="text-3xl font-bold text-green-400">Payment Successful</h1>
        <p className="mt-3 text-slate-300">
          Your sick certificate request has been submitted successfully and is now
          waiting for medical review.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/sick-certificates">
            <Button>Go to Requests</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}