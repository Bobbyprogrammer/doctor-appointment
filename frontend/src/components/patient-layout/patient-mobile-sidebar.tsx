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
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface PatientMobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
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
  {
    label: "Book Consultation",
    href: "/patient/consultations/new",
    icon: CalendarPlus,
  },
  {
    label: "Services",
    href: "/patient/services",
    icon: BriefcaseMedical,
  },
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

export default function PatientMobileSidebar({
  open,
  onOpenChange,
}: PatientMobileSidebarProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[280px] border-white/10 bg-[#24303d] p-0 text-white"
      >
        <SheetHeader className="border-b border-white/10 px-6 py-5 text-left">
          <SheetTitle className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            Patient Panel
          </SheetTitle>
        </SheetHeader>

        <nav className="space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
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
      </SheetContent>
    </Sheet>
  );
}