-- Migration: WIS Plan/Operations Tables and Admin RPCs
-- Creates ETL job tracking infrastructure with restart-safe design
-- Idempotent - can be run multiple times safely

-- =============================================================================
-- TABLES: ETL Plan and Job Tracking
-- =============================================================================

-- 1. wis_plan_items - ETL plan items (what to ingest)
create table if not exists public.wis_plan_items (
  id uuid primary key default gen_random_uuid(),
  model_code text not null,                    -- 'U435', 'U400'
  system_code text,                             -- '01', '25' (nullable for model-wide items)
  component_code text,                          -- '10', '20' (nullable)
  source_type text not null,                    -- 'manual_pdf', 'bulletin_pdf', 'parts_csv'
  source_path text not null,                    -- Storage path: 'wis-docs/model/U435/procedures/25.20.02-abc123.pdf'
  source_fingerprint text,                      -- SHA-256 hash for idempotency
  priority integer default 50,                  -- Higher = more important
  metadata jsonb default '{}'::jsonb,           -- Flexible metadata storage
  status text default 'pending',                -- 'pending', 'in_progress', 'completed', 'failed'
  error_message text,                           -- Last error if failed
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(source_path, source_fingerprint)
);

-- 2. wis_plan_releases - Snapshots of ETL plans for versioning
create table if not exists public.wis_plan_releases (
  id uuid primary key default gen_random_uuid(),
  release_name text not null unique,            -- 'u435-initial', 'u400-update-2025-01'
  description text,
  plan_items jsonb not null,                    -- Snapshot of plan items
  created_at timestamptz default now()
);

