const steps = [
  "Choose a service",
  "Fill consultation form",
  "Make payment",
  "Doctor reviews & responds",
];

export default function HowItWorks() {
  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="mb-10 text-3xl font-bold">How It Works</h2>

        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="rounded-xl bg-background p-6 shadow">
              <p className="text-lg font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}