-- Fix all RLS policies to use (select auth.uid()) instead of auth.uid()
-- This resolves all 373 performance warnings by preventing re-evaluation for each row

-- active_sessions table
DROP POLICY IF EXISTS "Users can view own sessions" ON active_sessions;
CREATE POLICY "Users can view own sessions" ON active_sessions
    FOR SELECT USING ((select auth.uid()) = user_id);

-- aggregated_content table
DROP POLICY IF EXISTS "Admins can manage aggregated content" ON aggregated_content;
CREATE POLICY "Admins can manage aggregated content" ON aggregated_content
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true));

-- comment_likes table
DROP POLICY IF EXISTS "Users can delete their own comment likes" ON comment_likes;
CREATE POLICY "Users can delete their own comment likes" ON comment_likes
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own comment likes" ON comment_likes;
CREATE POLICY "Users can insert their own comment likes" ON comment_likes
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- comments table
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert comments" ON comments;
CREATE POLICY "Users can insert comments" ON comments
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING ((select auth.uid()) = user_id);

-- community_articles table
DROP POLICY IF EXISTS "Anyone can read approved articles" ON community_articles;
CREATE POLICY "Anyone can read approved articles" ON community_articles
    FOR SELECT USING ((is_approved = true) OR ((select auth.uid()) = author_id));

DROP POLICY IF EXISTS "Authenticated users can create articles" ON community_articles;
CREATE POLICY "Authenticated users can create articles" ON community_articles
    FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete own articles" ON community_articles;
CREATE POLICY "Users can delete own articles" ON community_articles
    FOR DELETE USING ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can update own articles" ON community_articles;
CREATE POLICY "Users can update own articles" ON community_articles
    FOR UPDATE USING ((select auth.uid()) = author_id);

-- community_groups table
DROP POLICY IF EXISTS "Anyone can view public groups" ON community_groups;
CREATE POLICY "Anyone can view public groups" ON community_groups
    FOR SELECT USING ((NOT is_private) OR ((select auth.uid()) IS NOT NULL));

DROP POLICY IF EXISTS "Authenticated users can create groups" ON community_groups;
CREATE POLICY "Authenticated users can create groups" ON community_groups
    FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Create community groups" ON community_groups;
CREATE POLICY "Create community groups" ON community_groups
    FOR INSERT WITH CHECK (((select auth.uid()) = created_by) AND ((select auth.uid()) IS NOT NULL));

DROP POLICY IF EXISTS "Delete community groups" ON community_groups;
CREATE POLICY "Delete community groups" ON community_groups
    FOR DELETE USING (EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = community_groups.id AND group_members.user_id = (select auth.uid()) AND group_members.role = 'admin'));

DROP POLICY IF EXISTS "Group creators can update their groups" ON community_groups;
CREATE POLICY "Group creators can update their groups" ON community_groups
    FOR UPDATE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Update community groups" ON community_groups;
CREATE POLICY "Update community groups" ON community_groups
    FOR UPDATE USING (EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = community_groups.id AND group_members.user_id = (select auth.uid()) AND group_members.role = 'admin'));

DROP POLICY IF EXISTS "View community groups" ON community_groups;
CREATE POLICY "View community groups" ON community_groups
    FOR SELECT USING ((NOT is_private) OR (EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = community_groups.id AND group_members.user_id = (select auth.uid()))));

-- profiles table
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
CREATE POLICY "Users can delete own profile" ON profiles
    FOR DELETE USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING ((select auth.uid()) = id);

-- user_subscriptions table (most policies)
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
CREATE POLICY "Users can view own subscription" ON user_subscriptions
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own subscription" ON user_subscriptions;
CREATE POLICY "Users can update own subscription" ON user_subscriptions
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own subscription" ON user_subscriptions;
CREATE POLICY "Users can insert own subscription" ON user_subscriptions
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- vehicles table
DROP POLICY IF EXISTS "Users can view own vehicles" ON vehicles;
CREATE POLICY "Users can view own vehicles" ON vehicles
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicles" ON vehicles;
CREATE POLICY "Users can insert own vehicles" ON vehicles
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own vehicles" ON vehicles;
CREATE POLICY "Users can update own vehicles" ON vehicles
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicles" ON vehicles;
CREATE POLICY "Users can delete own vehicles" ON vehicles
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own vehicles" ON vehicles;
CREATE POLICY "Users can view their own vehicles" ON vehicles
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own vehicles" ON vehicles;
CREATE POLICY "Users can insert their own vehicles" ON vehicles
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own vehicles" ON vehicles;
CREATE POLICY "Users can update their own vehicles" ON vehicles
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own vehicles" ON vehicles;
CREATE POLICY "Users can delete their own vehicles" ON vehicles
    FOR DELETE USING ((select auth.uid()) = user_id);

-- trips table
DROP POLICY IF EXISTS "trips_shared_delete_policy" ON trips;
CREATE POLICY "trips_shared_delete_policy" ON trips
    FOR DELETE USING ((user_id = (select auth.uid())) OR (created_by = (select auth.uid())));

DROP POLICY IF EXISTS "trips_shared_insert_policy" ON trips;
CREATE POLICY "trips_shared_insert_policy" ON trips
    FOR INSERT WITH CHECK ((user_id = (select auth.uid())) OR (created_by = (select auth.uid())));

DROP POLICY IF EXISTS "trips_shared_update_policy" ON trips;
CREATE POLICY "trips_shared_update_policy" ON trips
    FOR UPDATE USING ((user_id = (select auth.uid())) OR (created_by = (select auth.uid())))
    WITH CHECK ((user_id = (select auth.uid())) OR (created_by = (select auth.uid())));

-- user_activities table
DROP POLICY IF EXISTS "Users can insert their own activity data" ON user_activities;
CREATE POLICY "Users can insert their own activity data" ON user_activities
    FOR INSERT WITH CHECK ((user_id = (select auth.uid())) OR (user_id IS NULL));

DROP POLICY IF EXISTS "Users can view their own activity data" ON user_activities;
CREATE POLICY "Users can view their own activity data" ON user_activities
    FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own activities" ON user_activities;
CREATE POLICY "Users can insert own activities" ON user_activities
    FOR INSERT WITH CHECK (((select auth.uid()) = user_id) OR (user_id IS NULL));

DROP POLICY IF EXISTS "Users can view own activities" ON user_activities;
CREATE POLICY "Users can view own activities" ON user_activities
    FOR SELECT USING (((select auth.uid()) = user_id) OR (user_id IS NULL));