-- Admin SMS Notification System
-- Sends SMS alerts to admin for key site events

-- Table to store SMS notification preferences
CREATE TABLE IF NOT EXISTS admin_sms_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  
  -- Event toggles
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

-- Table to log SMS notifications sent
CREATE TABLE IF NOT EXISTS admin_sms_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_id UUID,
  message TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, sent, failed
  twilio_sid TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE admin_sms_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sms_log ENABLE ROW LEVEL SECURITY;

-- Only admins can manage their SMS preferences
CREATE POLICY "Admins manage own SMS preferences" ON admin_sms_preferences
  FOR ALL USING (
    auth.uid() = admin_user_id AND 
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Only admins can view SMS logs
CREATE POLICY "Admins view SMS logs" ON admin_sms_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Insert default preferences for site owner
INSERT INTO admin_sms_preferences (
  admin_user_id,
  phone_number,
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
  '+61402091189',
  true,
  true,  -- New users
  true,  -- New posts
  true,  -- New listings
  false, -- Comments (too many)
  false, -- Messages (too many)
  true,  -- Feedback
  true,  -- Payments
  true,  -- Trips
  true   -- Errors
FROM auth.users
WHERE email = 'thabonel0@gmail.com'
ON CONFLICT (admin_user_id) DO NOTHING;

-- Function to queue SMS notification
CREATE OR REPLACE FUNCTION queue_admin_sms(
  p_event_type TEXT,
  p_event_id UUID,
  p_message TEXT
)
RETURNS UUID AS $$
DECLARE
  v_sms_id UUID;
  v_phone TEXT;
  v_enabled BOOLEAN;
  v_should_notify BOOLEAN;
BEGIN
  -- Get admin SMS preferences
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

  -- Only queue if notifications enabled and this event type is enabled
  IF v_enabled AND v_should_notify THEN
    INSERT INTO admin_sms_log (event_type, event_id, message, phone_number, status)
    VALUES (p_event_type, p_event_id, p_message, v_phone, 'pending')
    RETURNING id INTO v_sms_id;
    
    RETURN v_sms_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for new users
CREATE OR REPLACE FUNCTION notify_new_user()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM queue_admin_sms(
    'new_user',
    NEW.id,
    '🆕 New user signup: ' || COALESCE(NEW.email, 'Unknown')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for new posts
CREATE OR REPLACE FUNCTION notify_new_post()
RETURNS TRIGGER AS $$
DECLARE
  v_author_email TEXT;
BEGIN
  SELECT email INTO v_author_email FROM auth.users WHERE id = NEW.user_id;
  
  PERFORM queue_admin_sms(
    'new_post',
    NEW.id,
    '📝 New post by ' || COALESCE(v_author_email, 'Unknown') || ': ' || LEFT(NEW.title, 50)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for new marketplace listings
CREATE OR REPLACE FUNCTION notify_new_listing()
RETURNS TRIGGER AS $$
DECLARE
  v_seller_email TEXT;
BEGIN
  SELECT email INTO v_seller_email FROM auth.users WHERE id = NEW.seller_id;
  
  PERFORM queue_admin_sms(
    'new_listing',
    NEW.id,
    '🛒 New listing by ' || COALESCE(v_seller_email, 'Unknown') || ': ' || LEFT(NEW.title, 40)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for feedback
CREATE OR REPLACE FUNCTION notify_new_feedback()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM queue_admin_sms(
    'feedback',
    NEW.id,
    '💬 Feedback (' || NEW.category || '): ' || LEFT(NEW.message, 60)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for trips
CREATE OR REPLACE FUNCTION notify_new_trip()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM queue_admin_sms(
    'trip',
    NEW.id,
    '🗺️ New trip created: ' || LEFT(NEW.title, 60)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_notify_new_user ON auth.users;
CREATE TRIGGER trigger_notify_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_user();

DROP TRIGGER IF EXISTS trigger_notify_new_post ON community_posts;
CREATE TRIGGER trigger_notify_new_post
  AFTER INSERT ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_post();

DROP TRIGGER IF EXISTS trigger_notify_new_listing ON marketplace_listings;
CREATE TRIGGER trigger_notify_new_listing
  AFTER INSERT ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_listing();

DROP TRIGGER IF EXISTS trigger_notify_feedback ON feedback_submissions;
CREATE TRIGGER trigger_notify_feedback
  AFTER INSERT ON feedback_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_feedback();

DROP TRIGGER IF EXISTS trigger_notify_trip ON trips;
CREATE TRIGGER trigger_notify_trip
  AFTER INSERT ON trips
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_trip();
