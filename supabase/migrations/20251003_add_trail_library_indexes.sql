CREATE INDEX IF NOT EXISTS idx_trail_library_user_id ON user_trail_library(user_id);

CREATE INDEX IF NOT EXISTS idx_trail_library_created_at ON user_trail_library(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trail_library_is_favorite ON user_trail_library(is_favorite) WHERE is_favorite = true;

CREATE INDEX IF NOT EXISTS idx_trail_library_trail_source ON user_trail_library(trail_source);

CREATE INDEX IF NOT EXISTS idx_trail_library_osm_way_id ON user_trail_library(osm_way_id) WHERE osm_way_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_trail_library_search ON user_trail_library USING gin(to_tsvector('english', trail_name));
