-- Add processed flag to all submission tables
ALTER TABLE candidate_applications ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE employer_enquiries ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT false NOT NULL;

-- Allow service role to update (for admin panel processed toggle)
GRANT UPDATE ON public.candidate_applications TO service_role;
GRANT UPDATE ON public.employer_enquiries TO service_role;
GRANT UPDATE ON public.contact_messages TO service_role;
