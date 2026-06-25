-- Track what the candidate is currently earning
ALTER TABLE active_candidates
  ADD COLUMN IF NOT EXISTS current_salary TEXT;
