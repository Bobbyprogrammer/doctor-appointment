import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does consultation work?",
    answer:
      "Choose a service, fill out your medical details, complete payment, and your case will be reviewed by a qualified doctor.",
  },
  {
    question: "Can I get a prescription?",
    answer:
      "Yes, if the doctor determines that medication is appropriate, a prescription can be issued through the platform.",
  },
  {
    question: "Is it safe?",
    answer:
      "Yes, our platform is designed with secure systems to protect your personal and medical information.",
  },
  {
    question: "Can I book a consultation for my child?",
    answer:
      "Yes, some services allow consultations for children depending on the service settings and eligibility rules.",
  },
  {
    question: "Can I book on behalf of someone else?",
    answer:
      "Some services allow booking for another person. This depends on the service configuration set by the platform.",
  },
  {
    question: "How long does it take to get a response?",
    answer:
      "Response times depend on the service and doctor availability, but most consultations are reviewed as quickly as possible.",
  },
];

export default function FAQPreview() {
  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">FAQs</h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-xl border bg-background px-4 shadow-sm"
            >
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground mb-1 sm:mb-0">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}