"use client";

import { Menu, LogOut, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/context/AuthContext";

interface AppHeaderProps {
  onOpenSidebar: () => void;
}

const AppHeader = ({ onOpenSidebar }: AppHeaderProps) => {
  const { admin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-white/10 bg-[#2F3A48]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 hover:text-white lg:hidden"
          onClick={onOpenSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="hidden w-72 items-center rounded-xl border border-white/10 bg-white/5 px-3 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search here..."
            className="border-0 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 hover:text-white"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-white">
            {admin?.firstName} {admin?.lastName}
          </p>
          <p className="text-xs text-slate-400">{admin?.email}</p>
        </div>

        <Button
          variant="outline"
          onClick={logout}
          className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;