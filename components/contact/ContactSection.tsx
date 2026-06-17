"use client";

import { useRef, useState } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
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
      <div className="flex justify-center">
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
