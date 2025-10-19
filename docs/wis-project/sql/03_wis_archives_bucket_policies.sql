-- Step 2b: RLS policies for wis-archives bucket

create policy "wis-archives service role access"
  on storage.objects for all
  using (
    bucket_id = 'wis-archives'
    and auth.role() = 'service_role'
  );

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
