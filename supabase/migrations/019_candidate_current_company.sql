ALTER TABLE active_candidates
  ADD COLUMN IF NOT EXISTS current_company TEXT;
