-- Scraping Failure Analysis
-- Why are 96 out of 119 products not being scraped?

-- Query 1: Products that have never been checked
SELECT
  COUNT(*) as never_checked_count,
  'Products never scraped' as category
FROM affiliate_products
WHERE is_active = true
  AND last_price_check IS NULL
  AND affiliate_provider = 'amazon';

-- Query 2: Check if cron jobs are configured properly
-- Look for edge function URL and service role settings
SELECT
  name,
  setting
FROM pg_settings
WHERE name LIKE 'app.settings%';

-- Query 3: Recent scraping attempts (last 7 days)
SELECT
  last_price_check::date as check_date,
  COUNT(*) as products_checked
FROM affiliate_products
WHERE is_active = true
  AND last_price_check >= NOW() - INTERVAL '7 days'
GROUP BY last_price_check::date
ORDER BY check_date DESC;

-- Query 4: Error patterns - what's causing failures?
SELECT
  api_last_error,
  COUNT(*) as error_count
FROM affiliate_products
WHERE is_active = true
  AND api_last_error IS NOT NULL
GROUP BY api_last_error
ORDER BY error_count DESC;

-- Query 5: URL patterns - are some domains failing more?
SELECT
  CASE
    WHEN affiliate_url LIKE '%amazon.com%' THEN 'amazon.com (US)'
    WHEN affiliate_url LIKE '%amazon.com.au%' THEN 'amazon.com.au (AU)'
    WHEN affiliate_url LIKE '%amazon.de%' THEN 'amazon.de (DE)'
    WHEN affiliate_url LIKE '%amazon.fr%' THEN 'amazon.fr (FR)'
    WHEN affiliate_url LIKE '%amazon.es%' THEN 'amazon.es (ES)'
    WHEN affiliate_url LIKE '%amazon.it%' THEN 'amazon.it (IT)'
    ELSE 'Other'
  END as domain,
  COUNT(*) as total_products,
  COUNT(current_price) as with_current_price,
  COUNT(CASE WHEN api_error_count > 0 THEN 1 END) as with_errors
FROM affiliate_products
WHERE is_active = true
  AND affiliate_provider = 'amazon'
GROUP BY domain
ORDER BY total_products DESC;

-- Query 6: Sample of products that have never been checked
SELECT
  title,
  affiliate_url,
  created_at,
  price,
  currency
FROM affiliate_products
WHERE is_active = true
  AND last_price_check IS NULL
  AND affiliate_provider = 'amazon'
ORDER BY created_at DESC
LIMIT 10;