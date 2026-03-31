"use client";

import { useEffect } from "react";
import { PrescriptionsProvider, usePrescriptions } from "@/features/prescriptions/context/PrescriptionsContext";
import PrescriptionCard from "@/features/prescriptions/components/prescription-card";

function PrescriptionsPageContent() {
  const { prescriptions, loading, fetchMyPrescriptions } = usePrescriptions();

  useEffect(() => {
    fetchMyPrescriptions();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-purple-700 p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">My Prescriptions</h1>
        <p className="mt-2 text-sm text-blue-100">
          View your issued prescriptions, medicines, doctor notes, and attached
          files in one place.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-3xl bg-[#24303d]"
            />
          ))}
        </div>
      ) : prescriptions.length > 0 ? (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription._id || prescription.id}
              prescription={prescription}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#24303d] p-10 text-center text-slate-400">
          You do not have any prescriptions yet.
        </div>
      )}
    </div>
  );
}

export default function PrescriptionsPage() {
  return (
    <PrescriptionsProvider>
      <PrescriptionsPageContent />
    </PrescriptionsProvider>
  );
}