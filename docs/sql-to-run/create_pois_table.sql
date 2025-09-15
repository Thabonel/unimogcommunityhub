-- Create POIs table migration
-- Run this in Supabase SQL Editor to create the missing pois table

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the pois table
CREATE TABLE IF NOT EXISTS pois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  location GEOMETRY(Point, 4326) NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL CHECK (rating >= 1 AND rating <= 5),
  images TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS pois_location_idx ON pois USING GIST (location);
CREATE INDEX IF NOT EXISTS pois_created_by_idx ON pois (created_by);
CREATE INDEX IF NOT EXISTS pois_type_idx ON pois (type);
CREATE INDEX IF NOT EXISTS pois_created_at_idx ON pois (created_at DESC);

-- Enable Row Level Security
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view POIs" ON pois;
DROP POLICY IF EXISTS "Users can insert their own POIs" ON pois;
DROP POLICY IF EXISTS "Users can update their own POIs" ON pois;
DROP POLICY IF EXISTS "Users can delete their own POIs" ON pois;

-- Create policies
-- Allow authenticated users to read all POIs
CREATE POLICY "Anyone can view POIs" ON pois
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert their own POIs
CREATE POLICY "Users can insert their own POIs" ON pois
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own POIs
CREATE POLICY "Users can update their own POIs" ON pois
  FOR UPDATE USING (auth.uid() = created_by);

-- Allow users to delete their own POIs
CREATE POLICY "Users can delete their own POIs" ON pois
  FOR DELETE USING (auth.uid() = created_by);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at (drop first if exists)
DROP TRIGGER IF EXISTS update_pois_updated_at ON pois;
CREATE TRIGGER update_pois_updated_at
  BEFORE UPDATE ON pois
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample POI types as reference
COMMENT ON COLUMN pois.type IS 'POI type: camping, water, fuel, mechanic, viewpoint, hazard, river_crossing, gate, accommodation, food, track_start, track_end, emergency, other';