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

-- 2. Fix approve_notice_submission function (preserving existing signature)
CREATE OR REPLACE FUNCTION public.approve_notice_submission(submission_id uuid, reviewer_id uuid, admin_notes text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  submission_record notice_submissions%ROWTYPE;
  new_notice_id UUID;
BEGIN
  -- Check admin permission
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = reviewer_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can approve submissions';
  END IF;

  -- Get submission details
  SELECT * INTO submission_record
  FROM notice_submissions
  WHERE id = submission_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  -- Create published notice
  INSERT INTO notice_board (
    title,
    content,
    type,
    category,
    priority,
    author_id,
    author_type,
    tags,
    media,
    published_at
  ) VALUES (
    submission_record.title,
    submission_record.content,
    submission_record.type,
    submission_record.category,
    submission_record.requested_priority,
    submission_record.submitter_id,
    'user',
    submission_record.requested_tags,
    submission_record.media,
    NOW()
  ) RETURNING id INTO new_notice_id;

  -- Update submission status
  UPDATE notice_submissions
  SET
    status = 'approved',
    reviewed_by = reviewer_id,
    reviewed_at = NOW(),
    admin_notes = COALESCE(approve_notice_submission.admin_notes, admin_notes),
    published_notice_id = new_notice_id
  WHERE id = submission_id;

  -- Create notification for submitter
  INSERT INTO notifications (
    user_id,
    type,
    content,
    reference_id,
    reference_type
  ) VALUES (
    submission_record.submitter_id,
    'notice',
    jsonb_build_object(
      'title', 'Your notice has been approved!',
      'message', 'Your submitted notice "' || submission_record.title || '" has been approved and published.',
      'link', '/notices/' || new_notice_id
    ),
    new_notice_id,
    'notice'
  );

  RETURN new_notice_id;
END;
$function$;

-- 3. Fix reject_notice_submission function (preserving existing signature)
CREATE OR REPLACE FUNCTION public.reject_notice_submission(submission_id uuid, reviewer_id uuid, rejection_reason text, admin_notes text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  submission_record notice_submissions%ROWTYPE;
BEGIN
  -- Check admin permission
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = reviewer_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can reject submissions';
  END IF;

  -- Get submission details
  SELECT * INTO submission_record
  FROM notice_submissions
  WHERE id = submission_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  -- Update submission status
  UPDATE notice_submissions
  SET
    status = 'rejected',
    reviewed_by = reviewer_id,
    reviewed_at = NOW(),
    rejection_reason = reject_notice_submission.rejection_reason,
    admin_notes = COALESCE(reject_notice_submission.admin_notes, admin_notes)
  WHERE id = submission_id;

  -- Create notification for submitter
  INSERT INTO notifications (
    user_id,
    type,
    content,
    reference_id,
    reference_type
  ) VALUES (
    submission_record.submitter_id,
    'notice',
    jsonb_build_object(
      'title', 'Notice submission update',
      'message', 'Your submitted notice "' || submission_record.title || '" needs revision. Reason: ' || rejection_reason,
      'link', '/notice-submissions/' || submission_id
    ),
    submission_id,
    'notice_submission'
  );

  RETURN true;
END;
$function$;

-- 4. Fix update_notice_stats function (preserving existing signature as trigger)
CREATE OR REPLACE FUNCTION public.update_notice_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_TABLE_NAME = 'notice_reactions' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE notice_board
      SET reaction_count = reaction_count + 1
      WHERE id = NEW.notice_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE notice_board
      SET reaction_count = reaction_count - 1
      WHERE id = OLD.notice_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'notice_comments' THEN
    IF TG_OP = 'INSERT' AND NOT NEW.is_deleted THEN
      UPDATE notice_board
      SET comment_count = comment_count + 1
      WHERE id = NEW.notice_id;
    ELSIF TG_OP = 'UPDATE' THEN
      IF OLD.is_deleted = false AND NEW.is_deleted = true THEN
        UPDATE notice_board
        SET comment_count = comment_count - 1
        WHERE id = NEW.notice_id;
      ELSIF OLD.is_deleted = true AND NEW.is_deleted = false THEN
        UPDATE notice_board
        SET comment_count = comment_count + 1
        WHERE id = NEW.notice_id;
      END IF;
    END IF;
  ELSIF TG_TABLE_NAME = 'notice_views' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE notice_board
      SET view_count = view_count + 1
      WHERE id = NEW.notice_id;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
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