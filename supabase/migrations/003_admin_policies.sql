-- Allow service role to read all submissions (used by admin panel)
CREATE POLICY "Service role can read candidate_applications"
  ON candidate_applications FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can read employer_enquiries"
  ON employer_enquiries FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can read contact_messages"
  ON contact_messages FOR SELECT
  TO service_role
  USING (true);
