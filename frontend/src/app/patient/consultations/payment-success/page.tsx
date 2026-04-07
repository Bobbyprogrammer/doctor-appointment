"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold">Payment Successful</h1>

        <p className="mt-3 text-muted-foreground">
          Your payment was received successfully. Your consultation is now being
          prepared for doctor review.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/patient/consultations">View My Consultations</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/services">Book Another Service</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}