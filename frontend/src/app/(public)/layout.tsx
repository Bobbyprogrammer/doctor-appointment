import { ReactNode } from "react";
import PublicNavbar from "@/components/layout/public-header";
import PublicFooter from "@/components/layout/public-footer";
interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 ">
      
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,99,71,0.15),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,99,71,0.1),transparent_30%)]" />

      {/* Content */}
      <div className="relative w-full ">
           <PublicNavbar/>
        {children}
           <PublicFooter/>
      </div>
    </div>
  );
}