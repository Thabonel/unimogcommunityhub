-- Add missing columns to WIS tables for import

-- Add is_published column to wis_procedures if it doesn't exist
ALTER TABLE wis_procedures 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_wis_procedures_published 
ON wis_procedures(is_published) 
WHERE is_published = true;

-- Add any other potentially missing columns
ALTER TABLE wis_procedures
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add similar columns to parts and bulletins
ALTER TABLE wis_parts
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE wis_bulletins
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wis_parts_published 
ON wis_parts(is_published) 
WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_wis_bulletins_published 
ON wis_bulletins(is_published) 
WHERE is_published = true;