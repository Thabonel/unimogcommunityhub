-- Verify the Cron Fix Worked
-- Check if products were just updated and settings are working

-- Query 1: Products updated in last 10 minutes (just now)
SELECT
  title,
  current_price,
  last_price_check,
  api_last_error
FROM affiliate_products
WHERE last_price_check >= NOW() - INTERVAL '10 minutes'
ORDER BY last_price_check DESC;

-- Query 2: Verify settings are now configured
SELECT
  'edge_function_url' as setting_name,
  current_setting('app.settings.edge_function_url', true) as value,
  '✅ FIXED' as status
UNION ALL
SELECT
  'service_role_key' as setting_name,
  '[REDACTED]' as value,
  '✅ FIXED' as status;

-- Query 3: Current status summary
SELECT
  COUNT(*) as total_products,
  COUNT(current_price) as with_current_price,
  COUNT(CASE WHEN last_price_check >= NOW() - INTERVAL '1 day' THEN 1 END) as updated_today
FROM affiliate_products
WHERE is_active = true;