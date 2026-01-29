-- Pricing Discrepancy Investigation Queries
-- Run these in Supabase SQL Editor to identify the root cause

-- Query 1: Find products with price discrepancies
-- This identifies where stored price != current Amazon price
SELECT
  id,
  title,
  price as stored_price,
  current_price as scraped_price,
  currency as original_currency,
  price_currency as scraped_currency,
  last_price_check,
  api_error_count,
  api_last_error,
  availability_status,
  affiliate_url
FROM affiliate_products
WHERE is_active = true
  AND price IS NOT NULL
  AND current_price IS NOT NULL
  AND price != current_price
ORDER BY ABS(price - current_price) DESC;

-- Query 2: Find products with stale price data
-- This identifies products that haven't been checked recently
SELECT
  id,
  title,
  price,
  current_price,
  last_price_check,
  CASE
    WHEN last_price_check IS NULL THEN 'Never checked'
    WHEN last_price_check < NOW() - INTERVAL '7 days' THEN 'Stale (>7 days)'
    WHEN last_price_check < NOW() - INTERVAL '1 day' THEN 'Old (>1 day)'
    ELSE 'Recent'
  END as freshness_status,
  api_error_count,
  affiliate_url
FROM affiliate_products
WHERE is_active = true
ORDER BY last_price_check ASC NULLS FIRST;

-- Query 3: Find products with API errors
-- This identifies products where scraping is failing
SELECT
  id,
  title,
  price,
  current_price,
  api_error_count,
  api_last_error,
  last_price_check,
  affiliate_url
FROM affiliate_products
WHERE is_active = true
  AND api_error_count > 0
ORDER BY api_error_count DESC;

-- Query 4a: Check product_price_history table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'product_price_history'
ORDER BY ordinal_position;

-- Query 4b: Recent price changes (if table exists)
-- Shows all price changes in the last 30 days
SELECT
  ap.title,
  ph.old_price,
  ph.new_price,
  ph.currency,
  ph.price_change_percent,
  ap.affiliate_url
FROM product_price_history ph
JOIN affiliate_products ap ON ph.product_id = ap.id
ORDER BY ph.id DESC
LIMIT 50;

-- Query 5: Products without current price data
-- Shows products that may not be getting scraped
SELECT
  id,
  title,
  price,
  current_price,
  last_price_check,
  asin,
  affiliate_url
FROM affiliate_products
WHERE is_active = true
  AND current_price IS NULL
ORDER BY created_at DESC;

-- Query 6: Currency consistency check
-- Identifies currency mismatches
SELECT
  id,
  title,
  price,
  currency as original_currency,
  current_price,
  price_currency as scraped_currency,
  last_price_check
FROM affiliate_products
WHERE is_active = true
  AND currency != price_currency
  AND price_currency IS NOT NULL;

-- Query 7: Summary statistics
SELECT
  COUNT(*) as total_products,
  COUNT(current_price) as products_with_current_price,
  COUNT(last_price_check) as products_ever_checked,
  AVG(CASE WHEN last_price_check IS NOT NULL
    THEN EXTRACT(EPOCH FROM NOW() - last_price_check)/3600
    ELSE NULL END) as avg_hours_since_check,
  COUNT(CASE WHEN api_error_count > 0 THEN 1 END) as products_with_errors,
  COUNT(CASE WHEN price != current_price AND current_price IS NOT NULL THEN 1 END) as products_with_discrepancies
FROM affiliate_products
WHERE is_active = true;