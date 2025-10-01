-- Simple fix for Function Search Path Mutable security warnings
-- This version only adds SET search_path without modifying function logic
-- Run each statement separately in Supabase Dashboard SQL Editor

-- Note: For complex functions, we need to get the full function body first
-- then recreate with SET search_path added. This SQL uses simplified placeholders.

-- 1. Fix update_updated_at_column function
ALTER FUNCTION public.update_updated_at_column()
SET search_path = 'public';

-- 2. Fix approve_notice_submission function
ALTER FUNCTION public.approve_notice_submission(uuid, uuid, text)
SET search_path = 'public';

-- 3. Fix reject_notice_submission function
ALTER FUNCTION public.reject_notice_submission(uuid, uuid, text, text)
SET search_path = 'public';

-- 4. Fix update_notice_stats function
ALTER FUNCTION public.update_notice_stats()
SET search_path = 'public';

-- 5. Fix notify_post_comment function
ALTER FUNCTION public.notify_post_comment()
SET search_path = 'public';

-- 6. Fix notify_post_like function
ALTER FUNCTION public.notify_post_like()
SET search_path = 'public';

-- 7. Fix notify_new_message function
ALTER FUNCTION public.notify_new_message()
SET search_path = 'public';

-- 8. Fix create_notification function
ALTER FUNCTION public.create_notification(uuid, text, text, text, text, uuid, uuid, text)
SET search_path = 'public';

-- 9. Fix update_unimog_resources_updated_at function
ALTER FUNCTION public.update_unimog_resources_updated_at()
SET search_path = 'public';