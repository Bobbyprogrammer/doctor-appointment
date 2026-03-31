"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useServices } from "@/features/services/context/ServicesContext";
import ServiceCard from "@/features/services/components/service-card";

export default function ServicesPreview() {
  const { services, loading } = useServices();

  const topServices = services.slice(0, 6);

  return (
    <section className="mx-auto w-full max-w-7xl px-4">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Our Services
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            Explore Our Online Medical Services
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Get quick access to trusted healthcare services from experienced
            professionals, all from the comfort of your home.
          </p>
        </div>

        <Link href="/services">
          <Button variant="outline">View All Services</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      ) : topServices.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {topServices.map((service) => (
            <ServiceCard
              key={service._id || service.id || service.slug}
              service={service}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No services available right now.
        </div>
      )}
    </section>
  );
}