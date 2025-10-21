-- Affiliate Shop System
-- Curated products with external affiliate links for revenue generation

-- Product categories enum
CREATE TYPE product_category AS ENUM (
  'recovery_gear',
  'camping_expedition',
  'tools_maintenance',
  'parts_upgrades',
  'books_manuals',
  'apparel_merchandise',
  'electronics',
  'outdoor_gear'
);

-- Affiliate providers enum
CREATE TYPE affiliate_provider AS ENUM (
  'amazon',
  'ebay',
  'custom'
);

-- Main affiliate products table
CREATE TABLE IF NOT EXISTS affiliate_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  short_description text,
  category product_category NOT NULL,
  price decimal(10,2),
  currency text DEFAULT 'USD',
  image_url text,
  additional_images text[],
  affiliate_provider affiliate_provider NOT NULL,
  affiliate_url text NOT NULL,
  commission_rate decimal(5,2),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  click_count integer DEFAULT 0,
  tags text[],
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Click tracking table
CREATE TABLE IF NOT EXISTS affiliate_product_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES affiliate_products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  clicked_at timestamptz DEFAULT now(),
  user_agent text,
  ip_address inet,
  referrer text
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_products_category ON affiliate_products(category);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_featured ON affiliate_products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_affiliate_products_active ON affiliate_products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_affiliate_products_sort ON affiliate_products(sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product ON affiliate_product_clicks(product_id, clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user ON affiliate_product_clicks(user_id, clicked_at DESC);

-- RLS Policies
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_product_clicks ENABLE ROW LEVEL SECURITY;

-- Public can view active products
CREATE POLICY "Anyone can view active products"
  ON affiliate_products
  FOR SELECT
  USING (is_active = true);

-- Admins can manage all products
CREATE POLICY "Admins can view all products"
  ON affiliate_products
  FOR SELECT
  TO authenticated
  USING (check_admin_access());

CREATE POLICY "Admins can create products"
  ON affiliate_products
  FOR INSERT
  TO authenticated
  WITH CHECK (check_admin_access());

CREATE POLICY "Admins can update products"
  ON affiliate_products
  FOR UPDATE
  TO authenticated
  USING (check_admin_access())
  WITH CHECK (check_admin_access());

CREATE POLICY "Admins can delete products"
  ON affiliate_products
  FOR DELETE
  TO authenticated
  USING (check_admin_access());

-- Click tracking policies
CREATE POLICY "Anyone can insert clicks"
  ON affiliate_product_clicks
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all clicks"
  ON affiliate_product_clicks
  FOR SELECT
  TO authenticated
  USING (check_admin_access());

-- Updated trigger
CREATE OR REPLACE FUNCTION update_affiliate_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER affiliate_products_updated_at
  BEFORE UPDATE ON affiliate_products
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliate_products_updated_at();

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_product_clicks(product_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE affiliate_products
  SET click_count = click_count + 1
  WHERE id = product_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON affiliate_products TO anon;
GRANT ALL ON affiliate_products TO authenticated;
GRANT ALL ON affiliate_products TO service_role;
GRANT INSERT ON affiliate_product_clicks TO anon;
GRANT ALL ON affiliate_product_clicks TO authenticated;
GRANT ALL ON affiliate_product_clicks TO service_role;
