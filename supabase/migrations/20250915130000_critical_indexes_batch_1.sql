CREATE INDEX IF NOT EXISTS idx_user_activities_user_event_timestamp ON user_activities (user_id, event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_session_event_timestamp ON user_activities (session_id, event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_event_timestamp ON user_activities (event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_timestamp ON user_activities (user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips (user_id);