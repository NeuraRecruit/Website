import type { Metadata } from "next";
import { EmployerForm } from "@/components/forms/EmployerForm";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeader } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Employers",
  description:
    "Hire skilled construction professionals with Neura Recruitment. Access our talent network for faster placements, reliability, and retention.",
};

const outcomes = [
  {
    title: "Talent Network",
    description:
      "Access a curated network of pre-vetted construction professionals across every trade and discipline.",
  },
  {
    title: "Speed",
    description:
      "Quality candidates delivered quickly. We understand project timelines and respond at the pace you need.",
  },
  {
    title: "Reliability",
    description:
      "Consistent communication, transparent processes, and dependable delivery on every brief.",
  },
  {
    title: "Retention",
    description:
      "Our 95% placement retention rate reflects the quality of our matching and ongoing support.",
  },
];

export default function EmployersPage() {
  return (
    <>
      <Section className="pt-28 sm:pt-32" blueprint>
        <SectionHeader
          eyebrow="For Employers"
          title="Construction talent, delivered"
          description="Partner with Neura to solve your hiring challenges with speed, quality, and reliability."
          align="left"
        />
      </Section>

      <Section secondary>
        <div className="grid gap-6 sm:grid-cols-2">
          {outcomes.map((item) => (
            <Card key={item.title} hover>
              <h3 className="text-xl font-semibold text-text-light">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="enquiry">
        <SectionHeader
          eyebrow="Get in Touch"
          title="Book a consultation"
          description="Tell us about your hiring needs and we'll be in touch to discuss how Neura can help."
          align="left"
        />
        <div className="mx-auto max-w-2xl">
          <EmployerForm />
        </div>
      </Section>
    </>
  );
}
