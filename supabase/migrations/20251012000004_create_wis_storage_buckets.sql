-- Migration: Create WIS storage buckets for ETL worker
-- Creates buckets: wis-docs (public), wis-archives (private), wis-media (public)

-- Create wis-docs bucket for procedure and bulletin HTML/PDF files (public read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wis-docs',
  'wis-docs',
  true,
  52428800, -- 50MB limit
  array['text/html', 'application/pdf']
)
on conflict (id) do nothing;

-- Create wis-archives bucket for parts JSON and other archives (private)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wis-archives',
  'wis-archives',
  false,
  52428800, -- 50MB limit
  array['application/json', 'application/zip', 'application/x-tar']
)
on conflict (id) do nothing;

-- Create wis-media bucket for images, diagrams, videos (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wis-media',
  'wis-media',
  true,
  10485760, -- 10MB limit
  array['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'video/mp4']
)
on conflict (id) do nothing;

-- RLS policies for wis-docs bucket
-- Public read access (bucket is public)
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

-- Service role and authenticated users can write
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
        and auth.role() in ('authenticated', 'service_role')
      );
  end if;
end $$;

-- RLS policies for wis-archives bucket
-- Only service role can read/write (private bucket)
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

-- Premium users can read archives
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

-- RLS policies for wis-media bucket
-- Public read access (bucket is public)
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

-- Service role and authenticated users can write
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
        and auth.role() in ('authenticated', 'service_role')
      );
  end if;
end $$;

-- Add comments
comment on column storage.buckets.id is 'Bucket identifier used in storage operations';
