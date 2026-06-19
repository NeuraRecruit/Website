"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Section, SectionHeader } from "@/components/ui/Section";
import { fadeUp, staggerContainer } from "@/lib/motion";

const stats = [
  { value: 24, suffix: "h", label: "Response Time" },
  { value: 100, suffix: "+", label: "Candidates Placed" },
  { value: 95, suffix: "%", label: "Placement Retention" },
];

export function TrustedAcrossConstruction() {
  return (
    <Section blueprint secondary>
      <SectionHeader
        eyebrow="Trusted Across Health & Safety & Construction"
        title="Results that speak for themselves"
        description="We partner with leading health & safety teams and construction firms across the UK to deliver exceptional talent."
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <AnimatedCounter {...stat} />
          </motion.div>
        ))}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-border bg-bg-secondary/50 p-6 text-center backdrop-blur-sm sm:p-8">
            <p className="text-3xl font-semibold tracking-tight text-text-light sm:text-4xl lg:text-5xl">
              UK-Wide
            </p>
            <p className="mt-2 text-sm text-text-secondary sm:text-base">Coverage</p>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
