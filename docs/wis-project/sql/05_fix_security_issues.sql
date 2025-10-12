-- Fix security issues from Supabase linter

-- Issue 1: Remove signup_health_check view (exposes auth.users to anon)
-- This view is for admin monitoring only, should not be publicly accessible
drop view if exists public.signup_health_check cascade;

create or replace view public.signup_health_check
with (security_invoker = true) as
select
  count(*) filter (where created_at > now() - interval '1 hour') as signups_last_hour,
  count(*) filter (where created_at > now() - interval '6 hours') as signups_last_6h,
  count(*) filter (where created_at > now() - interval '24 hours') as signups_last_24h,
  max(created_at) as last_signup_time,
  extract(epoch from now() - max(created_at)) / 3600 as hours_since_last_signup,
  case
    when max(created_at) is null then 'CRITICAL: NO SIGNUPS EVER'
    when extract(epoch from now() - max(created_at)) / 3600 > 12 then 'CRITICAL: No signups in 12+ hours'
    when extract(epoch from now() - max(created_at)) / 3600 > 6 then 'WARNING: No signups in 6+ hours'
    when extract(epoch from now() - max(created_at)) / 3600 > 2 then 'NOTICE: No signups in 2+ hours'
    else 'OK: Recent signup activity'
  end as health_status
from auth.users;

revoke all on public.signup_health_check from anon;
revoke all on public.signup_health_check from authenticated;
grant select on public.signup_health_check to service_role;

-- Issue 2: Recreate WIS views with security_invoker = true

drop view if exists public.v_wis_active_jobs cascade;

create or replace view public.v_wis_active_jobs
with (security_invoker = true) as
select
  j.id,
  j.job_type,
  j.status,
  j.progress_pct,
  j.started_at,
  j.updated_at,
  p.model_code,
  p.system_code,
  p.source_type,
  p.category
from public.wis_ingest_jobs j
join public.wis_ingestion_plan_items p on p.id = j.plan_item_id
where j.status in ('pending', 'running', 'paused')
order by j.started_at desc nulls last, j.created_at desc;

grant select on public.v_wis_active_jobs to authenticated;

drop view if exists public.wis_documents_unified cascade;

create or replace view public.wis_documents_unified
with (security_invoker = true) as
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

grant select on public.wis_documents_unified to authenticated;
