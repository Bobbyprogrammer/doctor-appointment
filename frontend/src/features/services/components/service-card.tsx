import Link from "next/link";
import { Clock3, Stethoscope, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/service";
const currnecy=process.env.NEXT_PUBLIC_CURRENCY
interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const hasDiscount =
    service.discountedPrice !== null &&
    service.discountedPrice < service.price;

  return (
    <Card className="h-full rounded-2xl border-border/50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-2xl bg-primary/10 p-3">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
            {service.category}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{service.name}</h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {service.description || "Professional online consultation service."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary" />
            <span>{service.durationMinutes} min</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="capitalize">{service.doctorType}</span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {currnecy}{service.price}
                </span>
                <span className="text-2xl font-bold text-primary">
                {currnecy}{service.discountedPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">
                {currnecy}{service.price}
              </span>
            )}
          </div>

          <Link href={`/services/${service.slug}`}>
            <Button>View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}