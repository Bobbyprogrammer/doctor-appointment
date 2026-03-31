import { ReactNode } from "react";
import PublicNavbar from "@/components/layout/public-header";
import PublicFooter from "@/components/layout/public-footer";
interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,99,71,0.18),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,99,71,0.10),transparent_25%)]" />
 <PublicNavbar/>
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8">
        {children}
      </div>
        <PublicFooter/>
    </div>
  );
}