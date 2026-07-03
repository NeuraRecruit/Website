import { createSupabaseAdmin } from "@/lib/supabase/server";
import { sendTaskReminderNotification } from "@/lib/email";

type TaskReminderRow = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  due_at: string;
  notify_to: string;
  assignee: string | null;
  repeat_reminder: boolean;
  last_reminder_sent_at: string | null;
  active_candidates: { full_name: string | null; job_title: string | null } | null;
};

function candidateName(row: TaskReminderRow): string | null {
  if (!row.active_candidates) return null;
  const name = row.active_candidates.full_name || "Unnamed";
  return row.active_candidates.job_title ? `${name} · ${row.active_candidates.job_title}` : name;
}

export type ProcessRemindersResult = {
  processed: number;
  firstDue: number;
  repeatDue: number;
  errors: string[];
};

export async function processDueReminders(): Promise<ProcessRemindersResult> {
  const admin = createSupabaseAdmin();
  const now = new Date();
  const nowIso = now.toISOString();
  const repeatCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const { data: firstDue, error: firstError } = await admin
    .from("admin_tasks")
    .select("*, active_candidates(full_name, job_title)")
    .eq("completed", false)
    .not("notify_to", "is", null)
    .not("due_at", "is", null)
    .lte("due_at", nowIso)
    .is("last_reminder_sent_at", null);

  if (firstError) throw new Error(firstError.message);

  const { data: repeatDue, error: repeatError } = await admin
    .from("admin_tasks")
    .select("*, active_candidates(full_name, job_title)")
    .eq("completed", false)
    .eq("repeat_reminder", true)
    .not("notify_to", "is", null)
    .not("last_reminder_sent_at", "is", null)
    .lte("last_reminder_sent_at", repeatCutoff);

  if (repeatError) throw new Error(repeatError.message);

  const firstRows = (firstDue ?? []) as TaskReminderRow[];
  const repeatRows = (repeatDue ?? []) as TaskReminderRow[];
  const repeatIds = new Set(repeatRows.map((r) => r.id));
  const toProcess = [...firstRows.filter((r) => !repeatIds.has(r.id)), ...repeatRows];

  let processed = 0;
  const errors: string[] = [];

  for (const task of toProcess) {
    const isRepeat = task.last_reminder_sent_at !== null;
    const isOverdue = new Date(task.due_at) < now;

    try {
      await sendTaskReminderNotification({
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_at: task.due_at,
        assignee: task.assignee,
        candidate_name: candidateName(task),
        notify_to: task.notify_to,
        isRepeat,
        isOverdue,
      });

      const { error: updateError } = await admin
        .from("admin_tasks")
        .update({ last_reminder_sent_at: nowIso })
        .eq("id", task.id);

      if (updateError) {
        errors.push(`${task.id}: ${updateError.message}`);
      } else {
        processed += 1;
      }
    } catch (err) {
      errors.push(`${task.id}: ${err instanceof Error ? err.message : "send failed"}`);
    }
  }

  return {
    processed,
    firstDue: firstRows.length,
    repeatDue: repeatRows.length,
    errors,
  };
}
