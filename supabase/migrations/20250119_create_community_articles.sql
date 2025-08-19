-- Create community_articles table for user-submitted content
-- This table stores articles submitted by community members through the knowledge base

-- Create the main table
CREATE TABLE IF NOT EXISTS community_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('Maintenance', 'Repair', 'Adventures', 'Modifications', 'Tyres', 'Technical', 'General')),
  
  -- Author information
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  author_name TEXT,
  author_avatar TEXT,
  
  -- Metadata
  published_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time INTEGER DEFAULT 5,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  
  -- Additional fields
  source_url TEXT,
  original_file_url TEXT,
  cover_image TEXT,
  
  -- Status flags
  is_archived BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true, -- Auto-approve for now, can add moderation later
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_articles_category ON community_articles(category);
CREATE INDEX IF NOT EXISTS idx_community_articles_author ON community_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_community_articles_published ON community_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_articles_approved ON community_articles(is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_community_articles_archived ON community_articles(is_archived) WHERE is_archived = false;

-- Enable Row Level Security
ALTER TABLE community_articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Public can view approved articles" ON community_articles;
DROP POLICY IF EXISTS "Authenticated users can create articles" ON community_articles;
DROP POLICY IF EXISTS "Users can update own articles" ON community_articles;
DROP POLICY IF EXISTS "Users can delete own articles" ON community_articles;
DROP POLICY IF EXISTS "Admins have full access" ON community_articles;

-- RLS Policies

-- Everyone can read approved, non-archived articles
CREATE POLICY "Public can view approved articles" ON community_articles
  FOR SELECT 
  USING (is_approved = true AND is_archived = false);

-- Authenticated users can create articles (author_id must match their ID)
CREATE POLICY "Authenticated users can create articles" ON community_articles
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    auth.uid() = author_id
  );

-- Users can update their own articles
CREATE POLICY "Users can update own articles" ON community_articles
  FOR UPDATE 
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Users can delete their own articles
CREATE POLICY "Users can delete own articles" ON community_articles
  FOR DELETE 
  USING (auth.uid() = author_id);

-- Admins have full access to all articles
CREATE POLICY "Admins have full access" ON community_articles
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_community_articles_updated_at ON community_articles;
CREATE TRIGGER update_community_articles_updated_at
  BEFORE UPDATE ON community_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON community_articles TO authenticated;
GRANT SELECT ON community_articles TO anon;

-- Insert a sample article to verify the table works
INSERT INTO community_articles (
  title,
  excerpt,
  content,
  category,
  author_name,
  reading_time,
  is_approved
) VALUES (
  'Welcome to the Community Articles',
  'Share your knowledge and experiences with the Unimog community.',
  '# Welcome to Community Articles

This is where you can share your Unimog knowledge, experiences, and tips with the community. 

## How to Submit an Article

1. Click the "Submit Article" button on any knowledge page
2. Fill in the article details
3. Submit for community viewing

## Categories Available

- **Maintenance**: Regular maintenance guides and tips
- **Repair**: Troubleshooting and repair procedures  
- **Adventures**: Trip reports and adventure stories
- **Modifications**: Custom modifications and upgrades
- **Tyres**: Tire selection and maintenance
- **Technical**: Technical specifications and deep dives
- **General**: Everything else Unimog-related

Start sharing your knowledge today!',
  'General',
  'UnimogHub Team',
  2,
  true
);

-- Return success message
SELECT 'Community articles table created successfully!' as message;