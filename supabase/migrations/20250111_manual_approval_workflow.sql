-- Create manual approval workflow
-- This allows admins to review user-uploaded manuals before they're processed

-- Add approval status to manual_metadata
ALTER TABLE manual_metadata 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create index for approval status
CREATE INDEX IF NOT EXISTS idx_manual_metadata_approval_status ON manual_metadata(approval_status);

-- Create table for pending manual uploads (before processing)
CREATE TABLE IF NOT EXISTS pending_manual_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  model_codes TEXT[] DEFAULT '{}',
  year_range TEXT,
  file_size BIGINT,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for pending uploads
CREATE INDEX idx_pending_uploads_status ON pending_manual_uploads(approval_status);
CREATE INDEX idx_pending_uploads_uploaded_by ON pending_manual_uploads(uploaded_by);
CREATE INDEX idx_pending_uploads_created_at ON pending_manual_uploads(created_at);

-- RLS policies for pending uploads
ALTER TABLE pending_manual_uploads ENABLE ROW LEVEL SECURITY;

-- Users can view their own pending uploads
CREATE POLICY "Users can view their own pending uploads"
  ON pending_manual_uploads FOR SELECT
  USING (auth.uid() = uploaded_by);

-- Users can insert their own uploads
CREATE POLICY "Users can create pending uploads"
  ON pending_manual_uploads FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Admins can view all pending uploads
CREATE POLICY "Admins can view all pending uploads"
  ON pending_manual_uploads FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update pending uploads (approve/reject)
CREATE POLICY "Admins can update pending uploads"
  ON pending_manual_uploads FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Update manual_metadata RLS to only show approved manuals to non-admins
DROP POLICY IF EXISTS "Authenticated users can read manual metadata" ON manual_metadata;
CREATE POLICY "Authenticated users can read approved manual metadata"
  ON manual_metadata FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      approval_status = 'approved' OR
      -- Admins can see all
      auth.uid() IN (
        SELECT id FROM auth.users 
        WHERE raw_user_meta_data->>'role' = 'admin'
      ) OR
      EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Update manual_chunks RLS to only show chunks from approved manuals
DROP POLICY IF EXISTS "Authenticated users can read manual chunks" ON manual_chunks;
CREATE POLICY "Authenticated users can read approved manual chunks"
  ON manual_chunks FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM manual_metadata mm 
      WHERE mm.id = manual_chunks.manual_id 
      AND (
        mm.approval_status = 'approved' OR
        -- Admins can see all
        auth.uid() IN (
          SELECT id FROM auth.users 
          WHERE raw_user_meta_data->>'role' = 'admin'
        ) OR
        EXISTS (
          SELECT 1 FROM user_roles 
          WHERE user_id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

-- Function to approve a manual and trigger processing
CREATE OR REPLACE FUNCTION approve_manual_for_processing(
  pending_upload_id UUID,
  admin_user_id UUID DEFAULT auth.uid()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  upload_record pending_manual_uploads;
  new_manual_id UUID;
BEGIN
  -- Check if user is admin
  IF NOT (
    admin_user_id IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = admin_user_id AND role = 'admin'
    )
  ) THEN
    RAISE EXCEPTION 'Only admins can approve manuals';
  END IF;
  
  -- Get the pending upload
  SELECT * INTO upload_record
  FROM pending_manual_uploads
  WHERE id = pending_upload_id AND approval_status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending upload not found or already processed';
  END IF;
  
  -- Create manual metadata record
  INSERT INTO manual_metadata (
    filename,
    title,
    model_codes,
    year_range,
    category,
    page_count,
    file_size,
    uploaded_by,
    approval_status,
    approved_by,
    approved_at,
    processed_at
  ) VALUES (
    upload_record.filename,
    upload_record.title,
    upload_record.model_codes,
    upload_record.year_range,
    upload_record.category,
    0, -- Will be updated after processing
    upload_record.file_size,
    upload_record.uploaded_by,
    'approved',
    admin_user_id,
    NOW(),
    NULL -- Will be set after processing
  ) RETURNING id INTO new_manual_id;
  
  -- Update pending upload status
  UPDATE pending_manual_uploads
  SET 
    approval_status = 'approved',
    approved_by = admin_user_id,
    approved_at = NOW(),
    updated_at = NOW()
  WHERE id = pending_upload_id;
  
  RETURN new_manual_id;
END;
$$;

-- Function to reject a manual
CREATE OR REPLACE FUNCTION reject_manual_upload(
  pending_upload_id UUID,
  reason TEXT DEFAULT NULL,
  admin_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT (
    admin_user_id IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = admin_user_id AND role = 'admin'
    )
  ) THEN
    RAISE EXCEPTION 'Only admins can reject manuals';
  END IF;
  
  -- Update pending upload status
  UPDATE pending_manual_uploads
  SET 
    approval_status = 'rejected',
    approved_by = admin_user_id,
    approved_at = NOW(),
    rejection_reason = reason,
    updated_at = NOW()
  WHERE id = pending_upload_id AND approval_status = 'pending';
  
  RETURN FOUND;
END;
$$;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_pending_uploads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pending_uploads_updated_at
  BEFORE UPDATE ON pending_manual_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_pending_uploads_updated_at();