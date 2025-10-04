-- ========================================
-- EMAIL NOTIFICATION SETUP FOR UNIMOG COMMUNITY HUB
-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- ========================================

CREATE TABLE IF NOT EXISTS admin_email_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  notify_new_user BOOLEAN DEFAULT true,
  notify_new_post BOOLEAN DEFAULT true,
  notify_new_listing BOOLEAN DEFAULT true,
  notify_new_comment BOOLEAN DEFAULT false,
  notify_new_message BOOLEAN DEFAULT false,
  notify_feedback BOOLEAN DEFAULT true,
  notify_payment BOOLEAN DEFAULT true,
  notify_trip BOOLEAN DEFAULT true,
  notify_error BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(admin_user_id)
);

CREATE TABLE IF NOT EXISTS admin_email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_id UUID,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage own email preferences" ON admin_email_preferences
  FOR ALL USING (
    auth.uid() = admin_user_id AND
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins view email logs" ON admin_email_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

INSERT INTO admin_email_preferences (
  admin_user_id,
  email,
  enabled,
  notify_new_user,
  notify_new_post,
  notify_new_listing,
  notify_new_comment,
  notify_new_message,
  notify_feedback,
  notify_payment,
  notify_trip,
  notify_error
)
SELECT
  id,
  'thabonel0@gmail.com',
  true,
  true,
  true,
  true,
  false,
  false,
  true,
  true,
  true,
  true
FROM auth.users
WHERE email = 'thabonel0@gmail.com'
ON CONFLICT (admin_user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION queue_admin_email(
  p_event_type TEXT,
  p_event_id UUID,
  p_subject TEXT,
  p_message TEXT
)
RETURNS UUID AS $$
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

  IF v_enabled AND v_should_notify THEN
    INSERT INTO admin_email_log (event_type, event_id, subject, message, recipient_email, status)
    VALUES (p_event_type, p_event_id, p_subject, p_message, v_email, 'pending')
    RETURNING id INTO v_email_id;

    RETURN v_email_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION notify_new_user_email()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_new_post_email()
RETURNS TRIGGER AS $$
DECLARE
  v_author_email TEXT;
BEGIN
  SELECT email INTO v_author_email FROM auth.users WHERE id = NEW.user_id;

  PERFORM queue_admin_email(
    'new_post',
    NEW.id,
    '📝 New Community Post - Unimog Community Hub',
    'New post by ' || COALESCE(v_author_email, 'Unknown') || E'\n\n' ||
    'Title: ' || NEW.title || E'\n\n' ||
    'Content: ' || LEFT(NEW.content, 200) || E'\n\n' ||
    'View: https://unimogcommunityhub.com/community'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_new_listing_email()
RETURNS TRIGGER AS $$
DECLARE
  v_seller_email TEXT;
BEGIN
  SELECT email INTO v_seller_email FROM auth.users WHERE id = NEW.seller_id;

  PERFORM queue_admin_email(
    'new_listing',
    NEW.id,
    '🛒 New Marketplace Listing - Unimog Community Hub',
    'New listing by ' || COALESCE(v_seller_email, 'Unknown') || E'\n\n' ||
    'Title: ' || NEW.title || E'\n' ||
    'Price: $' || NEW.price || E'\n\n' ||
    'Description: ' || LEFT(NEW.description, 200) || E'\n\n' ||
    'View: https://unimogcommunityhub.com/marketplace'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_new_feedback_email()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM queue_admin_email(
    'feedback',
    NEW.id,
    '💬 New Feedback - Unimog Community Hub',
    'Category: ' || NEW.category || E'\n' ||
    'From: ' || COALESCE(NEW.email, 'Anonymous') || E'\n\n' ||
    'Message: ' || NEW.message || E'\n\n' ||
    'View: https://unimogcommunityhub.com/admin'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_new_trip_email()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM queue_admin_email(
    'trip',
    NEW.id,
    '🗺️ New Trip Created - Unimog Community Hub',
    'New trip: ' || NEW.title || E'\n\n' ||
    'Created: ' || NOW()::TEXT || E'\n\n' ||
    'View: https://unimogcommunityhub.com/trips'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_new_user_email ON auth.users;
CREATE TRIGGER trigger_notify_new_user_email
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_user_email();

DROP TRIGGER IF EXISTS trigger_notify_new_post_email ON community_posts;
CREATE TRIGGER trigger_notify_new_post_email
  AFTER INSERT ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_post_email();

DROP TRIGGER IF EXISTS trigger_notify_new_listing_email ON marketplace_listings;
CREATE TRIGGER trigger_notify_new_listing_email
  AFTER INSERT ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_listing_email();

DROP TRIGGER IF EXISTS trigger_notify_feedback_email ON feedback;
CREATE TRIGGER trigger_notify_feedback_email
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_feedback_email();

DROP TRIGGER IF EXISTS trigger_notify_trip_email ON trips;
CREATE TRIGGER trigger_notify_trip_email
  AFTER INSERT ON trips
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_trip_email();

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'send-admin-emails',
  '* * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/send-admin-email',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3NDQzNTEsImV4cCI6MjA0MjMyMDM1MX0.lfg8o8GzMWVJhWqPPPj9T7hGvFB-CmxDxR3lRXLl3eI"}'::jsonb
    ) as request_id;
  $$
);

SELECT queue_admin_email(
  'error',
  gen_random_uuid(),
  '🧪 Test Email - Email Notifications Active',
  'This is a test email from Unimog Community Hub. Email notifications are now working!'
);
