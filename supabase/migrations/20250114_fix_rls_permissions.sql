-- Fix RLS policies to use has_role function instead of directly querying auth.users

-- Drop existing policies that cause permission errors
DROP POLICY IF EXISTS "Admins can view all pending uploads" ON pending_manual_uploads;
DROP POLICY IF EXISTS "Admins can update pending uploads" ON pending_manual_uploads;
DROP POLICY IF EXISTS "Admins can manage processing errors" ON processing_errors;
DROP POLICY IF EXISTS "Admins can manage processing queue" ON manual_processing_queue;
DROP POLICY IF EXISTS "Admins can view all manual metadata" ON manual_metadata;
DROP POLICY IF EXISTS "Admins can manage manual metadata" ON manual_metadata;
DROP POLICY IF EXISTS "Admins can delete manual metadata" ON manual_metadata;

-- Recreate policies using has_role function
CREATE POLICY "Admins can view all pending uploads"
  ON pending_manual_uploads FOR SELECT
  USING (public.has_role('admin'));

CREATE POLICY "Admins can update pending uploads" 
  ON pending_manual_uploads FOR UPDATE
  USING (public.has_role('admin'));

CREATE POLICY "Admins can manage processing errors"
  ON processing_errors FOR ALL
  USING (public.has_role('admin'));

CREATE POLICY "Admins can manage processing queue"
  ON manual_processing_queue FOR ALL
  USING (public.has_role('admin'));

CREATE POLICY "Admins can view all manual metadata"
  ON manual_metadata FOR SELECT
  USING (
    -- Allow public read for approved manuals
    approval_status = 'approved' 
    OR 
    -- Allow admins to see all
    public.has_role('admin')
    OR
    -- Allow users to see their own uploads
    uploaded_by = auth.uid()
  );

CREATE POLICY "Admins can manage manual metadata"
  ON manual_metadata FOR ALL
  USING (public.has_role('admin'));

-- Also fix the manual_chunks policies if they exist
DROP POLICY IF EXISTS "Admins can manage manual chunks" ON manual_chunks;

CREATE POLICY "Admins can manage manual chunks"
  ON manual_chunks FOR ALL
  USING (public.has_role('admin'));

-- Allow public read access to manual chunks for approved manuals
CREATE POLICY "Public can read approved manual chunks"
  ON manual_chunks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM manual_metadata 
      WHERE manual_metadata.id = manual_chunks.manual_id 
      AND manual_metadata.approval_status = 'approved'
    )
  );