-- Extend status to three states: available, in_work, unavailable
ALTER TABLE active_candidates
  DROP CONSTRAINT IF EXISTS active_candidates_status_check;

ALTER TABLE active_candidates
  ADD CONSTRAINT active_candidates_status_check
    CHECK (status IN ('available', 'in_work', 'unavailable'));
