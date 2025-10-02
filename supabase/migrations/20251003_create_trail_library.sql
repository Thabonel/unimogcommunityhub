CREATE TABLE IF NOT EXISTS user_trail_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    trail_name TEXT NOT NULL,
    trail_description TEXT,
    trail_source TEXT DEFAULT 'osm' CHECK (trail_source IN ('osm', 'user_upload', 'community', 'government')),
    osm_way_id BIGINT,

    geojson_data JSONB NOT NULL,

    distance_meters NUMERIC(10,2),
    elevation_gain_meters NUMERIC(7,2),
    elevation_loss_meters NUMERIC(7,2),
    min_elevation_meters NUMERIC(7,2),
    max_elevation_meters NUMERIC(7,2),
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'difficult', 'extreme')),
    terrain_types TEXT[],

    bounds JSONB,

    is_favorite BOOLEAN DEFAULT false,
    times_driven INTEGER DEFAULT 0,
    last_driven_at TIMESTAMPTZ,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_notes TEXT,

    is_public BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trail_library_user ON user_trail_library(user_id);
CREATE INDEX IF NOT EXISTS idx_trail_library_name ON user_trail_library(trail_name);
CREATE INDEX IF NOT EXISTS idx_trail_library_source ON user_trail_library(trail_source);
CREATE INDEX IF NOT EXISTS idx_trail_library_public ON user_trail_library(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_trail_library_osm_id ON user_trail_library(osm_way_id) WHERE osm_way_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trail_library_geojson ON user_trail_library USING GIN (geojson_data);

ALTER TABLE user_trail_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trails" ON user_trail_library
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public trails" ON user_trail_library
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own trails" ON user_trail_library
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own trails" ON user_trail_library
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own trails" ON user_trail_library
    FOR DELETE USING (user_id = auth.uid());
