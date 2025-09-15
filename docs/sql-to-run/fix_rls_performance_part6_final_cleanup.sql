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

DROP POLICY IF EXISTS "Users can create inquiries" ON marketplace_inquiries;
CREATE POLICY "Users can create inquiries" ON marketplace_inquiries
    FOR INSERT WITH CHECK ((select auth.uid()) = inquirer_id);

DROP POLICY IF EXISTS "Users can view inquiries they sent or received" ON marketplace_inquiries;
CREATE POLICY "Users can view inquiries they sent or received" ON marketplace_inquiries
    FOR SELECT USING (((select auth.uid()) = inquirer_id) OR EXISTS (SELECT 1 FROM marketplace_listings WHERE marketplace_listings.id = marketplace_inquiries.listing_id AND marketplace_listings.seller_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update inquiries they sent" ON marketplace_inquiries;
CREATE POLICY "Users can update inquiries they sent" ON marketplace_inquiries
    FOR UPDATE USING ((select auth.uid()) = inquirer_id);

DROP POLICY IF EXISTS "Sellers can respond to inquiries" ON marketplace_inquiries;
CREATE POLICY "Sellers can respond to inquiries" ON marketplace_inquiries
    FOR UPDATE USING (EXISTS (SELECT 1 FROM marketplace_listings WHERE marketplace_listings.id = marketplace_inquiries.listing_id AND marketplace_listings.seller_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can view their own purchase history" ON purchase_history;
CREATE POLICY "Users can view their own purchase history" ON purchase_history
    FOR SELECT USING ((select auth.uid()) = buyer_id);

DROP POLICY IF EXISTS "Sellers can view sales to them" ON purchase_history;
CREATE POLICY "Sellers can view sales to them" ON purchase_history
    FOR SELECT USING ((select auth.uid()) = seller_id);

DROP POLICY IF EXISTS "Users can create purchase records" ON purchase_history;
CREATE POLICY "Users can create purchase records" ON purchase_history
    FOR INSERT WITH CHECK ((select auth.uid()) = buyer_id);

DROP POLICY IF EXISTS "Users can create their own event posts" ON event_posts;
CREATE POLICY "Users can create their own event posts" ON event_posts
    FOR INSERT WITH CHECK ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can view all public events" ON event_posts;
CREATE POLICY "Users can view all public events" ON event_posts
    FOR SELECT USING ((visibility = 'public') OR ((select auth.uid()) = created_by));

DROP POLICY IF EXISTS "Users can update their own events" ON event_posts;
CREATE POLICY "Users can update their own events" ON event_posts
    FOR UPDATE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can delete their own events" ON event_posts;
CREATE POLICY "Users can delete their own events" ON event_posts
    FOR DELETE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can RSVP to events" ON event_rsvps;
CREATE POLICY "Users can RSVP to events" ON event_rsvps
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view RSVPs for their events" ON event_rsvps;
CREATE POLICY "Users can view RSVPs for their events" ON event_rsvps
    FOR SELECT USING (EXISTS (SELECT 1 FROM event_posts WHERE event_posts.id = event_rsvps.event_id AND event_posts.created_by = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update their own RSVPs" ON event_rsvps;
CREATE POLICY "Users can update their own RSVPs" ON event_rsvps
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own RSVPs" ON event_rsvps;
CREATE POLICY "Users can delete their own RSVPs" ON event_rsvps
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create parts for their vehicles" ON vehicle_parts;
CREATE POLICY "Users can create parts for their vehicles" ON vehicle_parts
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM vehicles WHERE vehicles.id = vehicle_parts.vehicle_id AND vehicles.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can view parts for their vehicles" ON vehicle_parts;
CREATE POLICY "Users can view parts for their vehicles" ON vehicle_parts
    FOR SELECT USING (EXISTS (SELECT 1 FROM vehicles WHERE vehicles.id = vehicle_parts.vehicle_id AND vehicles.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update parts for their vehicles" ON vehicle_parts;
CREATE POLICY "Users can update parts for their vehicles" ON vehicle_parts
    FOR UPDATE USING (EXISTS (SELECT 1 FROM vehicles WHERE vehicles.id = vehicle_parts.vehicle_id AND vehicles.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete parts for their vehicles" ON vehicle_parts;
CREATE POLICY "Users can delete parts for their vehicles" ON vehicle_parts
    FOR DELETE USING (EXISTS (SELECT 1 FROM vehicles WHERE vehicles.id = vehicle_parts.vehicle_id AND vehicles.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create service records for their vehicles" ON service_records;
CREATE POLICY "Users can create service records for their vehicles" ON service_records
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM vehicles WHERE vehicles.id = service_records.vehicle_id AND vehicles.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can view service records for their vehicles" ON service_records;
CREATE POLICY "Users can view service records for their vehicles" ON service_records
    FOR SELECT USING (EXISTS (SELECT 1 FROM vehicles WHERE vehicles.id = service_records.vehicle_id AND vehicles.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update service records for their vehicles" ON service_records;
CREATE POLICY "Users can update service records for their vehicles" ON service_records
    FOR UPDATE USING (EXISTS (SELECT 1 FROM vehicles WHERE vehicles.id = service_records.vehicle_id AND vehicles.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete service records for their vehicles" ON service_records;
CREATE POLICY "Users can delete service records for their vehicles" ON service_records
    FOR DELETE USING (EXISTS (SELECT 1 FROM vehicles WHERE vehicles.id = service_records.vehicle_id AND vehicles.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create their own forum topics" ON forum_topics;
CREATE POLICY "Users can create their own forum topics" ON forum_topics
    FOR INSERT WITH CHECK ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can view all forum topics" ON forum_topics;
CREATE POLICY "Users can view all forum topics" ON forum_topics
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own forum topics" ON forum_topics;
CREATE POLICY "Users can update their own forum topics" ON forum_topics
    FOR UPDATE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can delete their own forum topics" ON forum_topics;
CREATE POLICY "Users can delete their own forum topics" ON forum_topics
    FOR DELETE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can create forum replies" ON forum_replies;
CREATE POLICY "Users can create forum replies" ON forum_replies
    FOR INSERT WITH CHECK ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can view all forum replies" ON forum_replies;
CREATE POLICY "Users can view all forum replies" ON forum_replies
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own forum replies" ON forum_replies;
CREATE POLICY "Users can update their own forum replies" ON forum_replies
    FOR UPDATE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can delete their own forum replies" ON forum_replies;
CREATE POLICY "Users can delete their own forum replies" ON forum_replies
    FOR DELETE USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Users can create their own knowledge articles" ON knowledge_articles;
CREATE POLICY "Users can create their own knowledge articles" ON knowledge_articles
    FOR INSERT WITH CHECK ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can view approved articles or their own" ON knowledge_articles;
CREATE POLICY "Users can view approved articles or their own" ON knowledge_articles
    FOR SELECT USING ((is_approved = true) OR ((select auth.uid()) = author_id));

DROP POLICY IF EXISTS "Users can update their own knowledge articles" ON knowledge_articles;
CREATE POLICY "Users can update their own knowledge articles" ON knowledge_articles
    FOR UPDATE USING ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can delete their own knowledge articles" ON knowledge_articles;
CREATE POLICY "Users can delete their own knowledge articles" ON knowledge_articles
    FOR DELETE USING ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Users can vote on knowledge articles" ON knowledge_article_votes;
CREATE POLICY "Users can vote on knowledge articles" ON knowledge_article_votes
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own votes" ON knowledge_article_votes;
CREATE POLICY "Users can view their own votes" ON knowledge_article_votes
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own votes" ON knowledge_article_votes;
CREATE POLICY "Users can update their own votes" ON knowledge_article_votes
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own votes" ON knowledge_article_votes;
CREATE POLICY "Users can delete their own votes" ON knowledge_article_votes
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own media" ON user_media;
CREATE POLICY "Users can create their own media" ON user_media
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own media" ON user_media;
CREATE POLICY "Users can view their own media" ON user_media
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own media" ON user_media;
CREATE POLICY "Users can update their own media" ON user_media
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own media" ON user_media;
CREATE POLICY "Users can delete their own media" ON user_media
    FOR DELETE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create location check-ins" ON location_checkins;
CREATE POLICY "Users can create location check-ins" ON location_checkins
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own check-ins" ON location_checkins;
CREATE POLICY "Users can view their own check-ins" ON location_checkins
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view public check-ins" ON location_checkins;
CREATE POLICY "Users can view public check-ins" ON location_checkins
    FOR SELECT USING ((visibility = 'public') OR ((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users can update their own check-ins" ON location_checkins;
CREATE POLICY "Users can update their own check-ins" ON location_checkins
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own check-ins" ON location_checkins;
CREATE POLICY "Users can delete their own check-ins" ON location_checkins
    FOR DELETE USING ((select auth.uid()) = user_id);