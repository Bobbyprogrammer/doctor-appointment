"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSickCertificates } from "@/features/sick-certificates/context/SickCertificatesContext";
import SickCertificateRequestCard from "@/features/sick-certificates/components/sick-certificate-request-card";

export default function SickCertificatesPage() {
  const { requests, loading, fetchMyRequests } = useSickCertificates();

  useEffect(() => {
    fetchMyRequests();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-r from-pink-600 to-rose-600 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Sick Certificates</h1>
            <p className="mt-2 text-sm text-pink-100">
              Manage your sick certificate requests and downloads.
            </p>
          </div>

          <Link href="/patient/sick-certificate/new">
            <Button className="bg-white text-black hover:bg-slate-100">
              New Request
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-3xl bg-[#24303d]"
            />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <SickCertificateRequestCard
              key={request._id || request.id}
              request={request}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#24303d] p-10 text-center text-slate-400">
          You do not have any sick certificate requests yet.
        </div>
      )}
    </div>
  );
}