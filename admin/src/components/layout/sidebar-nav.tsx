"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  onNavigate?: () => void;
}

const SidebarNav = ({ onNavigate }: SidebarNavProps) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {sidebarRoutes.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
              isActive
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNav;