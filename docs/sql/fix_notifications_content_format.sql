-- Fix notifications content format - convert string JSON to proper JSONB

-- First, let's see what we're working with
-- UPDATE existing notifications to convert string JSON to proper JSONB
UPDATE notifications
SET content = content::text::jsonb
WHERE content::text LIKE '{%}' AND jsonb_typeof(content) = 'string';

-- Fix the create_notification function to use proper JSONB
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL,
  p_sender_id UUID DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (
    id,
    user_id,
    sender_id,
    type,
    content,
    reference_id,
    reference_type,
    is_read,
    created_at
  ) VALUES (
    gen_random_uuid(),
    p_user_id,
    p_sender_id,
    p_type,
    jsonb_build_object(
      'title', p_title,
      'message', p_message,
      'link', p_link
    ),
    p_reference_id,
    p_reference_type,
    false,
    NOW()
  ) RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$;