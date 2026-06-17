"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCvSignedUrl, toggleProcessed } from "./actions";
import { adminLogout } from "./login/actions";
import type {
  CandidateApplication,
  EmployerEnquiry,
  ContactMessage,
} from "./actions";

type Tab = "applications" | "enquiries" | "messages";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "blue" | "green";
}) {
  const cls = {
    default: "bg-bg-secondary text-text-secondary",
    blue: "bg-accent/10 text-accent",
    green: "bg-emerald-50 text-emerald-700",
  }[variant];
  return (
    <span className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

function CvButton({ storagePath }: { storagePath: string }) {
  const [pending, startTransition] = useTransition();

  const download = () => {
    startTransition(async () => {
      const url = await getCvSignedUrl(storagePath);
      if (url) window.open(url, "_blank");
    });
  };

  return (
    <button
      onClick={download}
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-50"
    >
      {pending ? "Loading…" : "Download CV"}
    </button>
  );
}

type ProcessedTable =
  | "candidate_applications"
  | "employer_enquiries"
  | "contact_messages";

function ProcessedCheckbox({
  id,
  table,
  initialProcessed,
}: {
  id: string;
  table: ProcessedTable;
  initialProcessed: boolean;
}) {
  const [processed, setProcessed] = useState(initialProcessed);
  const [, startTransition] = useTransition();

  const handleChange = (checked: boolean) => {
    if (!checked) {
      const confirmed = window.confirm(
        "Are you sure you want to mark this as unprocessed?"
      );
      if (!confirmed) return;
    }
    setProcessed(checked);
    startTransition(async () => {
      await toggleProcessed(table, id, checked);
    });
  };

  return (
    <label className="flex cursor-pointer items-center gap-2 select-none">
      <input
        type="checkbox"
        checked={processed}
        onChange={(e) => handleChange(e.target.checked)}
        className="h-4 w-4 rounded border-border accent-accent"
      />
      <span className={`text-xs font-medium ${processed ? "text-emerald-600" : "text-text-secondary"}`}>
        {processed ? "Processed" : "Mark as processed"}
      </span>
    </label>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-16 text-center">
      <p className="text-sm text-text-secondary">No {label} yet</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">{label}</p>
      <p className="mt-0.5 text-sm text-text-light">{value}</p>
    </div>
  );
}

function ApplicationsTab({ items }: { items: CandidateApplication[] }) {
  if (!items.length) return <EmptyState label="applications" />;
  return (
    <div className="space-y-3">
      {items.map((app) => (
        <div
          key={app.id}
          className={`rounded-xl border bg-white p-5 transition-colors ${
            app.processed ? "border-emerald-200 opacity-70" : "border-border"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="font-semibold text-text-light">{app.full_name}</p>
            <div className="flex flex-col items-end gap-2">
              <p className="text-xs text-text-secondary">{formatDate(app.created_at)}</p>
              <ProcessedCheckbox
                id={app.id}
                table="candidate_applications"
                initialProcessed={app.processed}
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Email" value={
              <a href={`mailto:${app.email}`} className="hover:text-accent">{app.email}</a>
            } />
            <Field label="Phone" value={app.phone} />
            <Field label="Preferred role" value={app.role} />
            <Field label="Preferred location" value={app.location} />
            <Field label="CV" value={
              app.cv_url
                ? <CvButton storagePath={app.cv_url} />
                : <span className="text-text-secondary/60">Not uploaded</span>
            } />
          </div>
        </div>
      ))}
    </div>
  );
}

function EnquiriesTab({ items }: { items: EmployerEnquiry[] }) {
  if (!items.length) return <EmptyState label="enquiries" />;
  return (
    <div className="space-y-3">
      {items.map((enq) => (
        <div
          key={enq.id}
          className={`rounded-xl border bg-white p-5 transition-colors ${
            enq.processed ? "border-emerald-200 opacity-70" : "border-border"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="font-semibold text-text-light">{enq.company_name}</p>
            <div className="flex flex-col items-end gap-2">
              <p className="text-xs text-text-secondary">{formatDate(enq.created_at)}</p>
              <ProcessedCheckbox
                id={enq.id}
                table="employer_enquiries"
                initialProcessed={enq.processed}
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Contact name" value={enq.contact_name} />
            <Field label="Email" value={
              <a href={`mailto:${enq.email}`} className="hover:text-accent">{enq.email}</a>
            } />
            <Field label="Phone" value={enq.phone} />
          </div>
          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">Hiring needs</p>
            <p className="mt-1.5 rounded-lg bg-bg-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary">
              {enq.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesTab({ items }: { items: ContactMessage[] }) {
  if (!items.length) return <EmptyState label="messages" />;
  return (
    <div className="space-y-3">
      {items.map((msg) => (
        <div
          key={msg.id}
          className={`rounded-xl border bg-white p-5 transition-colors ${
            msg.processed ? "border-emerald-200 opacity-70" : "border-border"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-text-light">{msg.full_name}</p>
              {msg.request_callback && <Badge variant="green">Callback requested</Badge>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="text-xs text-text-secondary">{formatDate(msg.created_at)}</p>
              <ProcessedCheckbox
                id={msg.id}
                table="contact_messages"
                initialProcessed={msg.processed}
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Email" value={
              <a href={`mailto:${msg.email}`} className="hover:text-accent">{msg.email}</a>
            } />
            {msg.phone && <Field label="Phone" value={msg.phone} />}
            {msg.company && <Field label="Company" value={msg.company} />}
          </div>
          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">Message</p>
            <p className="mt-1.5 rounded-lg bg-bg-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary">
              {msg.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboard({
  applications,
  enquiries,
  messages,
}: {
  applications: CandidateApplication[];
  enquiries: EmployerEnquiry[];
  messages: ContactMessage[];
}) {
  const [tab, setTab] = useState<Tab>("applications");

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "applications", label: "Applications", count: applications.length },
    { id: "enquiries", label: "Enquiries", count: enquiries.length },
    { id: "messages", label: "Messages", count: messages.length },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Neura Recruitment
            </p>
            <h1 className="mt-0.5 text-lg font-semibold text-text-light">Admin</h1>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-light"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="flex gap-1 rounded-xl border border-border bg-white p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id ? "text-white" : "text-text-secondary hover:text-text-light"
              }`}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="admin-tab-indicator"
                  className="absolute inset-0 rounded-lg bg-accent shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {t.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    tab === t.id ? "bg-white/20 text-white" : "bg-bg-secondary text-text-secondary"
                  }`}
                >
                  {t.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mt-6"
          >
            {tab === "applications" && <ApplicationsTab items={applications} />}
            {tab === "enquiries" && <EnquiriesTab items={enquiries} />}
            {tab === "messages" && <MessagesTab items={messages} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

