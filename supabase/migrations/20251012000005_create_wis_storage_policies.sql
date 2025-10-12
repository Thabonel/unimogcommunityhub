-- Migration: Create RLS policies for WIS storage buckets
-- Prerequisite: Buckets must exist (created via script or Dashboard)

-- =============================================================================
-- wis-docs bucket policies
-- =============================================================================

-- Policy: Public read access
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'wis-docs public read'
  ) then
    create policy "wis-docs public read"
      on storage.objects for select
      using (bucket_id = 'wis-docs');
  end if;
end $$;

-- Policy: Authenticated users can upload
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'wis-docs authenticated write'
  ) then
    create policy "wis-docs authenticated write"
      on storage.objects for insert
      with check (
        bucket_id = 'wis-docs'
        and auth.role() = 'authenticated'
      );
  end if;
end $$;

-- Policy: Service role full access
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'wis-docs service role access'
  ) then
    create policy "wis-docs service role access"
      on storage.objects for all
      using (
        bucket_id = 'wis-docs'
        and auth.role() = 'service_role'
      );
  end if;
end $$;

-- =============================================================================
-- wis-archives bucket policies
-- =============================================================================

-- Policy: Service role full access
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'wis-archives service role access'
  ) then
    create policy "wis-archives service role access"
      on storage.objects for all
      using (
        bucket_id = 'wis-archives'
        and auth.role() = 'service_role'
      );
  end if;
end $$;

-- Policy: Premium users can read
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'wis-archives premium read'
  ) then
    create policy "wis-archives premium read"
      on storage.objects for select
      using (
        bucket_id = 'wis-archives'
        and exists (
          select 1 from public.user_subscriptions
          where user_id = auth.uid()
          and subscription_type = 'premium'
          and subscription_status = 'active'
        )
      );
  end if;
end $$;

-- =============================================================================
-- wis-media bucket policies
-- =============================================================================

-- Policy: Public read access
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'wis-media public read'
  ) then
    create policy "wis-media public read"
      on storage.objects for select
      using (bucket_id = 'wis-media');
  end if;
end $$;

-- Policy: Authenticated users can upload
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'wis-media authenticated write'
  ) then
    create policy "wis-media authenticated write"
      on storage.objects for insert
      with check (
        bucket_id = 'wis-media'
        and auth.role() = 'authenticated'
      );
  end if;
end $$;

-- Policy: Service role full access
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'wis-media service role access'
  ) then
    create policy "wis-media service role access"
      on storage.objects for all
      using (
        bucket_id = 'wis-media'
        and auth.role() = 'service_role'
      );
  end if;
end $$;

-- Add comments for documentation
comment on policy "wis-docs public read" on storage.objects is
  'Allow public read access to WIS procedure and bulletin documents';

comment on policy "wis-docs authenticated write" on storage.objects is
  'Allow authenticated users to upload WIS documents';

comment on policy "wis-archives premium read" on storage.objects is
  'Allow premium users to read private WIS archives (parts JSON, etc)';

comment on policy "wis-media public read" on storage.objects is
  'Allow public read access to WIS media (images, diagrams, videos)';
