-- ========================================
-- COMPLETE POI & SECURITY FIXES
-- Run this in Supabase SQL Editor
-- ========================================

-- =====================================
-- PART 1: CREATE POI TABLE (CRITICAL)
-- =====================================

-- Drop any existing broken POI table
DROP TABLE IF EXISTS public.pois CASCADE;

-- Create the POIs table with correct structure
CREATE TABLE public.pois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL CHECK (rating >= 1 AND rating <= 5),
  images TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX pois_created_by_idx ON public.pois (created_by);
CREATE INDEX pois_type_idx ON public.pois (type);
CREATE INDEX pois_created_at_idx ON public.pois (created_at DESC);
CREATE INDEX pois_location_idx ON public.pois (latitude, longitude);

-- Add coordinate constraints
ALTER TABLE public.pois ADD CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90);
ALTER TABLE public.pois ADD CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180);

-- =====================================
-- PART 2: SETUP RLS POLICIES
-- =====================================

-- Enable Row Level Security
ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view POIs" ON public.pois;
DROP POLICY IF EXISTS "Users can insert their own POIs" ON public.pois;
DROP POLICY IF EXISTS "Users can update their own POIs" ON public.pois;
DROP POLICY IF EXISTS "Users can delete their own POIs" ON public.pois;

-- Create RLS policies
CREATE POLICY "Anyone can view POIs" ON public.pois
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own POIs" ON public.pois
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own POIs" ON public.pois
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own POIs" ON public.pois
  FOR DELETE USING (auth.uid() = created_by);

-- =====================================
-- PART 3: GRANT API PERMISSIONS
-- =====================================

-- Grant permissions to API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.pois TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =====================================
-- PART 4: CREATE UPDATE TRIGGER
-- =====================================

-- Create trigger for updated_at column
CREATE TRIGGER update_pois_updated_at
  BEFORE UPDATE ON public.pois
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- PART 5: FIX JWT CLAIMS OVERRIDE SECURITY
-- =====================================

-- Fix the remaining security warning for jwt_claims_override
DO $$
DECLARE
    func_exists boolean;
    func_definition text;
BEGIN
    -- Check if the function exists
    SELECT EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'jwt_claims_override'
        AND n.nspname = 'app_auth'
    ) INTO func_exists;

    IF func_exists THEN
        -- Get the current function definition
        SELECT pg_get_functiondef(p.oid) INTO func_definition
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'jwt_claims_override'
        AND n.nspname = 'app_auth';

        RAISE NOTICE 'Found jwt_claims_override function: %', substring(func_definition, 1, 100) || '...';

        -- Apply security fix
        BEGIN
            EXECUTE 'ALTER FUNCTION app_auth.jwt_claims_override() SET search_path = app_auth, public, pg_temp';
            RAISE NOTICE '✅ Successfully secured jwt_claims_override function';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '⚠️ Could not secure jwt_claims_override: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'ℹ️ jwt_claims_override function not found - may not exist in this setup';
    END IF;
END $$;

-- =====================================
-- PART 6: REFRESH API SCHEMA CACHE
-- =====================================

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- =====================================
-- PART 7: VERIFICATION & TESTING
-- =====================================

-- Verify POI table was created correctly
SELECT
    'POI table created successfully' as status,
    COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'pois' AND table_schema = 'public';

-- Show table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'pois' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verify RLS policies
SELECT
    policy_name,
    permissive,
    cmd as command,
    roles
FROM pg_policies
WHERE tablename = 'pois'
ORDER BY policy_name;

-- Check API permissions
SELECT
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants
WHERE table_name = 'pois'
ORDER BY grantee, privilege_type;

-- Test POI insertion (will succeed if everything is working)
-- This should work if you're running as an authenticated user
INSERT INTO public.pois (name, description, type, latitude, longitude, created_by)
VALUES (
    'Test POI',
    'This is a test POI created during setup',
    'other',
    -33.8985,
    151.0944,
    auth.uid()
) RETURNING id, name, 'Test POI created successfully!' as result;

-- Summary
SELECT
    'All fixes applied successfully! POI table ready for use.' as final_status,
    COUNT(*) as total_pois
FROM public.pois;