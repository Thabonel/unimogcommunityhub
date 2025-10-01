-- Remove unused indexes from aggregated_content (keep only primary key)
DROP INDEX IF EXISTS idx_aggregated_content_category;
DROP INDEX IF EXISTS idx_aggregated_content_category_created;
DROP INDEX IF EXISTS idx_aggregated_content_created_at;
DROP INDEX IF EXISTS idx_aggregated_content_difficulty;
DROP INDEX IF EXISTS idx_aggregated_content_feed_id;
DROP INDEX IF EXISTS idx_aggregated_content_guid;
DROP INDEX IF EXISTS idx_aggregated_content_location;
DROP INDEX IF EXISTS idx_aggregated_content_published;
DROP INDEX IF EXISTS idx_aggregated_content_tags;
DROP INDEX IF EXISTS idx_aggregated_content_updated_at;

-- Remove unused indexes from posts (keep only primary key)
DROP INDEX IF EXISTS idx_posts_created_at;
DROP INDEX IF EXISTS idx_posts_metadata;
DROP INDEX IF EXISTS idx_posts_post_type;
DROP INDEX IF EXISTS idx_posts_updated_at;
DROP INDEX IF EXISTS idx_posts_user_created;
DROP INDEX IF EXISTS idx_posts_user_id_created_at;
DROP INDEX IF EXISTS idx_posts_visibility;
DROP INDEX IF EXISTS posts_user_id_index;

-- Remove unused indexes from trips (keep primary key and most used index)
DROP INDEX IF EXISTS idx_trips_completed;
DROP INDEX IF EXISTS idx_trips_created_at;
DROP INDEX IF EXISTS idx_trips_difficulty;
DROP INDEX IF EXISTS idx_trips_end_coordinates;
DROP INDEX IF EXISTS idx_trips_is_completed;
DROP INDEX IF EXISTS idx_trips_is_public;
DROP INDEX IF EXISTS idx_trips_public;
DROP INDEX IF EXISTS idx_trips_shared_groups;
DROP INDEX IF EXISTS idx_trips_shared_users;
DROP INDEX IF EXISTS idx_trips_start_coordinates;
DROP INDEX IF EXISTS idx_trips_tags;
DROP INDEX IF EXISTS idx_trips_terrain_types;
DROP INDEX IF EXISTS idx_trips_trip_type;
DROP INDEX IF EXISTS idx_trips_updated_at;
DROP INDEX IF EXISTS idx_trips_user_id;
DROP INDEX IF EXISTS idx_trips_visibility;

-- Remove unused indexes from user_activities (keep primary key and most used indexes)
DROP INDEX IF EXISTS idx_user_activities_event_id;
DROP INDEX IF EXISTS idx_user_activities_event_timestamp;
DROP INDEX IF EXISTS idx_user_activities_session_event_timestamp;
DROP INDEX IF EXISTS idx_user_activities_session_id;
DROP INDEX IF EXISTS idx_user_activities_timestamp;
DROP INDEX IF EXISTS idx_user_activities_user_event_timestamp;
DROP INDEX IF EXISTS idx_user_activities_user_timestamp;