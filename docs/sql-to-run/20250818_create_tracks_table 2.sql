-- ====================================
-- TRACKS TABLE FOR ROUTE STORAGE
-- ====================================
-- This migration creates the tracks table for storing user routes, GPX data, and trip planning

-- Create tracks table
CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic route information
  name TEXT NOT NULL,
  description TEXT,
  
  -- Route data storage (JSON format for flexibility)
  segments JSONB NOT NULL, -- Contains points, bounds, waypoints
  
  -- Route metrics  
  distance_km DECIMAL(10,3) DEFAULT 0,
  
  -- Route source and type
  source_type TEXT NOT NULL CHECK (source_type IN ('gpx_upload', 'route_planner', 'manual')),
  difficulty TEXT DEFAULT 'moderate' CHECK (difficulty IN ('easy', 'moderate', 'hard', 'expert')),
  
  -- User association
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Visibility settings
  is_public BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  
  -- Additional metadata (JSON for flexibility)
  metadata JSONB DEFAULT '{}',
  
  -- Trip association (optional)
  trip_id UUID, -- Reference to trips table when implemented
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS tracks_created_by_idx ON public.tracks(created_by);
CREATE INDEX IF NOT EXISTS tracks_is_public_idx ON public.tracks(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS tracks_visible_idx ON public.tracks(visible) WHERE visible = true;
CREATE INDEX IF NOT EXISTS tracks_source_type_idx ON public.tracks(source_type);
CREATE INDEX IF NOT EXISTS tracks_difficulty_idx ON public.tracks(difficulty);
CREATE INDEX IF NOT EXISTS tracks_created_at_idx ON public.tracks(created_at DESC);

-- Enable RLS
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own tracks
CREATE POLICY "Users can view own tracks" ON public.tracks
  FOR SELECT USING (auth.uid() = created_by);

-- Users can view public tracks
CREATE POLICY "Anyone can view public tracks" ON public.tracks
  FOR SELECT USING (is_public = true AND visible = true);

-- Users can insert their own tracks
CREATE POLICY "Users can create own tracks" ON public.tracks
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Users can update their own tracks
CREATE POLICY "Users can update own tracks" ON public.tracks
  FOR UPDATE USING (auth.uid() = created_by);

-- Users can delete their own tracks  
CREATE POLICY "Users can delete own tracks" ON public.tracks
  FOR DELETE USING (auth.uid() = created_by);

-- Admins can view all tracks
CREATE POLICY "Admins can view all tracks" ON public.tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Add trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_tracks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tracks_updated_at_trigger
  BEFORE UPDATE ON public.tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_tracks_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.tracks IS 'Stores user routes from GPX uploads, route planning, and manual entry';
COMMENT ON COLUMN public.tracks.segments IS 'JSON containing route points, bounds, and waypoints';
COMMENT ON COLUMN public.tracks.metadata IS 'JSON containing additional route data like profile, duration, notes, images, etc.';
COMMENT ON COLUMN public.tracks.source_type IS 'How the track was created: gpx_upload, route_planner, or manual';
COMMENT ON COLUMN public.tracks.difficulty IS 'Route difficulty level: easy, moderate, hard, expert';