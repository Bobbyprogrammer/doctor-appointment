"use client";

import { useMemo, useState } from "react";
import { useServices } from "@/features/services/context/ServicesContext";
import ServiceCard from "@/features/services/components/service-card";

export default function ServicesPage() {
  const { services, loading } = useServices();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        services
          .map((service) => service.category?.trim())
          .filter(Boolean)
      )
    );

    return ["all", ...uniqueCategories];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === "all") return services;

    return services.filter(
      (service) =>
        service.category?.toLowerCase().trim() ===
        selectedCategory.toLowerCase().trim()
    );
  }, [services, selectedCategory]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Services
        </p>
        <h1 className="text-4xl font-bold">All Medical Services</h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse all available consultation services and choose the one that
          matches your healthcare needs.
        </p>
      </div>

      {!loading && categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "border border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {category === "all" ? "All" : category}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id || service.id || service.slug}
              service={service}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No services available in this category.
        </div>
      )}
    </main>
  );
}