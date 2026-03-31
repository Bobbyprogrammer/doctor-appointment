"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SidebarNav from "./sidebar-nav";
import { ShieldCheck } from "lucide-react";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileSidebar = ({ open, onOpenChange }: MobileSidebarProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-72 border-white/10 bg-[#24303d] p-0 text-white"
      >
        <SheetHeader className="border-b border-white/10 px-6 py-5 text-left">
          <SheetTitle className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold">Admin Panel</span>
              <span className="text-xs font-normal text-slate-400">
                Telemedicine CRM
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 py-6">
          <SidebarNav onNavigate={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;