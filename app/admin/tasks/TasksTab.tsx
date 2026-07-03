"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompleted,
  type AdminTask,
  type CandidateOption,
  type TaskAssignee,
  type TaskNotifyTo,
  type TaskPriority,
} from "./actions";

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-50 text-yellow-700",
  low: "bg-gray-100 text-gray-500",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const PRIORITY_FORM_OPTIONS: { value: TaskPriority; label: string; active: string }[] = [
  { value: "high", label: "High", active: "border-red-400 bg-red-100 text-red-700" },
  { value: "medium", label: "Medium", active: "border-accent bg-accent text-white" },
  { value: "low", label: "Low", active: "border-gray-400 bg-gray-100 text-gray-700" },
];

const NOTIFY_OPTIONS: { value: TaskNotifyTo; label: string }[] = [
  { value: "james@neurarecruitment.com", label: "James" },
  { value: "deividas@neurarecruitment.com", label: "Deividas" },
  { value: "hello@neurarecruitment.com", label: "Hello" },
];

const ASSIGNEE_OPTIONS: { value: TaskAssignee | ""; label: string }[] = [
  { value: "", label: "Unassigned" },
  { value: "james", label: "James" },
  { value: "deividas", label: "Deividas" },
];

type DueFilter = "all" | "due_today" | "overdue" | "completed";
type PriorityFilter = "all" | TaskPriority;

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">{label}</p>
      <p className="mt-0.5 break-words text-sm text-text-light">
        {value || <span className="text-text-secondary/40">—</span>}
      </p>
    </div>
  );
}

function Chip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className ?? "bg-bg-secondary text-text-secondary"}`}
    >
      {label}
    </span>
  );
}

function PriorityBadge({ priority, compact }: { priority: TaskPriority; compact?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full font-medium ${PRIORITY_STYLES[priority]} ${
        compact ? "px-2 py-0.5 text-[10px] uppercase tracking-wide" : "px-2.5 py-0.5 text-xs"
      }`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

function splitDueAt(iso: string | null): { due_date: string; due_time: string } {
  if (!iso) return { due_date: "", due_time: "" };
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const due_date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const due_time =
    d.getHours() === 9 && d.getMinutes() === 0 && d.getSeconds() === 0
      ? ""
      : `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { due_date, due_time };
}

function combineDueAt(due_date: string, due_time: string): string {
  if (!due_date) return "";
  const [year, month, day] = due_date.split("-").map(Number);
  if (due_time) {
    const [hours, minutes] = due_time.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes, 0, 0).toISOString();
  }
  // Date-only reminders: 9am local on the due date
  return new Date(year, month - 1, day, 9, 0, 0, 0).toISOString();
}

function hasDueTime(iso: string): boolean {
  const d = new Date(iso);
  return d.getHours() !== 9 || d.getMinutes() !== 0 || d.getSeconds() !== 0;
}

function formatDueDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (!hasDueTime(iso)) {
    return d.toLocaleDateString("en-GB", { dateStyle: "medium" });
  }
  return d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

function isOverdue(task: AdminTask): boolean {
  if (!task.due_at || task.completed) return false;
  const due = new Date(task.due_at);
  const now = new Date();
  if (!hasDueTime(task.due_at)) {
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return dueDay < today;
  }
  return due < now;
}

function isDueToday(task: AdminTask): boolean {
  if (!task.due_at || task.completed) return false;
  const due = new Date(task.due_at);
  const now = new Date();
  return (
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate()
  );
}

function assigneeLabel(assignee: TaskAssignee | null): string {
  if (assignee === "james") return "James";
  if (assignee === "deividas") return "Deividas";
  return "Unassigned";
}

function notifyLabel(notifyTo: TaskNotifyTo | null): string {
  if (!notifyTo) return "—";
  return NOTIFY_OPTIONS.find((o) => o.value === notifyTo)?.label ?? notifyTo;
}

function candidateLabel(candidate: { full_name: string | null; job_title: string | null } | null): string {
  if (!candidate) return "";
  const name = candidate.full_name || "Unnamed";
  return candidate.job_title ? `${name} · ${candidate.job_title}` : name;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "medium" as TaskPriority,
  assignee: "" as TaskAssignee | "",
  candidate_id: "",
  due_date: "",
  due_time: "",
  notify_to: "" as TaskNotifyTo | "",
  repeat_reminder: false,
};

function CandidatePicker({
  candidates,
  value,
  onChange,
}: {
  candidates: CandidateOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = candidates.find((c) => c.id === value);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) => (c.full_name ?? "Unnamed").toLowerCase().includes(q));
  }, [candidates, search]);

  return (
    <div className="relative">
      {open ? (
        <input
          type="text"
          role="combobox"
          aria-expanded
          aria-controls="candidate-picker-list"
          autoFocus
          placeholder="Search candidates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150);
          }}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setSearch("");
          }}
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 text-left text-sm transition-colors hover:border-accent/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <span className={selected ? "text-text-light" : "text-text-secondary/50"}>
            {selected?.full_name ?? "Click to select a candidate…"}
          </span>
          {selected && <PriorityBadge priority={selected.priority} compact />}
        </button>
      )}

      {open && (
        <ul
          id="candidate-picker-list"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-white py-1 shadow-lg"
        >
          <li>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange("");
                setSearch("");
                setOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-bg-secondary"
            >
              No candidate linked
            </button>
          </li>
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-text-secondary">No matches</li>
          ) : (
            filtered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(c.id);
                    setSearch("");
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-bg-secondary ${
                    c.id === value ? "bg-accent/10 text-accent" : "text-text-light"
                  }`}
                >
                  <span className={c.id === value ? "font-medium" : undefined}>
                    {c.full_name || "Unnamed"}
                  </span>
                  <PriorityBadge priority={c.priority} compact />
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

