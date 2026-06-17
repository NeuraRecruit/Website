"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PathToggleBox } from "@/components/forms/PathToggleBox";
import { CandidateForm } from "@/components/forms/CandidateForm";
import { EmployerForm } from "@/components/forms/EmployerForm";
import { Section, SectionHeader } from "@/components/ui/Section";
import type { PathType } from "@/lib/paths";

function ApplyContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as PathType | null;
  const roleParam = searchParams.get("role") || "";
  const locationParam = searchParams.get("location") || "";

  const [selected, setSelected] = useState<PathType | null>(
    typeParam === "worker" || typeParam === "client" ? typeParam : null
  );

  return (
    <Section className="min-h-[80vh] pt-28 sm:pt-32">
      <SectionHeader
        eyebrow="Get Started"
        title="How can we help you?"
        description="Choose your path and we'll guide you through the next steps."
        align="center"
      />

      {!selected ? (
        <div className="mx-auto max-w-lg">
          <PathToggleBox hideHeader onContinue={setSelected} layoutId="apply-path-toggle" />
        </div>
      ) : (
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="mb-6 text-sm text-text-secondary transition-colors hover:text-text-light"
          >
            &larr; Back to selection
          </button>

          {selected === "worker" ? (
            <>
              <h3 className="mb-6 text-2xl font-semibold text-text-light">
                Candidate Application
              </h3>
              <CandidateForm
                defaultRole={roleParam}
                defaultLocation={locationParam}
              />
            </>
          ) : (
            <>
              <h3 className="mb-6 text-2xl font-semibold text-text-light">
                Employer Enquiry
              </h3>
              <EmployerForm />
            </>
          )}
        </div>
      )}
    </Section>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] pt-32" />}>
      <ApplyContent />
    </Suspense>
  );
}
