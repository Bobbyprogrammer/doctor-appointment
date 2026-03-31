import { Shield, Clock, UserCheck } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Platform",
  },
  {
    icon: Clock,
    title: "Fast Response",
  },
  {
    icon: UserCheck,
    title: "Certified Doctors",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4">
      <h2 className="mb-10 text-3xl font-bold text-center">
        Why Choose Us
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((f, i) => {
          const Icon = f.icon;

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-3 rounded-xl p-6 shadow"
            >
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">{f.title}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}