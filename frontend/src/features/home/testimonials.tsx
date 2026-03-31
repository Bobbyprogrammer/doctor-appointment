"use client";

import { useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const reviews = [
  {
    name: "Ali Khan",
    text: "Very fast and professional service!",
    role: "Patient",
  },
  {
    name: "Sara Ahmed",
    text: "Got prescription within hours. Amazing!",
    role: "Patient",
  },
  {
    name: "Usman Tariq",
    text: "The consultation process was smooth and very easy to follow.",
    role: "Patient",
  },
  {
    name: "Hina Malik",
    text: "I booked for my child and the doctor response was excellent.",
    role: "Parent",
  },
  {
    name: "Areeba Noor",
    text: "Very convenient and secure platform. Highly recommended.",
    role: "Patient",
  },
];

export default function Testimonials() {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center text-3xl font-bold">
          What Patients Say
        </h2>

        <Carousel
          plugins={[autoplay]}
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full rounded-2xl bg-background p-6 shadow-md">
                  <div className="mb-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground">"{review.text}"</p>

                  <div className="mt-6">
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.role}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}