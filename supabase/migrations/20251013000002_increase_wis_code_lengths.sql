-- Increase code column lengths for WIS tables to accommodate generated codes

-- wis_systems: Increase system_code from 10 to 20 chars
-- Generated codes like "TRANS_U1700L" need at least 12 chars
ALTER TABLE wis_systems
  ALTER COLUMN system_code TYPE varchar(20);

-- wis_components: Increase component_code from 10 to 30 chars
-- Generated codes like "ENG_U400_BLOCK" need at least 14 chars
ALTER TABLE wis_components
  ALTER COLUMN component_code TYPE varchar(30);

-- wis_procedures: Increase procedure_code from 20 to 50 chars for safety
-- Generated codes like "ENG_U400_BLOCK_INSP" need at least 19 chars
ALTER TABLE wis_procedures
  ALTER COLUMN procedure_code TYPE varchar(50);
