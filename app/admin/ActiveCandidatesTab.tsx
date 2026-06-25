"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  createActiveCandidate,
  updateActiveCandidate,
  deleteActiveCandidate,
  toggleCandidateStatus,
  getCvSignedUrl,
} from "./actions";
import type { ActiveCandidate, CandidateStatus, CandidatePriority, EmploymentType } from "./actions";

// ─── Shared helpers ────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">{label}</p>
      <p className="mt-0.5 break-all text-sm text-text-light">{value || <span className="text-text-secondary/40">—</span>}</p>
    </div>
  );
}

function CvDownloadButton({ storagePath }: { storagePath: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const url = await getCvSignedUrl(storagePath);
          if (url) window.open(url, "_blank");
        })
      }
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-50"
    >
      {pending ? "Loading…" : "Download CV"}
    </button>
  );
}

// ─── Notice period options ────────────────────────────────────────────────

const NOTICE_OPTIONS = [
  "1 week",
  "2 weeks",
  "3 weeks",
  "1 month",
  "2 months",
  "3 months",
  "3 months+",
] as const;

// Sort weight — shorter notice = higher priority
const NOTICE_WEIGHT: Record<string, number> = {
  "1 week": 1,
  "2 weeks": 2,
  "3 weeks": 3,
  "1 month": 4,
  "2 months": 5,
  "3 months": 6,
  "3 months+": 7,
};

const STATUS_WEIGHT: Record<CandidateStatus, number> = {
  available: 0,
  in_work: 1,
  unavailable: 2,
};

