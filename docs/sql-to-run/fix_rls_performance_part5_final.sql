-- FINAL RLS Performance Fix - Part 5
-- This fixes the "( SELECT auth.uid() AS uid)" format that's still causing warnings

-- Fix all remaining policies with the old "AS uid" format

-- Fix active_sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON active_sessions;
CREATE POLICY "Users can view own sessions" ON active_sessions
    FOR SELECT USING ((select auth.uid()) = user_id);

-- Fix aggregated_content
DROP POLICY IF EXISTS "Admins can manage aggregated content" ON aggregated_content;
CREATE POLICY "Admins can manage aggregated content" ON aggregated_content
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true));

-- Fix comment_likes
DROP POLICY IF EXISTS "Users can delete their own comment likes" ON comment_likes;
CREATE POLICY "Users can delete their own comment likes" ON comment_likes
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own comment likes" ON comment_likes;
CREATE POLICY "Users can insert their own comment likes" ON comment_likes
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- Fix comments
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert comments" ON comments;
CREATE POLICY "Users can insert comments" ON comments
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING ((select auth.uid()) = user_id);

-- Fix community_articles
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

-- Fix community_groups (all the remaining policies)
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

-- Fix community_posts
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK ((EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (select auth.uid()))) AND ((select auth.uid()) = author_id));

DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
CREATE POLICY "Users can delete own posts" ON community_posts
    FOR DELETE USING ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
CREATE POLICY "Users can update own posts" ON community_posts
    FOR UPDATE USING ((select auth.uid()) = author_id);

-- Fix community_recommendations
DROP POLICY IF EXISTS "Admins can do everything" ON community_recommendations;
CREATE POLICY "Admins can do everything" ON community_recommendations
    FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = (select auth.uid()) AND user_roles.role = 'admin'::app_role));

DROP POLICY IF EXISTS "Users can create their own recommendations" ON community_recommendations;
CREATE POLICY "Users can create their own recommendations" ON community_recommendations
    FOR INSERT WITH CHECK ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can delete their own recommendations" ON community_recommendations;
CREATE POLICY "Users can delete their own recommendations" ON community_recommendations
    FOR DELETE USING ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can update their own recommendations" ON community_recommendations;
CREATE POLICY "Users can update their own recommendations" ON community_recommendations
    FOR UPDATE USING ((select auth.uid()) = author_id) WITH CHECK ((select auth.uid()) = author_id);

-- Fix connections
DROP POLICY IF EXISTS "Users can insert connection requests" ON connections;
CREATE POLICY "Users can insert connection requests" ON connections
    FOR INSERT WITH CHECK ((select auth.uid()) = requester_id);

DROP POLICY IF EXISTS "Users can see connections they are part of" ON connections;
CREATE POLICY "Users can see connections they are part of" ON connections
    FOR SELECT USING (((select auth.uid()) = requester_id) OR ((select auth.uid()) = addressee_id));

DROP POLICY IF EXISTS "Users can update connections they are part of" ON connections;
CREATE POLICY "Users can update connections they are part of" ON connections
    FOR UPDATE USING (((select auth.uid()) = requester_id) OR ((select auth.uid()) = addressee_id));

-- Fix content_interactions
DROP POLICY IF EXISTS "Users can create their own interactions" ON content_interactions;
CREATE POLICY "Users can create their own interactions" ON content_interactions
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own interactions" ON content_interactions;
CREATE POLICY "Users can delete their own interactions" ON content_interactions
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own interactions" ON content_interactions;
CREATE POLICY "Users can view their own interactions" ON content_interactions
    FOR SELECT USING ((select auth.uid()) = user_id);