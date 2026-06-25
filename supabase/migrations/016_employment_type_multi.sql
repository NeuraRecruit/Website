-- Allow candidates to be open to both permanent and contract roles
-- Store as comma-separated e.g. "permanent", "contractor", or "permanent,contractor"
ALTER TABLE active_candidates
  DROP CONSTRAINT IF EXISTS active_candidates_employment_type_check;
