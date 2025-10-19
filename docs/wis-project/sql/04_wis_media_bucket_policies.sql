-- Step 2c: RLS policies for wis-media bucket

create policy "wis-media public read"
  on storage.objects for select
  using (bucket_id = 'wis-media');

create policy "wis-media authenticated write"
  on storage.objects for insert
  with check (
    bucket_id = 'wis-media'
    and auth.role() = 'authenticated'
  );

create policy "wis-media service role access"
  on storage.objects for all
  using (
    bucket_id = 'wis-media'
    and auth.role() = 'service_role'
  );
