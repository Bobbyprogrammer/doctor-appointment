"use client";

import { Menu, LogOut, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PatientHeaderProps {
  onOpenSidebar: () => void;
}

export default function PatientHeader({
  onOpenSidebar,
}: PatientHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#2F3A48]/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSidebar}
            className="xl:hidden text-white hover:bg-white/10 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-white">
              Patient Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Manage your consultations and records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/patient/profile")}
            className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2 transition hover:bg-white/10"
          >
            <div className="text-right hidden sm:block">
             
              <p className="text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              {/* <p className="text-xs text-slate-400">{user?.email}</p> */}
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <UserCircle2 className="h-6 w-6 text-white" />
            </div>
          </button>

          <Button
            onClick={logout}
            variant="outline"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}