-- Increase code column lengths for WIS tables to accommodate generated codes

-- Step 1: Drop view that depends on these columns
DROP VIEW IF EXISTS wis_documents_unified;

-- Step 2: Drop generated column that depends on procedure_code
ALTER TABLE wis_procedures
  DROP COLUMN IF EXISTS search_vector;

-- Step 3: Alter column types
ALTER TABLE wis_systems
  ALTER COLUMN system_code TYPE varchar(20);

ALTER TABLE wis_components
  ALTER COLUMN component_code TYPE varchar(30);

ALTER TABLE wis_procedures
  ALTER COLUMN procedure_code TYPE varchar(50);

-- Step 4: Recreate search_vector as generated column
ALTER TABLE wis_procedures
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      procedure_code || ' ' ||
      title || ' ' ||
      COALESCE(description, '') || ' ' ||
      COALESCE(overview, '')
    )
  ) STORED;

-- Step 5: Recreate index on search_vector
CREATE INDEX IF NOT EXISTS idx_wis_procedures_search
  ON wis_procedures USING gin(search_vector);

-- Step 6: Recreate wis_documents_unified view
CREATE VIEW wis_documents_unified AS
SELECT
  p.id,
  'procedure'::text AS document_type,
  p.procedure_code AS code,
  p.title,
  p.description,
  p.overview AS content,
  p.status,
  p.difficulty_level,
  p.estimated_time_hours,
  NULL::text AS category,
  NULL::text AS severity_level,
  NULL::text[] AS models_affected,
  p.created_at,
  p.updated_at
FROM wis_procedures p
WHERE p.status = 'active'
UNION ALL
SELECT
  b.id,
  'bulletin'::text AS document_type,
  b.bulletin_number AS code,
  b.title,
  b.description,
  b.content,
  b.status,
  NULL::integer AS difficulty_level,
  NULL::numeric(4,2) AS estimated_time_hours,
  b.category,
  b.severity AS severity_level,
  b.applicable_models AS models_affected,
  b.created_at,
  b.created_at AS updated_at
FROM wis_service_bulletins b
WHERE b.status = 'active';
