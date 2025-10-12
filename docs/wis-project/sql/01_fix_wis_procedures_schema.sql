-- Step 1: Fix wis_procedures schema for ETL compatibility

alter table public.wis_procedures
  alter column component_id drop not null;

alter table public.wis_procedures
  add column if not exists source_path text;

alter table public.wis_procedures
  add column if not exists source_url text;

alter table public.wis_procedures
  add column if not exists source_fingerprint text;

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

create index if not exists idx_wis_procedures_source_fingerprint
  on public.wis_procedures(source_fingerprint)
  where source_fingerprint is not null;

create index if not exists idx_wis_procedures_source_path
  on public.wis_procedures(source_path)
  where source_path is not null;

alter table public.wis_procedures
  drop constraint if exists wis_procedures_component_id_procedure_code_key;

create unique index if not exists wis_procedures_component_procedure_unique
  on public.wis_procedures(component_id, procedure_code)
  where component_id is not null;
