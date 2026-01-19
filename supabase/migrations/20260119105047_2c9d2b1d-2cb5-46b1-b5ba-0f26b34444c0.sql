-- Allow public/authenticated users to read subscription data
-- This is needed for the distributor listing and order pages to verify active subscriptions
-- The subscriptions table contains no sensitive PII (only plan, status, dates)

CREATE POLICY "Public can view subscription status"
  ON subscriptions
  FOR SELECT
  TO anon, authenticated
  USING (true);