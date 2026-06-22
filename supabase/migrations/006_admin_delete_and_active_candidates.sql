-- Allow service role to delete submissions (used by admin panel)
GRANT DELETE ON public.candidate_applications TO service_role;
GRANT DELETE ON public.employer_enquiries TO service_role;
GRANT DELETE ON public.contact_messages TO service_role;

-- Allow service role to delete CVs from storage when an application is deleted
CREATE POLICY "Service role can delete CVs"
  ON storage.objects FOR DELETE
  TO service_role
  USING (bucket_id = 'cvs');

-- Manually maintained talent pool for the admin team
CREATE TABLE IF NOT EXISTS active_candidates (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        TEXT,
  email            TEXT,
  phone            TEXT,
  linkedin_url     TEXT,
  job_title        TEXT,
  desired_role     TEXT,
  location         TEXT,
  salary_expectation TEXT,
  day_rate         TEXT,
  previous_roles   TEXT,
  qualifications   TEXT,
  notice_period    TEXT,
  availability     TEXT,
  cv_storage_path  TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at       TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE active_candidates ENABLE ROW LEVEL SECURITY;

-- Admin-only access via service role (no public policies)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.active_candidates TO service_role;
