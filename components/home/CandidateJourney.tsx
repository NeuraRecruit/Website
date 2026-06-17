"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { fadeUp, staggerContainer } from "@/lib/motion";

const steps = [
  { step: 1, title: "Apply", description: "Share your experience and preferences" },
  { step: 2, title: "Conversation", description: "We learn about your goals" },
  { step: 3, title: "Matching", description: "We find the right opportunity" },
  { step: 4, title: "Interview", description: "We prepare and support you" },
  { step: 5, title: "Placement", description: "You start your new role" },
];

export function CandidateJourney() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Your Journey"
        title="From application to placement"
        description="A straightforward process designed around you."
      />

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto px-4 pb-4 sm:overflow-visible sm:px-0 sm:pb-0">
          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex min-w-max gap-4 sm:min-w-0 sm:grid sm:grid-cols-5 sm:items-stretch sm:gap-6"
          >
            {steps.map((item) => (
              <motion.li
                key={item.step}
                variants={fadeUp}
                className="w-[200px] flex-shrink-0 sm:w-auto sm:flex"
              >
                <div className="flex h-full min-h-[200px] w-full flex-col rounded-2xl border border-border bg-bg-secondary/60 p-5 sm:min-h-[220px] sm:p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-semibold text-accent">
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-semibold text-text-light">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </Section>
  );
}
