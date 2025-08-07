-- Create trips table for storing trip information
-- This table was also missing and referenced by tracks

-- Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    start_location TEXT, -- Coordinate string "lat,lng"
    end_location TEXT,   -- Coordinate string "lat,lng"
    distance_km NUMERIC(10,3) DEFAULT 0,
    difficulty TEXT DEFAULT 'moderate' CHECK (difficulty IN ('easy', 'moderate', 'hard', 'extreme')),
    created_by UUID NOT NULL, -- User ID reference
    is_public BOOLEAN DEFAULT false,
    route_data JSONB DEFAULT '{}', -- Route geometry and waypoints
    metadata JSONB DEFAULT '{}', -- Additional trip data
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_created_by ON public.trips(created_by);
CREATE INDEX IF NOT EXISTS idx_trips_is_public ON public.trips(is_public);
CREATE INDEX IF NOT EXISTS idx_trips_difficulty ON public.trips(difficulty);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON public.trips(created_at);

-- Enable RLS
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trips
CREATE POLICY "Users can view public trips" ON public.trips
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own trips" ON public.trips
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create trips" ON public.trips
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own trips" ON public.trips
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own trips" ON public.trips
    FOR DELETE USING (auth.uid() = created_by);

-- Grant permissions
GRANT ALL ON public.trips TO authenticated;
GRANT SELECT ON public.trips TO anon;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_trips_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_trips_updated_at ON public.trips;
CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON public.trips
    FOR EACH ROW
    EXECUTE FUNCTION update_trips_updated_at();

-- Add foreign key constraint to tracks table (if tracks table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tracks') THEN
        -- Add foreign key constraint
        ALTER TABLE public.tracks 
        ADD CONSTRAINT fk_tracks_trip_id 
        FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Validation message
DO $$
BEGIN
    RAISE NOTICE 'Trips table created successfully!';
    RAISE NOTICE 'Table includes: route_data (JSONB), metadata (JSONB), start/end locations';
    RAISE NOTICE 'RLS policies enabled for user data protection';
    RAISE NOTICE 'Please run this migration in your Supabase dashboard';
END $$;