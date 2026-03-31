import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqSections = [
  {
    title: "General Questions",
    items: [
      {
        question: "What is this telemedicine platform?",
        answer:
          "This platform allows patients to access healthcare services online in a secure and convenient way. Users can browse medical services, submit consultation requests, complete required questionnaires, upload supporting files when needed, and receive care from qualified doctors without visiting a clinic in person.",
      },
      {
        question: "Who can use this platform?",
        answer:
          "The platform is designed for patients seeking convenient online healthcare services. Depending on the service, users may book consultations for themselves, for a child, or in some cases for another person. Eligibility depends on the selected service, age restrictions, and service rules.",
      },
      {
        question: "Is telemedicine safe and reliable?",
        answer:
          "Yes. The platform is built to support secure access to healthcare services and patient information. Medical data is handled carefully, and consultations are reviewed by qualified professionals according to the service selected by the patient.",
      },
      {
        question: "Can I use the service from anywhere?",
        answer:
          "In most cases, yes. Because the platform is web-based, patients can access it from home, work, or while travelling, as long as they have internet access. However, service availability may depend on operational coverage, legal rules, and the specific healthcare service being requested.",
      },
    ],
  },
  {
    title: "Booking & Consultations",
    items: [
      {
        question: "How do I book a consultation?",
        answer:
          "To book a consultation, choose a service, review the service details, and proceed through the consultation flow. You may need to select the patient type, provide notes, complete a questionnaire, upload supporting medical files, and make payment before the consultation is submitted for review.",
      },
      {
        question: "Do I choose a doctor myself?",
        answer:
          "At this stage, consultations are primarily service-based rather than doctor-directory based. Patients choose the service they need, and the consultation is then reviewed and assigned appropriately. This helps ensure that the case goes to a suitable doctor for that service.",
      },
      {
        question: "What happens after I submit a consultation?",
        answer:
          "Once submitted, your consultation enters the platform workflow. Depending on payment and review status, it may be marked as pending payment, waiting for review, under review, or completed. Admin staff can monitor the case and assign it to a doctor when needed.",
      },
      {
        question: "Can I schedule a consultation for later?",
        answer:
          "Some consultation requests may support scheduling information depending on the service flow and platform configuration. If scheduling is available for the service, you will be able to choose or provide a preferred time during the request process.",
      },
      {
        question: "Can I cancel a consultation?",
        answer:
          "Cancellation depends on the consultation stage and the platform policy. In some cases, a request may be cancelled before review or before assignment. Once a consultation has progressed further, cancellation and refund handling may vary.",
      },
    ],
  },
  {
    title: "Services & Eligibility",
    items: [
      {
        question: "How do I know which service to choose?",
        answer:
          "Each service includes details such as description, category, consultation duration, doctor type, pricing, and eligibility rules. Reviewing the service detail page should help you decide which option best matches your healthcare need.",
      },
      {
        question: "Are there age restrictions for some services?",
        answer:
          "Yes. Some services can include minimum or maximum age rules. These restrictions are checked during the consultation process to help ensure the selected service is appropriate for the patient.",
      },
      {
        question: "Can I book a consultation for my child?",
        answer:
          "Yes, certain services allow consultations for children. This depends on the service settings and age requirements. If a service is not suitable for children, the platform will prevent that booking flow.",
      },
      {
        question: "Can I submit a request on behalf of someone else?",
        answer:
          "Some services allow consultations for another person, while others require the patient to complete the request themselves. This depends on the service settings configured for safety and compliance.",
      },
    ],
  },
  {
    title: "Payments & Pricing",
    items: [
      {
        question: "When do I pay for a consultation?",
        answer:
          "Payment is generally required before a consultation is fully submitted into the review workflow. The exact timing depends on the service flow, but the platform is designed to support payment before medical review begins.",
      },
      {
        question: "How is the consultation amount calculated?",
        answer:
          "The amount is based on the selected service pricing. If a service has a discounted price configured, the discounted amount may be shown instead of the regular price.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Refund handling depends on the consultation status and the platform’s billing policy. Some requests may qualify for refunds in cases such as cancellation or service-specific exceptions.",
      },
      {
        question: "Will I receive a payment record or invoice?",
        answer:
          "The platform is designed to support payment and billing records. Depending on the final implementation, users may be able to view transaction history and access invoices or payment confirmations from their account.",
      },
    ],
  },
  {
    title: "Prescriptions, Certificates & Medical Review",
    items: [
      {
        question: "Can I receive a prescription through the platform?",
        answer:
          "If the reviewing doctor determines that a prescription is medically appropriate and permitted for the case, a prescription may be issued through the platform. Prescriptions are never guaranteed and depend entirely on clinical judgment.",
      },
      {
        question: "Can I request a sick certificate or medical certificate?",
        answer:
          "If your platform services include certificate-related workflows, a doctor may issue a certificate when appropriate and supported by the consultation outcome. This depends on platform setup and doctor review.",
      },
      {
        question: "How long does it take for a doctor to review my case?",
        answer:
          "Review time depends on the consultation queue, service type, and doctor availability. The platform is built to support an efficient workflow, but exact timing can vary depending on demand and case complexity.",
      },
      {
        question: "What if my condition is urgent?",
        answer:
          "This platform is not a replacement for emergency services. If you are experiencing severe symptoms, chest pain, difficulty breathing, confusion, fainting, or any urgent medical emergency, you should immediately contact emergency services or go to the nearest emergency department.",
      },
    ],
  },
  {
    title: "Files, Records & Privacy",
    items: [
      {
        question: "Can I upload medical files or reports?",
        answer:
          "Yes. During consultation submission, the platform can support uploading documents and relevant files to help doctors understand the case better. These may include reports, scans, or other medical documents where supported.",
      },
      {
        question: "What types of files can I upload?",
        answer:
          "Supported file formats depend on the platform configuration, but commonly supported files may include images and document formats such as PDF or Word documents. File limits and validation rules may also apply.",
      },
      {
        question: "Will my personal and medical data remain private?",
        answer:
          "Protecting patient data is a key part of the platform. Personal and medical information is handled carefully and should only be accessible to authorized users involved in the care and management process.",
      },
      {
        question: "Can I view my consultation history later?",
        answer:
          "Yes. The platform is designed to support consultation history so patients can review previous requests, statuses, and related healthcare documents from their account dashboard.",
      },
    ],
  },
  {
    title: "Account & Support",
    items: [
      {
        question: "How do I create an account?",
        answer:
          "Patients can register by providing the required personal information, such as first name, last name, email, password, and phone number. An optional profile picture may also be supported.",
      },
      {
        question: "What if I forget my password?",
        answer:
          "The platform is designed to support password reset functionality so users can recover access to their account securely.",
      },
      {
        question: "Why am I being redirected after login?",
        answer:
          "Users are redirected based on their account role. Patients are taken to the patient dashboard, doctors to the doctor dashboard, and admin users to the admin dashboard experience.",
      },
      {
        question: "How can I contact support?",
        answer:
          "You can use the Contact page or platform support channels to reach the team for technical help, billing questions, or general platform assistance.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="bg-background">
      <section className="border-b bg-gradient-to-b from-primary/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Help Center
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about consultations, payments,
              services, prescriptions, files, privacy, and account usage. This
              page is designed to help patients understand the platform clearly
              before booking care online.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="mb-4 text-lg font-semibold">On this page</h2>
            <nav className="space-y-3 text-sm">
              {faqSections.map((section) => (
                <a
                  key={section.title}
                  href={`#${section.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block text-muted-foreground transition hover:text-foreground"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-10">
            {faqSections.map((section, sectionIndex) => (
              <section
                key={section.title}
                id={section.title.toLowerCase().replace(/\s+/g, "-")}
                className="rounded-3xl border bg-card p-6 shadow-sm md:p-8"
              >
                <div className="mb-6">
                  <p className="text-sm font-medium text-primary">
                    Section {sectionIndex + 1}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">{section.title}</h2>
                </div>

                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                >
                  {section.items.map((faq, index) => (
                    <AccordionItem
                      key={faq.question}
                      value={`${section.title}-${index}`}
                      className="rounded-2xl border bg-background px-5"
                    >
                      <AccordionTrigger className="text-left text-base font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-sm leading-7 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}

            <section className="rounded-3xl border bg-primary/5 p-8 text-center">
              <h2 className="text-2xl font-bold">Still need help?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                If you could not find the answer you were looking for, our team
                can help you with account questions, technical support, service
                guidance, and consultation-related concerns.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Contact Support
                </a>
                <a
                  href="/services"
                  className="inline-flex h-11 items-center justify-center rounded-xl border px-6 text-sm font-medium transition hover:bg-muted"
                >
                  Browse Services
                </a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}