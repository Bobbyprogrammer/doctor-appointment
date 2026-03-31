import Image from "next/image";
import { ShieldCheck, HeartPulse, Users, Stethoscope } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description:
      "We are committed to protecting patient information and building a safe digital healthcare experience.",
  },
  {
    icon: HeartPulse,
    title: "Patient-Centered Care",
    description:
      "Every feature is designed to make healthcare more accessible, convenient, and supportive for patients.",
  },
  {
    icon: Users,
    title: "Trusted Professionals",
    description:
      "Our platform supports care workflows involving qualified healthcare professionals and structured review processes.",
  },
  {
    icon: Stethoscope,
    title: "Modern Telemedicine",
    description:
      "We combine healthcare and technology to make consultations, prescriptions, and follow-up simpler and faster.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background">
      <section className="border-b bg-gradient-to-b from-primary/10 to-transparent">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              About Us
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Making healthcare simpler, faster, and more accessible
            </h1>
            <p className="text-lg text-muted-foreground">
              Our telemedicine platform is designed to help patients access
              healthcare services online with confidence. From consultation
              requests to medical review, prescriptions, and support, we aim to
              create a smooth digital care experience built around convenience,
              trust, and patient safety.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1400&auto=format&fit=crop"
              alt="Healthcare professionals working together"
              width={1400}
              height={900}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1400&auto=format&fit=crop"
              alt="Online healthcare and telemedicine"
              width={1400}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-5">
            <h2 className="text-3xl font-bold">Who we are</h2>
            <p className="text-muted-foreground leading-7">
              We are building a healthcare platform focused on improving how
              patients connect with medical services online. Instead of making
              users navigate complicated systems, we aim to provide a clear,
              secure, and structured consultation journey.
            </p>
            <p className="text-muted-foreground leading-7">
              The platform supports service-based consultation requests, secure
              patient information handling, medical questionnaires, doctor
              assignment workflows, and healthcare-related outcomes such as
              prescriptions or certificates where appropriate.
            </p>
            <p className="text-muted-foreground leading-7">
              Our goal is not only to provide convenience, but also to build a
              trustworthy digital healthcare experience that feels professional,
              clear, and easy to use.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Our Values
            </p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              What drives our platform
            </h2>
            <p className="mt-4 text-muted-foreground">
              We believe digital healthcare should be built around trust,
              accessibility, security, and a smooth patient experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-3xl bg-background p-6 shadow-sm"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Our Mission
            </p>
            <h2 className="text-3xl font-bold">Why this platform matters</h2>
            <p className="text-muted-foreground leading-7">
              Healthcare access should not feel difficult or delayed. Our
              mission is to reduce friction in the consultation process by
              helping patients access medical services online in a way that is
              understandable, efficient, and supportive.
            </p>
            <p className="text-muted-foreground leading-7">
              By combining service-based consultation flows, secure digital
              records, doctor assignment workflows, and patient-friendly
              interfaces, we aim to make telemedicine approachable for everyday
              use.
            </p>
            <p className="text-muted-foreground leading-7">
              We are focused on building a platform that not only works well
              technically, but also feels reassuring and professional for the
              people who depend on it.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1400&auto=format&fit=crop"
              alt="Doctor reviewing healthcare information"
              width={1400}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold">Built for modern care</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Our platform is designed to support a modern telemedicine model
              where patients can access services online, complete guided
              consultation steps, upload relevant files, make payments, and
              receive timely review. The aim is to make the healthcare journey
              simpler without reducing the quality, structure, or professionalism
              expected from a healthcare experience.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/services"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Explore Services
              </a>
              <a
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-xl border px-6 text-sm font-medium transition hover:bg-muted"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}