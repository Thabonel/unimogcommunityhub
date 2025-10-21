-- RPS Illustration Review System
-- Admin tool for manually reviewing and correcting illustration names

CREATE TABLE IF NOT EXISTS rps_illustration_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  illustration_id uuid REFERENCES rps_illustrations(id) ON DELETE CASCADE,
  original_description text,
  proposed_description text,
  review_status text DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'corrected')),
  corrected_description text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_rps_illustration_reviews_illustration_id ON rps_illustration_reviews(illustration_id);
CREATE INDEX IF NOT EXISTS idx_rps_illustration_reviews_status ON rps_illustration_reviews(review_status);
CREATE INDEX IF NOT EXISTS idx_rps_illustration_reviews_reviewer ON rps_illustration_reviews(reviewed_by);

-- RLS Policies - Admin only
ALTER TABLE rps_illustration_reviews ENABLE ROW LEVEL SECURITY;

-- Admins can view all reviews
CREATE POLICY "Admins can view all reviews"
  ON rps_illustration_reviews
  FOR SELECT
  TO authenticated
  USING (check_admin_access(auth.uid()));

-- Admins can create reviews
CREATE POLICY "Admins can create reviews"
  ON rps_illustration_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (check_admin_access(auth.uid()));

-- Admins can update reviews
CREATE POLICY "Admins can update reviews"
  ON rps_illustration_reviews
  FOR UPDATE
  TO authenticated
  USING (check_admin_access(auth.uid()))
  WITH CHECK (check_admin_access(auth.uid()));

-- Updated trigger
CREATE OR REPLACE FUNCTION update_rps_illustration_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rps_illustration_reviews_updated_at
  BEFORE UPDATE ON rps_illustration_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_rps_illustration_reviews_updated_at();

-- Grant permissions
GRANT ALL ON rps_illustration_reviews TO authenticated;
GRANT ALL ON rps_illustration_reviews TO service_role;
