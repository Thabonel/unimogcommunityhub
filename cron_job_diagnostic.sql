-- Fixed Cron Job Investigation for Amazon Price Scraping
-- Run these queries in Supabase SQL Editor to diagnose the automation

-- Query 1: Check if cron extension is available first
SELECT
  extname as extension_name,
  extversion as version
FROM pg_extension
WHERE extname = 'pg_cron'
UNION ALL
SELECT
  'cron_schema_exists' as extension_name,
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'cron')
    THEN 'YES'
    ELSE 'NO'
  END as version;

-- Query 2: Check cron table structure (if available)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'cron'
  AND table_name = 'job'
ORDER BY ordinal_position;

-- Query 3: Check if cron jobs exist (basic check)
SELECT
  jobname,
  schedule,
  command,
  active,
  jobid
FROM cron.job
WHERE jobname LIKE '%amazon%'
   OR jobname LIKE '%price%'
   OR jobname LIKE '%scrape%'
ORDER BY jobname;

-- Query 4: List ALL cron jobs to see what's configured
SELECT
  jobname,
  schedule,
  active,
  command
FROM cron.job
ORDER BY jobname;

-- Query 5: Check required settings for cron jobs
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

-- Query 6: Check if migrations have been applied
SELECT
  version,
  name
FROM supabase_migrations.schema_migrations
WHERE name LIKE '%amazon%'
   OR name LIKE '%schedule%'
ORDER BY version DESC;