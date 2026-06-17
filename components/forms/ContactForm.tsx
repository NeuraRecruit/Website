"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/FormFields";
import { submitContact, type ContactState } from "@/app/actions/submit-contact";

const initialState: ContactState = {};

type ContactFormProps = {
  requestCallback?: boolean;
  onCallbackChange?: (value: boolean) => void;
};

export function ContactForm({
  requestCallback = false,
  onCallbackChange,
}: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const [wantsCallback, setWantsCallback] = useState(requestCallback);
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const loadedAtRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (loadedAtRef.current) loadedAtRef.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    setWantsCallback(requestCallback);
    if (requestCallback) {
      document.getElementById("contact-phone")?.focus();
    }
  }, [requestCallback]);

  useEffect(() => {
    if (state.fieldErrors?.phone?.[0]) {
      setPhoneError(state.fieldErrors.phone[0]);
    }
  }, [state.fieldErrors]);

  if (state.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-accent/30 bg-accent/5 p-8 text-center"
      >
        <h3 className="text-xl font-semibold text-text-light">Message sent</h3>
        <p className="mt-3 text-text-secondary">
          {wantsCallback
            ? "Thank you. We'll be in touch shortly to arrange your callback."
            : "Thank you for getting in touch. We'll respond to your message soon."}
        </p>
      </div>
    );
  }

  const handleCallbackToggle = (checked: boolean) => {
    setWantsCallback(checked);
    onCallbackChange?.(checked);
    setPhoneError(undefined);
    if (checked) {
      setTimeout(() => document.getElementById("contact-phone")?.focus(), 0);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (wantsCallback) {
      const phone = (
        e.currentTarget.elements.namedItem("phone") as HTMLInputElement
      )?.value?.trim();

      if (!phone || phone.length < 7) {
        e.preventDefault();
        setPhoneError("Phone number is required for a callback");
        document.getElementById("contact-phone")?.focus();
        return;
      }
    }
    setPhoneError(undefined);
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="request_callback" value={wantsCallback ? "true" : "false"} />
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

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg-secondary/50 p-4 transition-colors hover:border-accent/20">
        <input
          type="checkbox"
          checked={wantsCallback}
          onChange={(e) => handleCallbackToggle(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
        />
        <span>
          <span className="block text-sm font-medium text-text-light">
            Request a callback
          </span>
          <span className="mt-1 block text-sm text-text-secondary">
            Prefer to speak with someone? Tick this and we&apos;ll call you back.
          </span>
        </span>
      </label>

      <Input
        id="contact-phone"
        name="phone"
        type="tel"
        label={wantsCallback ? "Phone" : "Phone (optional)"}
        placeholder="+44 7700 000000"
        required={wantsCallback}
        aria-required={wantsCallback}
        error={phoneError || state.fieldErrors?.phone?.[0]}
        onChange={() => phoneError && setPhoneError(undefined)}
      />

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
