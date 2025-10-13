-- Clear fake WIS data to prepare for ETL processor
-- Temporarily disable RLS to allow deletion, then re-enable

-- Disable RLS temporarily
ALTER TABLE wis_procedures DISABLE ROW LEVEL SECURITY;
ALTER TABLE wis_components DISABLE ROW LEVEL SECURITY;
ALTER TABLE wis_systems DISABLE ROW LEVEL SECURITY;
ALTER TABLE wis_models DISABLE ROW LEVEL SECURITY;

-- Delete all data (cascade handles dependencies)
TRUNCATE TABLE wis_procedures CASCADE;
TRUNCATE TABLE wis_components CASCADE;
TRUNCATE TABLE wis_systems CASCADE;
TRUNCATE TABLE wis_models CASCADE;

-- Re-enable RLS
ALTER TABLE wis_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_models ENABLE ROW LEVEL SECURITY;

-- Verify deletion
SELECT
  (SELECT COUNT(*) FROM wis_procedures) as procedures_remaining,
  (SELECT COUNT(*) FROM wis_components) as components_remaining,
  (SELECT COUNT(*) FROM wis_systems) as systems_remaining,
  (SELECT COUNT(*) FROM wis_models) as models_remaining;
