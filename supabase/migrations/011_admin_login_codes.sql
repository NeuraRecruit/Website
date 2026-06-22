-- One-time email login codes for the admin two-step login
CREATE TABLE IF NOT EXISTS admin_login_codes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash  TEXT NOT NULL,
  attempts   INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_login_codes ENABLE ROW LEVEL SECURITY;

-- Admin-only access via service role (no public policies)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_login_codes TO service_role;
