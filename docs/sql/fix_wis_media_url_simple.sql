-- Simple working version of wis_media_url that returns public URLs
-- This avoids the storage.sign function which doesn't exist

DROP FUNCTION IF EXISTS public.wis_media_url(TEXT, TEXT, INTEGER);

CREATE OR REPLACE FUNCTION public.wis_media_url(
    bucket TEXT,
    file_name TEXT,
    expires_in INTEGER DEFAULT 3600
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- For now, return public URLs since the storage.sign function doesn't exist
    -- In a real deployment, these buckets should be configured for public access
    -- or use the Supabase storage API from the client side
    
    RETURN 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/' || bucket || '/' || file_name;
END;
$$;

-- Grant execute permissions to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.wis_media_url(TEXT, TEXT, INTEGER) TO anon, authenticated;

-- Test the function
SELECT public.wis_media_url('wis-photos', 'test.jpg', 3600) as test_url;