-- Debug Edge Function Call Results
-- The HTTP call succeeded (341580) but no products were updated

-- Query 1: Check current settings (should both be ✅ now)
SELECT
  'edge_function_url' as setting,
  current_setting('app.settings.edge_function_url', true) as value
UNION ALL
SELECT
  'service_role_key' as setting,
  LEFT(current_setting('app.settings.service_role_key', true), 10) || '...' as value;

-- Query 2: Products that should be prioritized for scraping
-- These should be selected first (never checked + Amazon products)
SELECT
  title,
  last_price_check,
  affiliate_provider,
  api_error_count,
  affiliate_url
FROM affiliate_products
WHERE is_active = true
  AND affiliate_provider = 'amazon'
  AND last_price_check IS NULL
ORDER BY created_at ASC
LIMIT 8;

-- Query 3: Check if any products were updated recently (expand timeframe)
SELECT
  title,
  current_price,
  last_price_check,
  api_last_error
FROM affiliate_products
WHERE last_price_check >= NOW() - INTERVAL '1 hour'
ORDER BY last_price_check DESC
LIMIT 10;

-- Query 4: Test edge function manually with direct query
-- This tests if we can call the scraper with proper auth
SELECT net.http_post(
  url := 'https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/scrape-amazon-prices',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
  ),
  body := '{}'::jsonb
) as direct_call_result;