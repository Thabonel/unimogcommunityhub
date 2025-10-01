-- Fix the final 2 RLS policies with auth function issues

-- Fix user_subscriptions table
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON user_subscriptions;
CREATE POLICY "Service role can manage all subscriptions" ON user_subscriptions
    FOR ALL USING (check_admin_access());

-- Fix wis_chunks table
DROP POLICY IF EXISTS "Allow authenticated users to read wis_chunks" ON wis_chunks;
CREATE POLICY "Allow authenticated users to read wis_chunks" ON wis_chunks
    FOR SELECT USING ((select auth.uid()) IS NOT NULL);