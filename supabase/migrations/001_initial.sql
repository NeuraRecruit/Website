-- Candidate applications table
CREATE TABLE IF NOT EXISTS candidate_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  cv_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Employer enquiries table
CREATE TABLE IF NOT EXISTS employer_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE candidate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for public forms
CREATE POLICY "Allow anonymous insert on candidate_applications"
  ON candidate_applications FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on employer_enquiries"
  ON employer_enquiries FOR INSERT
  TO anon
  WITH CHECK (true);

-- Storage bucket for CVs
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', false)
ON CONFLICT (id) DO NOTHING;

-- Allow service role to manage CV uploads (handled via server action)
CREATE POLICY "Service role can upload CVs"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "Service role can read CVs"
  ON storage.objects FOR SELECT
  TO service_role
  USING (bucket_id = 'cvs');
