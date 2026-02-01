-- Create storage bucket for PDF page images
INSERT INTO storage.buckets (id, name, public)
VALUES ('page-images', 'page-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to page images
CREATE POLICY "Public page images access" ON storage.objects
FOR SELECT USING (bucket_id = 'page-images');

-- Allow authenticated users to upload page images
CREATE POLICY "Authenticated users can upload page images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'page-images');

-- Allow service role to manage page images
CREATE POLICY "Service role can manage page images" ON storage.objects
FOR ALL USING (bucket_id = 'page-images' AND auth.role() = 'service_role');

-- Add visual_content_type column if not exists
ALTER TABLE manual_chunks
ADD COLUMN IF NOT EXISTS visual_content_type text;

-- Add extraction_quality column if not exists
ALTER TABLE manual_chunks
ADD COLUMN IF NOT EXISTS extraction_quality numeric;

-- Add index for visual content queries
CREATE INDEX IF NOT EXISTS idx_manual_chunks_visual_content
ON manual_chunks (has_visual_elements, page_image_url)
WHERE has_visual_elements = true;
