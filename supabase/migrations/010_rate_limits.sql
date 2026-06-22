-- Durable rate limiting for public form submissions (replaces in-memory limiter)
CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT PRIMARY KEY,
  count        INT NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Service-role only (accessed from server actions); no public policies
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rate_limits TO service_role;
