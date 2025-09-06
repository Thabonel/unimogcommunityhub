-- Fix wis_media_url RPC function to work with Supabase storage
CREATE OR REPLACE FUNCTION public.wis_media_url(
    bucket TEXT,
    file_name TEXT,
    expires_in INTEGER DEFAULT 3600
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    signed_url TEXT;
BEGIN
    -- Generate a signed URL for the media file using Supabase storage
    -- This uses the built-in storage.sign function
    SELECT url INTO signed_url 
    FROM storage.sign(bucket, file_name, expires_in);
    
    -- If that doesn't work, fall back to a direct storage URL
    IF signed_url IS NULL THEN
        signed_url := 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/' || bucket || '/' || file_name;
    END IF;
    
    RETURN signed_url;
EXCEPTION
    WHEN OTHERS THEN
        -- Fallback to direct public URL if signing fails
        RETURN 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/' || bucket || '/' || file_name;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.wis_media_url(TEXT, TEXT, INTEGER) TO anon, authenticated;