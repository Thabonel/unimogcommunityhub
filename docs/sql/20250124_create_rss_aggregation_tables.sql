-- Create RSS feeds table for managing feed sources
CREATE TABLE IF NOT EXISTS public.rss_feeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  feed_url TEXT NOT NULL UNIQUE,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_fetched_at TIMESTAMPTZ,
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create aggregated content table for storing fetched content
CREATE TABLE IF NOT EXISTS public.aggregated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_id UUID REFERENCES public.rss_feeds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  author VARCHAR(255),
  published_at TIMESTAMPTZ,
  url TEXT UNIQUE NOT NULL,
  guid TEXT,
  category VARCHAR(100),
  tags TEXT[],
  featured_image_url TEXT,
  
  -- Location and trail specific fields
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  distance_km DECIMAL(10, 2),
  elevation_gain_m DECIMAL(10, 2),
  difficulty_level VARCHAR(50),
  
  -- GPX specific fields
  gpx_file_url TEXT,
  track_points_count INTEGER,
  waypoints_count INTEGER,
  
  -- Engagement metrics
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content interactions table for tracking user engagement
CREATE TABLE IF NOT EXISTS public.content_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.aggregated_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- 'view', 'like', 'save', 'download'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(content_id, user_id, interaction_type)
);

-- Create saved content table for user's saved items
CREATE TABLE IF NOT EXISTS public.saved_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.aggregated_content(id) ON DELETE CASCADE,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, content_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rss_feeds_active ON public.rss_feeds(is_active);
CREATE INDEX IF NOT EXISTS idx_rss_feeds_last_fetched ON public.rss_feeds(last_fetched_at);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_feed_id ON public.aggregated_content(feed_id);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_category ON public.aggregated_content(category);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_published ON public.aggregated_content(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_tags ON public.aggregated_content USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_location ON public.aggregated_content(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_difficulty ON public.aggregated_content(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_content_interactions_user ON public.content_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_content_interactions_content ON public.content_interactions(content_id);
CREATE INDEX IF NOT EXISTS idx_saved_content_user ON public.saved_content(user_id);

-- Enable Row Level Security
ALTER TABLE public.rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aggregated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rss_feeds (admin only for management)
CREATE POLICY "Public can view active RSS feeds" ON public.rss_feeds
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage RSS feeds" ON public.rss_feeds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for aggregated_content (public read, admin write)
CREATE POLICY "Public can view aggregated content" ON public.aggregated_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage aggregated content" ON public.aggregated_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for content_interactions
CREATE POLICY "Users can view their own interactions" ON public.content_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions" ON public.content_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" ON public.content_interactions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for saved_content
CREATE POLICY "Users can view their own saved content" ON public.saved_content
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save content" ON public.saved_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their saved content" ON public.saved_content
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved content" ON public.saved_content
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update content engagement metrics
CREATE OR REPLACE FUNCTION update_content_metrics()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update the appropriate count based on interaction type
    IF NEW.interaction_type = 'view' THEN
      UPDATE public.aggregated_content 
      SET views_count = views_count + 1,
          updated_at = NOW()
      WHERE id = NEW.content_id;
    ELSIF NEW.interaction_type = 'like' THEN
      UPDATE public.aggregated_content 
      SET likes_count = likes_count + 1,
          updated_at = NOW()
      WHERE id = NEW.content_id;
    ELSIF NEW.interaction_type = 'save' THEN
      UPDATE public.aggregated_content 
      SET saves_count = saves_count + 1,
          updated_at = NOW()
      WHERE id = NEW.content_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrease the count when interaction is removed
    IF OLD.interaction_type = 'like' THEN
      UPDATE public.aggregated_content 
      SET likes_count = GREATEST(0, likes_count - 1),
          updated_at = NOW()
      WHERE id = OLD.content_id;
    ELSIF OLD.interaction_type = 'save' THEN
      UPDATE public.aggregated_content 
      SET saves_count = GREATEST(0, saves_count - 1),
          updated_at = NOW()
      WHERE id = OLD.content_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating metrics
CREATE TRIGGER update_content_metrics_trigger
AFTER INSERT OR DELETE ON public.content_interactions
FOR EACH ROW
EXECUTE FUNCTION update_content_metrics();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_rss_feeds_updated_at BEFORE UPDATE ON public.rss_feeds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aggregated_content_updated_at BEFORE UPDATE ON public.aggregated_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();