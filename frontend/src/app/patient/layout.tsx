"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import PatientSidebar from "@/components/patient-layout/patient-sidebar";
import PatientHeader from "@/components/patient-layout/patient-header";
import PatientMobileSidebar from "@/components/patient-layout/patient-mobile-sidebar";

export default function PatientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "patient") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2F3A48] text-white">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "patient") return null;

  return (
    <div className="min-h-screen w-full bg-[#2F3A48]">
      <div className="flex min-h-screen w-full">
        <PatientSidebar />

        <PatientMobileSidebar
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <PatientHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />

          <main className="flex-1 min-w-0">
            <div className="w-full px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}