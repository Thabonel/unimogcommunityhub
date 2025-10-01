-- Sample RSS feeds for off-road trail and GPX track sources
-- These are examples of trail and off-road content aggregators

INSERT INTO public.rss_feeds (name, feed_url, category, is_active) VALUES
  -- Overland and expedition sources
  ('Expedition Portal - Routes', 'https://expeditionportal.com/feed/', 'expedition', true),
  ('Overland Bound - Community', 'https://www.overlandbound.com/forums/forums/-/index.rss', 'overland', true),
  
  -- Trail databases and communities  
  ('AllTrails Blog', 'https://www.alltrails.com/blog/feed', 'trails', true),
  ('TrailDamage Colorado 4x4', 'https://www.traildamage.com/rss.xml', '4x4-trails', true),
  ('Gaia GPS Blog', 'https://blog.gaiagps.com/feed/', 'navigation', true),
  
  -- GPX and route sharing platforms
  ('WikiLoc Recent Tracks', 'https://www.wikiloc.com/wikiloc/rss.do?t=tracks', 'gpx-tracks', true),
  ('GPSies Latest Routes', 'https://www.gpsies.com/rss.do', 'gpx-tracks', true),
  
  -- 4x4 and off-road specific
  ('4WDrive - Trail Reports', 'https://www.4wdrive.com/blog/feed/', '4x4-trails', true),
  ('Off-Road.com News', 'https://www.off-road.com/feed/', 'off-road', true),
  ('OutdoorX4 Magazine', 'https://www.outdoorx4.com/feed/', '4x4-trails', true),
  
  -- Regional trail sources
  ('Utah Off-Road', 'https://www.utah.com/feed/', 'regional-trails', true),
  ('Arizona 4x4 Trails', 'https://www.arizona4x4trails.com/feed/', 'regional-trails', true),
  
  -- Unimog specific (if available)
  ('Unimog International', 'https://www.unimog-international.com/feed/', 'unimog', true),
  ('BenzWorld Unimog Forum', 'https://www.benzworld.org/forums/unimog/index.rss', 'unimog', true)
ON CONFLICT (feed_url) DO NOTHING;

-- Note: Some of these feeds may need to be validated/updated with actual working URLs
-- The system will automatically disable feeds that fail repeatedly (after 5 errors)