import Link from "next/link";
import { adminLogout } from "@/app/admin/login/actions";
import { processDueReminders } from "@/lib/task-reminders";
import { getCandidateOptions, getTasks } from "./actions";
import { TasksTab } from "./TasksTab";

export const metadata = { title: "Tasks — Admin — Neura Recruitment" };
export const dynamic = "force-dynamic";

export default async function AdminTasksPage() {
  // Process any due reminders when the page is opened (backup if cron hasn't run yet)
  let reminderErrors: string[] = [];
  try {
    const result = await processDueReminders();
    reminderErrors = result.errors;
  } catch {
    // Table may not exist yet before migration — page still loads
  }

  const [tasks, candidates] = await Promise.all([getTasks(), getCandidateOptions()]);

  return (
    <div className="min-h-screen bg-bg-secondary">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {reminderErrors.length > 0 && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Some reminders could not be sent: {reminderErrors.join("; ")}
          </div>
        )}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Neura Recruitment
            </p>
            <h1 className="mt-0.5 text-lg font-semibold text-text-light">Tasks</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-light"
            >
              Back to Admin
            </Link>
            <form action={adminLogout}>
              <button
                type="submit"
                className="rounded-lg border border-border bg-white px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-light"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <TasksTab initialTasks={tasks} candidates={candidates} />
      </main>
    </div>
  );
}
