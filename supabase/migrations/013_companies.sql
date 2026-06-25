-- Client companies tracked by the admin team
CREATE TABLE IF NOT EXISTS companies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name  TEXT NOT NULL,
  industry      TEXT,
  contact_name  TEXT,
  contact_title TEXT,
  email         TEXT,
  phone         TEXT,
  website       TEXT,
  location      TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Admin-only access via service role (no public policies)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO service_role;
