CREATE OR REPLACE FUNCTION public.notify_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM queue_admin_sms(
    'new_user',
    NEW.id,
    '🆕 New user signup: ' || COALESCE(NEW.email, 'Unknown')
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_new_user_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM queue_admin_email(
    'new_user',
    NEW.id,
    '🆕 New User Signup - Unimog Community Hub',
    'New user signed up: ' || COALESCE(NEW.email, 'Unknown') || E'\n\n' ||
    'Time: ' || NOW()::TEXT || E'\n' ||
    'View in admin panel: https://unimogcommunityhub.com/admin'
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.queue_admin_sms(p_event_type text, p_event_id uuid, p_message text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_sms_id UUID;
  v_phone TEXT;
  v_enabled BOOLEAN;
  v_should_notify BOOLEAN;
BEGIN
  SELECT
    phone_number,
    enabled,
    CASE p_event_type
      WHEN 'new_user' THEN notify_new_user
      WHEN 'new_post' THEN notify_new_post
      WHEN 'new_listing' THEN notify_new_listing
      WHEN 'new_comment' THEN notify_new_comment
      WHEN 'new_message' THEN notify_new_message
      WHEN 'feedback' THEN notify_feedback
      WHEN 'payment' THEN notify_payment
      WHEN 'trip' THEN notify_trip
      WHEN 'error' THEN notify_error
      ELSE false
    END
  INTO v_phone, v_enabled, v_should_notify
  FROM admin_sms_preferences
  WHERE admin_user_id IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
  LIMIT 1;

  IF v_enabled AND v_should_notify AND v_phone IS NOT NULL THEN
    INSERT INTO admin_sms_log (event_type, event_id, message, phone_number, status)
    VALUES (p_event_type, p_event_id, p_message, v_phone, 'pending')
    RETURNING id INTO v_sms_id;

    RETURN v_sms_id;
  END IF;

  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.queue_admin_email(p_event_type text, p_event_id uuid, p_subject text, p_message text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_email_id UUID;
  v_email TEXT;
  v_enabled BOOLEAN;
  v_should_notify BOOLEAN;
BEGIN
  SELECT
    email,
    enabled,
    CASE p_event_type
      WHEN 'new_user' THEN notify_new_user
      WHEN 'new_post' THEN notify_new_post
      WHEN 'new_listing' THEN notify_new_listing
      WHEN 'new_comment' THEN notify_new_comment
      WHEN 'new_message' THEN notify_new_message
      WHEN 'feedback' THEN notify_feedback
      WHEN 'payment' THEN notify_payment
      WHEN 'trip' THEN notify_trip
      WHEN 'error' THEN notify_error
      ELSE false
    END
  INTO v_email, v_enabled, v_should_notify
  FROM admin_email_preferences
  WHERE admin_user_id IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
  LIMIT 1;

  IF v_enabled AND v_should_notify AND v_email IS NOT NULL THEN
    INSERT INTO admin_email_log (event_type, event_id, subject, message, recipient_email, status)
    VALUES (p_event_type, p_event_id, p_subject, p_message, v_email, 'pending')
    RETURNING id INTO v_email_id;

    RETURN v_email_id;
  END IF;

  RETURN NULL;
END;
$function$;
