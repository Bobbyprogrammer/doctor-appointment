"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelledPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold">Payment Cancelled</h1>

        <p className="mt-3 text-muted-foreground">
          Your payment was not completed. You can return to your consultations
          and try again anytime.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/patient/consultations">Back to Consultations</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/services">Browse Services</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}