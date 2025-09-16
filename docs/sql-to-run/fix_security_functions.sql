-- Fix Function Search Path Mutable security warnings
-- Run this in Supabase Dashboard SQL Editor

-- 1. Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- 2. Fix approve_notice_submission function
CREATE OR REPLACE FUNCTION public.approve_notice_submission(submission_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    UPDATE notice_submissions
    SET status = 'approved', approved_at = now()
    WHERE id = submission_id;
END;
$function$;

-- 3. Fix reject_notice_submission function
CREATE OR REPLACE FUNCTION public.reject_notice_submission(submission_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    UPDATE notice_submissions
    SET status = 'rejected', rejected_at = now()
    WHERE id = submission_id;
END;
$function$;

-- 4. Fix update_notice_stats function
CREATE OR REPLACE FUNCTION public.update_notice_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    -- Update notice statistics
    UPDATE notice_stats
    SET updated_at = now();
END;
$function$;

-- 5. Fix notify_post_comment function
CREATE OR REPLACE FUNCTION public.notify_post_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    -- Create notification for new comment
    INSERT INTO notifications (user_id, type, content, created_at)
    VALUES (NEW.user_id, 'comment', 'New comment on your post', now());
    RETURN NEW;
END;
$function$;

-- 6. Fix notify_post_like function
CREATE OR REPLACE FUNCTION public.notify_post_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    -- Create notification for new like
    INSERT INTO notifications (user_id, type, content, created_at)
    VALUES (NEW.user_id, 'like', 'Someone liked your post', now());
    RETURN NEW;
END;
$function$;

-- 7. Fix notify_new_message function
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    -- Create notification for new message
    INSERT INTO notifications (user_id, type, content, created_at)
    VALUES (NEW.recipient_id, 'message', 'You have a new message', now());
    RETURN NEW;
END;
$function$;

-- 8. Fix create_notification function
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id uuid,
    p_type text,
    p_content text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    notification_id uuid;
BEGIN
    INSERT INTO notifications (user_id, type, content, created_at)
    VALUES (p_user_id, p_type, p_content, now())
    RETURNING id INTO notification_id;

    RETURN notification_id;
END;
$function$;

-- 9. Fix update_unimog_resources_updated_at function
CREATE OR REPLACE FUNCTION public.update_unimog_resources_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;