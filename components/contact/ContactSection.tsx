"use client";

import { ContactForm } from "@/components/forms/ContactForm";
import { Card } from "@/components/ui/Card";
import { FOUNDERS } from "@/lib/constants";

function FounderContact({
  name,
  phone,
  phoneHref,
}: {
  name: string;
  phone: string;
  phoneHref: string;
}) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium text-text-light">{name}</p>
      <a
        href={phoneHref}
        className="mt-1 inline-block text-xs text-text-secondary transition-colors hover:text-accent sm:text-sm"
      >
        {phone}
      </a>
    </div>
  );
}

export function ContactSection() {
  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8">
        <FounderContact
          name={FOUNDERS.james.name}
          phone={FOUNDERS.james.phone}
          phoneHref={FOUNDERS.james.phoneHref}
        />

        <FounderContact
          name={FOUNDERS.deividas.name}
          phone={FOUNDERS.deividas.phone}
          phoneHref={FOUNDERS.deividas.phoneHref}
        />
      </div>

      <div className="mt-10 scroll-mt-28 sm:mt-12">
        <Card>
          <ContactForm />
        </Card>
      </div>
    </>
  );
}
