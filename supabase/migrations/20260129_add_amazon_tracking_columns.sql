-- Migration: Add Amazon price/availability tracking columns and tables
-- Required by: scrape-amazon-prices, check-product-availability edge functions

-- Step 1: Add missing columns to affiliate_products
ALTER TABLE affiliate_products ADD COLUMN IF NOT EXISTS current_price decimal(10,2);
ALTER TABLE affiliate_products ADD COLUMN IF NOT EXISTS price_currency text;
ALTER TABLE affiliate_products ADD COLUMN IF NOT EXISTS last_price_check timestamptz;
ALTER TABLE affiliate_products ADD COLUMN IF NOT EXISTS last_availability_check timestamptz;
ALTER TABLE affiliate_products ADD COLUMN IF NOT EXISTS availability_status text DEFAULT 'unknown';
ALTER TABLE affiliate_products ADD COLUMN IF NOT EXISTS api_error_count integer DEFAULT 0;
ALTER TABLE affiliate_products ADD COLUMN IF NOT EXISTS api_last_error text;
ALTER TABLE affiliate_products ADD COLUMN IF NOT EXISTS asin text;

-- Step 2: Create product_price_history table
CREATE TABLE IF NOT EXISTS product_price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES affiliate_products(id) ON DELETE CASCADE,
  old_price decimal(10,2),
  new_price decimal(10,2),
  currency text,
  price_change_percent numeric(10,2),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_history_product ON product_price_history(product_id, created_at DESC);

-- Step 3: Create product_availability_log table
CREATE TABLE IF NOT EXISTS product_availability_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES affiliate_products(id) ON DELETE CASCADE,
  old_status text,
  new_status text,
  checked_at timestamptz DEFAULT now(),
  response_time_ms integer,
  api_response jsonb,
  error_message text
);

CREATE INDEX IF NOT EXISTS idx_availability_log_product ON product_availability_log(product_id, checked_at DESC);

-- Step 4: Enable RLS on new tables
ALTER TABLE product_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_availability_log ENABLE ROW LEVEL SECURITY;

-- Step 5: RLS policies for product_price_history
CREATE POLICY "Allow public read access to price history"
  ON product_price_history FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow service role to insert price history"
  ON product_price_history FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow service role to delete price history"
  ON product_price_history FOR DELETE
  TO service_role
  USING (true);

-- Step 6: RLS policies for product_availability_log
CREATE POLICY "Allow public read access to availability log"
  ON product_availability_log FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow service role to insert availability log"
  ON product_availability_log FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow service role to delete availability log"
  ON product_availability_log FOR DELETE
  TO service_role
  USING (true);

-- Step 7: Grant permissions
GRANT SELECT ON product_price_history TO anon, authenticated;
GRANT SELECT ON product_availability_log TO anon, authenticated;
GRANT ALL ON product_price_history TO service_role;
GRANT ALL ON product_availability_log TO service_role;

-- Step 8: Add index on asin for faster lookups
CREATE INDEX IF NOT EXISTS idx_affiliate_products_asin ON affiliate_products(asin) WHERE asin IS NOT NULL;

-- Step 9: Add index on availability_status for filtering
CREATE INDEX IF NOT EXISTS idx_affiliate_products_availability ON affiliate_products(availability_status) WHERE availability_status IS NOT NULL;
