import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FOUNDERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Neura Recruitment specialises in health & safety and construction recruitment — a relationship-driven partner helping people and businesses grow through better hiring decisions.",
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-28 sm:pt-32" blueprint>
        <SectionHeader
          eyebrow="About Neura"
          title="More consultancy than agency"
          description="We founded Neura because recruitment deserved better — less noise, more substance, and relationships that last. We specialise in health &amp; safety and construction recruitment — connecting the people who keep projects safe and moving."
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
                their teams. While we bring that consultancy-first approach to every
                brief, our core focus is health &amp; safety and construction — from
                HSE leadership to site-based roles.
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
        {/* Desktop: photo | text | photo — Mobile: text on top, photos side by side below */}
        <div className="lg:grid lg:grid-cols-[1fr_2fr_1fr] lg:items-center lg:gap-12">

          {/* Leadership text — centred on mobile, middle column on desktop */}
          <div className="text-center lg:order-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Founders
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-text-light sm:text-3xl">
              Leadership Team
            </h3>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary">
              Built on relationships, trust, and long-term thinking, we lead Neura —
              Deividas Grigas and James Cox. With over five years in recruitment,
              we bring a consultancy-first approach to hiring, helping businesses hire
              with confidence and helping candidates make meaningful career moves.
            </p>
          </div>

          {/* Photos row — side by side on mobile, individual columns on desktop */}
          <div className="mt-8 grid grid-cols-2 gap-4 lg:contents lg:mt-0">

            <div className="mx-auto w-full max-w-[280px] lg:order-1">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
                <Image
                  src="/images/deividas-grigas.png"
                  alt="Deividas Grigas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 280px"
                />
              </div>
              <p className="mt-4 text-center text-lg font-semibold text-text-light">
                Deividas Grigas
              </p>
              <p className="mt-1 text-center text-sm text-accent">Co-Founder</p>
              <p className="mt-1 text-center">
                <a
                  href={FOUNDERS.deividas.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  LinkedIn
                </a>
              </p>
              <p className="mt-1 text-center">
                <a
                  href={FOUNDERS.deividas.phoneHref}
                  className="text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  {FOUNDERS.deividas.phone}
                </a>
              </p>
            </div>

          <div className="mx-auto w-full max-w-[280px] lg:order-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
              <Image
                src="/images/james-cox-headshot.png"
                alt="James Cox"
                fill
                className="object-cover object-center"
                sizes="280px"
              />
            </div>
            <p className="mt-4 text-center text-lg font-semibold text-text-light">
              James Cox
            </p>
            <p className="mt-1 text-center text-sm text-accent">Co-Founder</p>
            <p className="mt-1 text-center">
              <a
                href={FOUNDERS.james.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary transition-colors hover:text-accent"
              >
                LinkedIn
              </a>
            </p>
            <p className="mt-1 text-center">
              <a
                href={FOUNDERS.james.phoneHref}
                className="text-sm text-text-secondary transition-colors hover:text-accent"
              >
                {FOUNDERS.james.phone}
              </a>
            </p>
          </div>

          </div>{/* end photos row */}
        </div>
        <div className="mt-12 text-center">
          <Button href="/apply">Work With Us</Button>
        </div>
      </Section>
    </>
  );
}
