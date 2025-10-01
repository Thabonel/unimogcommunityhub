DROP POLICY IF EXISTS "Users can create their own manual ratings" ON manual_ratings;
CREATE POLICY "Users can create their own manual ratings" ON manual_ratings
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own manual ratings" ON manual_ratings;
CREATE POLICY "Users can view their own manual ratings" ON manual_ratings
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own manual ratings" ON manual_ratings;
CREATE POLICY "Users can update their own manual ratings" ON manual_ratings
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own manual ratings" ON manual_ratings;
CREATE POLICY "Users can delete their own manual ratings" ON manual_ratings
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own bookmarks" ON manual_bookmarks;
CREATE POLICY "Users can create their own bookmarks" ON manual_bookmarks
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own bookmarks" ON manual_bookmarks;
CREATE POLICY "Users can view their own bookmarks" ON manual_bookmarks
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON manual_bookmarks;
CREATE POLICY "Users can delete their own bookmarks" ON manual_bookmarks
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own search history" ON search_history;
CREATE POLICY "Users can create their own search history" ON search_history
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own search history" ON search_history;
CREATE POLICY "Users can view their own search history" ON search_history
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own search history" ON search_history;
CREATE POLICY "Users can delete their own search history" ON search_history
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own preferences" ON user_preferences;
CREATE POLICY "Users can create their own preferences" ON user_preferences
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;
CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own preferences" ON user_preferences;
CREATE POLICY "Users can delete their own preferences" ON user_preferences
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create badges" ON user_badges;
CREATE POLICY "Users can create badges" ON user_badges
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view all badges" ON user_badges;
CREATE POLICY "Users can view all badges" ON user_badges
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "System can create achievements" ON user_achievements;
CREATE POLICY "System can create achievements" ON user_achievements
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own reviews" ON reviews;
CREATE POLICY "Users can create their own reviews" ON reviews
    FOR INSERT WITH CHECK ((select auth.uid()) = reviewer_id);

DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
CREATE POLICY "Users can view all reviews" ON reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING ((select auth.uid()) = reviewer_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING ((select auth.uid()) = reviewer_id);

DROP POLICY IF EXISTS "Users can create their own trip reports" ON trip_reports;
CREATE POLICY "Users can create their own trip reports" ON trip_reports
    FOR INSERT WITH CHECK ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can view public trip reports" ON trip_reports;
CREATE POLICY "Users can view public trip reports" ON trip_reports
    FOR SELECT USING ((visibility = 'public') OR ((select auth.uid()) = author_id));

DROP POLICY IF EXISTS "Users can update their own trip reports" ON trip_reports;
CREATE POLICY "Users can update their own trip reports" ON trip_reports
    FOR UPDATE USING ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can delete their own trip reports" ON trip_reports;
CREATE POLICY "Users can delete their own trip reports" ON trip_reports
    FOR DELETE USING ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can create photo tags" ON trip_report_photos;
CREATE POLICY "Users can create photo tags" ON trip_report_photos
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM trip_reports WHERE trip_reports.id = trip_report_photos.report_id AND trip_reports.author_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can view photos for public reports" ON trip_report_photos;
CREATE POLICY "Users can view photos for public reports" ON trip_report_photos
    FOR SELECT USING (EXISTS (SELECT 1 FROM trip_reports WHERE trip_reports.id = trip_report_photos.report_id AND ((trip_reports.visibility = 'public') OR (trip_reports.author_id = (select auth.uid())))));

DROP POLICY IF EXISTS "Users can update their own photos" ON trip_report_photos;
CREATE POLICY "Users can update their own photos" ON trip_report_photos
    FOR UPDATE USING (EXISTS (SELECT 1 FROM trip_reports WHERE trip_reports.id = trip_report_photos.report_id AND trip_reports.author_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete their own photos" ON trip_report_photos;
CREATE POLICY "Users can delete their own photos" ON trip_report_photos
    FOR DELETE USING (EXISTS (SELECT 1 FROM trip_reports WHERE trip_reports.id = trip_report_photos.report_id AND trip_reports.author_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create their own route collections" ON route_collections;
CREATE POLICY "Users can create their own route collections" ON route_collections
    FOR INSERT WITH CHECK ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can view public collections" ON route_collections;
CREATE POLICY "Users can view public collections" ON route_collections
    FOR SELECT USING ((visibility = 'public') OR ((select auth.uid()) = created_by));

DROP POLICY IF EXISTS "Users can update their own collections" ON route_collections;
CREATE POLICY "Users can update their own collections" ON route_collections
    FOR UPDATE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can delete their own collections" ON route_collections;
CREATE POLICY "Users can delete their own collections" ON route_collections
    FOR DELETE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can add routes to their collections" ON collection_routes;
CREATE POLICY "Users can add routes to their collections" ON collection_routes
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM route_collections WHERE route_collections.id = collection_routes.collection_id AND route_collections.created_by = (select auth.uid())));

DROP POLICY IF EXISTS "Users can view routes in accessible collections" ON collection_routes;
CREATE POLICY "Users can view routes in accessible collections" ON collection_routes
    FOR SELECT USING (EXISTS (SELECT 1 FROM route_collections WHERE route_collections.id = collection_routes.collection_id AND ((route_collections.visibility = 'public') OR (route_collections.created_by = (select auth.uid())))));

DROP POLICY IF EXISTS "Users can remove routes from their collections" ON collection_routes;
CREATE POLICY "Users can remove routes from their collections" ON collection_routes
    FOR DELETE USING (EXISTS (SELECT 1 FROM route_collections WHERE route_collections.id = collection_routes.collection_id AND route_collections.created_by = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create weather alerts" ON weather_alerts;
CREATE POLICY "Users can create weather alerts" ON weather_alerts
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own alerts" ON weather_alerts;
CREATE POLICY "Users can view their own alerts" ON weather_alerts
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own alerts" ON weather_alerts;
CREATE POLICY "Users can update their own alerts" ON weather_alerts
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own alerts" ON weather_alerts;
CREATE POLICY "Users can delete their own alerts" ON weather_alerts
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own gear lists" ON gear_lists;
CREATE POLICY "Users can create their own gear lists" ON gear_lists
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own gear lists" ON gear_lists;
CREATE POLICY "Users can view their own gear lists" ON gear_lists
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view public gear lists" ON gear_lists;
CREATE POLICY "Users can view public gear lists" ON gear_lists
    FOR SELECT USING ((visibility = 'public') OR ((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users can update their own gear lists" ON gear_lists;
CREATE POLICY "Users can update their own gear lists" ON gear_lists
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own gear lists" ON gear_lists;
CREATE POLICY "Users can delete their own gear lists" ON gear_lists
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can add items to their gear lists" ON gear_list_items;
CREATE POLICY "Users can add items to their gear lists" ON gear_list_items
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM gear_lists WHERE gear_lists.id = gear_list_items.list_id AND gear_lists.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can view items in accessible lists" ON gear_list_items;
CREATE POLICY "Users can view items in accessible lists" ON gear_list_items
    FOR SELECT USING (EXISTS (SELECT 1 FROM gear_lists WHERE gear_lists.id = gear_list_items.list_id AND ((gear_lists.visibility = 'public') OR (gear_lists.user_id = (select auth.uid())))));

DROP POLICY IF EXISTS "Users can update items in their lists" ON gear_list_items;
CREATE POLICY "Users can update items in their lists" ON gear_list_items
    FOR UPDATE USING (EXISTS (SELECT 1 FROM gear_lists WHERE gear_lists.id = gear_list_items.list_id AND gear_lists.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete items from their lists" ON gear_list_items;
CREATE POLICY "Users can delete items from their lists" ON gear_list_items
    FOR DELETE USING (EXISTS (SELECT 1 FROM gear_lists WHERE gear_lists.id = gear_list_items.list_id AND gear_lists.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Admins can manage content moderation" ON content_moderation;
CREATE POLICY "Admins can manage content moderation" ON content_moderation
    FOR ALL USING (check_admin_access());

DROP POLICY IF EXISTS "Users can view moderation of their own content" ON content_moderation;
CREATE POLICY "Users can view moderation of their own content" ON content_moderation
    FOR SELECT USING ((select auth.uid()) = content_author_id);

DROP POLICY IF EXISTS "Users can report content" ON content_reports;
CREATE POLICY "Users can report content" ON content_reports
    FOR INSERT WITH CHECK ((select auth.uid()) = reporter_id);

DROP POLICY IF EXISTS "Users can view their own reports" ON content_reports;
CREATE POLICY "Users can view their own reports" ON content_reports
    FOR SELECT USING ((select auth.uid()) = reporter_id);

DROP POLICY IF EXISTS "Admins can view all reports" ON content_reports;
CREATE POLICY "Admins can view all reports" ON content_reports
    FOR SELECT USING (check_admin_access());

DROP POLICY IF EXISTS "Users can create activity logs" ON activity_logs;
CREATE POLICY "Users can create activity logs" ON activity_logs
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own activity" ON activity_logs;
CREATE POLICY "Users can view their own activity" ON activity_logs
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can view all activity" ON activity_logs;
CREATE POLICY "Admins can view all activity" ON activity_logs
    FOR SELECT USING (check_admin_access());

DROP POLICY IF EXISTS "Users can view system health status" ON system_health;
CREATE POLICY "Users can view system health status" ON system_health
    FOR SELECT USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Admins can manage system health" ON system_health;
CREATE POLICY "Admins can manage system health" ON system_health
    FOR ALL USING (check_admin_access());

DROP POLICY IF EXISTS "Users can create their own integration settings" ON user_integrations;
CREATE POLICY "Users can create their own integration settings" ON user_integrations
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own integration settings" ON user_integrations;
CREATE POLICY "Users can view their own integration settings" ON user_integrations
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own integration settings" ON user_integrations;
CREATE POLICY "Users can update their own integration settings" ON user_integrations
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own integration settings" ON user_integrations;
CREATE POLICY "Users can delete their own integration settings" ON user_integrations
    FOR DELETE USING ((select auth.uid()) = user_id);