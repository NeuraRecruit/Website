import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Neura Recruitment is a modern relationship-driven recruitment partner helping people and businesses grow through better hiring decisions.",
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-28 sm:pt-32" blueprint>
        <SectionHeader
          eyebrow="About Neura"
          title="More consultancy than agency"
          description="We founded Neura because recruitment deserved better — less noise, more substance, and relationships that last."
          align="left"
        />
      </Section>

      <Section secondary>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="text-2xl font-semibold text-text-light sm:text-3xl">Our Story</h3>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-text-secondary">
              <p>
                Great businesses are built by great people. We believe hiring should
                be thoughtful, relationship-led, and aligned with long-term goals.
              </p>
              <p>
                Neura was built on a simple belief: recruitment should be
                relationship-driven, not transactional. We take the time to understand
                what candidates want from their careers and what employers need from
                their teams.
              </p>
              <p>
                Our approach is built around clarity, consistency, and trust — helping
                businesses hire with confidence and helping people move into roles
                where they can thrive.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image
              src="/images/about-team.webp"
              alt="Recruitment consultation meeting"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-bg-secondary/60 p-8 sm:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Mission
            </p>
            <p className="mt-4 text-lg leading-relaxed text-text-light">
              To connect exceptional people with meaningful opportunities through
              genuine relationships, deep market insight, and an unwavering
              commitment to quality.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-bg-secondary/60 p-8 sm:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Vision
            </p>
            <p className="mt-4 text-lg leading-relaxed text-text-light">
              To redefine recruitment in the UK — setting the standard for trust,
              professionalism, and long-term thinking in every partnership we build.
            </p>
          </div>
        </div>
      </Section>

      <Section secondary>
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr_1fr] lg:items-center lg:gap-12">
          <div className="mx-auto w-full max-w-[280px]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
              <Image
                src="/images/deividas-grigas.png"
                alt="Deividas Grigas"
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
            <p className="mt-4 text-center text-lg font-semibold text-text-light">
              Deividas Grigas
            </p>
            <p className="mt-1 text-center text-sm text-accent">Co-Founder</p>
          </div>

          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Founders
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-text-light sm:text-3xl">
              Leadership Team
            </h3>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary">
              Built on relationships, trust, and long-term thinking, we lead Neura —
              Deividas Grigas and James Cox. With over five years each in recruitment,
              we bring a consultancy-first approach to hiring, helping businesses hire
              with confidence and helping candidates make meaningful career moves.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[280px]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
              <div className="flex h-full items-center justify-center bg-bg-primary text-text-secondary">
                <span className="text-sm">James photo</span>
              </div>
            </div>
            <p className="mt-4 text-center text-lg font-semibold text-text-light">
              James Cox
            </p>
            <p className="mt-1 text-center text-sm text-accent">Co-Founder</p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Button href="/apply">Work With Us</Button>
        </div>
      </Section>
    </>
  );
}
