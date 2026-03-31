"use client";

import { useEffect } from "react";
import {
  DoctorPrescriptionsProvider,
  useDoctorPrescriptions,
} from "@/features/doctor-prescriptions/context/DoctorPrescriptionsContext";
import DoctorPrescriptionCard from "@/features/doctor-prescriptions/components/doctor-prescription-card";

function DoctorPrescriptionsPageContent() {
  const { prescriptions, loading, fetchDoctorPrescriptions } =
    useDoctorPrescriptions();

  useEffect(() => {
    fetchDoctorPrescriptions();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-r from-green-600 to-teal-600 p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">My Prescriptions</h1>
        <p className="mt-2 text-sm text-green-100">
          View prescriptions you have issued for your assigned consultations.
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
            <DoctorPrescriptionCard
              key={prescription._id || prescription.id}
              prescription={prescription}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#24303d] p-10 text-center text-slate-400">
          You have not created any prescriptions yet.
        </div>
      )}
    </div>
  );
}

export default function DoctorPrescriptionsPage() {
  return (
    <DoctorPrescriptionsProvider>
      <DoctorPrescriptionsPageContent />
    </DoctorPrescriptionsProvider>
  );
}