"use client";

import { useState, useTransition } from "react";
import { getCvSignedUrl } from "./actions";
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

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "blue" | "green" }) {
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

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-16 text-center">
      <p className="text-sm text-text-secondary">No {label} yet</p>
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
          className="rounded-xl border border-border bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-text-light">{app.full_name}</p>
              <p className="mt-0.5 text-sm text-text-secondary">
                <a href={`mailto:${app.email}`} className="hover:text-accent">
                  {app.email}
                </a>{" "}
                · {app.phone}
              </p>
            </div>
            <p className="text-xs text-text-secondary">{formatDate(app.created_at)}</p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="blue">{app.role}</Badge>
            <Badge>{app.location}</Badge>
            {app.cv_url ? (
              <CvButton storagePath={app.cv_url} />
            ) : (
              <span className="text-xs text-text-secondary/60">No CV uploaded</span>
            )}
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
        <div key={enq.id} className="rounded-xl border border-border bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-text-light">{enq.company_name}</p>
              <p className="mt-0.5 text-sm text-text-secondary">
                {enq.contact_name} ·{" "}
                <a href={`mailto:${enq.email}`} className="hover:text-accent">
                  {enq.email}
                </a>{" "}
                · {enq.phone}
              </p>
            </div>
            <p className="text-xs text-text-secondary">{formatDate(enq.created_at)}</p>
          </div>
          <p className="mt-3 rounded-lg bg-bg-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary">
            {enq.message}
          </p>
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
        <div key={msg.id} className="rounded-xl border border-border bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-text-light">{msg.full_name}</p>
                {msg.request_callback && (
                  <Badge variant="green">Callback requested</Badge>
                )}
              </div>
              <p className="mt-0.5 text-sm text-text-secondary">
                <a href={`mailto:${msg.email}`} className="hover:text-accent">
                  {msg.email}
                </a>
                {msg.phone && ` · ${msg.phone}`}
                {msg.company && ` · ${msg.company}`}
              </p>
            </div>
            <p className="text-xs text-text-secondary">{formatDate(msg.created_at)}</p>
          </div>
          <p className="mt-3 rounded-lg bg-bg-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary">
            {msg.message}
          </p>
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
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Neura Recruitment
            </p>
            <h1 className="mt-0.5 text-lg font-semibold text-text-light">Admin</h1>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-light"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex gap-1 rounded-xl border border-border bg-white p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-accent text-white shadow-sm"
                  : "text-text-secondary hover:text-text-light"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  tab === t.id ? "bg-white/20 text-white" : "bg-bg-secondary text-text-secondary"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "applications" && <ApplicationsTab items={applications} />}
          {tab === "enquiries" && <EnquiriesTab items={enquiries} />}
          {tab === "messages" && <MessagesTab items={messages} />}
        </div>
      </main>
    </div>
  );
}
