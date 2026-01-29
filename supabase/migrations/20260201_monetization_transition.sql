-- Monetization Transition Plan - Phase 1
-- Extends existing verification and affiliate systems
-- Adds commercial vendors, supporters, and revenue tracking

BEGIN;

-- 1. EXTEND VERIFICATION SYSTEM FOR VIN/OWNERSHIP VALIDATION

-- Add new verification columns for VIN and auto-processing
ALTER TABLE verifications
  ADD COLUMN IF NOT EXISTS verification_type text DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS vin_number varchar(17),
  ADD COLUMN IF NOT EXISTS vehicle_year integer,
  ADD COLUMN IF NOT EXISTS vehicle_model text,
  ADD COLUMN IF NOT EXISTS auto_approved boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS confidence_score decimal(5,2),
  ADD COLUMN IF NOT EXISTS document_type text CHECK (document_type IN ('registration', 'title', 'insurance', 'photo')),
  ADD COLUMN IF NOT EXISTS ocr_processed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS ocr_data jsonb;

-- Add check constraint for verification types
ALTER TABLE verifications
  ADD CONSTRAINT check_verification_type
  CHECK (verification_type IN ('manual', 'vin_automatic', 'document_ocr'));

-- New indexes for VIN and verification type
CREATE INDEX IF NOT EXISTS idx_verifications_vin ON verifications(vin_number) WHERE vin_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_verifications_type ON verifications(verification_type);
CREATE INDEX IF NOT EXISTS idx_verifications_confidence ON verifications(confidence_score) WHERE confidence_score IS NOT NULL;

-- 2. COMMERCIAL VENDOR SYSTEM

-- Commercial vendor tiers
CREATE TYPE vendor_tier AS ENUM ('basic', 'featured', 'premium');

-- Commercial vendors table
CREATE TABLE IF NOT EXISTS commercial_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  contact_email text NOT NULL,
  phone text,
  website text,
  business_address text,
  business_description text,
  tier vendor_tier NOT NULL DEFAULT 'basic',
  monthly_fee decimal(8,2) NOT NULL DEFAULT 50.00,
  stripe_subscription_id text,
  stripe_customer_id text,
  is_active boolean DEFAULT true,
  is_approved boolean DEFAULT false,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users(id),
  billing_start_date timestamptz,
  next_billing_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Premium routes/tours offered by tour operators
CREATE TABLE IF NOT EXISTS premium_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES commercial_vendors(id) ON DELETE CASCADE,
  route_name text NOT NULL,
  description text,
  short_description text,
  gpx_file_url text,
  route_images text[],
  difficulty_level text CHECK (difficulty_level IN ('easy', 'moderate', 'difficult', 'extreme')),
  estimated_duration_days integer,
  max_participants integer,
  price_per_person decimal(10,2),
  currency text DEFAULT 'AUD',
  is_exclusive boolean DEFAULT true,
  is_active boolean DEFAULT true,
  booking_url text,
  contact_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. COMMUNITY SUPPORTER SYSTEM

-- Supporter tiers
CREATE TYPE supporter_tier AS ENUM ('supporter', 'patron', 'founder');

-- Community supporters table
CREATE TABLE IF NOT EXISTS community_supporters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tier supporter_tier NOT NULL,
  monthly_amount decimal(8,2) NOT NULL,
  currency text DEFAULT 'AUD',
  stripe_subscription_id text,
  stripe_customer_id text,
  is_active boolean DEFAULT true,
  is_annual boolean DEFAULT false,
  supporter_message text,
  public_name text,
  show_publicly boolean DEFAULT true,
  started_at timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 4. LEGACY SUBSCRIPTION TRANSITION

-- Add legacy subscriber tracking to user_subscriptions
ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS legacy_subscriber boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS founder_status boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS grandfathered_benefits jsonb,
  ADD COLUMN IF NOT EXISTS transition_date timestamptz,
  ADD COLUMN IF NOT EXISTS legacy_notes text;

-- Mark existing subscribers as legacy
UPDATE user_subscriptions
SET
  legacy_subscriber = true,
  founder_status = (subscription_type = 'lifetime'),
  grandfathered_benefits = CASE
    WHEN subscription_type = 'lifetime' THEN '{"priority_support": true, "founder_badge": true, "early_access": true}'::jsonb
    ELSE '{"priority_support": true, "transition_period": true}'::jsonb
  END,
  transition_date = now()
WHERE subscription_status = 'active' OR is_free_access = true;

-- 5. REVENUE TRACKING AND ANALYTICS

-- Revenue streams for comprehensive tracking
CREATE TYPE revenue_stream_type AS ENUM (
  'affiliate_commission',
  'commercial_vendor_subscription',
  'supporter_contribution',
  'legacy_subscription',
  'premium_route_booking',
  'featured_listing_fee'
);

