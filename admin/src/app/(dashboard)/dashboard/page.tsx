"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";
import {
  Users,
  UserRound,
  BriefcaseMedical,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type StatItem = {
  title: string;
  value: number;
  icon: LucideIcon;
};

const iconMap = {
  users: Users,
  doctors: UserRound,
  services: BriefcaseMedical,
  consultations: FileText,
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admins/stats");

      if (data.success) {
        const formattedStats: StatItem[] = [
          {
            title: "Total Patients",
            value: Number(data.stats.totalPatients || 0),
            icon: iconMap.users,
          },
          {
            title: "Total Doctors",
            value: Number(data.stats.totalDoctors || 0),
            icon: iconMap.doctors,
          },
          {
            title: "Total Services",
            value: Number(data.stats.totalServices || 0),
            icon: iconMap.services,
          },
          {
            title: "Total Consultations",
            value: Number(data.stats.totalConsultations || 0),
            icon: iconMap.consultations,
          },
        ];

        setStats(formattedStats);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-purple-700 p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-blue-100">
          Welcome to your telemedicine admin dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="border-white/10 bg-[#24303d] text-white shadow-xl"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {item.title}
                </CardTitle>
                <div className="rounded-xl bg-white/10 p-3">
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-white/10 bg-[#24303d] text-white shadow-xl">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">
            Your recent activity, charts, tables, and analytics will appear here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}