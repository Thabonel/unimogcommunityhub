-- Emergency Price Scraping Fix
-- Run these queries to diagnose and fix the scraping system

-- 1. Check if cron job settings exist
SELECT
  current_setting('app.settings.edge_function_url', true) as edge_url,
  current_setting('app.settings.service_role_key', true) as has_service_key;

-- 2. Manually trigger price scraping (immediate fix)
-- Copy this URL and call it manually in browser or Postman:
-- https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/scrape-amazon-prices
-- (Add Authorization header: Bearer [your-service-role-key])

-- 3. Check recent cron job activity
SELECT * FROM cron.job ORDER BY last_run_start_time DESC LIMIT 10;

-- 4. Force immediate price check for 10 most important products
-- Run this to manually trigger scraping via HTTP
SELECT net.http_post(
  url := 'https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/scrape-amazon-prices',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
  ),
  body := '{}'::jsonb
);