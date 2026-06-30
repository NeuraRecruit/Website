"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/FormFields";
import { submitContact, type ContactState } from "@/app/actions/submit-contact";

const initialState: ContactState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const loadedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loadedAtRef.current) loadedAtRef.current.value = String(Date.now());
  }, []);

  if (state.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-accent/30 bg-accent/5 p-8 text-center"
      >
        <h3 className="text-xl font-semibold text-text-light">Message sent</h3>
        <p className="mt-3 text-text-secondary">
          Thank you for getting in touch. We&apos;ll respond to your message soon.
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
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600"
        >
          {state.error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          name="full_name"
          label="Name"
          placeholder="Your name"
          required
          error={state.fieldErrors?.full_name?.[0]}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@email.com"
          required
          error={state.fieldErrors?.email?.[0]}
        />
      </div>

      <Input
        name="company"
        label="Company (optional)"
        placeholder="Your company"
        error={state.fieldErrors?.company?.[0]}
      />

      <Textarea
        name="message"
        label="Message"
        placeholder="How can we help?"
        required
        error={state.fieldErrors?.message?.[0]}
      />

      <Input
        id="contact-phone"
        name="phone"
        type="tel"
        label="Phone (optional)"
        placeholder="+44 7700 000000"
        error={state.fieldErrors?.phone?.[0]}
      />

      <p className="text-xs text-text-secondary">
        By submitting this form you acknowledge our{" "}
        <Link
          href="/privacy"
          className="text-accent underline underline-offset-2 hover:text-accent/80"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
