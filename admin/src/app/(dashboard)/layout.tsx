"use client";

import { ReactNode, useState } from "react";
import AppSidebar from "@/components/layout/app-sidebar";
import AppHeader from "@/components/layout/app-header";
import MobileSidebar from "@/components/layout/mobile-sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#2F3A48]">
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <MobileSidebar
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AppHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />

          <main className="flex-1 min-w-0">
            <div className="w-full px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;