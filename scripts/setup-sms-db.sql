-- Run this in Supabase SQL Editor to set up SMS notifications
-- https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new

-- Step 1: Apply the migration (creates tables and triggers)
-- Copy/paste contents of: supabase/migrations/*_create_admin_sms_notifications.sql
-- OR use: supabase db push --project-ref ydevatqwkoccxhtejdor

-- Step 2: Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Step 3: Schedule Edge Function to run every minute
SELECT cron.schedule(
  'send-admin-sms',
  '* * * * *',  -- Every minute
  $$
  SELECT
    net.http_post(
        url:='https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/send-admin-sms',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3NDQzNTEsImV4cCI6MjA0MjMyMDM1MX0.lfg8o8GzMWVJhWqPPPj9T7hGvFB-CmxDxR3lRXLl3eI"}'::jsonb
    ) as request_id;
  $$
);

-- Step 4: Verify cron job is scheduled
SELECT * FROM cron.job WHERE jobname = 'send-admin-sms';

-- Step 5: Send test SMS
SELECT queue_admin_sms(
  'error',
  gen_random_uuid(),
  '🧪 Test SMS from Unimog Community Hub - Setup complete!'
);

-- Step 6: Check SMS was queued (wait 1 minute for delivery)
SELECT
  event_type,
  message,
  status,
  created_at
FROM admin_sms_log
ORDER BY created_at DESC
LIMIT 5;

-- Troubleshooting queries:

-- Check your SMS preferences
SELECT * FROM admin_sms_preferences WHERE phone_number = '+61402091189';

-- View cron execution log
SELECT * FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'send-admin-sms')
ORDER BY start_time DESC
LIMIT 10;

-- Manually trigger Edge Function (for testing)
SELECT net.http_post(
  url:='https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/send-admin-sms',
  headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3NDQzNTEsImV4cCI6MjA0MjMyMDM1MX0.lfg8o8GzMWVJhWqPPPj9T7hGvFB-CmxDxR3lRXLl3eI"}'::jsonb
) as request_id;
