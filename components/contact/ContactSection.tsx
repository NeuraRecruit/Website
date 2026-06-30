"use client";

import { useRef, useState } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card } from "@/components/ui/Card";
import { FOUNDERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
  const [requestCallback, setRequestCallback] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleRequestCallback = () => {
    setRequestCallback(true);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2 sm:gap-x-4">
        <FounderContact
          name={FOUNDERS.james.name}
          phone={FOUNDERS.james.phone}
          phoneHref={FOUNDERS.james.phoneHref}
        />

        <button
          type="button"
          onClick={handleRequestCallback}
          className={cn(
            "px-1 text-center text-xs font-medium transition-colors sm:text-sm",
            requestCallback ? "text-accent" : "text-text-secondary hover:text-accent"
          )}
        >
          Request a callback
        </button>

        <FounderContact
          name={FOUNDERS.deividas.name}
          phone={FOUNDERS.deividas.phone}
          phoneHref={FOUNDERS.deividas.phoneHref}
        />
      </div>

      <div ref={formRef} className="mt-10 scroll-mt-28 sm:mt-12">
        <Card>
          <ContactForm
            requestCallback={requestCallback}
            onCallbackChange={setRequestCallback}
          />
        </Card>
      </div>
    </>
  );
}
