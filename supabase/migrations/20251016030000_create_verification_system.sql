-- Unimog Ownership Verification System
-- Creates verification table, storage bucket, and access controls

-- 1. Create verifications table
CREATE TABLE IF NOT EXISTS verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  vehicle_model text NOT NULL,
  vehicle_year integer,
  vehicle_location text,
  vehicle_story text,
  admin_reviewed_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Add verification columns to user_subscriptions
ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_status_created ON verifications(status, created_at DESC);

-- 4. Enable RLS on verifications table
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for verifications table

-- Users can view their own verification
CREATE POLICY "Users can view own verification"
  ON verifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own verification (only if they don't have one already)
CREATE POLICY "Users can create own verification"
  ON verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM verifications WHERE user_id = auth.uid()
    )
  );

-- Users can update their own verification only if status is 'pending' or 'rejected'
CREATE POLICY "Users can update pending/rejected verification"
  ON verifications
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND status IN ('pending', 'rejected')
  )
  WITH CHECK (
    auth.uid() = user_id
    AND status IN ('pending', 'rejected')
  );

-- Admins can view all verifications
CREATE POLICY "Admins can view all verifications"
  ON verifications
  FOR SELECT
  TO authenticated
  USING (check_admin_access());

-- Admins can update any verification
CREATE POLICY "Admins can update verifications"
  ON verifications
  FOR UPDATE
  TO authenticated
  USING (check_admin_access())
  WITH CHECK (check_admin_access());

-- 6. Create storage bucket for verification photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('verifications', 'verifications', false)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage bucket policies for verifications

-- Users can upload to their own folder
CREATE POLICY "Users can upload verification photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'verifications'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can view their own verification photos
CREATE POLICY "Users can view own verification photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'verifications'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can view all verification photos
CREATE POLICY "Admins can view all verification photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'verifications'
    AND check_admin_access()
  );

-- Users can delete their own verification photos (for re-upload)
CREATE POLICY "Users can delete own verification photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'verifications'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 8. Function to sync verification status to user_subscriptions
CREATE OR REPLACE FUNCTION sync_verification_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- When verification is approved, update user_subscriptions
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    UPDATE user_subscriptions
    SET
      is_verified = true,
      verified_at = NEW.approved_at
    WHERE user_id = NEW.user_id;
  END IF;

  -- When verification is rejected or revoked, remove verified status
  IF NEW.status IN ('rejected', 'pending') AND OLD.status = 'approved' THEN
    UPDATE user_subscriptions
    SET
      is_verified = false,
      verified_at = NULL
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

-- 9. Create trigger to auto-sync verification status
CREATE TRIGGER sync_verification_status_trigger
  AFTER INSERT OR UPDATE ON verifications
  FOR EACH ROW
  EXECUTE FUNCTION sync_verification_status();

-- 10. Function to get verification stats (for admin dashboard)
CREATE OR REPLACE FUNCTION get_verification_stats()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT jsonb_build_object(
    'pending', (SELECT COUNT(*) FROM verifications WHERE status = 'pending'),
    'approved', (SELECT COUNT(*) FROM verifications WHERE status = 'approved'),
    'rejected', (SELECT COUNT(*) FROM verifications WHERE status = 'rejected'),
    'total', (SELECT COUNT(*) FROM verifications)
  );
$$;
