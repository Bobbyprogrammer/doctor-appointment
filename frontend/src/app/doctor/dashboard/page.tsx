"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface DoctorDashboardStats {
  assignedConsultations: number;
  underReviewConsultations: number;
  completedConsultations: number;

  assignedSickCertificates: number;
  underReviewSickCertificates: number;
  completedSickCertificates: number;
}

interface DoctorDashboardResponse {
  success: boolean;
  stats: DoctorDashboardStats;
  message?: string;
}

export default function DoctorDashboardPage() {
  const [stats, setStats] = useState<DoctorDashboardStats>({
    assignedConsultations: 0,
    underReviewConsultations: 0,
    completedConsultations: 0,

    assignedSickCertificates: 0,
    underReviewSickCertificates: 0,
    completedSickCertificates: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const { data } = await api.get<DoctorDashboardResponse>(
        "/doctors/dashboard-stats"
      );

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching doctor dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-r from-green-600 to-teal-600 p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-white">
          Doctor Dashboard
        </h1>
        <p className="mt-2 text-sm text-green-100">
          Manage your consultations and patient cases efficiently.
        </p>
      </div>

      {/* CONSULTATION STATS */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">
          Consultation Overview
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#24303d] p-6 shadow">
            <h3 className="text-sm text-slate-400">Assigned Cases</h3>
            <p className="mt-2 text-2xl font-bold">
              {loading ? "..." : stats.assignedConsultations}
            </p>
          </div>

          <div className="rounded-2xl bg-[#24303d] p-6 shadow">
            <h3 className="text-sm text-slate-400">Under Review</h3>
            <p className="mt-2 text-2xl font-bold">
              {loading ? "..." : stats.underReviewConsultations}
            </p>
          </div>

          <div className="rounded-2xl bg-[#24303d] p-6 shadow">
            <h3 className="text-sm text-slate-400">Completed</h3>
            <p className="mt-2 text-2xl font-bold">
              {loading ? "..." : stats.completedConsultations}
            </p>
          </div>
        </div>
      </div>

      {/* SICK CERTIFICATE STATS */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">
          Sick Certificate Overview
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#24303d] p-6 shadow">
            <h3 className="text-sm text-slate-400">Assigned Requests</h3>
            <p className="mt-2 text-2xl font-bold">
              {loading ? "..." : stats.assignedSickCertificates}
            </p>
          </div>

          <div className="rounded-2xl bg-[#24303d] p-6 shadow">
            <h3 className="text-sm text-slate-400">Under Review</h3>
            <p className="mt-2 text-2xl font-bold">
              {loading ? "..." : stats.underReviewSickCertificates}
            </p>
          </div>

          <div className="rounded-2xl bg-[#24303d] p-6 shadow">
            <h3 className="text-sm text-slate-400">Completed</h3>
            <p className="mt-2 text-2xl font-bold">
              {loading ? "..." : stats.completedSickCertificates}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}