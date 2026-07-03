"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export type TaskPriority = "high" | "medium" | "low";
export type TaskNotifyTo =
  | "james@neurarecruitment.com"
  | "deividas@neurarecruitment.com"
  | "hello@neurarecruitment.com";
export type TaskAssignee = "james" | "deividas";

export type CandidateOption = {
  id: string;
  full_name: string | null;
  priority: TaskPriority;
};

const PRIORITY_WEIGHT: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const NOTICE_WEIGHT: Record<string, number> = {
  "1 week": 1,
  "2 weeks": 2,
  "3 weeks": 3,
  "1 month": 4,
  "2 months": 5,
  "3 months": 6,
  "3 months+": 7,
};

export type AdminTask = {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  due_at: string | null;
  notify_to: TaskNotifyTo | null;
  assignee: TaskAssignee | null;
  candidate_id: string | null;
  repeat_reminder: boolean;
  completed: boolean;
  last_reminder_sent_at: string | null;
  created_at: string;
  updated_at: string;
  candidate: {
    id: string;
    full_name: string | null;
    job_title: string | null;
  } | null;
};

type TaskRow = Omit<AdminTask, "candidate"> & {
  active_candidates: AdminTask["candidate"];
};

function optStr(formData: FormData, key: string): string | null {
  const v = (formData.get(key) as string | null)?.trim();
  return v || null;
}

function parsePriority(raw: string | null): TaskPriority {
  return raw === "high" || raw === "low" ? raw : "medium";
}

function parseAssignee(raw: string | null): TaskAssignee | null {
  return raw === "james" || raw === "deividas" ? raw : null;
}

function parseNotifyTo(raw: string | null): TaskNotifyTo | null {
  if (
    raw === "james@neurarecruitment.com" ||
    raw === "deividas@neurarecruitment.com" ||
    raw === "hello@neurarecruitment.com"
  ) {
    return raw;
  }
  return null;
}

function parseDueAt(raw: string | null): string | null {
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  // Already ISO from client, or legacy datetime-local string
  return date.toISOString();
}

function mapTask(row: TaskRow): AdminTask {
  const { active_candidates, ...task } = row;
  return {
    ...task,
    candidate: active_candidates ?? null,
  };
}

function parseTaskFields(formData: FormData) {
  const title = optStr(formData, "title");
  if (!title) throw new Error("Title is required");

  const due_at = parseDueAt(optStr(formData, "due_at"));
  const notify_to = parseNotifyTo(optStr(formData, "notify_to"));
  const repeat_reminder = formData.get("repeat_reminder") === "true";

  if (due_at && !notify_to) {
    throw new Error("Notify recipient is required when a due date is set");
  }

  const candidateRaw = optStr(formData, "candidate_id");

  return {
    title,
    description: optStr(formData, "description"),
    priority: parsePriority(optStr(formData, "priority")),
    due_at,
    notify_to: due_at ? notify_to : null,
    assignee: parseAssignee(optStr(formData, "assignee")),
    candidate_id: candidateRaw || null,
    repeat_reminder: due_at ? repeat_reminder : false,
  };
}

export async function getTasks(): Promise<AdminTask[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("admin_tasks")
    .select("*, active_candidates(id, full_name, job_title)")
    .order("completed", { ascending: true })
    .order("due_at", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  const tasks = (data ?? []).map((row) => mapTask(row as TaskRow));

  const priorityWeight: Record<TaskPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pw = priorityWeight[a.priority] - priorityWeight[b.priority];
    if (pw !== 0) return pw;
    if (a.due_at && b.due_at) return a.due_at.localeCompare(b.due_at);
    if (a.due_at) return -1;
    if (b.due_at) return 1;
    return b.updated_at.localeCompare(a.updated_at);
  });
}

export async function getCandidateOptions(): Promise<CandidateOption[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("active_candidates")
    .select("id, full_name, priority, notice_period");

  if (error) throw new Error(error.message);

  return (data ?? [])
    .sort((a, b) => {
      const priorityDiff =
        (PRIORITY_WEIGHT[a.priority] ?? 1) - (PRIORITY_WEIGHT[b.priority] ?? 1);
      if (priorityDiff !== 0) return priorityDiff;
      const aw = a.notice_period ? (NOTICE_WEIGHT[a.notice_period] ?? 99) : 99;
      const bw = b.notice_period ? (NOTICE_WEIGHT[b.notice_period] ?? 99) : 99;
      return aw - bw;
    })
    .map(({ id, full_name, priority }) => ({
      id,
      full_name,
      priority: (priority === "high" || priority === "low" ? priority : "medium") as TaskPriority,
    }));
}

export async function createTask(formData: FormData): Promise<void> {
  const admin = createSupabaseAdmin();
  const fields = parseTaskFields(formData);

  const { error } = await admin.from("admin_tasks").insert({
    ...fields,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/tasks");
}

export async function updateTask(id: string, formData: FormData): Promise<void> {
  const admin = createSupabaseAdmin();
  const fields = parseTaskFields(formData);

  const { data: existing, error: fetchError } = await admin
    .from("admin_tasks")
    .select("due_at, notify_to, repeat_reminder")
    .eq("id", id)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const reminderChanged =
    existing.due_at !== fields.due_at ||
    existing.notify_to !== fields.notify_to ||
    existing.repeat_reminder !== fields.repeat_reminder;

  const updatePayload = {
    ...fields,
    updated_at: new Date().toISOString(),
    ...(reminderChanged ? { last_reminder_sent_at: null } : {}),
  };

  const { error } = await admin.from("admin_tasks").update(updatePayload).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/tasks");
}

export async function deleteTask(id: string): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin.from("admin_tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tasks");
}

export async function toggleTaskCompleted(id: string, completed: boolean): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("admin_tasks")
    .update({
      completed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/tasks");
}
