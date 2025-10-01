-- ========================================
-- POI Table Creation Fix
-- Run this in Supabase SQL Editor
-- ========================================

-- First, drop any existing poi-related table that might be broken
DROP TABLE IF EXISTS pois CASCADE;

-- Create the pois table with correct structure
CREATE TABLE pois (
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

-- Create indexes for better performance
CREATE INDEX pois_created_by_idx ON pois (created_by);
CREATE INDEX pois_type_idx ON pois (type);
CREATE INDEX pois_created_at_idx ON pois (created_at DESC);
CREATE INDEX pois_location_idx ON pois (latitude, longitude);

-- Enable Row Level Security
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;

-- Create policies for proper access control
CREATE POLICY "Anyone can view POIs" ON pois
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own POIs" ON pois
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own POIs" ON pois
  FOR UPDATE USING (auth.uid() = created_by);

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

-- Create trigger for updated_at
CREATE TRIGGER update_pois_updated_at
  BEFORE UPDATE ON pois
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add constraints to ensure valid coordinates
ALTER TABLE pois ADD CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90);
ALTER TABLE pois ADD CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180);

-- Add comment for reference
COMMENT ON COLUMN pois.type IS 'POI type: camping, water, fuel, mechanic, viewpoint, hazard, river_crossing, gate, accommodation, food, track_start, track_end, emergency, other';

-- Verify table was created successfully
SELECT 'POI table created successfully' as status;

-- Show the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pois'
AND table_schema = 'public'
ORDER BY ordinal_position;