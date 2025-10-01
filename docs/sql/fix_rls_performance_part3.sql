-- Fix remaining RLS policies that still have performance warnings
-- This addresses the remaining 313 warnings after parts 1 and 2

-- Fix community_posts table (still has direct auth.uid() calls)
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK ((EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (select auth.uid()))) AND ((select auth.uid()) = author_id));

DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
CREATE POLICY "Users can delete own posts" ON community_posts
    FOR DELETE USING ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
CREATE POLICY "Users can update own posts" ON community_posts
    FOR UPDATE USING ((select auth.uid()) = author_id);

-- Fix community_recommendations table
DROP POLICY IF EXISTS "Admins can do everything" ON community_recommendations;
CREATE POLICY "Admins can do everything" ON community_recommendations
    FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = (select auth.uid()) AND user_roles.role = 'admin'::app_role));

DROP POLICY IF EXISTS "Users can create their own recommendations" ON community_recommendations;
CREATE POLICY "Users can create their own recommendations" ON community_recommendations
    FOR INSERT WITH CHECK ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can update their own recommendations" ON community_recommendations;
CREATE POLICY "Users can update their own recommendations" ON community_recommendations
    FOR UPDATE USING ((select auth.uid()) = author_id) WITH CHECK ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can delete their own recommendations" ON community_recommendations;
CREATE POLICY "Users can delete their own recommendations" ON community_recommendations
    FOR DELETE USING ((select auth.uid()) = author_id);

-- Fix connections table (uses old format)
DROP POLICY IF EXISTS "Users can insert connection requests" ON connections;
CREATE POLICY "Users can insert connection requests" ON connections
    FOR INSERT WITH CHECK ((select auth.uid()) = requester_id);

DROP POLICY IF EXISTS "Users can see connections they are part of" ON connections;
CREATE POLICY "Users can see connections they are part of" ON connections
    FOR SELECT USING (((select auth.uid()) = requester_id) OR ((select auth.uid()) = addressee_id));

DROP POLICY IF EXISTS "Users can update connections they are part of" ON connections;
CREATE POLICY "Users can update connections they are part of" ON connections
    FOR UPDATE USING (((select auth.uid()) = requester_id) OR ((select auth.uid()) = addressee_id));

-- Fix conversations table
DROP POLICY IF EXISTS "Users can see conversations they participate in" ON conversations;
CREATE POLICY "Users can see conversations they participate in" ON conversations
    FOR SELECT USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_participants.conversation_id = conversations.id AND conversation_participants.user_id = (select auth.uid())));

-- Fix conversation_participants table
DROP POLICY IF EXISTS "Users can see conversation participants of their conversations" ON conversation_participants;
CREATE POLICY "Users can see conversation participants of their conversations" ON conversation_participants
    FOR SELECT USING ((user_id = (select auth.uid())) OR (EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = (select auth.uid()))));

-- Fix fuel_logs table
DROP POLICY IF EXISTS "Users can create their own fuel logs" ON fuel_logs;
CREATE POLICY "Users can create their own fuel logs" ON fuel_logs
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own fuel logs" ON fuel_logs;
CREATE POLICY "Users can delete their own fuel logs" ON fuel_logs
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own fuel logs" ON fuel_logs;
CREATE POLICY "Users can update their own fuel logs" ON fuel_logs
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own fuel logs" ON fuel_logs;
CREATE POLICY "Users can view their own fuel logs" ON fuel_logs
    FOR SELECT USING ((select auth.uid()) = user_id);

-- Fix GPX-related tables
DROP POLICY IF EXISTS "gpx_track_points_user_delete" ON gpx_track_points;
CREATE POLICY "gpx_track_points_user_delete" ON gpx_track_points
    FOR DELETE USING (EXISTS (SELECT 1 FROM gpx_tracks WHERE gpx_tracks.id = gpx_track_points.track_id AND ((gpx_tracks.user_id = (select auth.uid())) OR check_admin_access())));

DROP POLICY IF EXISTS "gpx_track_points_user_insert" ON gpx_track_points;
CREATE POLICY "gpx_track_points_user_insert" ON gpx_track_points
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM gpx_tracks WHERE gpx_tracks.id = gpx_track_points.track_id AND gpx_tracks.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "gpx_track_points_user_select" ON gpx_track_points;
CREATE POLICY "gpx_track_points_user_select" ON gpx_track_points
    FOR SELECT USING (EXISTS (SELECT 1 FROM gpx_tracks WHERE gpx_tracks.id = gpx_track_points.track_id AND ((gpx_tracks.user_id = (select auth.uid())) OR check_admin_access())));

DROP POLICY IF EXISTS "gpx_track_points_user_update" ON gpx_track_points;
CREATE POLICY "gpx_track_points_user_update" ON gpx_track_points
    FOR UPDATE USING (EXISTS (SELECT 1 FROM gpx_tracks WHERE gpx_tracks.id = gpx_track_points.track_id AND ((gpx_tracks.user_id = (select auth.uid())) OR check_admin_access())));

-- Fix gpx_tracks table
DROP POLICY IF EXISTS "gpx_tracks_user_delete" ON gpx_tracks;
CREATE POLICY "gpx_tracks_user_delete" ON gpx_tracks
    FOR DELETE USING ((user_id = (select auth.uid())) OR check_admin_access());

DROP POLICY IF EXISTS "gpx_tracks_user_insert" ON gpx_tracks;
CREATE POLICY "gpx_tracks_user_insert" ON gpx_tracks
    FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "gpx_tracks_user_select" ON gpx_tracks;
CREATE POLICY "gpx_tracks_user_select" ON gpx_tracks
    FOR SELECT USING ((user_id = (select auth.uid())) OR check_admin_access());

DROP POLICY IF EXISTS "gpx_tracks_user_update" ON gpx_tracks;
CREATE POLICY "gpx_tracks_user_update" ON gpx_tracks
    FOR UPDATE USING ((user_id = (select auth.uid())) OR check_admin_access());

-- Fix gpx_waypoints table
DROP POLICY IF EXISTS "gpx_waypoints_user_delete" ON gpx_waypoints;
CREATE POLICY "gpx_waypoints_user_delete" ON gpx_waypoints
    FOR DELETE USING ((user_id = (select auth.uid())) OR check_admin_access());

DROP POLICY IF EXISTS "gpx_waypoints_user_insert" ON gpx_waypoints;
CREATE POLICY "gpx_waypoints_user_insert" ON gpx_waypoints
    FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "gpx_waypoints_user_select" ON gpx_waypoints;
CREATE POLICY "gpx_waypoints_user_select" ON gpx_waypoints
    FOR SELECT USING ((user_id = (select auth.uid())) OR check_admin_access());

DROP POLICY IF EXISTS "gpx_waypoints_user_update" ON gpx_waypoints;
CREATE POLICY "gpx_waypoints_user_update" ON gpx_waypoints
    FOR UPDATE USING ((user_id = (select auth.uid())) OR check_admin_access());