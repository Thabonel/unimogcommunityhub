-- Add hierarchical manual organization support
-- This enables grouping related manual sections under a parent manual

-- Add new columns for hierarchical organization
ALTER TABLE manual_chunks ADD COLUMN IF NOT EXISTS parent_manual_title TEXT;
ALTER TABLE manual_chunks ADD COLUMN IF NOT EXISTS section_number INTEGER;
ALTER TABLE manual_chunks ADD COLUMN IF NOT EXISTS subsection_title TEXT;

-- Create indexes for efficient hierarchical queries
CREATE INDEX IF NOT EXISTS idx_manual_chunks_parent ON manual_chunks(parent_manual_title);
CREATE INDEX IF NOT EXISTS idx_manual_chunks_section ON manual_chunks(parent_manual_title, section_number);

-- Add comments for documentation
COMMENT ON COLUMN manual_chunks.parent_manual_title IS 'Groups related manual sections under a parent manual (e.g., "Unimog 435 Maintenance Manual")';
COMMENT ON COLUMN manual_chunks.section_number IS 'Sequential section number within the parent manual for ordering';
COMMENT ON COLUMN manual_chunks.subsection_title IS 'Human-readable section title (e.g., "Engine Housing", "Brakes - Hydraulic")';