"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function Hero() {
  return (
    <section className="relative flex min-h-[72svh] flex-col justify-center overflow-hidden sm:min-h-[78svh]">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-recruitment.webp"
          alt=""
          fill
          priority
          className="hero-video-zoom object-cover object-top lg:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/50 to-white" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-accent sm:text-sm"
          >
            Neura Recruitment
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-semibold leading-[1.08] tracking-tight text-text-light sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {SITE_TAGLINE}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg md:text-xl"
          >
            {SITE_DESCRIPTION}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
