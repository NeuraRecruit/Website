-- Track candidate seniority level (optional)
ALTER TABLE active_candidates
  ADD COLUMN IF NOT EXISTS seniority TEXT
    CHECK (seniority IN ('junior', 'senior') OR seniority IS NULL);
