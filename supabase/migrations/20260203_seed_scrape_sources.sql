-- Seed initial scrape sources for trips and repair guides
-- These are known, high-quality Unimog community resources

BEGIN;

-- Trip sources
INSERT INTO scrape_sources (url, domain, name, type, frequency, status, discovered_by, confidence_score)
VALUES
  ('https://www.wikiloc.com/wikiloc/find.do?q=unimog', 'wikiloc.com', 'Wikiloc Unimog Trails', 'trip', 'weekly', 'active', 'admin', 1.0),
  ('https://www.ioverlander.com/', 'ioverlander.com', 'iOverlander', 'trip', 'weekly', 'active', 'admin', 1.0),
  ('https://www.expeditionportal.com/forum/forums/unimog.72/', 'expeditionportal.com', 'Expedition Portal Unimog Forum', 'trip', 'weekly', 'active', 'admin', 1.0)
ON CONFLICT (url) DO NOTHING;

-- Repair guide sources
INSERT INTO scrape_sources (url, domain, name, type, frequency, status, discovered_by, confidence_score)
VALUES
  ('https://www.mercedessource.com/problems/unimog', 'mercedessource.com', 'Mercedes Source Unimog', 'guide', 'weekly', 'active', 'admin', 1.0),
  ('https://www.unimog-community.de/', 'unimog-community.de', 'Unimog Community DE', 'guide', 'weekly', 'active', 'admin', 1.0)
ON CONFLICT (url) DO NOTHING;

COMMIT;
