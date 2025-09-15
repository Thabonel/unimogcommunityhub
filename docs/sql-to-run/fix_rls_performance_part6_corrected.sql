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

DROP POLICY IF EXISTS "Users can create coordinates for their tracks" ON trip_coordinates;
CREATE POLICY "Users can create coordinates for their tracks" ON trip_coordinates
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_coordinates.trip_id AND trips.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can view coordinates for their tracks" ON trip_coordinates;
CREATE POLICY "Users can view coordinates for their tracks" ON trip_coordinates
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_coordinates.trip_id AND trips.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update coordinates for their tracks" ON trip_coordinates;
CREATE POLICY "Users can update coordinates for their tracks" ON trip_coordinates
    FOR UPDATE USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_coordinates.trip_id AND trips.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete coordinates for their tracks" ON trip_coordinates;
CREATE POLICY "Users can delete coordinates for their tracks" ON trip_coordinates
    FOR DELETE USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_coordinates.trip_id AND trips.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create emergency alerts for their trips" ON trip_emergency_alerts;
CREATE POLICY "Users can create emergency alerts for their trips" ON trip_emergency_alerts
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_emergency_alerts.trip_id AND trips.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can view emergency alerts for their trips" ON trip_emergency_alerts;
CREATE POLICY "Users can view emergency alerts for their trips" ON trip_emergency_alerts
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_emergency_alerts.trip_id AND trips.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update emergency alerts for their trips" ON trip_emergency_alerts;
CREATE POLICY "Users can update emergency alerts for their trips" ON trip_emergency_alerts
    FOR UPDATE USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_emergency_alerts.trip_id AND trips.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete emergency alerts for their trips" ON trip_emergency_alerts;
CREATE POLICY "Users can delete emergency alerts for their trips" ON trip_emergency_alerts
    FOR DELETE USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_emergency_alerts.trip_id AND trips.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create their own waypoints" ON waypoints;
CREATE POLICY "Users can create their own waypoints" ON waypoints
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own waypoints" ON waypoints;
CREATE POLICY "Users can view their own waypoints" ON waypoints
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own waypoints" ON waypoints;
CREATE POLICY "Users can update their own waypoints" ON waypoints
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own waypoints" ON waypoints;
CREATE POLICY "Users can delete their own waypoints" ON waypoints
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own listings" ON marketplace_listings;
CREATE POLICY "Users can create their own listings" ON marketplace_listings
    FOR INSERT WITH CHECK ((select auth.uid()) = seller_id);

DROP POLICY IF EXISTS "Users can view all approved listings" ON marketplace_listings;
CREATE POLICY "Users can view all approved listings" ON marketplace_listings
    FOR SELECT USING ((status = 'approved') OR ((select auth.uid()) = seller_id));

DROP POLICY IF EXISTS "Users can update their own listings" ON marketplace_listings;
CREATE POLICY "Users can update their own listings" ON marketplace_listings
    FOR UPDATE USING ((select auth.uid()) = seller_id);

DROP POLICY IF EXISTS "Users can delete their own listings" ON marketplace_listings;
CREATE POLICY "Users can delete their own listings" ON marketplace_listings
    FOR DELETE USING ((select auth.uid()) = seller_id);

DROP POLICY IF EXISTS "Users can create trip comments" ON trip_comments;
CREATE POLICY "Users can create trip comments" ON trip_comments
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view trip comments" ON trip_comments;
CREATE POLICY "Users can view trip comments" ON trip_comments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own trip comments" ON trip_comments;
CREATE POLICY "Users can update their own trip comments" ON trip_comments
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own trip comments" ON trip_comments;
CREATE POLICY "Users can delete their own trip comments" ON trip_comments
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can share trips" ON trip_shares;
CREATE POLICY "Users can share trips" ON trip_shares
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own trip shares" ON trip_shares;
CREATE POLICY "Users can view their own trip shares" ON trip_shares
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own trip shares" ON trip_shares;
CREATE POLICY "Users can delete their own trip shares" ON trip_shares
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view weather data for their trips" ON trip_weather_data;
CREATE POLICY "Users can view weather data for their trips" ON trip_weather_data
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_weather_data.trip_id AND trips.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "System can insert weather data" ON trip_weather_data;
CREATE POLICY "System can insert weather data" ON trip_weather_data
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view vehicle views" ON vehicle_views;
CREATE POLICY "Users can view vehicle views" ON vehicle_views
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can track their own views" ON vehicle_views;
CREATE POLICY "Users can track their own views" ON vehicle_views
    FOR INSERT WITH CHECK ((select auth.uid()) = viewer_id);

DROP POLICY IF EXISTS "Users can create WIS bookmarks" ON wis_bookmarks;
CREATE POLICY "Users can create WIS bookmarks" ON wis_bookmarks
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own WIS bookmarks" ON wis_bookmarks;
CREATE POLICY "Users can view their own WIS bookmarks" ON wis_bookmarks
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own WIS bookmarks" ON wis_bookmarks;
CREATE POLICY "Users can update their own WIS bookmarks" ON wis_bookmarks
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own WIS bookmarks" ON wis_bookmarks;
CREATE POLICY "Users can delete their own WIS bookmarks" ON wis_bookmarks
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Authenticated users can view WIS bulletins" ON wis_bulletins;
CREATE POLICY "Authenticated users can view WIS bulletins" ON wis_bulletins
    FOR SELECT USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can view WIS diagrams" ON wis_diagrams;
CREATE POLICY "Authenticated users can view WIS diagrams" ON wis_diagrams
    FOR SELECT USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can view WIS parts" ON wis_parts;
CREATE POLICY "Authenticated users can view WIS parts" ON wis_parts
    FOR SELECT USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can view WIS procedures" ON wis_procedures;
CREATE POLICY "Authenticated users can view WIS procedures" ON wis_procedures
    FOR SELECT USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Users can create WIS search queries" ON wis_search_queries;
CREATE POLICY "Users can create WIS search queries" ON wis_search_queries
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own WIS searches" ON wis_search_queries;
CREATE POLICY "Users can view their own WIS searches" ON wis_search_queries
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view WIS usage logs for their sessions" ON wis_usage_logs;
CREATE POLICY "Users can view WIS usage logs for their sessions" ON wis_usage_logs
    FOR SELECT USING (EXISTS (SELECT 1 FROM wis_sessions WHERE wis_sessions.id = wis_usage_logs.session_id AND wis_sessions.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "System can create WIS usage logs" ON wis_usage_logs;
CREATE POLICY "System can create WIS usage logs" ON wis_usage_logs
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view WIS wiring" ON wis_wiring;
CREATE POLICY "Authenticated users can view WIS wiring" ON wis_wiring
    FOR SELECT USING ((select auth.uid()) IS NOT NULL);