-- ====================================
-- RSS FEED CONTENT AGGREGATION SYSTEM
-- ====================================
-- This migration creates tables for RSS feed management and content aggregation

-- ====================================
-- STEP 1: CREATE RSS FEEDS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS rss_feeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  feed_url TEXT NOT NULL UNIQUE,
  website_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  
  -- Feed metadata
  last_fetched_at TIMESTAMPTZ,
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Feed settings
  fetch_frequency_minutes INTEGER DEFAULT 60, -- How often to check for updates
  auto_categorize BOOLEAN DEFAULT true,
  
  -- User association
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- STEP 2: CREATE AGGREGATED CONTENT TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS aggregated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_id UUID NOT NULL REFERENCES rss_feeds(id) ON DELETE CASCADE,
  
  -- Content metadata
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Full content if available
  summary TEXT, -- AI-generated summary
  author TEXT,
  published_at TIMESTAMPTZ,
  url TEXT NOT NULL,
  guid TEXT, -- RSS GUID for deduplication
  
  -- Categorization
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'difficult', 'extreme')),
  
  -- Location data
  location_name TEXT,
  latitude FLOAT,
  longitude FLOAT,
  country TEXT,
  region TEXT,
  
  -- Trail/Route specific data
  distance_km FLOAT,
  elevation_gain_m FLOAT,
  duration_hours FLOAT,
  trail_type TEXT,
  
  -- Media
  featured_image_url TEXT,
  images TEXT[] DEFAULT '{}',
  gpx_url TEXT,
  
  -- Engagement metrics
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  
  -- Processing status
  is_processed BOOLEAN DEFAULT false,
  processing_error TEXT,
  embeddings vector(1536), -- For semantic search
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- STEP 3: CREATE USER SAVED CONTENT TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS user_saved_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES aggregated_content(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  UNIQUE(user_id, content_id)
);

-- ====================================
-- STEP 4: CREATE CONTENT LIKES TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS content_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES aggregated_content(id) ON DELETE CASCADE,
  liked_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, content_id)
);

