-- Trip tracking system for manual and automatic location data
CREATE TABLE IF NOT EXISTS trip_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    trip_name TEXT,
    start_location TEXT,
    end_location TEXT,
    start_coordinates POINT,
    end_coordinates POINT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    distance_km NUMERIC(8,2),
    duration_minutes INTEGER,
    trip_type TEXT DEFAULT 'mixed' CHECK (trip_type IN ('on-road', 'off-road', 'mixed', 'work-site', 'maintenance')),
    tracking_method TEXT DEFAULT 'manual' CHECK (tracking_method IN ('manual', 'automatic', 'gps')),
    average_speed_kmh NUMERIC(5,2),
    max_speed_kmh NUMERIC(5,2),
    fuel_consumed_liters NUMERIC(6,2),
    notes TEXT,
    gps_data JSONB,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location tracking settings per user
CREATE TABLE IF NOT EXISTS location_tracking_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    tracking_mode TEXT DEFAULT 'manual' CHECK (tracking_mode IN ('automatic', 'manual', 'disabled')),
    auto_tracking_enabled BOOLEAN DEFAULT false,
    share_location_data BOOLEAN DEFAULT false,
    minimum_trip_distance_km NUMERIC(4,1) DEFAULT 1.0,
    auto_detect_trip_start BOOLEAN DEFAULT true,
    privacy_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quick location check-ins for manual tracking
CREATE TABLE IF NOT EXISTS location_checkins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    location_name TEXT NOT NULL,
    coordinates POINT,
    activity_type TEXT DEFAULT 'general' CHECK (activity_type IN ('general', 'work', 'maintenance', 'fuel', 'rest', 'destination')),
    notes TEXT,
    checked_in_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trip_logs_user_vehicle ON trip_logs(user_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trip_logs_start_time ON trip_logs(start_time);
CREATE INDEX IF NOT EXISTS idx_trip_logs_active ON trip_logs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_location_checkins_user_vehicle ON location_checkins(user_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_location_checkins_time ON location_checkins(checked_in_at);

-- Row Level Security
ALTER TABLE trip_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_tracking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_checkins ENABLE ROW LEVEL SECURITY;

-- Policies for trip_logs
CREATE POLICY "Users can view their own trip logs" ON trip_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own trip logs" ON trip_logs
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own trip logs" ON trip_logs
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own trip logs" ON trip_logs
    FOR DELETE USING (user_id = auth.uid());

-- Policies for location_tracking_settings
CREATE POLICY "Users can view their own location settings" ON location_tracking_settings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own location settings" ON location_tracking_settings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own location settings" ON location_tracking_settings
    FOR UPDATE USING (user_id = auth.uid());

-- Policies for location_checkins
CREATE POLICY "Users can view their own location checkins" ON location_checkins
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own location checkins" ON location_checkins
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own location checkins" ON location_checkins
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own location checkins" ON location_checkins
    FOR DELETE USING (user_id = auth.uid());

-- Function to calculate usage statistics
CREATE OR REPLACE FUNCTION get_usage_statistics(
    p_user_id UUID,
    p_vehicle_id UUID DEFAULT NULL,
    p_period_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_distance_km NUMERIC,
    total_operating_hours NUMERIC,
    off_road_percentage NUMERIC,
    average_speed_kmh NUMERIC,
    trip_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(tl.distance_km), 0) as total_distance_km,
        COALESCE(SUM(tl.duration_minutes) / 60.0, 0) as total_operating_hours,
        CASE
            WHEN COUNT(*) > 0 THEN
                COALESCE(100.0 * COUNT(*) FILTER (WHERE tl.trip_type = 'off-road') / COUNT(*), 0)
            ELSE 0
        END as off_road_percentage,
        CASE
            WHEN SUM(tl.duration_minutes) > 0 THEN
                COALESCE(SUM(tl.distance_km) / (SUM(tl.duration_minutes) / 60.0), 0)
            ELSE 0
        END as average_speed_kmh,
        COUNT(*)::INTEGER as trip_count
    FROM trip_logs tl
    WHERE tl.user_id = p_user_id
        AND (p_vehicle_id IS NULL OR tl.vehicle_id = p_vehicle_id)
        AND tl.start_time >= NOW() - INTERVAL '1 day' * p_period_days
        AND tl.end_time IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_usage_statistics TO authenticated;