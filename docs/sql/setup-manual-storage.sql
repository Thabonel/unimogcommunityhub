-- Setup script for manual image extraction system
-- Run this in Supabase SQL Editor

-- 1. Create the 'manuals' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manuals',
  'manuals',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- 2. Create the 'manual-images' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manual-images',
  'manual-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 3. Set up RLS policies for manuals bucket (public read)
CREATE POLICY "Public read access for manuals" ON storage.objects
FOR SELECT USING (bucket_id = 'manuals');

CREATE POLICY "Authenticated upload for manuals" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'manuals'
  AND auth.role() = 'authenticated'
);

-- 4. Set up RLS policies for manual-images bucket (public read)
CREATE POLICY "Public read access for manual images" ON storage.objects
FOR SELECT USING (bucket_id = 'manual-images');

CREATE POLICY "Service role write access for manual images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'manual-images'
  AND auth.role() = 'service_role'
);

-- 5. Verify manual_images table exists with correct structure
CREATE TABLE IF NOT EXISTS manual_images (
  id TEXT PRIMARY KEY,
  manual_id TEXT NOT NULL,
  chunk_id UUID REFERENCES manual_chunks(id),
  image_path TEXT,
  image_url TEXT,
  description TEXT,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create index for faster image searches
CREATE INDEX IF NOT EXISTS idx_manual_images_manual_id ON manual_images(manual_id);
CREATE INDEX IF NOT EXISTS idx_manual_images_chunk_id ON manual_images(chunk_id);

-- 7. Enable RLS on manual_images table
ALTER TABLE manual_images ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policy for manual_images (public read)
CREATE POLICY "Public read access for manual images data" ON manual_images
FOR SELECT USING (true);

-- 9. Create RLS policy for manual_images (authenticated write)
CREATE POLICY "Authenticated write access for manual images data" ON manual_images
FOR ALL USING (auth.role() = 'authenticated');

-- 10. Grant necessary permissions
GRANT SELECT ON manual_images TO anon;
GRANT ALL ON manual_images TO authenticated;
GRANT ALL ON manual_images TO service_role;

-- 11. Show current manual_chunks data for verification
SELECT
  manual_id,
  COUNT(*) as chunk_count,
  MIN(page_number) as first_page,
  MAX(page_number) as last_page,
  MIN(created_at) as first_processed,
  MAX(created_at) as last_processed
FROM manual_chunks
GROUP BY manual_id
ORDER BY chunk_count DESC
LIMIT 10;

-- 12. Show current storage bucket status
SELECT
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name IN ('manuals', 'manual-images');