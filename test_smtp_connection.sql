-- Test SMTP connection by attempting to send a test email
-- This will help diagnose if the issue is with SMTP credentials or something else

-- Check current auth configuration
SELECT
  name,
  value
FROM pg_settings
WHERE name LIKE '%smtp%' OR name LIKE '%email%';

-- Alternative: Test if we can send emails via a different method
-- If SMTP is failing, we can bypass Supabase Auth emails and use an Edge Function instead
