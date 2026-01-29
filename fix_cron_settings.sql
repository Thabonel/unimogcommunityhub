-- Fix Cron Job Settings for Amazon Price Scraping
-- This configures the missing settings that cron jobs need

-- Step 1: Set the edge function URL
-- This tells cron jobs where to find your Supabase edge functions
SELECT set_config(
  'app.settings.edge_function_url',
  'https://ydevatqwkoccxhtejdor.supabase.co/functions/v1',
  false  -- false = setting persists across sessions
);

-- Step 2: Set the service role key
-- REPLACE 'YOUR_SERVICE_ROLE_KEY_HERE' with your actual service role key
-- Get it from: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/api
SELECT set_config(
  'app.settings.service_role_key',
  'YOUR_SERVICE_ROLE_KEY_HERE',  -- ← REPLACE THIS WITH ACTUAL KEY
  false  -- false = setting persists across sessions
);

-- Step 3: Verify settings are now configured
SELECT
  'edge_function_url' as setting_name,
  current_setting('app.settings.edge_function_url', true) as setting_value,
  CASE
    WHEN current_setting('app.settings.edge_function_url', true) IS NOT NULL THEN '✅ SET'
    ELSE '❌ MISSING'
  END as status
UNION ALL
SELECT
  'service_role_key' as setting_name,
  CASE
    WHEN current_setting('app.settings.service_role_key', true) IS NOT NULL THEN '[REDACTED - EXISTS]'
    ELSE 'NULL'
  END as setting_value,
  CASE
    WHEN current_setting('app.settings.service_role_key', true) IS NOT NULL THEN '✅ SET'
    ELSE '❌ MISSING'
  END as status;

-- Step 4: Check if cron jobs exist and try to trigger one manually
-- This will test if the fix worked
SELECT
  jobname,
  schedule,
  active
FROM cron.job
WHERE jobname LIKE '%amazon%'
ORDER BY jobname;

-- Step 5: Manual test of the fixed URL
-- This tests if the edge function URL is now accessible
SELECT net.http_post(
  url := current_setting('app.settings.edge_function_url', true) || '/scrape-amazon-prices',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
  ),
  body := '{}'::jsonb
) as test_result;