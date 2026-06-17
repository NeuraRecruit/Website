"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { JOBS, TRADES, LOCATIONS, SALARY_RANGES } from "@/data/jobs";
import { JobCard, RolesFilledBanner } from "@/components/jobs/JobCard";
import { Section, SectionHeader } from "@/components/ui/Section";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function JobsPage() {
  const [location, setLocation] = useState("");
  const [trade, setTrade] = useState("");
  const [salaryMin, setSalaryMin] = useState(0);

  const filtered = useMemo(() => {
    return JOBS.filter((job) => {
      if (location && job.location !== location) return false;
      if (trade && trade !== "All Trades" && job.trade !== trade) return false;
      if (salaryMin && job.salaryMin < salaryMin) return false;
      return true;
    });
  }, [location, trade, salaryMin]);

  return (
    <Section className="min-h-[80vh] pt-28 sm:pt-32">
      <SectionHeader
        eyebrow="Opportunities"
        title="Construction roles across the UK"
        description="Browse our recent opportunities. All listed roles are currently filled — register your interest for future openings."
        align="left"
      />

      <RolesFilledBanner className="mb-10" />

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="filter-location" className="mb-2 block text-sm font-medium text-text-light">
            Location
          </label>
          <select
            id="filter-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-bg-secondary px-4 text-base text-text-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc === "All Locations" ? "" : loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-trade" className="mb-2 block text-sm font-medium text-text-light">
            Trade
          </label>
          <select
            id="filter-trade"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-bg-secondary px-4 text-base text-text-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {TRADES.map((t) => (
              <option key={t} value={t === "All Trades" ? "" : t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-salary" className="mb-2 block text-sm font-medium text-text-light">
            Salary
          </label>
          <select
            id="filter-salary"
            value={salaryMin}
            onChange={(e) => setSalaryMin(Number(e.target.value))}
            className="h-12 w-full rounded-xl border border-border bg-bg-secondary px-4 text-base text-text-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {SALARY_RANGES.map((range) => (
              <option key={range.label} value={range.min}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        {filtered.length === 0 ? (
          <p className="col-span-full py-12 text-center text-text-secondary">
            No roles match your filters.{" "}
            <Link href="/apply?type=worker" className="text-accent hover:underline">
              Register your interest
            </Link>{" "}
            and we&apos;ll be in touch when something suitable opens up.
          </p>
        ) : (
          filtered.map((job) => (
            <motion.div key={job.id} variants={fadeUp}>
              <JobCard job={job} />
            </motion.div>
          ))
        )}
      </motion.div>
    </Section>
  );
}
