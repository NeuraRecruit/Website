-- Add availability status to active candidates
ALTER TABLE active_candidates
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'unavailable'));
