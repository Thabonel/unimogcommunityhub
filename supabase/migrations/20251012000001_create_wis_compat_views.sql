-- Migration: WIS Compatibility Views
-- Creates read-only views for frontend compatibility
-- Idempotent - can be run multiple times safely

-- 1. wis_bulletins view - Maps wis_service_bulletins columns for UI compatibility
create or replace view public.wis_bulletins as
select
  id,
  bulletin_number,
  title,
  description,
  content,
  category,
  severity as severity_level,
  applicable_models as models_affected,
  effective_date as issue_date,
  pdf_url,
  status,
  supersedes_bulletin,
  created_at,
  created_at as updated_at
from public.wis_service_bulletins;

-- 2. wis_documents_unified view - Unified view of procedures and bulletins
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
grant select on public.wis_bulletins to authenticated;
grant select on public.wis_documents_unified to authenticated;

-- Add helpful comments
comment on view public.wis_bulletins is 'Compatibility view mapping wis_service_bulletins for frontend use';
comment on view public.wis_documents_unified is 'Unified view combining procedures and bulletins for search and display';
