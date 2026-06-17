"use client";

import { useRef, useState } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { CONTACT } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const [requestCallback, setRequestCallback] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleRequestCallback = () => {
    setRequestCallback(true);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
        <a
          href={`mailto:${CONTACT.email}`}
          className="text-sm text-text-secondary transition-colors hover:text-text-light"
        >
          {CONTACT.email}
        </a>
        <span aria-hidden="true" className="hidden text-border sm:inline">
          |
        </span>
        <button
          type="button"
          onClick={handleRequestCallback}
          className={cn(
            "text-sm font-medium transition-colors",
            requestCallback ? "text-accent" : "text-text-secondary hover:text-accent"
          )}
        >
          Request a callback
        </button>
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
