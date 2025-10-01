-- Add page image support to manual_chunks table
-- Migration: 20250815_add_page_images.sql

-- Add columns for page image URLs and visual content metadata
ALTER TABLE manual_chunks 
ADD COLUMN IF NOT EXISTS page_image_url TEXT,
ADD COLUMN IF NOT EXISTS visual_content_type TEXT DEFAULT 'text' CHECK (visual_content_type IN ('text', 'diagram', 'mixed', 'schematic', 'photo')),
ADD COLUMN IF NOT EXISTS has_visual_elements BOOLEAN DEFAULT FALSE;

-- Add index for visual content queries
CREATE INDEX IF NOT EXISTS idx_manual_chunks_visual_content 
ON manual_chunks(has_visual_elements, visual_content_type);

-- Add index for page image URLs (for faster lookups)
CREATE INDEX IF NOT EXISTS idx_manual_chunks_page_image 
ON manual_chunks(page_image_url) WHERE page_image_url IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN manual_chunks.page_image_url IS 'URL to the page image in Supabase storage';
COMMENT ON COLUMN manual_chunks.visual_content_type IS 'Type of visual content on this page';
COMMENT ON COLUMN manual_chunks.has_visual_elements IS 'True if page contains diagrams, illustrations, or schematics';

-- Create storage bucket for manual pages if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('manual-pages', 'manual-pages', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for manual-pages bucket
CREATE POLICY "Allow authenticated users to view manual pages" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'manual-pages' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to upload manual pages" 
ON storage.objects FOR INSERT 
USING (bucket_id = 'manual-pages' AND auth.role() = 'authenticated');

CREATE POLICY "Allow service role full access to manual pages" 
ON storage.objects FOR ALL 
USING (bucket_id = 'manual-pages' AND auth.jwt() ->> 'role' = 'service_role');