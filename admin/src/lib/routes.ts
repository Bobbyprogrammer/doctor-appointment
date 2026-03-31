import {
  LayoutDashboard,
  Users,
  UserRound,
  BriefcaseMedical,
  FileText,
  Settings,
  FileQuestion,
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const sidebarRoutes: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    href: "/users",
    icon: Users,
  },
  {
    title: "Doctors",
    href: "/doctors",
    icon: UserRound,
  },
  {
    title: "Services",
    href: "/services",
    icon: BriefcaseMedical,
  },
  {
    title: "Consultations",
    href: "/consultations",
    icon: FileText,
  },
  {
    title: "Questionnaires",
    href: "/questionnaires",
    icon: FileQuestion,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];