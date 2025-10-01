-- Create POIs table for Points of Interest
CREATE TABLE IF NOT EXISTS public.pois (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  location JSONB NOT NULL, -- Store as GeoJSON point
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL(2,1),
  images TEXT[],
  metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX idx_pois_type ON public.pois(type);
CREATE INDEX idx_pois_created_by ON public.pois(created_by);
CREATE INDEX idx_pois_location ON public.pois USING GIN(location);

-- Enable RLS
ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can view POIs
CREATE POLICY "POIs are viewable by everyone" 
  ON public.pois FOR SELECT 
  USING (true);

-- Authenticated users can create POIs
CREATE POLICY "Authenticated users can create POIs" 
  ON public.pois FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own POIs
CREATE POLICY "Users can update own POIs" 
  ON public.pois FOR UPDATE 
  USING (auth.uid() = created_by);

-- Users can delete their own POIs
CREATE POLICY "Users can delete own POIs" 
  ON public.pois FOR DELETE 
  USING (auth.uid() = created_by);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_pois_updated_at 
  BEFORE UPDATE ON public.pois 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();