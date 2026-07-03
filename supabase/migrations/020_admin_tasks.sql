-- Admin task list with optional candidate link and reminder emails
CREATE TABLE IF NOT EXISTS admin_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('high', 'medium', 'low')),
  due_at TIMESTAMPTZ,
  notify_to TEXT
    CHECK (notify_to IN (
      'james@neurarecruitment.com',
      'deividas@neurarecruitment.com',
      'hello@neurarecruitment.com'
    )),
  assignee TEXT
    CHECK (assignee IN ('james', 'deividas')),
  candidate_id UUID REFERENCES active_candidates(id) ON DELETE SET NULL,
  repeat_reminder BOOLEAN NOT NULL DEFAULT false,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_tasks_cron_idx
  ON admin_tasks (completed, due_at, last_reminder_sent_at)
  WHERE completed = false AND notify_to IS NOT NULL;

ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_tasks TO service_role;
