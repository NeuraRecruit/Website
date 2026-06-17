import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";
import { Section, SectionHeader } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Neura Recruitment. Send us a message or request a callback — we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <Section className="min-h-[80vh] pt-28 sm:pt-32" blueprint>
      <div className="mx-auto w-full max-w-xl">
        <SectionHeader
          eyebrow="Contact"
          title="Send us a message"
          description="Have a question or want to find out more? Drop us a line and we'll get back to you."
          align="center"
          className="mb-8 sm:mb-10"
        />

        <ContactSection />
      </div>
    </Section>
  );
}
