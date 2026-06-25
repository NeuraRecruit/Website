-- Track whether an active candidate is seeking permanent or contract work
ALTER TABLE active_candidates
  ADD COLUMN IF NOT EXISTS employment_type TEXT NOT NULL DEFAULT 'permanent'
    CHECK (employment_type IN ('permanent', 'contractor'));