function TaskForm({
  initial,
  candidates,
  onSave,
  onCancel,
}: {
  initial: typeof EMPTY_FORM;
  candidates: CandidateOption[];
  onSave: (fd: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (key: keyof typeof EMPTY_FORM) => (v: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("title", values.title);
    fd.set("description", values.description);
    fd.set("priority", values.priority);
    fd.set("assignee", values.assignee);
    fd.set("candidate_id", values.candidate_id);
    fd.set("due_at", combineDueAt(values.due_date, values.due_time));
    fd.set("notify_to", values.notify_to);
    fd.set("repeat_reminder", values.repeat_reminder ? "true" : "false");

    startTransition(async () => {
      try {
        await onSave(fd);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-white p-6">
      <h3 className="text-base font-semibold text-text-light">
        {initial === EMPTY_FORM ? "Add task" : "Edit task"}
      </h3>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="title" className="block text-xs font-medium text-text-secondary">
          Title
        </label>
        <input
          id="title"
          required
          value={values.title}
          onChange={(e) => set("title")(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-xs font-medium text-text-secondary">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={(e) => set("description")(e.target.value)}
          className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-text-secondary">Priority</label>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_FORM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("priority")(opt.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                values.priority === opt.value ? opt.active : "border-border bg-white text-text-secondary hover:border-accent/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="assignee" className="block text-xs font-medium text-text-secondary">
            Assignee
          </label>
          <select
            id="assignee"
            value={values.assignee}
            onChange={(e) => set("assignee")(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {ASSIGNEE_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="due_date" className="block text-xs font-medium text-text-secondary">
            Due date (optional)
          </label>
          <input
            id="due_date"
            type="date"
            value={values.due_date}
            onChange={(e) => {
              const date = e.target.value;
              setValues((prev) => ({
                ...prev,
                due_date: date,
                due_time: date ? prev.due_time : "",
              }));
            }}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {values.due_date && (
        <div className="space-y-1">
          <label htmlFor="due_time" className="block text-xs font-medium text-text-secondary">
            Due time (optional)
          </label>
          <input
            id="due_time"
            type="time"
            value={values.due_time}
            onChange={(e) => set("due_time")(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <p className="text-xs text-text-secondary">
            Leave blank to set a date-only reminder for the start of the due day.
          </p>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="candidate_id" className="block text-xs font-medium text-text-secondary">
          Link to candidate (optional)
        </label>
        <CandidatePicker
          candidates={candidates}
          value={values.candidate_id}
          onChange={(id) => set("candidate_id")(id)}
        />
      </div>

      {values.due_date && (
        <div className="space-y-4 rounded-xl border border-border bg-bg-secondary/40 p-4">
          <div className="space-y-1">
            <label htmlFor="notify_to" className="block text-xs font-medium text-text-secondary">
              Reminder email to
            </label>
            <select
              id="notify_to"
              required
              value={values.notify_to}
              onChange={(e) => set("notify_to")(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Select recipient…</option>
              {NOTIFY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.value})
                </option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={values.repeat_reminder}
              onChange={(e) => set("repeat_reminder")(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
            />
            <span>
              <span className="block text-sm font-medium text-text-light">Repeat reminder</span>
              <span className="mt-0.5 block text-sm text-text-secondary">
                Re-send daily until the task is marked complete.
              </span>
            </span>
          </label>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border bg-white px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return confirming ? (
    <span className="flex items-center gap-2">
      <span className="text-xs text-text-secondary">Delete?</span>
      <button type="button" onClick={onConfirm} className="rounded bg-red-600 px-2 py-0.5 text-xs text-white hover:bg-red-700">
        Yes
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="rounded border border-border px-2 py-0.5 text-xs text-text-secondary">
        Cancel
      </button>
    </span>
  ) : (
    <button type="button" onClick={() => setConfirming(true)} className="rounded border border-red-200 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50">
      Delete
    </button>
  );
}

function TaskRow({ task, onEdit }: { task: AdminTask; onEdit: (task: AdminTask) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const overdue = isOverdue(task);

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white transition-colors ${
        task.completed
          ? "border-border opacity-70"
          : overdue
            ? "border-red-300"
            : "border-border"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-semibold ${task.completed ? "text-text-secondary line-through" : "text-text-light"}`}>
            {task.title}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <PriorityBadge priority={task.priority} />
            {task.due_at && (
              <Chip
                label={formatDueDate(task.due_at)}
                className={overdue ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-700"}
              />
            )}
            {overdue && <Chip label="Overdue" className="bg-red-100 text-red-700" />}
            {isDueToday(task) && !overdue && <Chip label="Due today" className="bg-amber-100 text-amber-800" />}
            {task.assignee && <Chip label={assigneeLabel(task.assignee)} />}
            {task.candidate && <Chip label={candidateLabel(task.candidate)} className="bg-accent/10 text-accent" />}
            {task.completed && <Chip label="Completed" className="bg-emerald-100 text-emerald-700" />}
          </div>
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
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="space-y-4 px-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Due date" value={task.due_at ? formatDueDate(task.due_at) : null} />
                <Field label="Assignee" value={assigneeLabel(task.assignee)} />
                <Field label="Reminder email" value={notifyLabel(task.notify_to)} />
                <Field
                  label="Repeat reminder"
                  value={task.repeat_reminder ? "Daily until complete" : "No"}
                />
                <Field
                  label="Reminder sent"
                  value={
                    task.last_reminder_sent_at
                      ? new Date(task.last_reminder_sent_at).toLocaleString("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : task.due_at && task.notify_to
                        ? "Pending"
                        : null
                  }
                />
                <Field label="Linked candidate" value={task.candidate ? candidateLabel(task.candidate) : null} />
              </div>

              {task.description && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/60">Description</p>
                  <p className="mt-1.5 whitespace-pre-wrap rounded-lg bg-bg-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary">
                    {task.description}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-accent/40 hover:text-accent"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await toggleTaskCompleted(task.id, !task.completed);
                      router.refresh();
                    })
                  }
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-accent/40 hover:text-accent disabled:opacity-50"
                >
                  {task.completed ? "Mark incomplete" : "Mark complete"}
                </button>
                <DeleteButton
                  onConfirm={() =>
                    startTransition(async () => {
                      await deleteTask(task.id);
                      router.refresh();
                    })
                  }
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TasksTab({
  initialTasks,
  candidates,
}: {
  initialTasks: AdminTask[];
  candidates: CandidateOption[];
}) {
  const router = useRouter();
  const [, startRefresh] = useTransition();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [dueFilter, setDueFilter] = useState<DueFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<AdminTask | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialTasks.filter((task) => {
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      if (dueFilter === "completed") return task.completed;
      if (dueFilter === "due_today") return isDueToday(task);
      if (dueFilter === "overdue") return isOverdue(task);
      if (q) {
        const haystack = [
          task.title,
          task.description ?? "",
          task.candidate?.full_name ?? "",
          task.candidate?.job_title ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [initialTasks, search, priorityFilter, dueFilter]);

  const formInitial = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description ?? "",
        priority: editingTask.priority,
        assignee: (editingTask.assignee ?? "") as TaskAssignee | "",
        candidate_id: editingTask.candidate_id ?? "",
        ...splitDueAt(editingTask.due_at),
        notify_to: (editingTask.notify_to ?? "") as TaskNotifyTo | "",
        repeat_reminder: editingTask.repeat_reminder,
      }
    : EMPTY_FORM;

  const handleSaved = () => {
    setShowForm(false);
    setEditingTask(null);
    startRefresh(() => router.refresh());
  };

  return (
    <div className="space-y-4">
      {!showForm && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full max-w-xs rounded-lg border border-border bg-white px-3 text-sm text-text-light placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />

          <div className="flex rounded-lg border border-border bg-white overflow-hidden text-xs font-medium">
            {(["all", "high", "medium", "low"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPriorityFilter(opt)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  priorityFilter === opt ? "bg-accent text-white" : "text-text-secondary hover:bg-bg-secondary"
                }`}
              >
                {opt === "all" ? "All priorities" : opt}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg border border-border bg-white overflow-hidden text-xs font-medium">
            {(
              [
                { id: "all", label: "All" },
                { id: "due_today", label: "Due today" },
                { id: "overdue", label: "Overdue" },
                { id: "completed", label: "Completed" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDueFilter(opt.id)}
                className={`px-3 py-1.5 transition-colors ${
                  dueFilter === opt.id ? "bg-accent text-white" : "text-text-secondary hover:bg-bg-secondary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="ml-auto flex-shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            + Add
          </button>
        </div>
      )}

      {showForm ? (
        <TaskForm
          key={editingTask?.id ?? "new"}
          initial={formInitial}
          candidates={candidates}
          onSave={async (fd) => {
            if (editingTask) await updateTask(editingTask.id, fd);
            else await createTask(fd);
            handleSaved();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center">
          <p className="text-sm text-text-secondary">No tasks match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onEdit={(t) => {
                setEditingTask(t);
                setShowForm(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
