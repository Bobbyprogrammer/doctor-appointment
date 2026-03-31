"use client";

import { useEffect } from "react";
import {
  DoctorConsultationsProvider,
  useDoctorConsultations,
} from "@/features/doctor-consultations/context/DoctorConsultationsContext";
import DoctorConsultationCard from "@/features/doctor-consultations/components/doctor-consultation-card";

function DoctorConsultationsPageContent() {
  const { consultations, loading, fetchAssignedConsultations } =
    useDoctorConsultations();

  useEffect(() => {
    fetchAssignedConsultations();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-r from-green-600 to-teal-600 p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">Assigned Consultations</h1>
        <p className="mt-2 text-sm text-green-100">
          Review assigned patient cases, check details, and continue treatment workflow.
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
      ) : consultations.length > 0 ? (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <DoctorConsultationCard
              key={consultation._id || consultation.id}
              consultation={consultation}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#24303d] p-10 text-center text-slate-400">
          No consultations have been assigned to you yet.
        </div>
      )}
    </div>
  );
}

export default function DoctorConsultationsPage() {
  return (
    <DoctorConsultationsProvider>
      <DoctorConsultationsPageContent />
    </DoctorConsultationsProvider>
  );
}