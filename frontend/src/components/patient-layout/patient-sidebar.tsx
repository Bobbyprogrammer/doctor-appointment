"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CalendarPlus,
  BriefcaseMedical,
  Pill,
  BadgeCheck,
  FolderOpen,
  UserRound,
  Settings,
  HeartPulse,
  HomeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    label: "Dashboard",
    href: "/patient/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Consultations",
    href: "/patient/consultations",
    icon: FileText,
  },
  // {
  //   label: "Book Consultation",
  //   href: "/patient/consultations/new",
  //   icon: CalendarPlus,
  // },
  // {
  //   label: "Services",
  //   href: "/patient/services",
  //   icon: BriefcaseMedical,
  // },
  {
    label: "Prescriptions",
    href: "/patient/prescriptions",
    icon: Pill,
  },
  {
    label: "Certificates",
    href: "/patient/certificates",
    icon: BadgeCheck,
  },
  {
    label: "Medical Records",
    href: "/patient/medical-records",
    icon: FolderOpen,
  },
  {
    label: "Profile",
    href: "/patient/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    href: "/patient/settings",
    icon: Settings,
  },
];

export default function PatientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] border-r border-white/10 bg-[#24303d] xl:flex xl:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <HeartPulse className="h-6 w-6 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Patient Panel</h2>
          <p className="text-sm text-slate-400">Telemedicine Care</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}