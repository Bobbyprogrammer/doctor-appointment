"use client";

import { useRouter } from "next/navigation";
import {
  Clock3,
  Stethoscope,
  Users,
  BadgeDollarSign,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/service";
import { useAuth } from "@/features/auth/context/AuthContext";

interface ServiceDetailProps {
  service: Service;
}
const currnecy=process.env.NEXT_PUBLIC_CURRENCY
export default function ServiceDetail({ service }: ServiceDetailProps) {
  const router = useRouter();
 const {user}=useAuth()
  const hasDiscount =
    service.discountedPrice !== null &&
    service.discountedPrice < service.price;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <button
        onClick={() => router.push("/services")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Services
      </button>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 to-primary/5 p-8">
            <div className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              {service.category}
            </div>

            <h1 className="text-3xl font-bold md:text-5xl">{service.name}</h1>

            <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
              {service.description || "Professional online healthcare service tailored to your needs."}
            </p>


            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg">Book Consultation</Button>
              {
                !user && <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/register")}
              >
                Create Account
              </Button>
              }
              
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-3">
                <Clock3 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <h3 className="mt-1 text-xl font-semibold">
                {service.durationMinutes} min
              </h3>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-3">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Doctor Type</p>
              <h3 className="mt-1 text-xl font-semibold capitalize">
                {service.doctorType}
              </h3>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Child Booking</p>
              <h3 className="mt-1 text-xl font-semibold">
                {service.allowForChild ? "Allowed" : "Not Allowed"}
              </h3>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-3">
                <BadgeDollarSign className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Price</p>
              <h3 className="mt-1 text-xl font-semibold">
                {hasDiscount ? ` ${currnecy} ${service.discountedPrice}` : `${currnecy} ${service.price}`}
              </h3>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold">What this service includes</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Online consultation</h3>
                  <p className="text-sm text-muted-foreground">
                    Speak with a qualified healthcare professional remotely.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Medical review</h3>
                  <p className="text-sm text-muted-foreground">
                    Your symptoms and questionnaire answers are carefully reviewed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Treatment guidance</h3>
                  <p className="text-sm text-muted-foreground">
                    Get professional advice and next-step recommendations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Prescription support</h3>
                  <p className="text-sm text-muted-foreground">
                    Prescriptions may be issued where medically appropriate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Eligibility & booking rules</h2>

            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Age Range: </span>
                {service.minAge !== null || service.maxAge !== null
                  ? `${service.minAge ?? 0} - ${service.maxAge ?? "No limit"}`
                  : "No age restriction"}
              </p>

              <p>
                <span className="font-semibold text-foreground">
                  Can be booked for a child:{" "}
                </span>
                {service.allowForChild ? "Yes" : "No"}
              </p>

              <p>
                <span className="font-semibold text-foreground">
                  Can be booked for someone else:{" "}
                </span>
                {service.allowForSomeoneElse ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border bg-card p-8 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold">Service Summary</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{service.name}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium capitalize">{service.category}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{service.durationMinutes} min</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Doctor Type</span>
              <span className="font-medium capitalize">{service.doctorType}</span>
            </div>

            <div className="border-t pt-4">
              {hasDiscount ? (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground line-through">
                    {currnecy}{service.price}
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {currnecy}{service.discountedPrice}
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-primary">{currnecy}{service.price}</p>
              )}
            </div>

            <Button onClick={()=>router.push(`/patient/consultations/new?serviceId=${service._id}`)} className="mt-4 w-full" size="lg">
              Book This Service
            </Button>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => router.push("/contact")}
            >
              Ask a Question
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}