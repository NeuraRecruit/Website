import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";
import { Section, SectionHeader } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Neura Recruitment. Call James or Deividas directly, send us a message, or request a callback.",
};

export default function ContactPage() {
  return (
    <Section className="min-h-[80vh] pt-28 sm:pt-32" blueprint>
      <div className="mx-auto w-full max-w-2xl">
        <SectionHeader
          eyebrow="Contact"
          title="Call or send us a message"
          description="Prefer to talk? Call James or Deividas directly — or drop us a line below and we'll get back to you."
          align="center"
          className="mb-8 sm:mb-10"
        />

        <ContactSection />
      </div>
    </Section>
  );
}
