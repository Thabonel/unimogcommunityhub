-- Migration: Fix wis_procedures schema for ETL compatibility
-- Adds source tracking columns and makes component_id nullable for ETL ingestion

-- Make component_id nullable to allow ETL to create procedures without requiring component assignment
alter table public.wis_procedures
  alter column component_id drop not null;

-- Add source tracking columns for ETL provenance
alter table public.wis_procedures
  add column if not exists source_path text;

alter table public.wis_procedures
  add column if not exists source_url text;

alter table public.wis_procedures
  add column if not exists source_fingerprint text;

-- Add unique constraint on source_fingerprint for idempotent ETL upserts
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'wis_procedures_source_fingerprint_key'
  ) then
    alter table public.wis_procedures
      add constraint wis_procedures_source_fingerprint_key unique (source_fingerprint);
  end if;
end $$;

-- Add index on source_fingerprint for performance
create index if not exists idx_wis_procedures_source_fingerprint
  on public.wis_procedures(source_fingerprint)
  where source_fingerprint is not null;

-- Add index on source_path for ETL tracking queries
create index if not exists idx_wis_procedures_source_path
  on public.wis_procedures(source_path)
  where source_path is not null;

-- Update existing unique constraint to handle nullable component_id
-- Drop old constraint and create new one that handles nulls
alter table public.wis_procedures
  drop constraint if exists wis_procedures_component_id_procedure_code_key;

-- Create new unique constraint that allows multiple NULL component_ids with same procedure_code
-- But enforces uniqueness when component_id is present
create unique index if not exists wis_procedures_component_procedure_unique
  on public.wis_procedures(component_id, procedure_code)
  where component_id is not null;

-- Add comments
comment on column public.wis_procedures.source_path is 'Local file path of the source document for ETL tracking';
comment on column public.wis_procedures.source_url is 'Public URL of the uploaded source document in storage';
comment on column public.wis_procedures.source_fingerprint is 'SHA-256 hash of source file for idempotent ETL upserts and change detection';
