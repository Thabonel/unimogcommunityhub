-- Small batch 1: RSS feeds and posts
DROP POLICY IF EXISTS "Admins can manage RSS feeds" ON rss_feeds;
CREATE POLICY "Admins can manage RSS feeds" ON rss_feeds
    FOR ALL USING (check_admin_access());

DROP POLICY IF EXISTS "Anyone can read RSS feeds" ON rss_feeds;
CREATE POLICY "Anyone can read RSS feeds" ON rss_feeds
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can view RSS feeds" ON rss_feeds;
CREATE POLICY "Authenticated users can view RSS feeds" ON rss_feeds
    FOR SELECT USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert posts" ON posts;
CREATE POLICY "Users can insert posts" ON posts
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view posts" ON posts;
CREATE POLICY "Users can view posts" ON posts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
CREATE POLICY "Users can update their own posts" ON posts
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
CREATE POLICY "Users can delete their own posts" ON posts
    FOR DELETE USING ((select auth.uid()) = user_id);