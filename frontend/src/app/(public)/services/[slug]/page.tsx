"use client";

import { useParams, useRouter } from "next/navigation";
import { useServices } from "@/features/services/context/ServicesContext";
import ServiceDetail from "@/features/services/components/service-details"


export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { services, loading, getServiceBySlug } = useServices();
 

  const slug = params?.slug as string;
  const service = getServiceBySlug(slug);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="h-96 animate-pulse rounded-3xl bg-muted" />
      </main>
    );
  }

  if (!service) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl border border-dashed p-12 text-center">
          <h1 className="text-2xl font-bold">Service not found</h1>
          <p className="mt-3 text-muted-foreground">
            The service you are looking for does not exist or is unavailable.
          </p>

          <button
            onClick={() => router.push("/services")}
            className="mt-6 rounded-xl bg-primary px-5 py-3 text-primary-foreground"
          >
            Back to Services
          </button>
        </div>
      </main>
    );
  }

  return <ServiceDetail service={service} />;
}