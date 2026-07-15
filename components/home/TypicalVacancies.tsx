"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TYPICAL_VACANCIES,
  getRegisterInterestHref,
  type TypicalVacancy,
} from "@/data/typical-vacancies";
import { CONTACT } from "@/lib/constants";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0 text-text-secondary transition-transform duration-300", open && "rotate-180")}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function VacancyAccordionItem({
  vacancy,
  open,
  onToggle,
}: {
  vacancy: TypicalVacancy;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `vacancy-panel-${vacancy.slug}`;
  const headerId = `vacancy-header-${vacancy.slug}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <button
        type="button"
        id={headerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-bg-secondary/40 sm:p-6"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-md border border-border bg-bg-secondary px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-accent">
              {vacancy.category}
            </span>
            <span className="inline-flex rounded-md border border-border bg-bg-secondary px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-text-secondary">
              {vacancy.employmentType}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-text-light sm:text-xl">
            {vacancy.title}
          </h3>
        </div>
        <ChevronIcon open={open} />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-5 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-6">
            <p className="text-sm font-medium leading-relaxed text-text-light sm:text-base">
              {vacancy.headline}
            </p>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
              {vacancy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <p className="mt-8 text-sm font-semibold text-text-light sm:text-base">
              {vacancy.requirementsTitle}
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-text-secondary sm:text-base">
              {vacancy.requirements.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {vacancy.closingNote && (
              <p className="mt-6 text-sm leading-relaxed text-text-secondary sm:text-base">
                {vacancy.closingNote}
              </p>
            )}

            <p className="mt-6 text-sm leading-relaxed text-text-secondary sm:text-base">
              {vacancy.registerText.replace("call us", `call ${CONTACT.phone}`)}
            </p>

            <div className="mt-6">
              <Link
                href={getRegisterInterestHref(vacancy)}
                className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                Register your interest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TypicalVacancies() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const handleToggle = (slug: string) => {
    setOpenSlug((current) => (current === slug ? null : slug));
  };

  return (
    <Section className="!pt-6 sm:!pt-8 lg:!pt-10">
      <SectionHeader
        eyebrow="What we hire for"
        title="Roles we recruit across the UK"
        description="We work with contractors, developers and infrastructure businesses across health & safety and construction. Register your interest and we'll be in touch when the right opportunity comes up."
      />

      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:gap-4">
        {TYPICAL_VACANCIES.map((vacancy) => (
          <VacancyAccordionItem
            key={vacancy.slug}
            vacancy={vacancy}
            open={openSlug === vacancy.slug}
            onToggle={() => handleToggle(vacancy.slug)}
          />
        ))}
      </div>
    </Section>
  );
}
