"use client";

import { useSearchParams } from "next/navigation";
import ConsultationBookingForm from "@/features/consultations/components/consultation-booking-form";

export default function NewConsultationPage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const serviceName = searchParams.get("serviceName") || "";
  const amount = Number(searchParams.get("amount")) || 0;
  if (!serviceId) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl border border-dashed p-10 text-center">
          Service not selected.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <ConsultationBookingForm serviceId={serviceId}    serviceName={serviceName}
  amount={amount} 
  />
    </main>
  );
}