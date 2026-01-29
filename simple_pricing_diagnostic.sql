-- Simple Pricing Discrepancy Diagnostic
-- Core queries to identify the pricing issue quickly

-- Query 1: Check what pricing fields exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'affiliate_products'
  AND column_name LIKE '%price%'
ORDER BY column_name;

-- Query 2: Sample of products with all price fields
SELECT
  title,
  price,
  current_price,
  currency,
  price_currency,
  last_price_check,
  api_error_count,
  affiliate_url
FROM affiliate_products
WHERE is_active = true
ORDER BY created_at DESC
LIMIT 10;

-- Query 3: Count products by price data availability
SELECT
  COUNT(*) as total_products,
  COUNT(price) as has_price,
  COUNT(current_price) as has_current_price,
  COUNT(CASE WHEN price IS NOT NULL AND current_price IS NOT NULL
             AND ABS(price - current_price) > 0.01 THEN 1 END) as price_discrepancies,
  COUNT(last_price_check) as ever_checked,
  COUNT(CASE WHEN api_error_count > 0 THEN 1 END) as has_errors
FROM affiliate_products
WHERE is_active = true;

-- Query 4: Products with biggest price differences
SELECT
  title,
  price as stored_price,
  current_price as scraped_price,
  ABS(price - current_price) as difference,
  last_price_check,
  api_error_count,
  LEFT(affiliate_url, 50) as url_start
FROM affiliate_products
WHERE is_active = true
  AND price IS NOT NULL
  AND current_price IS NOT NULL
  AND ABS(price - current_price) > 0.01
ORDER BY ABS(price - current_price) DESC
LIMIT 10;

-- Query 5: Products never checked or very stale
SELECT
  title,
  price,
  current_price,
  last_price_check,
  CASE
    WHEN last_price_check IS NULL THEN 'Never'
    WHEN last_price_check < NOW() - INTERVAL '7 days' THEN 'Very stale'
    WHEN last_price_check < NOW() - INTERVAL '1 day' THEN 'Stale'
    ELSE 'Recent'
  END as freshness,
  api_error_count
FROM affiliate_products
WHERE is_active = true
  AND (last_price_check IS NULL OR last_price_check < NOW() - INTERVAL '1 day')
ORDER BY last_price_check ASC NULLS FIRST
LIMIT 15;