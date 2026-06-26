-- Split day rate into current and desired (from/to range)
ALTER TABLE active_candidates
  ADD COLUMN IF NOT EXISTS current_day_rate TEXT,
  ADD COLUMN IF NOT EXISTS desired_day_rate TEXT;

-- Migrate existing day_rate values into current_day_rate
UPDATE active_candidates
SET current_day_rate = day_rate
WHERE day_rate IS NOT NULL AND day_rate <> '' AND (current_day_rate IS NULL OR current_day_rate = '');
