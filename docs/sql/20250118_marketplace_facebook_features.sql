-- Add view_count and saved_count columns to marketplace_listings if they don't exist
ALTER TABLE marketplace_listings 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS saved_count INTEGER DEFAULT 0;

-- Create saved_listings table for favorites functionality
CREATE TABLE IF NOT EXISTS saved_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, listing_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_listings_user_id ON saved_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_listings_listing_id ON saved_listings(listing_id);

-- Create RLS policies for saved_listings
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved listings
CREATE POLICY "Users can view their own saved listings" ON saved_listings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can save listings
CREATE POLICY "Users can save listings" ON saved_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can unsave their own listings
CREATE POLICY "Users can unsave their own listings" ON saved_listings
  FOR DELETE USING (auth.uid() = user_id);

-- Create functions for incrementing/decrementing saved count
CREATE OR REPLACE FUNCTION increment_saved_count(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE marketplace_listings 
  SET saved_count = COALESCE(saved_count, 0) + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_saved_count(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE marketplace_listings 
  SET saved_count = GREATEST(COALESCE(saved_count, 0) - 1, 0)
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION increment_saved_count TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_saved_count TO authenticated;