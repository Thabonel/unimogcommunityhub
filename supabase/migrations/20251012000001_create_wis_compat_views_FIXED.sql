-- Migration: WIS Compatibility Views (FIXED)
-- Creates read-only views for frontend compatibility
-- Idempotent - can be run multiple times safely

-- NOTE: wis_bulletins already exists as a TABLE (125 records)
-- We do NOT create a view for it - the table serves as the primary data source

-- wis_documents_unified view - Unified view of procedures and bulletins
create or replace view public.wis_documents_unified as
select
  p.id,
  'procedure' as document_type,
  p.procedure_code as code,
  p.title,
  p.description,
  p.overview as content,
  p.status,
  p.difficulty_level,
  p.estimated_time_hours,
  null::text as category,
  null::text as severity_level,
  null::text[] as models_affected,
  p.created_at,
  p.updated_at
from public.wis_procedures p
where p.status = 'active'

union all

select
  b.id,
  'bulletin' as document_type,
  b.bulletin_number as code,
  b.title,
  b.description,
  b.content,
  b.status,
  null::integer as difficulty_level,
  null::decimal(4,2) as estimated_time_hours,
  b.category,
  b.severity as severity_level,
  b.applicable_models as models_affected,
  b.created_at,
  b.created_at as updated_at
from public.wis_service_bulletins b
where b.status = 'active';

-- Grant select permissions to authenticated users
grant select on public.wis_documents_unified to authenticated;

-- Add helpful comment
comment on view public.wis_documents_unified is 'Unified view combining procedures and bulletins for search and display';
