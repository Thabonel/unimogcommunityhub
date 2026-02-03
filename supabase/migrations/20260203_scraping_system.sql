-- Scraping System Tables
-- Enables admin-managed and Barry-discovered content scraping

-- Sources to scrape
CREATE TABLE IF NOT EXISTS scrape_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('trip', 'guide')),
  frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  selectors JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'failed', 'pending_approval')),
  confidence_score FLOAT DEFAULT 1.0,
  discovered_by TEXT NOT NULL DEFAULT 'admin' CHECK (discovered_by IN ('admin', 'barry')),
  last_scraped_at TIMESTAMPTZ,
  next_scrape_at TIMESTAMPTZ DEFAULT NOW(),
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(url)
);

-- Scraped content
CREATE TABLE IF NOT EXISTS scraped_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES scrape_sources(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('trip', 'guide')),
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  embedding vector(1536),
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(url)
);

-- Barry's discovery suggestions
CREATE TABLE IF NOT EXISTS discovery_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  suggested_type TEXT CHECK (suggested_type IN ('trip', 'guide')),
  confidence_score FLOAT DEFAULT 0.5,
  reasoning TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  UNIQUE(url)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scrape_sources_next_scrape ON scrape_sources(next_scrape_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_scrape_sources_type ON scrape_sources(type);
CREATE INDEX IF NOT EXISTS idx_scraped_content_type ON scraped_content(content_type);
CREATE INDEX IF NOT EXISTS idx_scraped_content_source ON scraped_content(source_id);
CREATE INDEX IF NOT EXISTS idx_discovery_suggestions_status ON discovery_suggestions(status);

-- RLS policies
ALTER TABLE scrape_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_suggestions ENABLE ROW LEVEL SECURITY;

-- Admin-only write access for scrape_sources
CREATE POLICY "Admins can manage scrape sources" ON scrape_sources
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Public read access for scraped content (Barry needs this)
CREATE POLICY "Anyone can read scraped content" ON scraped_content
  FOR SELECT USING (true);

-- Service role can write scraped content
CREATE POLICY "Service role can write scraped content" ON scraped_content
  FOR ALL USING (auth.role() = 'service_role');

-- Admin access for discovery suggestions
CREATE POLICY "Admins can manage discovery suggestions" ON discovery_suggestions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Function to auto-approve high confidence sources
CREATE OR REPLACE FUNCTION auto_approve_high_confidence_source()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confidence_score >= 0.8 AND NEW.status = 'pending' THEN
    NEW.status := 'approved';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_approve_discovery
  BEFORE INSERT ON discovery_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION auto_approve_high_confidence_source();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_scrape_sources_updated
  BEFORE UPDATE ON scrape_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_scraped_content_updated
  BEFORE UPDATE ON scraped_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
