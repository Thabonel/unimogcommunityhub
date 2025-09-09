-- Add free access columns to profiles table
-- This allows admins to grant free lifetime access to specific users

-- Add columns for free access management
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_free_access BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(50) DEFAULT 'free_trial',
ADD COLUMN IF NOT EXISTS granted_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS granted_at TIMESTAMP WITH TIME ZONE;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_has_free_access ON profiles(has_free_access);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_type ON profiles(subscription_type);

-- Grant free lifetime access to the site owner (you)
UPDATE profiles 
SET 
  has_free_access = true,
  subscription_type = 'lifetime_free',
  granted_at = NOW()
WHERE email = 'thabonel0@gmail.com';

-- Also ensure admin status for the owner
UPDATE profiles
SET 
  is_admin = true,
  role = 'admin'
WHERE email = 'thabonel0@gmail.com';

-- Create a function to grant free access (for admin use)
CREATE OR REPLACE FUNCTION grant_free_access(target_user_id UUID, granting_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if granting user is admin
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = granting_user_id 
    AND (is_admin = true OR email = 'thabonel0@gmail.com')
  ) THEN
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
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = revoking_user_id 
    AND (is_admin = true OR email = 'thabonel0@gmail.com')
  ) THEN
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

-- Return success
SELECT 'Free access system configured successfully!' as message;