-- Continue fixing remaining RLS policies (Part 2)

-- messages table
DROP POLICY IF EXISTS "Users can see messages they sent or received" ON messages;
CREATE POLICY "Users can see messages they sent or received" ON messages
    FOR SELECT USING (((select auth.uid()) = sender_id) OR ((select auth.uid()) = recipient_id));

DROP POLICY IF EXISTS "Users can insert messages" ON messages;
CREATE POLICY "Users can insert messages" ON messages
    FOR INSERT WITH CHECK ((select auth.uid()) = sender_id);

DROP POLICY IF EXISTS "Users can update messages they sent" ON messages;
CREATE POLICY "Users can update messages they sent" ON messages
    FOR UPDATE USING ((select auth.uid()) = sender_id);

-- notifications table
DROP POLICY IF EXISTS "Users can see their own notifications" ON notifications;
CREATE POLICY "Users can see their own notifications" ON notifications
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING ((select auth.uid()) = user_id);

-- vehicle_likes table
DROP POLICY IF EXISTS "Users can insert own likes" ON vehicle_likes;
CREATE POLICY "Users can insert own likes" ON vehicle_likes
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own likes" ON vehicle_likes;
CREATE POLICY "Users can delete own likes" ON vehicle_likes
    FOR DELETE USING ((select auth.uid()) = user_id);

-- vehicle_comments table
DROP POLICY IF EXISTS "Users can insert own comments" ON vehicle_comments;
CREATE POLICY "Users can insert own comments" ON vehicle_comments
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON vehicle_comments;
CREATE POLICY "Users can update own comments" ON vehicle_comments
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON vehicle_comments;
CREATE POLICY "Users can delete own comments" ON vehicle_comments
    FOR DELETE USING ((select auth.uid()) = user_id);

-- user_roles table
DROP POLICY IF EXISTS "user_roles_read_own" ON user_roles;
CREATE POLICY "user_roles_read_own" ON user_roles
    FOR SELECT USING (user_id = (select auth.uid()));

-- feedback table
DROP POLICY IF EXISTS "Users can insert their own feedback" ON feedback;
CREATE POLICY "Users can insert their own feedback" ON feedback
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own feedback" ON feedback;
CREATE POLICY "Users can update their own feedback" ON feedback
    FOR UPDATE USING ((select auth.uid()) = user_id);

-- feedback_votes table
DROP POLICY IF EXISTS "Users can insert their own vote" ON feedback_votes;
CREATE POLICY "Users can insert their own vote" ON feedback_votes
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own vote" ON feedback_votes;
CREATE POLICY "Users can delete their own vote" ON feedback_votes
    FOR DELETE USING ((select auth.uid()) = user_id);

-- tracks table
DROP POLICY IF EXISTS "Users can view own tracks" ON tracks;
CREATE POLICY "Users can view own tracks" ON tracks
    FOR SELECT USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can create own tracks" ON tracks;
CREATE POLICY "Users can create own tracks" ON tracks
    FOR INSERT WITH CHECK ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can update own tracks" ON tracks;
CREATE POLICY "Users can update own tracks" ON tracks
    FOR UPDATE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can delete own tracks" ON tracks;
CREATE POLICY "Users can delete own tracks" ON tracks
    FOR DELETE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can insert their own tracks" ON tracks;
CREATE POLICY "Users can insert their own tracks" ON tracks
    FOR INSERT WITH CHECK ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can update their own tracks" ON tracks;
CREATE POLICY "Users can update their own tracks" ON tracks
    FOR UPDATE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can delete their own tracks" ON tracks;
CREATE POLICY "Users can delete their own tracks" ON tracks
    FOR DELETE USING ((select auth.uid()) = created_by);

-- Fix remaining policies for smaller tables
DROP POLICY IF EXISTS "Users can view own download logs" ON download_logs;
CREATE POLICY "Users can view own download logs" ON download_logs
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own trial events" ON trial_events;
CREATE POLICY "Users can view own trial events" ON trial_events
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own nudge history" ON nudge_history;
CREATE POLICY "Users can view own nudge history" ON nudge_history
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own trial data" ON user_trials;
CREATE POLICY "Users can view their own trial data" ON user_trials
    FOR SELECT USING ((select auth.uid()) = user_id);