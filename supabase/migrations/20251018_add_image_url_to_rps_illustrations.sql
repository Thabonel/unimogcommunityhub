-- Add image_url column to rps_illustrations table

ALTER TABLE rps_illustrations ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create index for image_url queries
CREATE INDEX IF NOT EXISTS idx_rps_illustrations_image_url 
ON rps_illustrations(image_url) 
WHERE image_url IS NOT NULL;

-- Add comment
COMMENT ON COLUMN rps_illustrations.image_url IS 'Public URL to the uploaded illustration image in Supabase Storage (rps_illustrations bucket)';
