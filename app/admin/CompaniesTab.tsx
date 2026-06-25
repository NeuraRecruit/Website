"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  type Company,
} from "./actions";

// ─── Shared helpers ──────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="break-all text-sm text-text-light">{value}</p>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-bg-secondary px-2.5 py-0.5 text-xs text-text-secondary">
      {label}
    </span>
  );
}

function LabelledInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-xs font-medium text-text-secondary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light placeholder-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}

function LabelledTextarea({
  label,
  name,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-xs font-medium text-text-secondary">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light placeholder-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}

// ─── Confirm-delete button ────────────────────────────────────────────────────

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return confirming ? (
    <span className="flex items-center gap-2">
      <span className="text-xs text-text-secondary">Delete?</span>
      <button
        type="button"
        onClick={onConfirm}
        className="rounded bg-red-600 px-2 py-0.5 text-xs text-white hover:bg-red-700"
      >
        Yes, delete
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded border border-border px-2 py-0.5 text-xs text-text-secondary hover:bg-bg-secondary"
      >
        Cancel
      </button>
    </span>
  ) : (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="rounded border border-red-200 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}

// ─── Add / Edit form ──────────────────────────────────────────────────────────

const EMPTY_FORM = {
  company_name: "",
  industry: "",
  contact_name: "",
  contact_title: "",
  email: "",
  phone: "",
  website: "",
  location: "",
  notes: "",
};

function CompanyForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: typeof EMPTY_FORM;
  onSave: (fd: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [pending, startTransition] = useTransition();

  function set(key: keyof typeof EMPTY_FORM) {
    return (v: string) => setValues((prev) => ({ ...prev, [key]: v }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await onSave(fd);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-bg-secondary p-4">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Company</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <LabelledInput label="Company name *" name="company_name" placeholder="e.g. Acme Ltd" value={values.company_name} onChange={set("company_name")} />
          <LabelledInput label="Industry" name="industry" placeholder="e.g. Construction" value={values.industry} onChange={set("industry")} />
          <LabelledInput label="Website" name="website" type="url" placeholder="https://" value={values.website} onChange={set("website")} />
          <LabelledInput label="Location" name="location" placeholder="e.g. Manchester" value={values.location} onChange={set("location")} />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Point of contact</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <LabelledInput label="Full name" name="contact_name" placeholder="e.g. Sarah Smith" value={values.contact_name} onChange={set("contact_name")} />
          <LabelledInput label="Job title" name="contact_title" placeholder="e.g. HR Manager" value={values.contact_title} onChange={set("contact_title")} />
          <LabelledInput label="Email" name="email" type="email" placeholder="sarah@acme.com" value={values.email} onChange={set("email")} />
          <LabelledInput label="Phone" name="phone" type="tel" placeholder="+44 7700 000000" value={values.phone} onChange={set("phone")} />
        </div>
      </div>

      <LabelledTextarea label="Notes" name="notes" placeholder="Internal notes, requirements, etc." value={values.notes} onChange={set("notes")} />

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Company row ──────────────────────────────────────────────────────────────

function CompanyRow({
  company,
  onUpdated,
}: {
  company: Company;
  onUpdated: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();

  const chips = [
    company.contact_name,
    company.phone,
    company.location,
    company.industry,
  ].filter(Boolean) as string[];

  function fieldFromCompany(c: Company): typeof EMPTY_FORM {
    return {
      company_name: c.company_name ?? "",
      industry: c.industry ?? "",
      contact_name: c.contact_name ?? "",
      contact_title: c.contact_title ?? "",
      email: c.email ?? "",
      phone: c.phone ?? "",
      website: c.website ?? "",
      location: c.location ?? "",
      notes: c.notes ?? "",
    };
  }

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !editing && setExpanded((p) => !p)}
        onKeyDown={(e) => !editing && (e.key === "Enter" || e.key === " ") && setExpanded((p) => !p)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <p className="font-semibold text-text-light">{company.company_name}</p>
          {chips.map((c) => (
            <Chip key={c} label={c} />
          ))}
        </div>
        <svg
          className={`h-4 w-4 flex-shrink-0 text-text-secondary transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 pb-4 pt-3 space-y-4">
              {editing ? (
                <CompanyForm
                  initial={fieldFromCompany(company)}
                  onSave={async (fd) => {
                    await updateCompany(company.id, fd);
                    setEditing(false);
                    onUpdated();
                  }}
                  onCancel={() => setEditing(false)}
                />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <Field label="Company name" value={company.company_name} />
                    <Field label="Industry" value={company.industry} />
                    <Field label="Website" value={company.website} />
                    <Field label="Location" value={company.location} />
                    <Field label="Contact name" value={company.contact_name} />
                    <Field label="Contact title" value={company.contact_title} />
                    <Field label="Email" value={company.email} />
                    <Field label="Phone" value={company.phone} />
                  </div>
                  {company.notes && (
                    <div>
                      <p className="text-xs text-text-secondary">Notes</p>
                      <p className="whitespace-pre-line text-sm text-text-light">{company.notes}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="rounded-lg border border-accent px-3 py-1 text-xs font-medium text-accent hover:bg-accent/5"
                    >
                      Edit
                    </button>
                    <DeleteButton
                      onConfirm={() =>
                        startTransition(async () => {
                          await deleteCompany(company.id);
                          onUpdated();
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main tab component ───────────────────────────────────────────────────────

export default function CompaniesTab({
  initialCompanies,
}: {
  initialCompanies: Company[];
}) {
  const router = useRouter();
  const [companies, setCompanies] = useState(initialCompanies);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCompanies(initialCompanies);
  }, [initialCompanies]);

  const filtered = companies.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.company_name.toLowerCase().includes(q) ||
      (c.contact_name ?? "").toLowerCase().includes(q) ||
      (c.location ?? "").toLowerCase().includes(q) ||
      (c.industry ?? "").toLowerCase().includes(q)
    );
  });

  function refresh() {
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search companies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light placeholder-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:max-w-xs"
        />
        <button
          type="button"
          onClick={() => setShowForm((p) => !p)}
          className="flex-shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
        >
          {showForm ? "Cancel" : "+ Add company"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <CompanyForm
          initial={EMPTY_FORM}
          onSave={async (fd) => {
            await createCompany(fd);
            setShowForm(false);
            refresh();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-text-secondary py-8">
          {search ? "No companies match your search." : "No companies yet — add one above."}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <CompanyRow key={c.id} company={c} onUpdated={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}
