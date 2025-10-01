-- CRITICAL FIXES for Staging Site
-- Run this in Supabase SQL Editor to fix POI table and trips recursion

-- 1. Create POIs table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS pois_created_by_idx ON pois (created_by);
CREATE INDEX IF NOT EXISTS pois_type_idx ON pois (type);
CREATE INDEX IF NOT EXISTS pois_created_at_idx ON pois (created_at DESC);
CREATE INDEX IF NOT EXISTS pois_location_idx ON pois (latitude, longitude);

-- Enable RLS
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies for pois
CREATE POLICY "Anyone can view POIs" ON pois
  FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert their own POIs" ON pois
  FOR INSERT WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Users can update their own POIs" ON pois
  FOR UPDATE USING ((select auth.uid()) = created_by);

CREATE POLICY "Users can delete their own POIs" ON pois
  FOR DELETE USING ((select auth.uid()) = created_by);

-- 2. Fix trips table RLS recursion
-- Remove problematic policies and create simple ones
DROP POLICY IF EXISTS "trips_shared_delete_policy" ON trips;
DROP POLICY IF EXISTS "trips_shared_insert_policy" ON trips;
DROP POLICY IF EXISTS "trips_shared_update_policy" ON trips;

-- Create simple, non-recursive policies
CREATE POLICY "Users can manage their own trips" ON trips
  FOR ALL USING ((select auth.uid()) = user_id);

-- Add trigger for pois updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_pois_updated_at ON pois;
CREATE TRIGGER update_pois_updated_at
  BEFORE UPDATE ON pois
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();