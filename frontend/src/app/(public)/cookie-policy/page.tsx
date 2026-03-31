export default function CookiePage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Legal
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Cookie Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              This Cookie Policy explains how we use cookies and similar
              technologies to improve your experience, maintain security, and
              analyze usage of our telemedicine platform.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="space-y-8 rounded-3xl border bg-card p-6 shadow-sm md:p-10">
          
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">1. What Are Cookies?</h2>
            <p className="text-muted-foreground leading-7">
              Cookies are small text files stored on your device when you visit
              a website. They help websites remember your preferences, improve
              performance, and provide a better user experience.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">2. How We Use Cookies</h2>
            <p className="text-muted-foreground leading-7">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Maintain user sessions and authentication</li>
              <li>Improve website performance and functionality</li>
              <li>Analyze usage and user behavior</li>
              <li>Enhance security and prevent unauthorized access</li>
              <li>Remember user preferences and settings</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">3. Types of Cookies We Use</h2>

            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Essential Cookies:</strong>{" "}
                Required for core functionality such as login, authentication,
                and secure access to the platform.
              </p>

              <p>
                <strong className="text-foreground">Performance Cookies:</strong>{" "}
                Help us understand how users interact with the platform so we
                can improve usability and performance.
              </p>

              <p>
                <strong className="text-foreground">Functional Cookies:</strong>{" "}
                Remember your preferences such as settings, language, or user
                choices.
              </p>

              <p>
                <strong className="text-foreground">Analytics Cookies:</strong>{" "}
                Provide insights into usage patterns to help us enhance the
                platform experience.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-7">
              Some cookies may be set by third-party services such as analytics
              providers, hosting services, or embedded tools. These cookies are
              governed by the respective third-party privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">5. Managing Cookies</h2>
            <p className="text-muted-foreground leading-7">
              You can manage or disable cookies through your browser settings.
              However, disabling certain cookies may affect the functionality
              and performance of the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">6. Updates to This Policy</h2>
            <p className="text-muted-foreground leading-7">
              We may update this Cookie Policy from time to time. Any changes
              will be reflected on this page with an updated effective date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">7. Contact Us</h2>
            <p className="text-muted-foreground leading-7">
              If you have questions about this Cookie Policy, you can contact us
              through our Contact page or official support channels.
            </p>
          </section>

        </div>
      </section>
    </main>
  );
}