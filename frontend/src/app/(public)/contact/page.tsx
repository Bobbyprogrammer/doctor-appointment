import { Mail, Phone, MapPin, Clock3, MessageSquareText } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="bg-background">
      <section className="border-b bg-gradient-to-b from-primary/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Contact Us
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              We’re here to help
            </h1>
            <p className="text-lg text-muted-foreground">
              Reach out to our team for support with consultations, services,
              accounts, payments, technical issues, or general questions about
              the platform.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <p className="mt-2 text-muted-foreground">
                Complete the form below and our team will get back to you as
                soon as possible.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First name</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last name</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone number</label>
                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help you?"
                  className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea
                  placeholder="Write your message here..."
                  className="min-h-[160px] w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <p className="mt-2 text-muted-foreground">
                You can also reach us through the following channels for general
                support and platform assistance.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">
                      support@telemedicine.com
                    </p>
                    <p className="text-sm text-muted-foreground">
                      For general support, billing, and platform issues
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">+353 123 456 789</p>
                    <p className="text-sm text-muted-foreground">
                      Available during standard support hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-muted-foreground">
                      123 Healthcare Street, Dublin, Ireland
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Registered business and support correspondence address
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <Clock3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Support Hours</h3>
                    <p className="text-muted-foreground">
                      Monday to Sunday
                    </p>
                    <p className="text-sm text-muted-foreground">
                      8:00 AM to 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 p-3">
                  <MessageSquareText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Before you contact us</h2>
                  <p className="mt-2 text-muted-foreground">
                    You may find a quick answer on our FAQ page. It covers
                    common questions about consultations, services, payments,
                    prescriptions, certificates, files, privacy, and account
                    access.
                  </p>

                  <a
                    href="/faq"
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border px-5 text-sm font-medium transition hover:bg-muted"
                  >
                    Visit FAQs
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-primary/5 p-6 md:p-8">
              <h2 className="text-xl font-bold">Emergency Notice</h2>
              <p className="mt-3 text-muted-foreground">
                This platform is not intended for medical emergencies. If you
                are experiencing severe symptoms such as chest pain, severe
                breathing difficulty, confusion, fainting, or any urgent medical
                condition, please contact emergency services immediately or go
                to your nearest emergency department.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}