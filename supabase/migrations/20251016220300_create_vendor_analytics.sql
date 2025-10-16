CREATE TABLE vendor_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL CHECK (action_type IN ('website_click', 'email_click', 'phone_click', 'profile_view')),
  user_email text,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendor_analytics_vendor_id ON vendor_analytics(vendor_id);
CREATE INDEX idx_vendor_analytics_user_id ON vendor_analytics(user_id);
CREATE INDEX idx_vendor_analytics_action_type ON vendor_analytics(action_type);
CREATE INDEX idx_vendor_analytics_created_at ON vendor_analytics(created_at DESC);

ALTER TABLE vendor_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics" ON vendor_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all analytics" ON vendor_analytics
  FOR SELECT USING (check_admin_access());
