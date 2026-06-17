"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { fadeUp } from "@/lib/motion";

export function EmployerCTA() {
  return (
    <Section className="!py-20 sm:!py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl border border-border bg-bg-secondary px-6 py-16 text-center shadow-sm sm:px-12 sm:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(46,107,255,0.08) 0%, transparent 60%)`,
          }}
        />
        <h2 className="relative text-3xl font-semibold tracking-tight text-text-light sm:text-4xl lg:text-5xl">
          Need construction talent?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-base text-text-secondary sm:text-lg">
          Partner with Neura to access a network of skilled professionals across
          every discipline in UK construction.
        </p>
        <div className="relative mt-8">
          <Button href="/apply?type=client" size="lg">
            Book a Consultation
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}
