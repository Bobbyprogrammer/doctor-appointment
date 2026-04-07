"use client";

import Link from "next/link";
import { Menu, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import MobilePublicNav from "./mobile-nav";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blogs" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Sick Certificate", href: "/patient/sick-certificate" },
];

export default function PublicNavbar() {
  const { user, loading } = useAuth();

  const dashboardHref =
    user?.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="./Logo.png" className="w-16 h-16" alt="" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && !user ? (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          ) : null}

          {!loading && user ? (
            <Link href={dashboardHref}>
              <Button>Dashboard</Button>
            </Link>
          ) : null}
        </div>

        <div className="md:hidden">
          <MobilePublicNav />
        </div>
      </div>
    </header>
  );
}