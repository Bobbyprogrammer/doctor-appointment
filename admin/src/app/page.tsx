"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      
      <div
        
        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-xl p-8 text-center"
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">
          Admin Panel
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Manage users, services, consultations and more.
        </p>

        {/* Button */}
        <Link href="/login">
          <Button className="w-full" size="lg">
            Login as Admin
          </Button>
        </Link>

        {/* Footer text */}
        <p className="text-xs text-zinc-400 mt-6">
          Secure admin access only
        </p>
      </div>

    </div>
  );
}