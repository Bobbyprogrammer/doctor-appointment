import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Stethoscope } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "FAQs", href: "/faq" },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="mt-20 border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
           <Link href="/" className="flex items-center gap-2">
          <img src="./Logo.png" className="w-16 h-16" alt="" />
        </Link>
            
          </div>
          <p className="text-sm text-muted-foreground">
            Secure online consultations, prescriptions, and healthcare support
            from trusted doctors.
          </p>
          <div className="flex items-center gap-3">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Company</h3>
          <div className="flex flex-col gap-3">
            {footerLinks.company.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Legal</h3>
          <div className="flex flex-col gap-3">
            {footerLinks.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Support</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Email: info@quickdoctor.ie</p>
            <p>Phone: +353 83 413 6053</p>
            <p>Available: Mon - Sun, 8:00 AM - 10:00 PM</p>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-sm text-muted-foreground md:flex-row">
          <p>© 2026 QuickDoctor.ie All rights reserved.</p>
          <p>Healthcare support online, safely and securely.</p>
        </div>
      </div>
    </footer>
  );
}