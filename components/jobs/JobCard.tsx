"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Job } from "@/data/jobs";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

function FilledBadge() {
  return (
    <span className="inline-flex rounded-md border border-border bg-bg-secondary px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-text-secondary">
      Filled
    </span>
  );
}

function FilledRoleModal({
  job,
  open,
  onClose,
}: {
  job: Job;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filled-role-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Role filled
            </p>
            <h3 id="filled-role-title" className="mt-3 text-xl font-semibold text-text-light">
              Sorry, this role has currently been filled
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              The <span className="font-medium text-text-light">{job.role}</span> position
              in {job.location} is no longer available. Register your interest and we&apos;ll
              contact you when a similar opportunity opens up.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/apply?type=worker&role=${encodeURIComponent(job.role)}&location=${encodeURIComponent(job.location)}`}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-accent px-6 text-sm font-medium text-white transition-all hover:bg-accent/90 sm:flex-1"
              >
                Register your interest
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-lg border border-border px-6 text-sm font-medium text-text-secondary transition-colors hover:text-text-light"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function RolesFilledBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-bg-secondary/80 p-6 sm:p-8",
        className
      )}
    >
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
        All roles filled
      </p>
      <h3 className="mt-2 text-xl font-semibold text-text-light sm:text-2xl">
        We have filled all roles currently
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
        New opportunities are added regularly. Register your interest and we&apos;ll
        contact you when a suitable role becomes available.
      </p>
      <Link
        href="/apply?type=worker"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-accent px-6 text-sm font-medium text-white transition-all hover:bg-accent/90"
      >
        Register your interest
      </Link>
    </div>
  );
}

type JobCardProps = {
  job: Job;
  variant?: "default" | "featured";
};

export function JobCard({ job, variant = "default" }: JobCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isFilled = job.filled ?? false;
  const isFeatured = variant === "featured";
  const showApply = !isFilled;

  const openFilledModal = () => {
    if (isFilled) setModalOpen(true);
  };

  return (
    <>
      <Card
        hover
        role={isFilled ? "button" : undefined}
        tabIndex={isFilled ? 0 : undefined}
        onClick={isFilled ? openFilledModal : undefined}
        onKeyDown={
          isFilled
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFilledModal();
                }
              }
            : undefined
        }
        className={cn(
          "flex h-full flex-col",
          isFilled && "cursor-pointer opacity-90",
          isFilled && !isFeatured && "opacity-75"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">
            {job.trade}
          </p>
          {isFilled && <FilledBadge />}
        </div>
        <h3 className="mt-3 text-xl font-semibold text-text-light">{job.role}</h3>
        <p className="mt-4 text-sm text-text-secondary">{job.location}</p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p className="text-sm font-medium text-text-light">{job.salary}</p>
          {showApply ? (
            <Link
              href={`/apply?type=worker&role=${encodeURIComponent(job.role)}&location=${encodeURIComponent(job.location)}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-accent px-5 text-sm font-medium text-white transition-all hover:bg-accent/90"
            >
              Apply
            </Link>
          ) : (
            <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-text-secondary">
              View
            </span>
          )}
        </div>
      </Card>

      {isFilled && (
        <FilledRoleModal
          job={job}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
