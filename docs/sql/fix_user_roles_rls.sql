-- Fix missing RLS policies on user_roles table
-- Issue: CRITICAL - Privilege escalation vulnerability
-- Risk: Any user could potentially grant themselves admin privileges
-- Priority: MUST FIX BEFORE LAUNCH

-- Enable Row Level Security on user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own role
-- This allows users to check their own role status
CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Only admins can insert roles
-- Prevents regular users from granting themselves roles
CREATE POLICY "Only admins can insert roles"
  ON user_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Policy 3: Only admins can update roles
-- Prevents users from modifying their own or others' roles
CREATE POLICY "Only admins can update roles"
  ON user_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Policy 4: Only admins can delete roles
-- Prevents users from removing role restrictions
CREATE POLICY "Only admins can delete roles"
  ON user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Add helpful comment
COMMENT ON TABLE user_roles IS 'User role assignments with RLS protection. Only admins can modify roles.';

-- Verify RLS is enabled
DO $$
BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'user_roles') THEN
    RAISE EXCEPTION 'RLS is not enabled on user_roles table!';
  END IF;
  RAISE NOTICE 'RLS successfully enabled on user_roles table';
END $$;