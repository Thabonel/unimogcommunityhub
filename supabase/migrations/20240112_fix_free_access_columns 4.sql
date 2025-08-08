-- Add free access columns to profiles table
-- This allows admins to grant free lifetime access to specific users

-- First, add any missing columns that we need
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_free_access BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(50) DEFAULT 'free_trial',
ADD COLUMN IF NOT EXISTS granted_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS granted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_has_free_access ON profiles(has_free_access);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_type ON profiles(subscription_type);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Grant free lifetime access and admin status to the site owner (you)
UPDATE profiles 
SET 
  has_free_access = true,
  subscription_type = 'lifetime_free',
  is_admin = true,
  role = 'admin',
  granted_at = NOW()
WHERE email = 'thabonel0@gmail.com';

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_user_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND (is_admin = true OR email = 'thabonel0@gmail.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to grant free access (for admin use)
CREATE OR REPLACE FUNCTION grant_free_access(target_user_id UUID, granting_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if granting user is admin
  IF is_user_admin(granting_user_id) THEN
    -- Grant free access
    UPDATE profiles 
    SET 
      has_free_access = true,
      subscription_type = 'lifetime_free',
      granted_by = granting_user_id,
      granted_at = NOW()
    WHERE id = target_user_id;
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to revoke free access (for admin use)
CREATE OR REPLACE FUNCTION revoke_free_access(target_user_id UUID, revoking_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if revoking user is admin
  IF is_user_admin(revoking_user_id) THEN
    -- Revoke free access
    UPDATE profiles 
    SET 
      has_free_access = false,
      subscription_type = 'free_trial',
      granted_by = NULL,
      granted_at = NULL
    WHERE id = target_user_id;
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to make someone an admin
CREATE OR REPLACE FUNCTION make_admin(target_user_id UUID, granting_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Only the owner can make other admins
  IF EXISTS (SELECT 1 FROM profiles WHERE id = granting_user_id AND email = 'thabonel0@gmail.com') THEN
    UPDATE profiles 
    SET 
      is_admin = true,
      role = 'admin',
      has_free_access = true,
      subscription_type = 'lifetime_free'
    WHERE id = target_user_id;
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- List all users with free access or admin status
CREATE OR REPLACE VIEW free_access_users AS
SELECT 
  id,
  email,
  full_name,
  is_admin,
  has_free_access,
  subscription_type,
  granted_at,
  granted_by
FROM profiles
WHERE has_free_access = true OR is_admin = true
ORDER BY is_admin DESC, granted_at DESC;

-- Return success and show current admin/free users
SELECT 
  'Free access system configured successfully!' as status,
  COUNT(*) as free_users_count
FROM profiles 
WHERE has_free_access = true OR is_admin = true;