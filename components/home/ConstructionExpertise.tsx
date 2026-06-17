"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { fadeUp, staggerContainer } from "@/lib/motion";

const expertise = [
  {
    title: "Trades & Labour",
    description:
      "Carpenters, electricians, plumbers, groundworkers, and skilled trades across every site.",
    icon: "01",
  },
  {
    title: "Engineering",
    description:
      "Structural, civil, and MEP engineers for complex developments and infrastructure.",
    icon: "02",
  },
  {
    title: "Commercial",
    description:
      "Quantity surveyors, commercial managers, and cost consultants who protect margins.",
    icon: "03",
  },
  {
    title: "Site Management",
    description:
      "Site managers and supervisors who deliver projects on time and to specification.",
    icon: "04",
  },
];

export function ConstructionExpertise() {
  return (
    <Section blueprint>
      <SectionHeader
        eyebrow="Construction Expertise"
        title="Deep sector knowledge"
        description="We recruit across every discipline in construction — from groundworks to commercial leadership."
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-4 sm:grid-cols-2 lg:gap-6"
      >
        {expertise.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl border border-border bg-bg-secondary/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_0_50px_rgba(46,107,255,0.1)] sm:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-4 font-heading text-7xl font-bold text-accent/5 transition-colors group-hover:text-accent/10 sm:text-8xl"
            >
              {item.icon}
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {item.icon}
            </p>
            <h3 className="mt-4 text-xl font-semibold text-text-light sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
