-- Create tracks table for storing GPX tracks and planned routes
-- This table was missing and causing save/upload failures

-- Create tracks table
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    segments JSONB NOT NULL DEFAULT '{}', -- Track points and bounds
    distance_km NUMERIC(10,3) DEFAULT 0,
    source_type TEXT NOT NULL DEFAULT 'gpx_upload' CHECK (source_type IN ('gpx_upload', 'route_planner', 'manual')),
    created_by UUID NOT NULL, -- User ID reference
    is_public BOOLEAN DEFAULT false,
    visible BOOLEAN DEFAULT true,
    difficulty TEXT DEFAULT 'moderate' CHECK (difficulty IN ('easy', 'moderate', 'hard', 'extreme')),
    trip_id UUID, -- Optional link to trips table
    metadata JSONB DEFAULT '{}', -- Additional data like profile, duration, waypoint count
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracks_created_by ON public.tracks(created_by);
CREATE INDEX IF NOT EXISTS idx_tracks_is_public ON public.tracks(is_public);
CREATE INDEX IF NOT EXISTS idx_tracks_visible ON public.tracks(visible);
CREATE INDEX IF NOT EXISTS idx_tracks_source_type ON public.tracks(source_type);
CREATE INDEX IF NOT EXISTS idx_tracks_trip_id ON public.tracks(trip_id);
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON public.tracks(created_at);

-- Enable RLS
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tracks
CREATE POLICY "Users can view own tracks" ON public.tracks
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can view public tracks" ON public.tracks
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create own tracks" ON public.tracks
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own tracks" ON public.tracks
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own tracks" ON public.tracks
    FOR DELETE USING (auth.uid() = created_by);

-- Grant permissions
GRANT ALL ON public.tracks TO authenticated;
GRANT SELECT ON public.tracks TO anon;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_tracks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tracks_updated_at ON public.tracks;
CREATE TRIGGER update_tracks_updated_at
    BEFORE UPDATE ON public.tracks
    FOR EACH ROW
    EXECUTE FUNCTION update_tracks_updated_at();

-- Validation message
DO $$
BEGIN
    RAISE NOTICE 'Tracks table created successfully!';
    RAISE NOTICE 'Table includes: segments (JSONB), metadata (JSONB), source_type, created_by';
    RAISE NOTICE 'RLS policies enabled for user data protection';
    RAISE NOTICE 'Please run this migration in your Supabase dashboard';
END $$;