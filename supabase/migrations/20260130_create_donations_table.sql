BEGIN;

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AUD',
  donor_name TEXT,
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own donations"
  ON donations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert donations"
  ON donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view non-anonymous donations"
  ON donations FOR SELECT
  USING (is_anonymous = false);

CREATE OR REPLACE FUNCTION get_donation_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_this_month', COALESCE(SUM(amount) FILTER (WHERE created_at >= date_trunc('month', NOW())), 0),
    'count_this_month', COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW())),
    'total_all_time', COALESCE(SUM(amount), 0),
    'count_all_time', COUNT(*)
  ) INTO result
  FROM donations;

  RETURN result;
END;
$$;

COMMIT;
