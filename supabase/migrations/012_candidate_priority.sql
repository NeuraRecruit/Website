-- Add priority level to active candidates
ALTER TABLE active_candidates
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('high', 'medium', 'low'));
