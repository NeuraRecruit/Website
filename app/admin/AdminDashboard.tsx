"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCvSignedUrl,
  toggleProcessed,
  deleteApplication,
  deleteEnquiry,
  deleteContactMessage,
} from "./actions";
import { adminLogout } from "./login/actions";
import type {
  CandidateApplication,
  EmployerEnquiry,
  ContactMessage,
  ActiveCandidate,
  Company,
} from "./actions";
import { ActiveCandidatesTab } from "./ActiveCandidatesTab";
import CompaniesTab from "./CompaniesTab";

type Tab = "applications" | "enquiries" | "messages" | "pool" | "companies";

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

function DeleteButton({
  onDelete,
}: {
  onDelete: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (!window.confirm("Are you sure you want to delete this? This cannot be undone.")) return;
    startTransition(async () => {
      await onDelete();
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
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
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">{label}</p>
      <p className="mt-0.5 break-all text-sm text-text-light">{value}</p>
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
          className={`rounded-xl border bg-white p-4 transition-colors sm:p-5 ${
            app.processed ? "border-emerald-200 opacity-70" : "border-border"
          }`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <p className="font-semibold text-text-light">{app.full_name}</p>
            <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
              <p className="text-xs text-text-secondary">{formatDate(app.created_at)}</p>
              <div className="flex items-center gap-2">
                <ProcessedCheckbox
                  id={app.id}
                  table="candidate_applications"
                  initialProcessed={app.processed}
                />
                <DeleteButton onDelete={() => deleteApplication(app.id)} />
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
            <div className="col-span-2 lg:col-span-3">
              <Field label="Email" value={
                <a href={`mailto:${app.email}`} className="hover:text-accent">{app.email}</a>
              } />
            </div>
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
          className={`rounded-xl border bg-white p-4 transition-colors sm:p-5 ${
            enq.processed ? "border-emerald-200 opacity-70" : "border-border"
          }`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <p className="font-semibold text-text-light">{enq.company_name}</p>
            <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
              <p className="text-xs text-text-secondary">{formatDate(enq.created_at)}</p>
              <div className="flex items-center gap-2">
                <ProcessedCheckbox
                  id={enq.id}
                  table="employer_enquiries"
                  initialProcessed={enq.processed}
                />
                <DeleteButton onDelete={() => deleteEnquiry(enq.id)} />
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
            <Field label="Contact name" value={enq.contact_name} />
            <Field label="Phone" value={enq.phone} />
            <div className="col-span-2 lg:col-span-1">
              <Field label="Email" value={
                <a href={`mailto:${enq.email}`} className="hover:text-accent">{enq.email}</a>
              } />
            </div>
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
          className={`rounded-xl border bg-white p-4 transition-colors sm:p-5 ${
            msg.processed ? "border-emerald-200 opacity-70" : "border-border"
          }`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-text-light">{msg.full_name}</p>
              {msg.request_callback && <Badge variant="green">Callback requested</Badge>}
            </div>
            <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
              <p className="text-xs text-text-secondary">{formatDate(msg.created_at)}</p>
              <div className="flex items-center gap-2">
                <ProcessedCheckbox
                  id={msg.id}
                  table="contact_messages"
                  initialProcessed={msg.processed}
                />
                <DeleteButton onDelete={() => deleteContactMessage(msg.id)} />
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
            <div className="col-span-2 lg:col-span-3">
              <Field label="Email" value={
                <a href={`mailto:${msg.email}`} className="hover:text-accent">{msg.email}</a>
              } />
            </div>
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
  activeCandidates,
  companies,
}: {
  applications: CandidateApplication[];
  enquiries: EmployerEnquiry[];
  messages: ContactMessage[];
  activeCandidates: ActiveCandidate[];
  companies: Company[];
}) {
  const [tab, setTab] = useState<Tab>("pool");

  const tabs: { id: Tab; label: string; mobileLabel: string; count: number; newCount: number }[] = [
    { id: "applications", label: "Applications", mobileLabel: "Apps", count: applications.length, newCount: applications.filter((a) => !a.processed).length },
    { id: "enquiries",    label: "Enquiries",    mobileLabel: "Enqs", count: enquiries.length,    newCount: enquiries.filter((e) => !e.processed).length },
    { id: "messages",     label: "Messages",     mobileLabel: "Msgs", count: messages.length,     newCount: messages.filter((m) => !m.processed).length },
    { id: "pool",         label: "Active Candidates", mobileLabel: "Pool", count: activeCandidates.length, newCount: 0 },
    { id: "companies",    label: "Companies",    mobileLabel: "Cos",  count: companies.length,    newCount: 0 },
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
              className={`relative flex flex-1 items-center justify-center rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
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
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="sm:hidden">{t.mobileLabel}</span>
                <span className="hidden sm:inline">{t.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                    tab === t.id ? "bg-white/20 text-white" : "bg-bg-secondary text-text-secondary"
                  }`}
                >
                  {t.count}
                </span>
                {t.newCount > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                    tab === t.id ? "bg-red-400 text-white" : "bg-red-500 text-white"
                  }`}>
                    {t.newCount}
                  </span>
                )}
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
            {tab === "pool" && <ActiveCandidatesTab initialCandidates={activeCandidates} />}
            {tab === "companies" && <CompaniesTab initialCompanies={companies} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

