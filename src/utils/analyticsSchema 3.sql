
-- SQL schema for Analytics tracking system

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

-- Enable RLS for user_activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own activity data
CREATE POLICY "Users can insert their own activity data"
  ON public.user_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Allow users to select their own activity data
CREATE POLICY "Users can view their own activity data"
  ON public.user_activities
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Content metrics table for aggregated stats
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

-- Enable RLS for content_metrics
ALTER TABLE public.content_metrics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read content metrics
CREATE POLICY "Content metrics are readable by anyone"
  ON public.content_metrics
  FOR SELECT
  TO authenticated
  USING (true);

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

-- Enable RLS for session_analytics
ALTER TABLE public.session_analytics ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own session data
CREATE POLICY "Users can view their own session data"
  ON public.session_analytics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Function to get top contributors
CREATE OR REPLACE FUNCTION public.get_top_contributors(
  time_period_start TIMESTAMPTZ,
  contributor_limit INTEGER DEFAULT 5
)
RETURNS TABLE(user_id UUID, count BIGINT) 
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    user_id,
    COUNT(*) as count
  FROM public.user_activities
  WHERE 
    user_id IS NOT NULL
    AND timestamp >= time_period_start
  GROUP BY user_id
  ORDER BY count DESC
  LIMIT contributor_limit;
$$;

-- Function to update content metrics based on activities
CREATE OR REPLACE FUNCTION update_content_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process relevant event types
  IF NEW.event_type IN ('page_view', 'post_like', 'post_comment', 'post_share', 'feature_use') THEN
    -- Extract content_id and content_type from event_data
    IF NEW.event_data ? 'content_id' AND NEW.event_data ? 'content_type' THEN
      -- Insert or update content metrics
      INSERT INTO public.content_metrics (
        content_id,
        content_type,
        last_updated
      )
      VALUES (
        NEW.event_data->>'content_id',
        NEW.event_data->>'content_type',
        NOW()
      )
      ON CONFLICT (content_id, content_type) DO UPDATE
      SET last_updated = NOW();
      
      -- Update specific metrics based on event_type
      IF NEW.event_type = 'page_view' THEN
        UPDATE public.content_metrics
        SET views = views + 1
        WHERE content_id = NEW.event_data->>'content_id'
        AND content_type = NEW.event_data->>'content_type';
      ELSIF NEW.event_type = 'post_like' THEN
        UPDATE public.content_metrics
        SET likes = likes + 1
        WHERE content_id = NEW.event_data->>'content_id'
        AND content_type = NEW.event_data->>'content_type';
      ELSIF NEW.event_type = 'post_comment' THEN
        UPDATE public.content_metrics
        SET comments = comments + 1
        WHERE content_id = NEW.event_data->>'content_id'
        AND content_type = NEW.event_data->>'content_type';
      ELSIF NEW.event_type = 'post_share' THEN
        UPDATE public.content_metrics
        SET shares = shares + 1
        WHERE content_id = NEW.event_data->>'content_id'
        AND content_type = NEW.event_data->>'content_type';
      ELSIF NEW.event_type = 'feature_use' AND NEW.event_data->>'action' = 'view_duration' THEN
        -- Update average view time
        UPDATE public.content_metrics
        SET 
          average_view_time = (
            (average_view_time * views + COALESCE((NEW.event_data->>'view_time')::numeric, 0)) / 
            NULLIF(views, 0)
          )
        WHERE content_id = NEW.event_data->>'content_id'
        AND content_type = NEW.event_data->>'content_type';
      END IF;
      
      -- Recalculate engagement score
      UPDATE public.content_metrics
      SET engagement_score = (
        (COALESCE(likes, 0) * 1.0 / NULLIF(views, 0)) +
        (COALESCE(comments, 0) * 5.0 / NULLIF(views, 0)) +
        (COALESCE(shares, 0) * 10.0 / NULLIF(views, 0)) +
        (0.1 * ln(COALESCE(views, 0) + 1)) +
        (0.05 * COALESCE(average_view_time, 0))
      )
      WHERE content_id = NEW.event_data->>'content_id'
      AND content_type = NEW.event_data->>'content_type';
    END IF;
  END IF;
  
  -- Track session data
  IF NEW.event_type = 'session_start' THEN
    INSERT INTO public.session_analytics (
      session_id,
      user_id,
      start_time,
      device_info
    )
    VALUES (
      NEW.session_id,
      NEW.user_id,
      NEW.timestamp,
      COALESCE(NEW.event_data, '{}'::jsonb)
    )
    ON CONFLICT (session_id) DO NOTHING;
  ELSIF NEW.event_type = 'session_end' THEN
    UPDATE public.session_analytics
    SET 
      end_time = NEW.timestamp,
      duration = COALESCE((NEW.event_data->>'duration')::integer, 0)
    WHERE session_id = NEW.session_id;
  ELSIF NEW.event_type = 'page_view' THEN
    UPDATE public.session_analytics
    SET pages_visited = pages_visited + 1
    WHERE session_id = NEW.session_id;
  ELSIF NEW.event_type = 'feature_use' THEN
    UPDATE public.session_analytics
    SET features_used = features_used + 1
    WHERE session_id = NEW.session_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_activities
DROP TRIGGER IF EXISTS update_metrics_on_activity ON public.user_activities;
CREATE TRIGGER update_metrics_on_activity
AFTER INSERT ON public.user_activities
FOR EACH ROW EXECUTE FUNCTION update_content_metrics();

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_user_activities_event_type ON public.user_activities(event_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_session_id ON public.user_activities(session_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_timestamp ON public.user_activities(timestamp);
