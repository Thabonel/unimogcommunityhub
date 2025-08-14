-- Add processing_status column to manual_metadata table
-- This column tracks the processing state of manual uploads

ALTER TABLE manual_metadata 
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending' 
  CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'));

-- Add columns for tracking processing details
ALTER TABLE manual_metadata
ADD COLUMN IF NOT EXISTS chunk_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS processing_completed_at TIMESTAMPTZ;

-- Create index for processing status
CREATE INDEX IF NOT EXISTS idx_manual_metadata_processing_status 
  ON manual_metadata(processing_status);

-- Update existing rows to have completed status if they have been processed
UPDATE manual_metadata 
SET processing_status = 'completed',
    processing_completed_at = processed_at
WHERE processed_at IS NOT NULL 
  AND processing_status IS NULL;

-- Update chunk_count for existing processed manuals
UPDATE manual_metadata mm
SET chunk_count = (
  SELECT COUNT(*) 
  FROM manual_chunks mc 
  WHERE mc.manual_id = mm.id
)
WHERE mm.processing_status = 'completed' 
  AND mm.chunk_count = 0;