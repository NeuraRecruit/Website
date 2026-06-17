"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PATHS, type PathType } from "@/lib/paths";
import { fadeUp, staggerContainer } from "@/lib/motion";

type PathSelectorProps = {
  selected?: PathType | null;
  onSelect: (type: PathType) => void;
  className?: string;
};

export function PathSelector({ selected, onSelect, className }: PathSelectorProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn("grid gap-4 sm:grid-cols-2 sm:gap-6", className)}
    >
      {PATHS.map((path) => (
        <motion.button
          key={path.type}
          type="button"
          variants={fadeUp}
          onClick={() => onSelect(path.type)}
          className={cn(
            "group rounded-2xl border p-6 text-left transition-all duration-300 sm:p-8",
            "min-h-[160px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            selected === path.type
              ? "border-accent bg-accent/10 shadow-[0_0_40px_rgba(46,107,255,0.15)]"
              : "border-border bg-bg-secondary/60 hover:border-accent/30 hover:bg-bg-secondary"
          )}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {path.label}
          </p>
          <h3 className="mt-3 text-xl font-semibold text-text-light sm:text-2xl">
            {path.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
            {path.description}
          </p>
          <span className="mt-6 inline-flex items-center text-sm font-medium text-accent group-hover:underline">
            {path.cta} &rarr;
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

export function PathSelectorLinks({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 sm:gap-6", className)}>
      {PATHS.map((path) => (
        <Link
          key={path.type}
          href={`/apply?type=${path.type}`}
          className="group rounded-2xl border border-border bg-bg-secondary/60 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_40px_rgba(46,107,255,0.12)] sm:p-8"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {path.label}
          </p>
          <h3 className="mt-3 text-xl font-semibold text-text-light">{path.title}</h3>
          <p className="mt-3 text-sm text-text-secondary">{path.description}</p>
        </Link>
      ))}
    </div>
  );
}
