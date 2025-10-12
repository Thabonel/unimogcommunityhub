-- WIS Samples Table & RPC for Quality Gate Feature
-- Allows pausing ETL jobs to review random samples before continuing

-- Create wis_samples table
create table if not exists public.wis_samples (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.wis_ingest_jobs(id) on delete cascade,
  procedure_id uuid not null references public.wis_procedures(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'flagged')),
  review_notes text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_wis_samples_job_id on public.wis_samples(job_id);
create index if not exists idx_wis_samples_status on public.wis_samples(status);
create index if not exists idx_wis_samples_procedure_id on public.wis_samples(procedure_id);

-- RLS Policies
alter table public.wis_samples enable row level security;

create policy "Authenticated users can read samples"
  on public.wis_samples for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update samples"
  on public.wis_samples for update
  using (auth.role() = 'authenticated');

create policy "Service role has full access"
  on public.wis_samples for all
  using (auth.role() = 'service_role');

-- RPC: wis_create_samples
create or replace function public.wis_create_samples(
  p_count integer,
  p_model_code text default null,
  p_job_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sample record;
  v_samples jsonb := '[]'::jsonb;
  v_inserted_count integer := 0;
begin
  -- Validate input
  if p_count <= 0 or p_count > 100 then
    raise exception 'Sample count must be between 1 and 100';
  end if;

  -- Insert random samples
  for v_sample in
    select id from public.wis_procedures
    where (p_model_code is null or model_code = p_model_code)
    order by random()
    limit p_count
  loop
    insert into public.wis_samples (job_id, procedure_id, status)
    values (p_job_id, v_sample.id, 'pending')
    on conflict do nothing;

    v_inserted_count := v_inserted_count + 1;
  end loop;

  -- Return summary
  return jsonb_build_object(
    'samples_created', v_inserted_count,
    'job_id', p_job_id,
    'model_code', p_model_code
  );
end;
$$;
