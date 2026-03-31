import SidebarNav from "./sidebar-nav";
import { ShieldCheck } from "lucide-react";

const AppSidebar = () => {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-white/10 bg-[#24303d] lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Admin Panel</h2>
          <p className="text-xs text-slate-400">Telemedicine CRM</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <SidebarNav />
      </div>
    </aside>
  );
};

export default AppSidebar;