-- CRITICAL FIXES for Staging Site v2
-- Handles existing policies properly

-- 1. Fix trips table RLS recursion by dropping ALL problematic policies first
DROP POLICY IF EXISTS "trips_shared_delete_policy" ON trips;
DROP POLICY IF EXISTS "trips_shared_insert_policy" ON trips;
DROP POLICY IF EXISTS "trips_shared_update_policy" ON trips;
DROP POLICY IF EXISTS "Users can manage their own trips" ON trips;

-- Create simple, non-recursive policy
CREATE POLICY "Users can manage their own trips" ON trips
  FOR ALL USING ((select auth.uid()) = user_id);

-- 2. Create POI table if missing (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS pois (
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

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS pois_created_by_idx ON pois (created_by);
CREATE INDEX IF NOT EXISTS pois_type_idx ON pois (type);
CREATE INDEX IF NOT EXISTS pois_location_idx ON pois (latitude, longitude);

-- Enable RLS
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;

-- Drop existing POI policies first
DROP POLICY IF EXISTS "Anyone can view POIs" ON pois;
DROP POLICY IF EXISTS "Users can insert their own POIs" ON pois;
DROP POLICY IF EXISTS "Users can update their own POIs" ON pois;
DROP POLICY IF EXISTS "Users can delete their own POIs" ON pois;

-- Create new POI policies
CREATE POLICY "Anyone can view POIs" ON pois
  FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert their own POIs" ON pois
  FOR INSERT WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Users can update their own POIs" ON pois
  FOR UPDATE USING ((select auth.uid()) = created_by);

CREATE POLICY "Users can delete their own POIs" ON pois
  FOR DELETE USING ((select auth.uid()) = created_by);