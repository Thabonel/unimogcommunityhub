-- Add missing columns to wis_procedures table
-- Run this FIRST before applying the U1700L fix

-- Check which columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'wis_procedures' 
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
ALTER TABLE wis_procedures 
ADD COLUMN IF NOT EXISTS parts_required TEXT[],
ADD COLUMN IF NOT EXISTS safety_warnings TEXT[],
ADD COLUMN IF NOT EXISTS steps JSONB,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Verify columns were added
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'wis_procedures' 
ORDER BY ordinal_position;