-- ====================================
-- STEP 5: CREATE RSS FEED CATEGORIES TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS feed_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  parent_id UUID REFERENCES feed_categories(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO feed_categories (name, description, icon, color) VALUES
  ('Trail Reports', 'Recent trail conditions and trip reports', 'map', '#4ade80'),
  ('Route Guides', 'Detailed route descriptions and guides', 'route', '#3b82f6'),
  ('Gear Reviews', 'Equipment reviews and recommendations', 'tool', '#f59e0b'),
  ('News & Events', 'Unimog community news and events', 'newspaper', '#8b5cf6'),
  ('Technical', 'Maintenance tips and technical articles', 'wrench', '#ef4444'),
  ('Adventures', 'Adventure stories and expedition reports', 'globe', '#10b981')
ON CONFLICT (name) DO NOTHING;

-- ====================================
-- STEP 6: CREATE INDEXES
-- ====================================

-- RSS Feeds indexes
CREATE INDEX IF NOT EXISTS idx_rss_feeds_category ON rss_feeds(category);
CREATE INDEX IF NOT EXISTS idx_rss_feeds_active ON rss_feeds(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_rss_feeds_last_fetched ON rss_feeds(last_fetched_at);

-- Aggregated Content indexes
CREATE INDEX IF NOT EXISTS idx_aggregated_content_feed_id ON aggregated_content(feed_id);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_published ON aggregated_content(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_category ON aggregated_content(category);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_location ON aggregated_content(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_guid ON aggregated_content(guid);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_processed ON aggregated_content(is_processed);

-- User interaction indexes
CREATE INDEX IF NOT EXISTS idx_user_saved_content_user ON user_saved_content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_likes_user ON content_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_content_likes_content ON content_likes(content_id);

-- ====================================
-- STEP 7: ENABLE RLS
-- ====================================

ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE aggregated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_categories ENABLE ROW LEVEL SECURITY;

-- ====================================
-- STEP 8: CREATE RLS POLICIES
-- ====================================

-- RSS Feeds policies
CREATE POLICY "rss_feeds_public_read" ON rss_feeds
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "rss_feeds_admin_all" ON rss_feeds
  FOR ALL
  USING (check_admin_access());

-- Aggregated Content policies
CREATE POLICY "aggregated_content_public_read" ON aggregated_content
  FOR SELECT
  USING (true);

CREATE POLICY "aggregated_content_admin_write" ON aggregated_content
  FOR INSERT
  WITH CHECK (check_admin_access());

CREATE POLICY "aggregated_content_admin_update" ON aggregated_content
  FOR UPDATE
  USING (check_admin_access());

CREATE POLICY "aggregated_content_admin_delete" ON aggregated_content
  FOR DELETE
  USING (check_admin_access());

-- User Saved Content policies
CREATE POLICY "user_saved_content_own" ON user_saved_content
  FOR ALL
  USING (user_id = auth.uid());

-- Content Likes policies
CREATE POLICY "content_likes_public_read" ON content_likes
  FOR SELECT
  USING (true);

CREATE POLICY "content_likes_own_write" ON content_likes
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "content_likes_own_delete" ON content_likes
  FOR DELETE
  USING (user_id = auth.uid());

-- Feed Categories policies
CREATE POLICY "feed_categories_public_read" ON feed_categories
  FOR SELECT
  USING (true);

CREATE POLICY "feed_categories_admin_write" ON feed_categories
  FOR ALL
  USING (check_admin_access());

-- ====================================
-- STEP 9: CREATE HELPER FUNCTIONS
-- ====================================

-- Function to get aggregated content with user interactions
CREATE OR REPLACE FUNCTION get_aggregated_content(
  p_category TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  feed_id UUID,
  feed_name TEXT,
  title TEXT,
  description TEXT,
  summary TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  url TEXT,
  category TEXT,
  tags TEXT[],
  difficulty_level TEXT,
  location_name TEXT,
  latitude FLOAT,
  longitude FLOAT,
  distance_km FLOAT,
  elevation_gain_m FLOAT,
  featured_image_url TEXT,
  view_count INTEGER,
  like_count INTEGER,
  save_count INTEGER,
  is_liked BOOLEAN,
  is_saved BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ac.id,
    ac.feed_id,
    rf.name as feed_name,
    ac.title,
    ac.description,
    ac.summary,
    ac.author,
    ac.published_at,
    ac.url,
    ac.category,
    ac.tags,
    ac.difficulty_level,
    ac.location_name,
    ac.latitude,
    ac.longitude,
    ac.distance_km,
    ac.elevation_gain_m,
    ac.featured_image_url,
    ac.view_count,
    ac.like_count,
    ac.save_count,
    EXISTS (
      SELECT 1 FROM content_likes cl 
      WHERE cl.content_id = ac.id AND cl.user_id = auth.uid()
    ) as is_liked,
    EXISTS (
      SELECT 1 FROM user_saved_content usc 
      WHERE usc.content_id = ac.id AND usc.user_id = auth.uid()
    ) as is_saved
  FROM aggregated_content ac
  JOIN rss_feeds rf ON rf.id = ac.feed_id
  WHERE 
    (p_category IS NULL OR ac.category = p_category)
    AND (p_tags IS NULL OR ac.tags && p_tags)
    AND rf.is_active = true
  ORDER BY ac.published_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle content like
CREATE OR REPLACE FUNCTION toggle_content_like(p_content_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- Check if like exists
  SELECT EXISTS (
    SELECT 1 FROM content_likes 
    WHERE content_id = p_content_id AND user_id = auth.uid()
  ) INTO v_exists;
  
  IF v_exists THEN
    -- Remove like
    DELETE FROM content_likes 
    WHERE content_id = p_content_id AND user_id = auth.uid();
    
    -- Update like count
    UPDATE aggregated_content 
    SET like_count = GREATEST(0, like_count - 1)
    WHERE id = p_content_id;
    
    RETURN FALSE;
  ELSE
    -- Add like
    INSERT INTO content_likes (user_id, content_id)
    VALUES (auth.uid(), p_content_id);
    
    -- Update like count
    UPDATE aggregated_content 
    SET like_count = like_count + 1
    WHERE id = p_content_id;
    
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to save/unsave content
CREATE OR REPLACE FUNCTION toggle_content_save(
  p_content_id UUID,
  p_notes TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- Check if saved
  SELECT EXISTS (
    SELECT 1 FROM user_saved_content 
    WHERE content_id = p_content_id AND user_id = auth.uid()
  ) INTO v_exists;
  
  IF v_exists THEN
    -- Remove save
    DELETE FROM user_saved_content 
    WHERE content_id = p_content_id AND user_id = auth.uid();
    
    -- Update save count
    UPDATE aggregated_content 
    SET save_count = GREATEST(0, save_count - 1)
    WHERE id = p_content_id;
    
    RETURN FALSE;
  ELSE
    -- Add save
    INSERT INTO user_saved_content (user_id, content_id, notes, tags)
    VALUES (auth.uid(), p_content_id, p_notes, p_tags);
    
    -- Update save count
    UPDATE aggregated_content 
    SET save_count = save_count + 1
    WHERE id = p_content_id;
    
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- STEP 10: CREATE TRIGGERS
-- ====================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rss_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rss_feeds_updated_at
  BEFORE UPDATE ON rss_feeds
  FOR EACH ROW
  EXECUTE FUNCTION update_rss_updated_at();

CREATE TRIGGER update_aggregated_content_updated_at
  BEFORE UPDATE ON aggregated_content
  FOR EACH ROW
  EXECUTE FUNCTION update_rss_updated_at();

-- Increment view count
CREATE OR REPLACE FUNCTION increment_content_view()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE aggregated_content 
  SET view_count = view_count + 1
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- STEP 11: GRANT PERMISSIONS
-- ====================================

GRANT ALL ON rss_feeds TO authenticated;
GRANT ALL ON aggregated_content TO authenticated;
GRANT ALL ON user_saved_content TO authenticated;
GRANT ALL ON content_likes TO authenticated;
GRANT ALL ON feed_categories TO authenticated;

GRANT EXECUTE ON FUNCTION get_aggregated_content(TEXT, TEXT[], INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_content_like(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_content_save(UUID, TEXT, TEXT[]) TO authenticated;

-- ====================================
-- STEP 12: INSERT DEFAULT RSS FEEDS
-- ====================================

-- Add some default RSS feeds for Unimog content
INSERT INTO rss_feeds (name, description, feed_url, website_url, category, tags) VALUES
  ('Expedition Portal - Unimog', 'Latest Unimog articles from Expedition Portal', 'https://expeditionportal.com/feed/?s=unimog', 'https://expeditionportal.com', 'Adventures', ARRAY['unimog', 'expedition', 'overland']),
  ('Overland Journal', 'Overland travel stories and vehicle builds', 'https://overlandjournal.com/feed/', 'https://overlandjournal.com', 'Adventures', ARRAY['overland', 'expedition', 'vehicles']),
  ('TrailReports.com', 'Trail condition reports and GPS tracks', 'https://www.trailreports.com/rss.xml', 'https://www.trailreports.com', 'Trail Reports', ARRAY['trails', 'conditions', 'hiking'])
ON CONFLICT (feed_url) DO NOTHING;

-- ====================================
-- STEP 13: REFRESH SCHEMA
-- ====================================

NOTIFY pgrst, 'reload schema';

-- Return success
SELECT 'RSS feed aggregation system created successfully!' as message;