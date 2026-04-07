"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Stethoscope,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "doctor") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#1f2937] text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#111827] p-4 md:flex">
        <h2 className="mb-8 text-2xl font-bold text-white">
          Doctor Panel
        </h2>

        <nav className="flex flex-col gap-2">
          <Link
            href="/doctor/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/doctor/consultations"
            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10"
          >
            <Stethoscope size={18} />
            Consultations
          </Link>
          <Link
            href="/doctor/sick-certificates"
            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10"
          >
            <Stethoscope size={18} />
            Sick Certificates
          </Link>

          <Link
            href="/doctor/prescriptions"
            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10"
          >
            <FileText size={18} />
            Prescriptions
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#111827] px-6 py-4">
          <h1 className="text-lg font-semibold">
            Welcome Dr. {user?.firstName}
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.profilePic?.url ||
                  "https://i.pravatar.cc/100"
                }
                className="h-10 w-10 rounded-full object-cover"
                alt="profile"
              />
            </div>

            <Button
              onClick={logout}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}