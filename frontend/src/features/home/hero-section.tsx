"use client";

import Image from "next/image";
import { useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const heroSlides = [
  {
    title: "Consult Doctors Online Anytime, Anywhere",
    description:
      "Get expert medical advice, prescriptions, and care from certified doctors without leaving your home.",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop",
  },
  {
    title: "Trusted Care for You and Your Family",
    description:
      "Book safe and convenient consultations for yourself, your child, or loved ones from anywhere.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1170&auto=format&fit=crop",
  },
  {
    title: "Fast Access to Healthcare Services",
    description:
      "Choose a service, complete your consultation, and get reviewed quickly by experienced doctors.",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1170&auto=format&fit=crop",
  },
];

export default function HeroSection() {
  const router = useRouter();

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 3500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <Carousel
          plugins={[autoplay]}
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="grid items-center gap-10 md:grid-cols-2">
                  <div className="space-y-6">
                    <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                      Trusted Online Healthcare
                    </span>

                    <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                      {slide.title}
                    </h1>

                    <p className="text-lg text-muted-foreground">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <Button size="lg">Book Consultation</Button>

                      <Button
                        onClick={() => router.push("/services")}
                        size="lg"
                        variant="outline"
                      >
                        View Services
                      </Button>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={1170}
                      height={780}
                      className="h-[280px] w-full object-cover md:h-[500px]"
                      priority={index === 0}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-4 hidden md:flex" />
          <CarouselNext className="right-4 hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}