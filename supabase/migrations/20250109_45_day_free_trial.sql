-- Migration: Implement 45-day free trial for new users
-- Date: 2025-01-09
-- Description: Updates trial system from 14 days to 45 days and ensures automatic activation

-- ====================================
-- 1. CREATE OR UPDATE USER_TRIALS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS user_trials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_trials_user_id ON user_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trials_expires_at ON user_trials(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_trials_is_active ON user_trials(is_active);

-- Enable RLS
ALTER TABLE user_trials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own trial" ON user_trials;
DROP POLICY IF EXISTS "Users can insert own trial" ON user_trials;
DROP POLICY IF EXISTS "Users can update own trial" ON user_trials;

-- Create RLS policies
CREATE POLICY "Users can view own trial" ON user_trials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trial" ON user_trials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trial" ON user_trials
  FOR UPDATE USING (auth.uid() = user_id);

-- ====================================
-- 2. CREATE FUNCTION TO START 45-DAY TRIAL
-- ====================================

CREATE OR REPLACE FUNCTION start_45_day_trial(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_trial_id UUID;
  v_result JSON;
BEGIN
  -- Check if user already has a trial
  IF EXISTS (SELECT 1 FROM user_trials WHERE user_id = p_user_id) THEN
    SELECT json_build_object(
      'success', false,
      'message', 'User already has a trial',
      'trial', row_to_json(ut.*)
    ) INTO v_result
    FROM user_trials ut
    WHERE ut.user_id = p_user_id;
    
    RETURN v_result;
  END IF;

  -- Create new 45-day trial
  INSERT INTO user_trials (
    user_id,
    started_at,
    expires_at,
    is_active
  ) VALUES (
    p_user_id,
    NOW(),
    NOW() + INTERVAL '45 days',
    true
  ) RETURNING id INTO v_trial_id;

  -- Return success with trial details
  SELECT json_build_object(
    'success', true,
    'message', '45-day trial started successfully',
    'trial', row_to_json(ut.*)
  ) INTO v_result
  FROM user_trials ut
  WHERE ut.id = v_trial_id;

  RETURN v_result;
END;
$$;

-- ====================================
-- 3. CREATE TRIGGER FOR AUTOMATIC TRIAL ON SIGNUP
-- ====================================

CREATE OR REPLACE FUNCTION auto_start_trial_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Start 45-day trial for new user
  INSERT INTO user_trials (
    user_id,
    started_at,
    expires_at,
    is_active
  ) VALUES (
    NEW.id,
    NOW(),
    NOW() + INTERVAL '45 days',
    true
  ) ON CONFLICT (user_id) DO NOTHING;
  
  -- Also create a basic subscription record with trial status
  INSERT INTO user_subscriptions (
    user_id,
    subscription_level,
    subscription_type,
    is_active,
    status,
    started_at,
    expires_at
  ) VALUES (
    NEW.id,
    'free',
    'trial',
    true,
    'trialing',
    NOW(),
    NOW() + INTERVAL '45 days'
  ) ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_start_trial ON auth.users;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created_start_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_start_trial_on_signup();

-- ====================================
-- 4. UPDATE EXISTING TRIALS TO 45 DAYS
-- ====================================

-- For users who signed up recently (last 14 days) and have active trials,
-- extend their trial to 45 days from their start date
UPDATE user_trials
SET 
  expires_at = started_at + INTERVAL '45 days',
  updated_at = NOW()
WHERE 
  is_active = true
  AND started_at > NOW() - INTERVAL '14 days';

-- ====================================
-- 5. UPDATE USER_SUBSCRIPTIONS TABLE
-- ====================================

-- Add necessary columns if they don't exist
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS subscription_level VARCHAR(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- ====================================
-- 6. CREATE HELPER FUNCTIONS
-- ====================================

-- Function to check trial status
CREATE OR REPLACE FUNCTION get_trial_status(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'has_trial', COUNT(*) > 0,
    'is_active', MAX(CASE WHEN is_active AND expires_at > NOW() THEN 1 ELSE 0 END) = 1,
    'days_remaining', GREATEST(0, EXTRACT(DAY FROM (expires_at - NOW()))),
    'started_at', MIN(started_at),
    'expires_at', MAX(expires_at)
  ) INTO v_result
  FROM user_trials
  WHERE user_id = p_user_id;
  
  RETURN v_result;
END;
$$;

-- Function to check if user can access premium features
CREATE OR REPLACE FUNCTION has_active_subscription_or_trial(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_trials 
    WHERE user_id = p_user_id 
      AND is_active = true 
      AND expires_at > NOW()
  ) OR EXISTS (
    SELECT 1 
    FROM user_subscriptions 
    WHERE user_id = p_user_id 
      AND is_active = true
      AND subscription_level != 'free'
  );
END;
$$;

-- ====================================
-- 7. GRANT PERMISSIONS
-- ====================================

GRANT SELECT, INSERT, UPDATE ON user_trials TO authenticated;
GRANT EXECUTE ON FUNCTION start_45_day_trial TO authenticated;
GRANT EXECUTE ON FUNCTION get_trial_status TO authenticated;
GRANT EXECUTE ON FUNCTION has_active_subscription_or_trial TO authenticated;

-- ====================================
-- 8. ADD HELPFUL COMMENTS
-- ====================================

COMMENT ON TABLE user_trials IS '45-day free trial tracking for new users';
COMMENT ON FUNCTION start_45_day_trial IS 'Starts a 45-day free trial for a user';
COMMENT ON FUNCTION auto_start_trial_on_signup IS 'Automatically starts 45-day trial when user signs up';
COMMENT ON FUNCTION get_trial_status IS 'Returns current trial status for a user';
COMMENT ON FUNCTION has_active_subscription_or_trial IS 'Checks if user has active subscription or trial';