-- 3. wis_ingest_jobs - ETL job execution tracking
create table if not exists public.wis_ingest_jobs (
  id uuid primary key default gen_random_uuid(),
  plan_item_id uuid references public.wis_plan_items(id) on delete set null,
  job_type text not null,                       -- 'extract', 'transform', 'load', 'full_etl'
  status text default 'pending',                -- 'pending', 'running', 'paused', 'completed', 'failed'
  progress_pct integer default 0,               -- 0-100
  checkpoint_state jsonb,                       -- For restart: {"last_page": 45, "chunks_processed": 120}
  result_summary jsonb,                         -- Stats: {"chunks_created": 150, "embeddings_generated": 150}
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. wis_ingest_errors - Detailed error log for debugging
create table if not exists public.wis_ingest_errors (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.wis_ingest_jobs(id) on delete cascade,
  error_type text not null,                     -- 'validation', 'extraction', 'embedding', 'db_insert'
  error_code text,                              -- Custom error codes
  error_message text not null,
  error_context jsonb,                          -- {"page": 12, "chunk_index": 45, "stack_trace": "..."}
  severity text default 'error',                -- 'warning', 'error', 'critical'
  created_at timestamptz default now()
);

-- 5. wis_etl_logs - General ETL execution logs
create table if not exists public.wis_etl_logs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.wis_ingest_jobs(id) on delete set null,
  log_level text not null,                      -- 'debug', 'info', 'warn', 'error'
  message text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- 6. wis_schema_versions - Track schema evolution
create table if not exists public.wis_schema_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,                 -- 'v1.0', 'v1.1'
  description text,
  migration_sql text,                           -- SQL applied in this version
  applied_at timestamptz default now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

create index if not exists idx_wis_plan_items_status on public.wis_plan_items(status);
create index if not exists idx_wis_plan_items_model on public.wis_plan_items(model_code);
create index if not exists idx_wis_plan_items_fingerprint on public.wis_plan_items(source_fingerprint);

create index if not exists idx_wis_ingest_jobs_status on public.wis_ingest_jobs(status);
create index if not exists idx_wis_ingest_jobs_created on public.wis_ingest_jobs(created_at desc);
create index if not exists idx_wis_ingest_jobs_plan_item on public.wis_ingest_jobs(plan_item_id);

create index if not exists idx_wis_ingest_errors_job on public.wis_ingest_errors(job_id);
create index if not exists idx_wis_ingest_errors_severity on public.wis_ingest_errors(severity);

create index if not exists idx_wis_etl_logs_job on public.wis_etl_logs(job_id);
create index if not exists idx_wis_etl_logs_created on public.wis_etl_logs(created_at desc);

-- =============================================================================
-- VIEW: Active Jobs
-- =============================================================================

create or replace view public.v_wis_active_jobs as
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
  p.source_path,
  (select count(*) from wis_ingest_errors where job_id = j.id) as error_count
from public.wis_ingest_jobs j
left join public.wis_plan_items p on j.plan_item_id = p.id
where j.status in ('pending', 'running', 'paused')
order by j.created_at desc;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.wis_plan_items enable row level security;
alter table public.wis_plan_releases enable row level security;
alter table public.wis_ingest_jobs enable row level security;
alter table public.wis_ingest_errors enable row level security;
alter table public.wis_etl_logs enable row level security;
alter table public.wis_schema_versions enable row level security;

-- Authenticated users: read-only
do $$
begin
  create policy "Authenticated users can read plan items" on public.wis_plan_items
    for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated users can read plan releases" on public.wis_plan_releases
    for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated users can read ingest jobs" on public.wis_ingest_jobs
    for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated users can read ingest errors" on public.wis_ingest_errors
    for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated users can read ETL logs" on public.wis_etl_logs
    for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated users can read schema versions" on public.wis_schema_versions
    for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

-- Service role: full access (implicitly granted by RLS bypass)

-- =============================================================================
-- ADMIN RPCs (SECURITY DEFINER for service role operations)
-- =============================================================================

-- RPC 1: Upsert plan item (idempotent by source_fingerprint)
create or replace function public.wis_upsert_plan_item(
  p_model_code text,
  p_system_code text,
  p_component_code text,
  p_source_type text,
  p_source_path text,
  p_source_fingerprint text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_item_id uuid;
begin
  insert into public.wis_plan_items (
    model_code,
    system_code,
    component_code,
    source_type,
    source_path,
    source_fingerprint,
    metadata,
    status
  ) values (
    p_model_code,
    p_system_code,
    p_component_code,
    p_source_type,
    p_source_path,
    p_source_fingerprint,
    p_metadata,
    'pending'
  )
  on conflict (source_path, source_fingerprint)
  do update set
    metadata = excluded.metadata,
    updated_at = now()
  returning id into v_item_id;

  return v_item_id;
end;
$$;

-- RPC 2: Create plan release snapshot
create or replace function public.wis_create_plan_release(
  p_release_name text,
  p_description text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_release_id uuid;
  v_plan_snapshot jsonb;
begin
  -- Snapshot current plan items
  select jsonb_agg(row_to_json(p))
  into v_plan_snapshot
  from public.wis_plan_items p;

  insert into public.wis_plan_releases (
    release_name,
    description,
    plan_items
  ) values (
    p_release_name,
    p_description,
    v_plan_snapshot
  )
  on conflict (release_name)
  do update set
    description = excluded.description,
    plan_items = excluded.plan_items
  returning id into v_release_id;

  return v_release_id;
end;
$$;

-- RPC 3: Start ingest job
create or replace function public.wis_start_ingest_job(
  p_plan_item_id uuid,
  p_job_type text
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_job_id uuid;
begin
  insert into public.wis_ingest_jobs (
    plan_item_id,
    job_type,
    status,
    started_at
  ) values (
    p_plan_item_id,
    p_job_type,
    'running',
    now()
  )
  returning id into v_job_id;

  -- Update plan item status
  update public.wis_plan_items
  set status = 'in_progress', updated_at = now()
  where id = p_plan_item_id;

  return v_job_id;
end;
$$;

-- RPC 4: Update ingest job (for progress/pause/resume)
create or replace function public.wis_update_ingest_job(
  p_job_id uuid,
  p_status text default null,
  p_progress_pct integer default null,
  p_checkpoint_state jsonb default null,
  p_result_summary jsonb default null,
  p_error_message text default null
)
returns void
language plpgsql
security definer
as $$
begin
  update public.wis_ingest_jobs
  set
    status = coalesce(p_status, status),
    progress_pct = coalesce(p_progress_pct, progress_pct),
    checkpoint_state = coalesce(p_checkpoint_state, checkpoint_state),
    result_summary = coalesce(p_result_summary, result_summary),
    error_message = coalesce(p_error_message, error_message),
    completed_at = case when p_status in ('completed', 'failed') then now() else completed_at end,
    updated_at = now()
  where id = p_job_id;

  -- Update plan item status based on job status
  if p_status = 'completed' then
    update public.wis_plan_items p
    set status = 'completed', updated_at = now()
    from public.wis_ingest_jobs j
    where j.id = p_job_id and p.id = j.plan_item_id;
  elsif p_status = 'failed' then
    update public.wis_plan_items p
    set status = 'failed', error_message = p_error_message, updated_at = now()
    from public.wis_ingest_jobs j
    where j.id = p_job_id and p.id = j.plan_item_id;
  end if;
end;
$$;

-- RPC 5: Record ingest error
create or replace function public.wis_record_ingest_error(
  p_job_id uuid,
  p_error_type text,
  p_error_code text,
  p_error_message text,
  p_error_context jsonb default '{}'::jsonb,
  p_severity text default 'error'
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_error_id uuid;
begin
  insert into public.wis_ingest_errors (
    job_id,
    error_type,
    error_code,
    error_message,
    error_context,
    severity
  ) values (
    p_job_id,
    p_error_type,
    p_error_code,
    p_error_message,
    p_error_context,
    p_severity
  )
  returning id into v_error_id;

  return v_error_id;
end;
$$;

-- =============================================================================
-- GRANTS
-- =============================================================================

grant select on public.v_wis_active_jobs to authenticated;

grant execute on function public.wis_upsert_plan_item to service_role;
grant execute on function public.wis_create_plan_release to service_role;
grant execute on function public.wis_start_ingest_job to service_role;
grant execute on function public.wis_update_ingest_job to service_role;
grant execute on function public.wis_record_ingest_error to service_role;

-- =============================================================================
-- COMMENTS
-- =============================================================================

comment on table public.wis_plan_items is 'ETL plan items - what to ingest into WIS';
comment on table public.wis_plan_releases is 'Snapshots of ETL plans for versioning';
comment on table public.wis_ingest_jobs is 'ETL job execution tracking with restart capability';
comment on table public.wis_ingest_errors is 'Detailed error log for ETL debugging';
comment on table public.wis_etl_logs is 'General ETL execution logs';
comment on table public.wis_schema_versions is 'Track WIS schema evolution';
comment on view public.v_wis_active_jobs is 'Active ETL jobs (pending/running/paused)';
