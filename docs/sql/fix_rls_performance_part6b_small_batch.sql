-- Small batch 2: Track comments and unimog models
DROP POLICY IF EXISTS "Users can create their own comments" ON track_comments;
CREATE POLICY "Users can create their own comments" ON track_comments
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON track_comments;
CREATE POLICY "Users can update their own comments" ON track_comments
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON track_comments;
CREATE POLICY "Users can delete their own comments" ON track_comments
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Allow insert for admins" ON unimog_models;
CREATE POLICY "Allow insert for admins" ON unimog_models
    FOR INSERT WITH CHECK (check_admin_access());

DROP POLICY IF EXISTS "Allow read for all" ON unimog_models;
CREATE POLICY "Allow read for all" ON unimog_models
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update for admins" ON unimog_models;
CREATE POLICY "Allow update for admins" ON unimog_models
    FOR UPDATE USING (check_admin_access());

DROP POLICY IF EXISTS "Allow delete for admins" ON unimog_models;
CREATE POLICY "Allow delete for admins" ON unimog_models
    FOR DELETE USING (check_admin_access());