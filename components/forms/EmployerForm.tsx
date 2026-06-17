"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/FormFields";
import { submitEnquiry, type EnquiryState } from "@/app/actions/submit-enquiry";

const initialState: EnquiryState = {};

export function EmployerForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const loadedAtRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (loadedAtRef.current) loadedAtRef.current.value = String(Date.now());
  }, []);

  if (state.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center"
      >
        <h3 className="text-xl font-semibold text-text-light">Enquiry received</h3>
        <p className="mt-3 text-text-secondary">
          Thank you. A member of our team will contact you to discuss your hiring needs.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Honeypot — hidden from humans, bots fill it */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
      <input type="hidden" name="form_loaded_at" ref={loadedAtRef} />

      {state.error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          name="company_name"
          label="Company name"
          placeholder="Your company"
          required
          error={state.fieldErrors?.company_name?.[0]}
        />
        <Input
          name="contact_name"
          label="Contact name"
          placeholder="Your name"
          required
          error={state.fieldErrors?.contact_name?.[0]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@company.com"
          required
          error={state.fieldErrors?.email?.[0]}
        />
        <Input
          name="phone"
          type="tel"
          label="Phone"
          placeholder="+44 7700 000000"
          required
          error={state.fieldErrors?.phone?.[0]}
        />
      </div>

      <Textarea
        name="message"
        label="Tell us about your hiring needs"
        placeholder="Roles, locations, timelines..."
        required
        error={state.fieldErrors?.message?.[0]}
      />

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Submitting..." : "Book a Consultation"}
      </Button>
    </form>
  );
}
