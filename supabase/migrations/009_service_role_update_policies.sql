-- Allow service role to update submission rows (for processed toggle and admin actions)
CREATE POLICY "Service role can update candidate_applications"
  ON candidate_applications FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can update employer_enquiries"
  ON employer_enquiries FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can update contact_messages"
  ON contact_messages FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