const PRIORITY_WEIGHT: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function NoticeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-text-secondary">Notice period</label>
      <div className="flex flex-wrap gap-2">
        {NOTICE_OPTIONS.map((opt) => (
          <label key={opt} className="cursor-pointer">
            <input
              type="radio"
              name="notice_period"
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            <span
              className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                value === opt
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-white text-text-secondary hover:border-accent/40 hover:text-text-light"
              }`}
            >
              {opt}
            </span>
          </label>
        ))}
        {/* Clear selection */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary/60 hover:text-text-secondary"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Salary helpers ───────────────────────────────────────────────────────

const SALARY_QUICK_PICKS = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];

// Parse stored salary string (e.g. "57k" or "57k,75k") → number(s)
function parseSalaryNums(raw: string): number[] {
  return raw
    .split(",")
    .map((s) => parseInt(s.trim().replace("k", "")))
    .filter((n) => !isNaN(n));
}

// Build display string from raw stored value (e.g. "57k" → "£57k", "57k,75k" → "£57k–£75k")
function salaryDisplay(raw: string): string {
  const nums = parseSalaryNums(raw).sort((a, b) => a - b);
  if (!nums.length) return "";
  if (nums.length === 1) return `£${nums[0]}k`;
  return `£${nums[0]}k–£${nums[nums.length - 1]}k`;
}

// Single-value salary picker with ±1k fine-tune
function SalaryStepInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  const adj = (delta: number) => {
    if (value === null) return;
    onChange(Math.max(20, Math.min(300, value + delta)));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-text-secondary">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {SALARY_QUICK_PICKS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? null : n)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              value === n
                ? "border-accent bg-accent text-white"
                : "border-border bg-white text-text-secondary hover:border-accent/40 hover:text-text-light"
            }`}
          >
            £{n}k
          </button>
        ))}
      </div>
      {value !== null && (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => adj(-1)}
            className="rounded border border-border bg-white px-2.5 py-1 text-sm font-semibold text-text-secondary hover:bg-bg-secondary">
            −
          </button>
          <span className="min-w-[4.5rem] text-center text-sm font-bold text-text-light">£{value}k</span>
          <button type="button" onClick={() => adj(+1)}
            className="rounded border border-border bg-white px-2.5 py-1 text-sm font-semibold text-text-secondary hover:bg-bg-secondary">
            +
          </button>
          <button type="button" onClick={() => onChange(null)}
            className="ml-1 text-xs text-text-secondary/60 hover:text-text-secondary">
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

// Range picker for desired salary (from / to)
function SalaryRangePicker({
  min,
  max,
  onChangeMin,
  onChangeMax,
}: {
  min: number | null;
  max: number | null;
  onChangeMin: (v: number | null) => void;
  onChangeMax: (v: number | null) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-text-secondary">Desired salary</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <SalaryStepInput label="From" value={min} onChange={onChangeMin} />
        <SalaryStepInput label="To" value={max} onChange={onChangeMax} />
      </div>
      {(min !== null || max !== null) && (
        <p className="text-xs text-text-secondary">
          Range:{" "}
          <span className="font-medium text-text-light">
            {min !== null && max !== null && min !== max
              ? `£${min}k–£${max}k+`
              : min !== null
              ? `£${min}k+`
              : `up to £${max}k`}
          </span>
        </p>
      )}
    </div>
  );
}

// ─── Status selector ──────────────────────────────────────────────────────

const STATUS_FORM_OPTIONS: { value: CandidateStatus; label: string; cls: string }[] = [
  { value: "available",   label: "Available",   cls: "border-emerald-400 bg-emerald-100 text-emerald-700" },
  { value: "in_work",     label: "In work",     cls: "border-orange-400 bg-orange-100 text-orange-700" },
  { value: "unavailable", label: "Unavailable", cls: "border-red-400 bg-red-100 text-red-600" },
];

function StatusSelector({
  value,
  onChange,
}: {
  value: CandidateStatus;
  onChange: (v: CandidateStatus) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-text-secondary">Status</label>
      <div className="flex flex-wrap gap-2">
        {STATUS_FORM_OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? opt.cls
                  : "border-border bg-white text-text-secondary hover:border-accent/40 hover:text-text-light"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Priority badge + selector ───────────────────────────────────────────

const PRIORITY_STYLES: Record<CandidatePriority, string> = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-yellow-50 text-yellow-700",
  low:    "bg-gray-100 text-gray-500",
};

const PRIORITY_LABELS: Record<CandidatePriority, string> = {
  high:   "High priority",
  medium: "Medium priority",
  low:    "Low priority",
};

function PriorityBadge({ priority }: { priority: CandidatePriority }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

const PRIORITY_FORM_OPTIONS: { value: CandidatePriority; label: string; active: string }[] = [
  { value: "high",   label: "High",   active: "border-red-400 bg-red-100 text-red-700" },
  { value: "medium", label: "Medium", active: "border-accent bg-accent text-white" },
  { value: "low",    label: "Low",    active: "border-gray-400 bg-gray-100 text-gray-700" },
];

function PrioritySelector({
  value,
  onChange,
}: {
  value: CandidatePriority;
  onChange: (v: CandidatePriority) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-text-secondary">Priority</label>
      <div className="flex flex-wrap gap-2">
        {PRIORITY_FORM_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
              value === opt.value
                ? opt.active
                : "border-border bg-white text-text-secondary hover:border-accent/40 hover:text-text-light"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Employment type selector (multi-select) ─────────────────────────────

const EMP_TYPE_STYLES: Record<string, string> = {
  permanent:  "border-blue-400 bg-blue-100 text-blue-700",
  contractor: "border-orange-400 bg-orange-100 text-orange-700",
};

function EmploymentTypeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const parse = (v: string) => v ? v.split(",").map((s) => s.trim()).filter(Boolean) : ["permanent"];
  const [selected, setSelected] = useState<string[]>(() => parse(value));

  // Keep in sync when the parent resets the form
  useEffect(() => { setSelected(parse(value)); }, [value]);

  const toggle = (e: React.MouseEvent, opt: string) => {
    e.stopPropagation();
    setSelected((prev) => {
      const next = prev.includes(opt) ? prev.filter((s) => s !== opt) : [...prev, opt];
      const final = next.length > 0 ? next : [opt]; // always keep at least one
      onChange(final.join(","));
      return final;
    });
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-text-secondary">
        Employment type <span className="font-normal text-text-secondary/60">(select all that apply)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {(["permanent", "contractor"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={(e) => toggle(e, opt)}
            className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
              selected.includes(opt)
                ? EMP_TYPE_STYLES[opt]
                : "border-border bg-white text-text-secondary hover:border-accent/40 hover:text-text-light"
            }`}
          >
            {opt === "permanent" ? "Permanent" : "Contractor"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Add / Edit form ──────────────────────────────────────────────────────

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  linkedin_url: "",
  job_title: "",
  desired_role: "",
  location: "",
  current_salary: "",
  salary_expectation: "",
  day_rate: "",
  previous_roles: "",
  qualifications: "",
  notice_period: "",
  availability: "",
  notes: "",
  status: "available" as CandidateStatus,
  priority: "medium" as CandidatePriority,
  employment_type: "permanent",
};

type FormValues = typeof EMPTY_FORM;

function fieldFromCandidate(c: ActiveCandidate): FormValues {
  return {
    full_name: c.full_name ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    linkedin_url: c.linkedin_url ?? "",
    job_title: c.job_title ?? "",
    desired_role: c.desired_role ?? "",
    location: c.location ?? "",
    current_salary: c.current_salary ?? "",
    salary_expectation: c.salary_expectation ?? "",
    day_rate: c.day_rate ?? "",
    previous_roles: c.previous_roles ?? "",
    qualifications: c.qualifications ?? "",
    notice_period: c.notice_period ?? "",
    availability: c.availability ?? "",
    notes: c.notes ?? "",
    status: c.status,
    priority: c.priority,
    employment_type: c.employment_type,
  };
}

function LabelledInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-text-secondary">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-text-light placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

function LabelledTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-text-secondary">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

function CandidateForm({
  initial,
  onCancel,
  onSaved,
  editingId,
}: {
  initial?: FormValues;
  onCancel: () => void;
  onSaved: () => void;
  editingId?: string;
}) {
  const base = initial ?? EMPTY_FORM;
  const [values, setValues] = useState<FormValues>(base);

  const [currentSalaryNum, setCurrentSalaryNum] = useState<number | null>(() => {
    const nums = parseSalaryNums(base.current_salary);
    return nums[0] ?? null;
  });
  const [desiredMin, setDesiredMin] = useState<number | null>(() => {
    const nums = parseSalaryNums(base.salary_expectation).sort((a, b) => a - b);
    return nums[0] ?? null;
  });
  const [desiredMax, setDesiredMax] = useState<number | null>(() => {
    const nums = parseSalaryNums(base.salary_expectation).sort((a, b) => a - b);
    return nums.length > 1 ? nums[nums.length - 1] : nums[0] ?? null;
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof FormValues) => (v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Inject computed fields not captured by native form inputs
    formData.set("current_salary", currentSalaryNum !== null ? `${currentSalaryNum}k` : "");
    const desiredParts = [desiredMin, desiredMax]
      .filter((n): n is number => n !== null)
      .map((n) => `${n}k`);
    formData.set("salary_expectation", [...new Set(desiredParts)].join(","));
    formData.set("status", values.status);
    formData.set("priority", values.priority);
    formData.set("employment_type", values.employment_type);
    setError(null);
    startTransition(async () => {
      try {
        if (editingId) {
          await updateActiveCandidate(editingId, formData);
        } else {
          await createActiveCandidate(formData);
        }
        onSaved();
      } catch (err) {
        setError((err as Error).message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-5"
    >
      <p className="text-sm font-semibold text-text-light">
        {editingId ? "Edit candidate" : "Add candidate"}
      </p>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Status */}
      <StatusSelector
        value={values.status as CandidateStatus}
        onChange={(v) => setValues((prev) => ({ ...prev, status: v }))}
      />

      {/* Priority */}
      <PrioritySelector
        value={values.priority as CandidatePriority}
        onChange={(v) => setValues((prev) => ({ ...prev, priority: v }))}
      />

      {/* Employment type */}
      <EmploymentTypeSelector
        value={values.employment_type}
        onChange={(v) => setValues((prev) => ({ ...prev, employment_type: v }))}
      />

      {/* Contact */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary/60">Contact</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <LabelledInput label="Full name" name="full_name" value={values.full_name} onChange={set("full_name")} placeholder="Jane Smith" />
          <LabelledInput label="Email" name="email" type="email" value={values.email} onChange={set("email")} placeholder="jane@example.com" />
          <LabelledInput label="Phone" name="phone" type="tel" value={values.phone} onChange={set("phone")} placeholder="+44 7700 000000" />
          <LabelledInput label="LinkedIn URL" name="linkedin_url" value={values.linkedin_url} onChange={set("linkedin_url")} placeholder="https://linkedin.com/in/..." />
        </div>
      </div>

      {/* Role */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary/60">Role</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <LabelledInput label="Current job title" name="job_title" value={values.job_title} onChange={set("job_title")} placeholder="HSE Advisor" />
          <LabelledInput label="Desired role" name="desired_role" value={values.desired_role} onChange={set("desired_role")} placeholder="H&S Manager" />
          <LabelledInput label="Location" name="location" value={values.location} onChange={set("location")} placeholder="London" />
        </div>
      </div>

      {/* Compensation */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary/60">Compensation</p>
        <div className="space-y-3">
          <SalaryStepInput label="Current salary" value={currentSalaryNum} onChange={setCurrentSalaryNum} />
          <SalaryRangePicker min={desiredMin} max={desiredMax} onChangeMin={setDesiredMin} onChangeMax={setDesiredMax} />
          <LabelledInput label="Day rate" name="day_rate" value={values.day_rate} onChange={set("day_rate")} placeholder="£350/day" />
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary/60">Availability</p>
        <div className="space-y-3">
          <NoticeSelector value={values.notice_period} onChange={set("notice_period")} />
          <LabelledInput label="Availability" name="availability" value={values.availability} onChange={set("availability")} placeholder="Immediately" />
        </div>
      </div>

      {/* Background */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary/60">Background</p>
        <div className="space-y-3">
          <LabelledTextarea label="Previous roles / employment history" name="previous_roles" value={values.previous_roles} onChange={set("previous_roles")} placeholder="2020–2024 — HSE Advisor at XYZ Construction..." />
          <LabelledTextarea label="Qualifications & certifications" name="qualifications" value={values.qualifications} onChange={set("qualifications")} placeholder="NEBOSH General Certificate, IOSH Managing Safely, CSCS..." />
        </div>
      </div>

      {/* CV & Notes */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary/60">CV & Notes</p>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-secondary">
              Upload CV {editingId && "(leave blank to keep existing)"}
            </label>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              className="text-sm text-text-secondary file:mr-3 file:rounded-lg file:border file:border-border file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-text-secondary"
            />
          </div>
          <LabelledTextarea label="Internal notes" name="notes" value={values.notes} onChange={set("notes")} placeholder="Referred by..., great attitude, available from..." />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving…" : editingId ? "Save changes" : "Add candidate"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-light"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Individual candidate row ─────────────────────────────────────────────

type ChipColor = "grey" | "blue" | "purple" | "teal" | "amber" | "slate" | "orange" | "green";

const CHIP_COLORS: Record<ChipColor, string> = {
  grey:   "bg-bg-secondary text-text-secondary",
  blue:   "bg-blue-50 text-blue-700",
  purple: "bg-purple-50 text-purple-700",
  teal:   "bg-teal-50 text-teal-700",
  amber:  "bg-amber-50 text-amber-700",
  slate:  "bg-slate-100 text-slate-600",
  orange: "bg-orange-50 text-orange-700",
  green:  "bg-emerald-50 text-emerald-700",
};

function Chip({ label, color = "grey" }: { label: string; color?: ChipColor }) {
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${CHIP_COLORS[color]}`}>
      {label}
    </span>
  );
}

const STATUS_CYCLE: CandidateStatus[] = ["available", "in_work", "unavailable"];

const STATUS_STYLES: Record<CandidateStatus, string> = {
  available:   "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  in_work:     "bg-orange-100 text-orange-700 hover:bg-orange-200",
  unavailable: "bg-red-100 text-red-600 hover:bg-red-200",
};

const STATUS_LABELS: Record<CandidateStatus, string> = {
  available:   "Available",
  in_work:     "In work",
  unavailable: "Unavailable",
};

function StatusBadge({ status }: { status: CandidateStatus }) {
  return (
    <span className={`inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function CandidateRow({
  candidate,
  onEdit,
}: {
  candidate: ActiveCandidate;
  onEdit: (c: ActiveCandidate) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [delPending, startDelTransition] = useTransition();
  const router = useRouter();

  const name = candidate.full_name || "Unnamed candidate";

  const currentSalaryChip = candidate.current_salary
    ? salaryDisplay(candidate.current_salary)
    : null;
  const desiredSalaryChip = candidate.salary_expectation
    ? salaryDisplay(candidate.salary_expectation)
    : candidate.day_rate || null;

  const empTypes = (candidate.employment_type ?? "permanent").split(",").map((s) => s.trim());
  const empChips: { label: string; color: ChipColor }[] = empTypes.includes("permanent") && empTypes.includes("contractor")
    ? [{ label: "Perm / Contract", color: "slate" }]
    : empTypes.includes("contractor")
    ? [{ label: "Contractor", color: "orange" }]
    : [{ label: "Permanent", color: "blue" }];

  const chips: { label: string; color: ChipColor }[] = [
    ...empChips,
    candidate.job_title    ? { label: candidate.job_title,    color: "blue"   } : null,
    currentSalaryChip      ? { label: `on ${currentSalaryChip}`,    color: "green"  } : null,
    candidate.desired_role ? { label: candidate.desired_role, color: "purple" } : null,
    desiredSalaryChip      ? { label: `wants ${desiredSalaryChip}+`, color: "amber"  } : null,
    candidate.location     ? { label: candidate.location,     color: "teal"   } : null,
    candidate.notice_period ? { label: `${candidate.notice_period} notice`, color: "slate" } : null,
    candidate.phone        ? { label: candidate.phone,        color: "grey"   } : null,
  ].filter(Boolean) as { label: string; color: ChipColor }[];

  const handleDelete = () => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    startDelTransition(async () => {
      await deleteActiveCandidate(candidate.id);
      router.refresh();
    });
  };

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      {/* Collapsed row — always visible */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((p) => !p)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded((p) => !p)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <p className="font-semibold text-text-light">{name}</p>
          <StatusBadge status={candidate.status} />
          <PriorityBadge priority={candidate.priority} />
          {chips.map((c) => (
            <Chip key={c.label} label={c.label} color={c.color} />
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

      {/* Expanded detail panel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 pb-4 pt-4 space-y-4">
              {/* Contact */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <div className="col-span-2 lg:col-span-3">
                  <Field label="Email" value={
                    candidate.email
                      ? <a href={`mailto:${candidate.email}`} className="hover:text-accent">{candidate.email}</a>
                      : null
                  } />
                </div>
                <Field label="Phone" value={candidate.phone} />
                <Field label="LinkedIn" value={
                  candidate.linkedin_url
                    ? <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent break-all">{candidate.linkedin_url}</a>
                    : null
                } />
                <Field label="Location" value={candidate.location} />
              </div>

              {/* Role & comp */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Field label="Current job title" value={candidate.job_title} />
                <Field label="Current salary" value={candidate.current_salary} />
                <Field label="Desired role" value={candidate.desired_role} />
                <Field label="Desired salary" value={candidate.salary_expectation} />
                <Field label="Day rate" value={candidate.day_rate} />
                <Field label="Notice period" value={candidate.notice_period} />
                <Field label="Availability" value={candidate.availability} />
              </div>

              {/* Background */}
              {candidate.previous_roles && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">Previous roles</p>
                  <p className="mt-1.5 whitespace-pre-wrap rounded-lg bg-bg-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary">
                    {candidate.previous_roles}
                  </p>
                </div>
              )}
              {candidate.qualifications && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">Qualifications</p>
                  <p className="mt-1.5 rounded-lg bg-bg-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary">
                    {candidate.qualifications}
                  </p>
                </div>
              )}
              {candidate.notes && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">Notes</p>
                  <p className="mt-1.5 whitespace-pre-wrap rounded-lg bg-bg-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary">
                    {candidate.notes}
                  </p>
                </div>
              )}

              {/* CV */}
              {candidate.cv_storage_path && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">CV</p>
                  <div className="mt-1.5">
                    <CvDownloadButton storagePath={candidate.cv_storage_path} />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onEdit(candidate)}
                  className="inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={delPending}
                  className="inline-flex items-center rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  {delPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tab root ─────────────────────────────────────────────────────────────

export function ActiveCandidatesTab({
  initialCandidates,
}: {
  initialCandidates: ActiveCandidate[];
}) {
  const [candidates, setCandidates] = useState<ActiveCandidate[]>(initialCandidates);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<ActiveCandidate | null>(null);
  const [search, setSearch] = useState("");
  const [empFilter, setEmpFilter] = useState<"all" | EmploymentType>("all");
  const [, startRefresh] = useTransition();
  const router = useRouter();

  // Sync local state when the server re-renders with fresh data
  useEffect(() => {
    setCandidates(initialCandidates);
  }, [initialCandidates]);

  const filtered = candidates
    .filter((c) => {
      if (empFilter !== "all" && !(c.employment_type ?? "permanent").split(",").includes(empFilter)) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return [c.full_name, c.desired_role, c.job_title, c.location, c.qualifications]
        .some((v) => v?.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const statusDiff = STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
      if (statusDiff !== 0) return statusDiff;
      const priorityDiff = (PRIORITY_WEIGHT[a.priority] ?? 1) - (PRIORITY_WEIGHT[b.priority] ?? 1);
      if (priorityDiff !== 0) return priorityDiff;
      const aw = a.notice_period ? (NOTICE_WEIGHT[a.notice_period] ?? 99) : 99;
      const bw = b.notice_period ? (NOTICE_WEIGHT[b.notice_period] ?? 99) : 99;
      return aw - bw;
    });

  const handleEdit = (c: ActiveCandidate) => {
    setEditingCandidate(c);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingCandidate(null);
    startRefresh(() => router.refresh());
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCandidate(null);
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      {!showForm && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            placeholder="Search by name, role, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full max-w-xs rounded-lg border border-border bg-white px-3 text-sm text-text-light placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          {/* Employment type filter */}
          <div className="flex rounded-lg border border-border bg-white overflow-hidden text-xs font-medium">
            {(["all", "permanent", "contractor"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setEmpFilter(opt)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  empFilter === opt
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:bg-bg-secondary"
                }`}
              >
                {opt === "all" ? "All" : opt === "permanent" ? "Permanent" : "Contractors"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => { setEditingCandidate(null); setShowForm(true); }}
            className="ml-auto flex-shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            + Add candidate
          </button>
        </div>
      )}

      {/* Colour legend */}
      {!showForm && (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border border-border bg-white px-3 py-2">
          <span className="text-xs font-medium text-text-secondary mr-1 self-center">Legend:</span>
          <span className="flex items-center gap-1.5 text-xs"><span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700">Current role</span></span>
          <span className="flex items-center gap-1.5 text-xs"><span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs text-purple-700">Desired role</span></span>
          <span className="flex items-center gap-1.5 text-xs"><span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs text-teal-700">Location</span></span>
          <span className="flex items-center gap-1.5 text-xs"><span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">Current salary</span></span>
          <span className="flex items-center gap-1.5 text-xs"><span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Desired salary</span></span>
          <span className="flex items-center gap-1.5 text-xs"><span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Notice</span></span>
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <CandidateForm
              initial={editingCandidate ? fieldFromCandidate(editingCandidate) : undefined}
              editingId={editingCandidate?.id}
              onCancel={handleCancel}
              onSaved={handleSaved}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {!showForm && (
        initialCandidates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-sm text-text-secondary">No active candidates yet</p>
            <p className="mt-1 text-xs text-text-secondary/60">Click &quot;+ Add candidate&quot; to add someone to the pool</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-10 text-center">
            <p className="text-sm text-text-secondary">No candidates match &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => (
              <CandidateRow key={c.id} candidate={c} onEdit={handleEdit} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
