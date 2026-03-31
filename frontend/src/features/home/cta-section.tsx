import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl font-bold">
        Ready to consult a doctor?
      </h2>

      <p className="mt-4 text-muted-foreground">
        Start your consultation now and get expert advice.
      </p>

      <Button size="lg" className="mt-6">
        Book Now
      </Button>
    </section>
  );
}