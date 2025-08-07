-- Fix and ensure tracks and trips tables have all required columns
-- This migration safely adds missing columns and policies

-- ============================================
-- 1. Create trips table if it doesn't exist
-- ============================================
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    start_location TEXT,
    end_location TEXT,
    distance_km NUMERIC(10,3) DEFAULT 0,
    created_by UUID NOT NULL,
    is_public BOOLEAN DEFAULT false,
    route_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. Create tracks table if it doesn't exist
-- ============================================
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    segments JSONB NOT NULL DEFAULT '{}',
    distance_km NUMERIC(10,3) DEFAULT 0,
    source_type TEXT NOT NULL DEFAULT 'gpx_upload',
    created_by UUID NOT NULL,
    is_public BOOLEAN DEFAULT false,
    visible BOOLEAN DEFAULT true,
    trip_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. Add missing columns to tracks table if they don't exist
-- ============================================
DO $$
BEGIN
    -- Add metadata column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'tracks' AND column_name = 'metadata') THEN
        ALTER TABLE public.tracks ADD COLUMN metadata JSONB DEFAULT '{}';
        RAISE NOTICE 'Added metadata column to tracks table';
    END IF;

    -- Add source_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'tracks' AND column_name = 'source_type') THEN
        ALTER TABLE public.tracks ADD COLUMN source_type TEXT NOT NULL DEFAULT 'gpx_upload';
        ALTER TABLE public.tracks ADD CONSTRAINT tracks_source_type_check 
            CHECK (source_type IN ('gpx_upload', 'route_planner', 'manual'));
        RAISE NOTICE 'Added source_type column to tracks table';
    END IF;

    -- Add segments column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'tracks' AND column_name = 'segments') THEN
        ALTER TABLE public.tracks ADD COLUMN segments JSONB NOT NULL DEFAULT '{}';
        RAISE NOTICE 'Added segments column to tracks table';
    END IF;

    -- Add visible column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'tracks' AND column_name = 'visible') THEN
        ALTER TABLE public.tracks ADD COLUMN visible BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added visible column to tracks table';
    END IF;

    -- Add trip_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'tracks' AND column_name = 'trip_id') THEN
        ALTER TABLE public.tracks ADD COLUMN trip_id UUID;
        RAISE NOTICE 'Added trip_id column to tracks table';
    END IF;

    -- Add difficulty column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'tracks' AND column_name = 'difficulty') THEN
        ALTER TABLE public.tracks ADD COLUMN difficulty TEXT DEFAULT 'moderate';
        ALTER TABLE public.tracks ADD CONSTRAINT tracks_difficulty_check 
            CHECK (difficulty IN ('easy', 'moderate', 'hard', 'extreme'));
        RAISE NOTICE 'Added difficulty column to tracks table';
    END IF;

    -- Fix created_by column type if it's TEXT (convert to UUID)
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'tracks' 
              AND column_name = 'created_by' 
              AND data_type = 'text') THEN
        -- First drop dependent policies
        DROP POLICY IF EXISTS "Users can view own tracks" ON public.tracks;
        DROP POLICY IF EXISTS "Users can create own tracks" ON public.tracks;
        DROP POLICY IF EXISTS "Users can update own tracks" ON public.tracks;
        DROP POLICY IF EXISTS "Users can delete own tracks" ON public.tracks;
        
        -- Convert column type
        ALTER TABLE public.tracks ALTER COLUMN created_by TYPE UUID USING created_by::UUID;
        RAISE NOTICE 'Converted created_by column from TEXT to UUID in tracks table';
    END IF;
END $$;

-- ============================================
-- 4. Add missing columns to trips table if they don't exist
-- ============================================
DO $$
BEGIN
    -- Add difficulty column if it doesn't exist (CRITICAL - this is missing!)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'trips' AND column_name = 'difficulty') THEN
        ALTER TABLE public.trips ADD COLUMN difficulty TEXT DEFAULT 'moderate';
        ALTER TABLE public.trips ADD CONSTRAINT trips_difficulty_check 
            CHECK (difficulty IN ('easy', 'moderate', 'hard', 'extreme'));
        RAISE NOTICE 'Added difficulty column to trips table';
    END IF;

    -- Add metadata column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'trips' AND column_name = 'metadata') THEN
        ALTER TABLE public.trips ADD COLUMN metadata JSONB DEFAULT '{}';
        RAISE NOTICE 'Added metadata column to trips table';
    END IF;

    -- Add route_data column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'trips' AND column_name = 'route_data') THEN
        ALTER TABLE public.trips ADD COLUMN route_data JSONB DEFAULT '{}';
        RAISE NOTICE 'Added route_data column to trips table';
    END IF;

    -- Fix created_by column type if it's TEXT (convert to UUID)
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'trips' 
              AND column_name = 'created_by' 
              AND data_type = 'text') THEN
        -- First drop dependent policies
        DROP POLICY IF EXISTS "Users can view own trips" ON public.trips;
        DROP POLICY IF EXISTS "Users can create trips" ON public.trips;
        DROP POLICY IF EXISTS "Users can update own trips" ON public.trips;
        DROP POLICY IF EXISTS "Users can delete own trips" ON public.trips;
        
        -- Convert column type
        ALTER TABLE public.trips ALTER COLUMN created_by TYPE UUID USING created_by::UUID;
        RAISE NOTICE 'Converted created_by column from TEXT to UUID in trips table';
    END IF;
