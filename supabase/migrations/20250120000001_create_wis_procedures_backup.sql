-- Create backup table for WIS procedures before deduplication
-- This ensures we can rollback if anything goes wrong during consolidation

-- Create backup table with same structure as original
CREATE TABLE IF NOT EXISTS wis_procedures_backup AS
SELECT * FROM wis_procedures;

-- Add comment to document purpose
COMMENT ON TABLE wis_procedures_backup IS 'Backup of wis_procedures table created before deduplication consolidation process';

-- Create index on backup table for faster queries if needed
CREATE INDEX IF NOT EXISTS idx_wis_procedures_backup_title ON wis_procedures_backup(title);
CREATE INDEX IF NOT EXISTS idx_wis_procedures_backup_procedure_code ON wis_procedures_backup(procedure_code);

-- Grant necessary permissions
-- Note: This backup table should only be used for emergency rollback