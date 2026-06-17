"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { fadeUp } from "@/lib/motion";

const pillars = [
  {
    title: "Faster Placements",
    description:
      "Quality candidates delivered quickly. We understand hiring timelines and move at the pace your business needs.",
  },
  {
    title: "Reliability",
    description:
      "Consistent communication and support throughout every placement. No ghosting, no surprises — just dependable service you can count on.",
  },
  {
    title: "Relationships",
    description:
      "Long-term partnerships over transactions. We take the time to understand your goals, whether you're building a team or finding your next opportunity.",
  },
];

export function WhyNeura() {
  return (
    <Section secondary>
      <div className="mb-10 sm:mb-14">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Why Neura
        </p>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-text-light sm:text-4xl lg:text-5xl">
          A recruitment partner built on trust
        </h2>
      </div>

      <div className="space-y-16 sm:space-y-24">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-16"
          >
            <div className="flex-1">
              <span className="text-sm font-medium text-accent/60">
                0{i + 1}
              </span>
              <h3 className="mt-2 text-2xl font-semibold text-text-light sm:text-3xl lg:text-4xl">
                {pillar.title}
              </h3>
            </div>
            <p className="flex-1 text-base leading-relaxed text-text-secondary sm:text-lg">
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
