"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select, FileInput } from "@/components/ui/FormFields";
import { LOCATIONS } from "@/data/jobs";
import {
  submitApplication,
  type ApplicationState,
} from "@/app/actions/submit-application";

const initialState: ApplicationState = {};
const MAX_CV_SIZE_MB = 10;
const MAX_CV_BYTES = MAX_CV_SIZE_MB * 1024 * 1024;

type CandidateFormProps = {
  defaultRole?: string;
  defaultLocation?: string;
};

export function CandidateForm({ defaultRole = "", defaultLocation = "" }: CandidateFormProps) {
  const [state, formAction, pending] = useActionState(submitApplication, initialState);
  const [cvError, setCvError] = useState<string | null>(null);
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
        <h3 className="text-xl font-semibold text-text-light">Application received</h3>
        <p className="mt-3 text-text-secondary">
          Thank you. Our team will review your application and be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Honeypot — hidden from humans, bots fill it */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
      <input type="hidden" name="form_loaded_at" ref={loadedAtRef} />

      {(state.error) && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          name="full_name"
          label="Full name"
          placeholder="John Smith"
          required
          error={state.fieldErrors?.full_name?.[0]}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="john@email.com"
          required
          error={state.fieldErrors?.email?.[0]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          name="phone"
          type="tel"
          label="Phone"
          placeholder="+44 7700 000000"
          required
          error={state.fieldErrors?.phone?.[0]}
        />
        <Input
          name="role"
          label="Role you're interested in"
          placeholder="e.g. Site Manager"
          defaultValue={defaultRole}
          required
          error={state.fieldErrors?.role?.[0]}
        />
      </div>

      <Select
        name="location"
        label="Preferred location"
        defaultValue={defaultLocation}
        options={LOCATIONS.filter((l) => l !== "All Locations").map((l) => ({
          label: l,
          value: l,
        }))}
        required
        error={state.fieldErrors?.location?.[0]}
      />

      <div>
        <FileInput
          name="cv"
          label={`Upload CV (PDF or Word, optional — max ${MAX_CV_SIZE_MB}MB)`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size > MAX_CV_BYTES) {
              setCvError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please upload a file under ${MAX_CV_SIZE_MB}MB.`);
              e.target.value = "";
            } else {
              setCvError(null);
            }
          }}
        />
        {cvError && (
          <p className="mt-2 text-sm text-red-600">{cvError}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
