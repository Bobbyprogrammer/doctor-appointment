"use client";

import { useEffect } from "react";
import { useConsultations } from "@/features/consultations/context/ConsultationsContext";
import MyConsultationCard from "@/features/consultations/components/my-consultation-card";

export default function MyConsultationsPage() {
  const { consultations, loading, fetchMyConsultations } = useConsultations();

  useEffect(() => {
    fetchMyConsultations();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-purple-700 p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">My Consultations</h1>
        <p className="mt-2 text-sm text-blue-100">
          Track your consultation requests, statuses, payments, and uploaded
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
      ) : consultations.length > 0 ? (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <MyConsultationCard
              key={consultation._id || consultation.id}
              consultation={consultation}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#24303d] p-10 text-center text-slate-400">
          You do not have any consultations yet.
        </div>
      )}
    </div>
  );
}