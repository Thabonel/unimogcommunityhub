-- Fix notifications type constraint to include all needed notification types

-- Drop the old constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add the new constraint with all needed types
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
CHECK (type = ANY (ARRAY[
  'like'::text,
  'comment'::text,
  'share'::text,
  'connection_request'::text,
  'connection_accepted'::text,
  'message'::text,
  'post_comment'::text,
  'post_like'::text,
  'marketplace'::text,
  'trip'::text,
  'system'::text,
  'achievement'::text,
  'notice'::text,
  'announcement'::text
]));

-- Now insert welcome notifications for all existing users
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
WHERE id IS NOT NULL
ON CONFLICT DO NOTHING;