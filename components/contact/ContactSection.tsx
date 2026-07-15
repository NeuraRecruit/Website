"use client";

import { ContactForm } from "@/components/forms/ContactForm";
import { Card } from "@/components/ui/Card";
import { CONTACT } from "@/lib/constants";

export function ContactSection() {
  return (
    <>
      <div className="text-center">
        <p className="text-sm font-medium text-text-light">Call us directly</p>
        <a
          href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
          className="mt-1 inline-block text-xs text-text-secondary transition-colors hover:text-accent sm:text-sm"
        >
          {CONTACT.phone}
        </a>
      </div>

      <div className="mt-10 scroll-mt-28 sm:mt-12">
        <Card>
          <ContactForm />
        </Card>
      </div>
    </>
  );
}
