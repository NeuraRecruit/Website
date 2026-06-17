"use client";

import { motion } from "framer-motion";
import { JOBS } from "@/data/jobs";
import { JobCard } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { fadeUp, staggerContainer } from "@/lib/motion";

const featured = JOBS.filter((j) => j.featured);

export function FeaturedOpportunities() {
  return (
    <Section secondary>
      <SectionHeader
        eyebrow="Featured Opportunities"
        title="Recent roles across the UK"
        description="All listed roles are currently filled. View our opportunities page to register your interest for future openings."
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        {featured.map((job) => (
          <motion.div key={job.id} variants={fadeUp}>
            <JobCard job={job} variant="featured" />
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-10 text-center">
        <Button href="/jobs" variant="secondary">
          View All Opportunities
        </Button>
      </div>
    </Section>
  );
}
