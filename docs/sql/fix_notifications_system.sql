-- Fix notifications system - Create triggers and seed initial notifications

-- Function to create notification
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

-- Function to notify when someone comments on a post
CREATE OR REPLACE FUNCTION notify_post_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post_author_id UUID;
  commenter_name TEXT;
  post_title TEXT;
BEGIN
  -- Get post author and details
  SELECT user_id, title INTO post_author_id, post_title
  FROM community_posts
  WHERE id = NEW.post_id;

  -- Don't notify if commenting on own post
  IF post_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get commenter name
  SELECT COALESCE(display_name, full_name, email) INTO commenter_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Create notification
  PERFORM create_notification(
    post_author_id,
    'post_comment',
    'New comment on your post',
    commenter_name || ' commented on your post: ' || COALESCE(post_title, 'Untitled'),
    '/community/posts/' || NEW.post_id,
    NEW.user_id,
    NEW.id,
    'comment'
  );

  RETURN NEW;
END;
$$;

-- Function to notify when someone likes a post
CREATE OR REPLACE FUNCTION notify_post_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post_author_id UUID;
  liker_name TEXT;
  post_title TEXT;
BEGIN
  -- Get post author and details
  SELECT user_id, title INTO post_author_id, post_title
  FROM community_posts
  WHERE id = NEW.post_id;

  -- Don't notify if liking own post
  IF post_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get liker name
  SELECT COALESCE(display_name, full_name, email) INTO liker_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Create notification
  PERFORM create_notification(
    post_author_id,
    'post_like',
    'Someone liked your post',
    liker_name || ' liked your post: ' || COALESCE(post_title, 'Untitled'),
    '/community/posts/' || NEW.post_id,
    NEW.user_id,
    NEW.id,
    'like'
  );

  RETURN NEW;
END;
$$;

-- Function to notify when someone sends a message
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sender_name TEXT;
BEGIN
  -- Get sender name
  SELECT COALESCE(display_name, full_name, email) INTO sender_name
  FROM profiles
  WHERE id = NEW.sender_id;

  -- Create notification
  PERFORM create_notification(
    NEW.recipient_id,
    'message',
    'New message',
    'You have a new message from ' || sender_name,
    '/messages',
    NEW.sender_id,
    NEW.id,
    'message'
  );

  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_notify_post_comment ON post_comments;
CREATE TRIGGER trigger_notify_post_comment
  AFTER INSERT ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_post_comment();

DROP TRIGGER IF EXISTS trigger_notify_post_like ON post_likes;
CREATE TRIGGER trigger_notify_post_like
  AFTER INSERT ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION notify_post_like();

DROP TRIGGER IF EXISTS trigger_notify_new_message ON messages;
CREATE TRIGGER trigger_notify_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();

-- Insert some initial system notifications for all users
INSERT INTO notifications (id, user_id, type, content, is_read, created_at)
SELECT
  gen_random_uuid(),
  id,
  'system',
  jsonb_build_object(
    'title', 'Welcome to Unimog Community Hub!',
    'message', 'Explore the community, share your adventures, and connect with fellow Unimog enthusiasts.',
    'link', '/dashboard'
  ),
  false,
  NOW()
FROM profiles
WHERE id IS NOT NULL;

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;