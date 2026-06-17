"use client";

import { motion } from "framer-motion";
import { PathToggleBox } from "@/components/forms/PathToggleBox";
import { Section, SectionHeader } from "@/components/ui/Section";
import { fadeUp } from "@/lib/motion";

export function GetStarted() {
  return (
    <Section secondary blueprint id="get-started" className="!pt-12 sm:!pt-14">
      <SectionHeader
        eyebrow="Get Started"
        title="How can we help you today?"
        description="Select the option that best describes you."
        align="center"
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="mx-auto w-full max-w-xl"
      >
        <PathToggleBox hideHeader layoutId="home-path-toggle" className="w-full max-w-none" />
      </motion.div>
    </Section>
  );
}
