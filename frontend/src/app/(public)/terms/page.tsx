export default function TermsPage() {
  return (
    <main className="bg-background">
      <section className="border-b bg-gradient-to-b from-primary/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Legal
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Terms & Conditions
            </h1>
            <p className="text-lg text-muted-foreground">
              These Terms & Conditions govern your access to and use of our
              telemedicine platform, website, applications, and related digital
              healthcare services.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="space-y-8 rounded-3xl border bg-card p-6 shadow-sm md:p-10">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
            <p className="leading-7 text-muted-foreground">
              By using this platform, you agree to comply with these Terms &
              Conditions and any applicable policies referenced by the platform.
              If you do not agree, you should not use the services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">2. Description of Services</h2>
            <p className="leading-7 text-muted-foreground">
              This platform provides access to digital healthcare-related
              services, including online consultation workflows, questionnaires,
              medical file uploads, communication or review processes,
              prescriptions, certificates, payment-related steps, and other
              related healthcare support features where available.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">3. User Responsibilities</h2>
            <p className="leading-7 text-muted-foreground">
              Users are responsible for providing accurate and complete
              information, maintaining the confidentiality of account
              credentials, using the platform lawfully, and avoiding misuse,
              fraud, or unauthorized access attempts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">4. Medical Disclaimer</h2>
            <p className="leading-7 text-muted-foreground">
              The platform is not intended for emergency care. If you are
              experiencing severe symptoms or a medical emergency, you should
              immediately contact emergency services or attend the nearest
              emergency department.
            </p>
            <p className="leading-7 text-muted-foreground">
              Any clinical outcome, prescription, or certificate is subject to
              professional review and medical judgment. Use of the platform does
              not guarantee a diagnosis, prescription, certificate, or specific
              treatment outcome.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">5. Eligibility and Service Rules</h2>
            <p className="leading-7 text-muted-foreground">
              Some services may be subject to age restrictions, patient type
              limitations, suitability checks, or other eligibility criteria.
              The platform may reject or restrict access to services that are
              not appropriate for the selected patient or situation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">6. Consultations and Workflow</h2>
            <p className="leading-7 text-muted-foreground">
              Consultations may pass through multiple statuses such as pending
              payment, waiting for review, under review, completed, rejected, or
              cancelled. The exact workflow depends on the service, payment
              status, review process, and platform rules.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">7. Payments and Refunds</h2>
            <p className="leading-7 text-muted-foreground">
              Some services require payment before consultation submission or
              review. Refunds, if available, are handled according to platform
              policy, service rules, and the status of the consultation or
              transaction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">8. Uploaded Content and Files</h2>
            <p className="leading-7 text-muted-foreground">
              Users may upload documents, reports, images, and other relevant
              files where supported. You confirm that any submitted material is
              accurate, lawful, and that you have the right to upload and share
              it for consultation purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">9. Intellectual Property</h2>
            <p className="leading-7 text-muted-foreground">
              All platform content, branding, design elements, software, and
              related materials remain the property of the platform owner or its
              licensors unless otherwise stated. Users may not copy, distribute,
              reverse engineer, or exploit platform materials without proper
              permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">10. Account Suspension or Termination</h2>
            <p className="leading-7 text-muted-foreground">
              We may suspend, restrict, or terminate access to any account that
              violates these terms, misuses the platform, provides fraudulent
              information, or creates security, legal, or operational risks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">11. Limitation of Liability</h2>
            <p className="leading-7 text-muted-foreground">
              To the extent permitted by law, the platform owner is not liable
              for indirect, incidental, consequential, or special losses
              resulting from the use of the services, service interruptions,
              third-party failures, or user misuse of the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">12. Changes to the Terms</h2>
            <p className="leading-7 text-muted-foreground">
              We may update these Terms & Conditions from time to time. Updated
              versions will be posted on this page, and continued use of the
              platform after changes may indicate acceptance of the revised
              terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">13. Contact</h2>
            <p className="leading-7 text-muted-foreground">
              If you have questions about these Terms & Conditions, you can
              contact us through the Contact page or official platform support
              channels.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}