-- Revenue tracking table
CREATE TABLE IF NOT EXISTS revenue_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_type revenue_stream_type NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'AUD',
  transaction_date timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  vendor_id uuid REFERENCES commercial_vendors(id),
  product_id uuid REFERENCES affiliate_products(id),
  stripe_payment_intent_id text,
  metadata jsonb,
  notes text,
  recorded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- 6. PERFORMANCE INDEXES

-- Commercial vendors indexes
CREATE INDEX IF NOT EXISTS idx_commercial_vendors_user ON commercial_vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_commercial_vendors_tier ON commercial_vendors(tier);
CREATE INDEX IF NOT EXISTS idx_commercial_vendors_active ON commercial_vendors(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_commercial_vendors_approved ON commercial_vendors(is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_commercial_vendors_billing ON commercial_vendors(next_billing_date) WHERE is_active = true;

-- Premium routes indexes
CREATE INDEX IF NOT EXISTS idx_premium_routes_vendor ON premium_routes(vendor_id);
CREATE INDEX IF NOT EXISTS idx_premium_routes_difficulty ON premium_routes(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_premium_routes_active ON premium_routes(is_active) WHERE is_active = true;

-- Supporters indexes
CREATE INDEX IF NOT EXISTS idx_supporters_user ON community_supporters(user_id);
CREATE INDEX IF NOT EXISTS idx_supporters_tier ON community_supporters(tier);
CREATE INDEX IF NOT EXISTS idx_supporters_active ON community_supporters(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_supporters_public ON community_supporters(show_publicly) WHERE show_publicly = true;

-- Revenue tracking indexes
CREATE INDEX IF NOT EXISTS idx_revenue_stream_type ON revenue_streams(stream_type);
CREATE INDEX IF NOT EXISTS idx_revenue_date ON revenue_streams(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_user ON revenue_streams(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_revenue_vendor ON revenue_streams(vendor_id) WHERE vendor_id IS NOT NULL;

-- 7. ROW LEVEL SECURITY POLICIES

-- Commercial vendors RLS
ALTER TABLE commercial_vendors ENABLE ROW LEVEL SECURITY;

-- Vendors can view/edit their own data
CREATE POLICY "Vendors can manage own data"
  ON commercial_vendors
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public can view approved active vendors
CREATE POLICY "Public can view approved vendors"
  ON commercial_vendors
  FOR SELECT
  USING (is_approved = true AND is_active = true);

-- Admins can manage all vendors
CREATE POLICY "Admins can manage all vendors"
  ON commercial_vendors
  FOR ALL
  TO authenticated
  USING (check_admin_access())
  WITH CHECK (check_admin_access());

-- Premium routes RLS
ALTER TABLE premium_routes ENABLE ROW LEVEL SECURITY;

-- Public can view active routes from approved vendors
CREATE POLICY "Public can view active routes"
  ON premium_routes
  FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM commercial_vendors cv
      WHERE cv.id = vendor_id
      AND cv.is_approved = true
      AND cv.is_active = true
    )
  );

-- Vendors can manage their own routes
CREATE POLICY "Vendors can manage own routes"
  ON premium_routes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM commercial_vendors cv
      WHERE cv.id = vendor_id
      AND cv.user_id = auth.uid()
    )
  );

-- Admins can manage all routes
CREATE POLICY "Admins can manage all routes"
  ON premium_routes
  FOR ALL
  TO authenticated
  USING (check_admin_access())
  WITH CHECK (check_admin_access());

-- Community supporters RLS
ALTER TABLE community_supporters ENABLE ROW LEVEL SECURITY;

-- Users can view/edit their own supporter data
CREATE POLICY "Users can manage own supporter data"
  ON community_supporters
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public can view public supporters (for recognition page)
CREATE POLICY "Public can view public supporters"
  ON community_supporters
  FOR SELECT
  USING (show_publicly = true AND is_active = true);

-- Admins can view all supporters
CREATE POLICY "Admins can view all supporters"
  ON community_supporters
  FOR SELECT
  TO authenticated
  USING (check_admin_access());

-- Revenue streams RLS
ALTER TABLE revenue_streams ENABLE ROW LEVEL SECURITY;

-- Only admins can view revenue data
CREATE POLICY "Admins can view all revenue"
  ON revenue_streams
  FOR SELECT
  TO authenticated
  USING (check_admin_access());

-- Only admins can insert revenue records
CREATE POLICY "Admins can insert revenue"
  ON revenue_streams
  FOR INSERT
  TO authenticated
  WITH CHECK (check_admin_access());

-- 8. HELPER FUNCTIONS

-- Function to calculate monthly recurring revenue
CREATE OR REPLACE FUNCTION calculate_mrr()
RETURNS decimal(10,2)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    COALESCE(
      (SELECT SUM(monthly_fee) FROM commercial_vendors WHERE is_active = true AND is_approved = true), 0
    ) +
    COALESCE(
      (SELECT SUM(monthly_amount) FROM community_supporters WHERE is_active = true), 0
    );
$$;

-- Function to get monetization stats
CREATE OR REPLACE FUNCTION get_monetization_stats()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT jsonb_build_object(
    'verification_stats', jsonb_build_object(
      'verified_users', (SELECT COUNT(*) FROM user_subscriptions WHERE is_verified = true),
      'pending_verifications', (SELECT COUNT(*) FROM verifications WHERE status = 'pending'),
      'auto_approved', (SELECT COUNT(*) FROM verifications WHERE auto_approved = true)
    ),
    'vendor_stats', jsonb_build_object(
      'active_vendors', (SELECT COUNT(*) FROM commercial_vendors WHERE is_active = true AND is_approved = true),
      'pending_approval', (SELECT COUNT(*) FROM commercial_vendors WHERE is_approved = false),
      'monthly_vendor_revenue', (SELECT COALESCE(SUM(monthly_fee), 0) FROM commercial_vendors WHERE is_active = true AND is_approved = true),
      'premium_routes', (SELECT COUNT(*) FROM premium_routes WHERE is_active = true)
    ),
    'supporter_stats', jsonb_build_object(
      'active_supporters', (SELECT COUNT(*) FROM community_supporters WHERE is_active = true),
      'monthly_support_revenue', (SELECT COALESCE(SUM(monthly_amount), 0) FROM community_supporters WHERE is_active = true),
      'public_supporters', (SELECT COUNT(*) FROM community_supporters WHERE show_publicly = true AND is_active = true)
    ),
    'revenue_stats', jsonb_build_object(
      'total_mrr', calculate_mrr(),
      'this_month_revenue', (
        SELECT COALESCE(SUM(amount), 0)
        FROM revenue_streams
        WHERE transaction_date >= date_trunc('month', CURRENT_DATE)
      ),
      'last_30_days', (
        SELECT COALESCE(SUM(amount), 0)
        FROM revenue_streams
        WHERE transaction_date >= CURRENT_DATE - INTERVAL '30 days'
      )
    ),
    'affiliate_stats', jsonb_build_object(
      'total_products', (SELECT COUNT(*) FROM affiliate_products WHERE is_active = true),
      'total_clicks', (SELECT COUNT(*) FROM affiliate_product_clicks WHERE clicked_at >= CURRENT_DATE - INTERVAL '30 days'),
      'featured_products', (SELECT COUNT(*) FROM affiliate_products WHERE is_featured = true AND is_active = true)
    )
  );
$$;

-- Function to process VIN verification
CREATE OR REPLACE FUNCTION process_vin_verification(
  verification_id uuid,
  extracted_vin text,
  confidence decimal(5,2),
  ocr_data jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  auto_approve boolean := false;
BEGIN
  -- Auto-approve if confidence is high and VIN is valid format
  IF confidence >= 90.0 AND length(extracted_vin) = 17 THEN
    auto_approve := true;
  END IF;

  -- Update verification record
  UPDATE verifications
  SET
    vin_number = extracted_vin,
    confidence_score = confidence,
    ocr_data = ocr_data,
    ocr_processed = true,
    auto_approved = auto_approve,
    status = CASE WHEN auto_approve THEN 'approved' ELSE 'pending' END,
    approved_at = CASE WHEN auto_approve THEN now() ELSE NULL END,
    updated_at = now()
  WHERE id = verification_id;

  RETURN auto_approve;
END;
$$;

-- Update timestamps function for new tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers for new tables
CREATE TRIGGER commercial_vendors_updated_at
  BEFORE UPDATE ON commercial_vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER premium_routes_updated_at
  BEFORE UPDATE ON premium_routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. GRANT PERMISSIONS

-- Grant permissions for new tables
GRANT SELECT ON commercial_vendors TO anon;
GRANT ALL ON commercial_vendors TO authenticated;
GRANT ALL ON commercial_vendors TO service_role;

GRANT SELECT ON premium_routes TO anon;
GRANT ALL ON premium_routes TO authenticated;
GRANT ALL ON premium_routes TO service_role;

GRANT ALL ON community_supporters TO authenticated;
GRANT ALL ON community_supporters TO service_role;

GRANT ALL ON revenue_streams TO authenticated;
GRANT ALL ON revenue_streams TO service_role;

COMMIT;