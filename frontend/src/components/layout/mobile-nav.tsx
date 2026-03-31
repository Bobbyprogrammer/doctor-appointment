"use client";

import Link from "next/link";
import { Menu, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

export default function MobilePublicNav() {
  const { user, loading } = useAuth();

  const dashboardHref =
    user?.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[320px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Telemedicine
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-4 flex flex-col gap-3">
            {!loading && !user ? (
              <>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            ) : null}

            {!loading && user ? (
              <Link href={dashboardHref}>
                <Button className="w-full">Dashboard</Button>
              </Link>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}