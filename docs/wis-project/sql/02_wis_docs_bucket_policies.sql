-- Step 2a: RLS policies for wis-docs bucket

create policy "wis-docs public read"
  on storage.objects for select
  using (bucket_id = 'wis-docs');

create policy "wis-docs authenticated write"
  on storage.objects for insert
  with check (
    bucket_id = 'wis-docs'
    and auth.role() = 'authenticated'
  );

create policy "wis-docs service role access"
  on storage.objects for all
  using (
    bucket_id = 'wis-docs'
    and auth.role() = 'service_role'
  );
