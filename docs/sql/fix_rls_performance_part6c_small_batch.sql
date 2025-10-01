-- Small batch 3: Trip coordinates and emergency alerts
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