-- Fix search_path security vulnerability in get_usage_statistics function
-- Issue: Function has SECURITY DEFINER without SET search_path
-- Risk: Search path injection attack allowing privilege escalation
-- Supabase Linter: function_search_path_mutable

-- Drop and recreate the function with proper security settings
CREATE OR REPLACE FUNCTION public.get_usage_statistics(
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
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp  -- 🔒 SECURITY FIX: Prevents search path injection
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(distance_km), 0) as total_distance_km,
        COALESCE(SUM(duration_minutes), 0) / 60.0 as total_operating_hours,
        CASE
            WHEN COUNT(*) > 0 THEN
                (COUNT(*) FILTER (WHERE trip_type IN ('off-road', 'mixed')) * 100.0 / COUNT(*))
            ELSE 0
        END as off_road_percentage,
        COALESCE(AVG(average_speed_kmh), 0) as average_speed_kmh,
        COUNT(*)::INTEGER as trip_count
    FROM public.trip_logs  -- 🔒 SECURITY FIX: Fully qualified table name
    WHERE user_id = p_user_id
        AND (p_vehicle_id IS NULL OR vehicle_id = p_vehicle_id)
        AND start_time >= NOW() - INTERVAL '1 day' * p_period_days
        AND end_time IS NOT NULL; -- Only completed trips
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_usage_statistics(UUID, UUID, INTEGER) TO authenticated;

-- Verify the fix
COMMENT ON FUNCTION public.get_usage_statistics IS 'Calculate trip usage statistics with secure search_path. Fixed: function_search_path_mutable vulnerability.';