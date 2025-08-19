
-- SQL schema for user activity analytics system

-- User activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page TEXT,
  session_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content metrics table
CREATE TABLE IF NOT EXISTS public.content_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  average_view_time NUMERIC DEFAULT 0,
  engagement_score NUMERIC DEFAULT 0,
  popularity_rank INTEGER,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(content_id, content_type)
);

-- Session analytics table
CREATE TABLE IF NOT EXISTS public.session_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  duration INTEGER,
  pages_visited INTEGER DEFAULT 0,
  features_used INTEGER DEFAULT 0,
  device_info JSONB,
  UNIQUE(session_id)
);

-- Add Row Level Security to all tables
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can insert their own activity data"
  ON public.user_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can view their own activity data"
  ON public.user_activities
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Content metrics are readable by anyone"
  ON public.content_metrics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own session data"
  ON public.session_analytics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
