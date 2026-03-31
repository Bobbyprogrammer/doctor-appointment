"use client";

import {
  FileText,
  Clock3,
  CheckCircle2,
  Pill,
  CalendarPlus,
  UserRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const stats = [
  {
    title: "Total Consultations",
    value: 8,
    icon: FileText,
  },
  {
    title: "Pending Review",
    value: 3,
    icon: Clock3,
  },
  {
    title: "Completed",
    value: 4,
    icon: CheckCircle2,
  },
  {
    title: "Prescriptions",
    value: 2,
    icon: Pill,
  },
];

export default function PatientDashboardPage() {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-purple-700 p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-blue-100">
          Manage your healthcare services, consultations, and personal records
          from one place.
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

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-[#24303d] text-white shadow-xl">
          <CardHeader>
            <CardTitle>Recent Consultations</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <p className="font-medium text-white">
                      General Consultation
                    </p>
                    <p className="text-sm text-slate-400">
                      Reference: CON-0000{item}
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#24303d] text-white shadow-xl">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push("/patient/consultations/new")}
              className="h-11 w-full justify-start"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Book New Consultation
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/patient/consultations")}
              className="h-11 w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <FileText className="mr-2 h-4 w-4" />
              View My Consultations
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/patient/profile")}
              className="h-11 w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <UserRound className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}