-- Analyze Scraping Failure Patterns
-- Run this while the script continues to understand failures

-- Query 1: Most recent scraping errors
SELECT
  title,
  api_last_error,
  api_error_count,
  last_price_check,
  affiliate_url
FROM affiliate_products
WHERE is_active = true
  AND api_last_error IS NOT NULL
  AND last_price_check >= NOW() - INTERVAL '1 hour'
ORDER BY last_price_check DESC
LIMIT 20;

-- Query 2: Error patterns by domain
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
  COUNT(CASE WHEN api_error_count > 0 THEN 1 END) as products_with_errors,
  COUNT(CASE WHEN last_price_check >= NOW() - INTERVAL '1 hour' THEN 1 END) as recently_checked
FROM affiliate_products
WHERE is_active = true
GROUP BY domain
ORDER BY products_with_errors DESC;

-- Query 3: Success vs failure patterns
SELECT
  api_last_error,
  COUNT(*) as error_count
FROM affiliate_products
WHERE is_active = true
  AND last_price_check >= NOW() - INTERVAL '1 hour'
  AND api_last_error IS NOT NULL
GROUP BY api_last_error
ORDER BY error_count DESC;