END $$;

-- ============================================
-- 5. Add foreign key constraint if it doesn't exist
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE constraint_name = 'fk_tracks_trip_id') THEN
        ALTER TABLE public.tracks 
        ADD CONSTRAINT fk_tracks_trip_id 
        FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added foreign key constraint fk_tracks_trip_id';
    END IF;
END $$;

-- ============================================
-- 6. Create indexes if they don't exist
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tracks_created_by ON public.tracks(created_by);
CREATE INDEX IF NOT EXISTS idx_tracks_is_public ON public.tracks(is_public);
CREATE INDEX IF NOT EXISTS idx_tracks_visible ON public.tracks(visible);
CREATE INDEX IF NOT EXISTS idx_tracks_source_type ON public.tracks(source_type);
CREATE INDEX IF NOT EXISTS idx_tracks_trip_id ON public.tracks(trip_id);
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON public.tracks(created_at);

CREATE INDEX IF NOT EXISTS idx_trips_created_by ON public.trips(created_by);
CREATE INDEX IF NOT EXISTS idx_trips_is_public ON public.trips(is_public);
CREATE INDEX IF NOT EXISTS idx_trips_difficulty ON public.trips(difficulty);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON public.trips(created_at);

-- ============================================
-- 7. Enable RLS if not already enabled
-- ============================================
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. Create RLS policies (drop and recreate to ensure correct types)
-- ============================================

-- Tracks policies
DROP POLICY IF EXISTS "Users can view own tracks" ON public.tracks;
CREATE POLICY "Users can view own tracks" ON public.tracks
    FOR SELECT USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can view public tracks" ON public.tracks;
CREATE POLICY "Users can view public tracks" ON public.tracks
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can create own tracks" ON public.tracks;
CREATE POLICY "Users can create own tracks" ON public.tracks
    FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own tracks" ON public.tracks;
CREATE POLICY "Users can update own tracks" ON public.tracks
    FOR UPDATE USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete own tracks" ON public.tracks;
CREATE POLICY "Users can delete own tracks" ON public.tracks
    FOR DELETE USING (auth.uid() = created_by);

-- Trips policies
DROP POLICY IF EXISTS "Users can view public trips" ON public.trips;
CREATE POLICY "Users can view public trips" ON public.trips
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can view own trips" ON public.trips;
CREATE POLICY "Users can view own trips" ON public.trips
    FOR SELECT USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can create trips" ON public.trips;
CREATE POLICY "Users can create trips" ON public.trips
    FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own trips" ON public.trips;
CREATE POLICY "Users can update own trips" ON public.trips
    FOR UPDATE USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete own trips" ON public.trips;
CREATE POLICY "Users can delete own trips" ON public.trips
    FOR DELETE USING (auth.uid() = created_by);

-- ============================================
-- 9. Grant permissions
-- ============================================
GRANT ALL ON public.tracks TO authenticated;
GRANT SELECT ON public.tracks TO anon;
GRANT ALL ON public.trips TO authenticated;
GRANT SELECT ON public.trips TO anon;

-- ============================================
-- 10. Create updated_at triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
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
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trips_updated_at ON public.trips;
CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON public.trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. Validation Report
-- ============================================
DO $$
DECLARE
    tracks_exists BOOLEAN;
    trips_exists BOOLEAN;
    metadata_exists BOOLEAN;
    segments_exists BOOLEAN;
BEGIN
    -- Check if tables exist
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tracks') INTO tracks_exists;
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'trips') INTO trips_exists;
    
    -- Check if critical columns exist
    SELECT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'tracks' AND column_name = 'metadata') INTO metadata_exists;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'tracks' AND column_name = 'segments') INTO segments_exists;
    
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Migration Validation Report:';
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Tracks table exists: %', tracks_exists;
    RAISE NOTICE 'Trips table exists: %', trips_exists;
    RAISE NOTICE 'Tracks.metadata column exists: %', metadata_exists;
    RAISE NOTICE 'Tracks.segments column exists: %', segments_exists;
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Your route saving and track upload should now work.';
    RAISE NOTICE '===========================================';
END $$;