"use client";

import { useDoctorSickCertificates, DoctorSickCertificatesProvider } from "@/features/doctor-sick-certificates/context/DoctorSickCertificatesContext";
import DoctorSickCertificateCard from "@/features/doctor-sick-certificates/components/doctor-sick-certificate-card";

function PageContent() {
  const { requests, loading } = useDoctorSickCertificates();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <h1 className="text-3xl font-bold text-white">
          Sick Certificate Requests
        </h1>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : requests.length > 0 ? (
        requests.map((req) => (
          <DoctorSickCertificateCard key={req._id} request={req} />
        ))
      ) : (
        <p className="text-slate-400">No requests assigned</p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <DoctorSickCertificatesProvider>
      <PageContent />
    </DoctorSickCertificatesProvider>
  );
}