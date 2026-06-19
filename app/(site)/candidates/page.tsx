import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeader } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Candidates",
  description:
    "Join Neura Recruitment's network of health & safety and construction professionals. Access exclusive opportunities, career progression, and ongoing support across the UK.",
};

const benefits = [
  {
    title: "Career Progression",
    description:
      "We don't just fill roles — we understand where you want to go and connect you with opportunities that advance your career.",
  },
  {
    title: "Access to Opportunities",
    description:
      "Gain access to health & safety and construction roles across leading firms — many exclusive to Neura's network.",
  },
  {
    title: "Industry Expertise",
    description:
      "Our team knows health & safety and construction inside out. We speak your language and understand what makes a great fit.",
  },
  {
    title: "Ongoing Support",
    description:
      "From application to placement and beyond, we're with you at every step of your journey.",
  },
];

export default function CandidatesPage() {
  return (
    <>
      <Section className="pt-28 sm:pt-32" blueprint>
        <SectionHeader
          eyebrow="For Candidates"
          title="Your next role starts here"
          description="Whether you're a skilled tradesperson or a senior site manager, Neura connects you with health &amp; safety and construction opportunities that match your ambitions."
          align="center"
        />
        <div className="mt-6 text-center">
          <Button href="/apply?type=worker" size="lg">
            Apply Now
          </Button>
        </div>
      </Section>

      <Section secondary>
        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <Card key={benefit.title} hover>
              <h3 className="text-xl font-semibold text-text-light">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-border bg-bg-primary/50 p-8 text-center sm:p-12">
          <h3 className="text-2xl font-semibold text-text-light sm:text-3xl">
            Ready to take the next step?
          </h3>
          <p className="mx-auto mt-4 max-w-lg text-text-secondary">
            Browse our current opportunities or apply directly and we&apos;ll match you
            to the right role.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/jobs" variant="secondary">
              View Opportunities
            </Button>
            <Button href="/apply?type=worker">Apply Now</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
