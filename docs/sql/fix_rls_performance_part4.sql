-- Fix remaining major RLS policy performance issues (Part 4)
-- Targeting the tables with the most remaining warnings

-- Fix group_members table (3 policies)
DROP POLICY IF EXISTS "Add group members simple" ON group_members;
CREATE POLICY "Add group members simple" ON group_members
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Remove own membership" ON group_members;
CREATE POLICY "Remove own membership" ON group_members
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Update own membership" ON group_members;
CREATE POLICY "Update own membership" ON group_members
    FOR UPDATE USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- Fix group_posts table (4 policies)
DROP POLICY IF EXISTS "Create group posts" ON group_posts;
CREATE POLICY "Create group posts" ON group_posts
    FOR INSERT WITH CHECK (((select auth.uid()) = user_id) AND (EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = group_posts.group_id AND group_members.user_id = (select auth.uid()))));

DROP POLICY IF EXISTS "Delete group posts" ON group_posts;
CREATE POLICY "Delete group posts" ON group_posts
    FOR DELETE USING ((user_id = (select auth.uid())) OR (EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = group_posts.group_id AND group_members.user_id = (select auth.uid()) AND group_members.role = ANY (ARRAY['admin'::text, 'moderator'::text]))));

DROP POLICY IF EXISTS "Update group posts" ON group_posts;
CREATE POLICY "Update group posts" ON group_posts
    FOR UPDATE USING ((user_id = (select auth.uid())) OR (EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = group_posts.group_id AND group_members.user_id = (select auth.uid()) AND group_members.role = ANY (ARRAY['admin'::text, 'moderator'::text]))));

DROP POLICY IF EXISTS "View group posts" ON group_posts;
CREATE POLICY "View group posts" ON group_posts
    FOR SELECT USING (EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = group_posts.group_id AND group_members.user_id = (select auth.uid())));

-- Fix maintenance_logs table (4 policies)
DROP POLICY IF EXISTS "Users can delete logs for their own vehicles" ON maintenance_logs;
CREATE POLICY "Users can delete logs for their own vehicles" ON maintenance_logs
    FOR DELETE USING ((SELECT vehicles.user_id FROM vehicles WHERE vehicles.id = maintenance_logs.vehicle_id) = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert logs for their own vehicles" ON maintenance_logs;
CREATE POLICY "Users can insert logs for their own vehicles" ON maintenance_logs
    FOR INSERT WITH CHECK ((SELECT vehicles.user_id FROM vehicles WHERE vehicles.id = maintenance_logs.vehicle_id) = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update logs for their own vehicles" ON maintenance_logs;
CREATE POLICY "Users can update logs for their own vehicles" ON maintenance_logs
    FOR UPDATE USING ((SELECT vehicles.user_id FROM vehicles WHERE vehicles.id = maintenance_logs.vehicle_id) = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view logs for their own vehicles" ON maintenance_logs;
CREATE POLICY "Users can view logs for their own vehicles" ON maintenance_logs
    FOR SELECT USING ((SELECT vehicles.user_id FROM vehicles WHERE vehicles.id = maintenance_logs.vehicle_id) = (select auth.uid()));

-- Fix maintenance_notification_settings table (4 policies)
DROP POLICY IF EXISTS "Users can delete notification settings for their own vehicles" ON maintenance_notification_settings;
CREATE POLICY "Users can delete notification settings for their own vehicles" ON maintenance_notification_settings
    FOR DELETE USING ((SELECT vehicles.user_id FROM vehicles WHERE vehicles.id = maintenance_notification_settings.vehicle_id) = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert notification settings for their own vehicles" ON maintenance_notification_settings;
CREATE POLICY "Users can insert notification settings for their own vehicles" ON maintenance_notification_settings
    FOR INSERT WITH CHECK ((SELECT vehicles.user_id FROM vehicles WHERE vehicles.id = maintenance_notification_settings.vehicle_id) = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update notification settings for their own vehicles" ON maintenance_notification_settings;
CREATE POLICY "Users can update notification settings for their own vehicles" ON maintenance_notification_settings
    FOR UPDATE USING ((SELECT vehicles.user_id FROM vehicles WHERE vehicles.id = maintenance_notification_settings.vehicle_id) = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view notification settings for their own vehicles" ON maintenance_notification_settings;
CREATE POLICY "Users can view notification settings for their own vehicles" ON maintenance_notification_settings
    FOR SELECT USING ((SELECT vehicles.user_id FROM vehicles WHERE vehicles.id = maintenance_notification_settings.vehicle_id) = (select auth.uid()));

-- Fix manuals_old table (4 policies)
DROP POLICY IF EXISTS "Admins can view all manuals" ON manuals_old;
CREATE POLICY "Admins can view all manuals" ON manuals_old
    FOR SELECT USING ((EXISTS (SELECT 1 FROM auth.users WHERE users.id = (select auth.uid()) AND users.is_super_admin)) OR (submitted_by = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete their unapproved manuals" ON manuals_old;
CREATE POLICY "Users can delete their unapproved manuals" ON manuals_old
    FOR DELETE USING ((submitted_by = (select auth.uid())) AND (approved = false));

DROP POLICY IF EXISTS "Users can insert their own manuals" ON manuals_old;
CREATE POLICY "Users can insert their own manuals" ON manuals_old
    FOR INSERT WITH CHECK (submitted_by = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own manuals" ON manuals_old;
CREATE POLICY "Users can update their own manuals" ON manuals_old
    FOR UPDATE USING (submitted_by = (select auth.uid()));

-- Fix post_comments table (3 policies)
DROP POLICY IF EXISTS "Authenticated users can comment" ON post_comments;
CREATE POLICY "Authenticated users can comment" ON post_comments
    FOR INSERT WITH CHECK ((EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (select auth.uid()))) AND ((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
CREATE POLICY "Users can delete own comments" ON post_comments
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON post_comments;
CREATE POLICY "Users can update own comments" ON post_comments
    FOR UPDATE USING ((select auth.uid()) = user_id);

-- Fix post_likes table (2 policies)
DROP POLICY IF EXISTS "Authenticated users can like" ON post_likes;
CREATE POLICY "Authenticated users can like" ON post_likes
    FOR INSERT WITH CHECK ((EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (select auth.uid()))) AND ((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users can unlike" ON post_likes;
CREATE POLICY "Users can unlike" ON post_likes
    FOR DELETE USING ((select auth.uid()) = user_id);

-- Fix post_shares table (2 policies)
DROP POLICY IF EXISTS "Users can delete their own post shares" ON post_shares;
CREATE POLICY "Users can delete their own post shares" ON post_shares
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own post shares" ON post_shares;
CREATE POLICY "Users can insert their own post shares" ON post_shares
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- Fix saved_listings table (3 policies)
DROP POLICY IF EXISTS "Users can save listings" ON saved_listings;
CREATE POLICY "Users can save listings" ON saved_listings
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can unsave their own listings" ON saved_listings;
CREATE POLICY "Users can unsave their own listings" ON saved_listings
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own saved listings" ON saved_listings;
CREATE POLICY "Users can view their own saved listings" ON saved_listings
    FOR SELECT USING ((select auth.uid()) = user_id);