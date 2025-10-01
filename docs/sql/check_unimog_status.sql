-- Check for Unimog435sm files in storage
SELECT 
    'Storage Files' as type,
    name,
    metadata->>'size' as file_size_bytes,
    ROUND((metadata->>'size')::bigint / 1024.0 / 1024.0, 2) as file_size_mb,
    created_at,
    updated_at
FROM storage.objects 
WHERE bucket_id = 'manuals' 
AND name ILIKE '%unimog435sm%'
ORDER BY created_at DESC;

-- Check manual_metadata for processing status
SELECT 
    'Manual Metadata' as type,
    id,
    filename,
    title,
    ROUND(file_size / 1024.0 / 1024.0, 2) as file_size_mb,
    processing_status,
    chunk_count,
    created_at,
    error_message
FROM manual_metadata 
WHERE filename ILIKE '%unimog435sm%' 
OR title ILIKE '%435%'
ORDER BY created_at DESC;

-- Check for any large files over 100MB
SELECT 
    'Large Files' as type,
    filename,
    ROUND(file_size / 1024.0 / 1024.0, 2) as file_size_mb,
    processing_status,
    chunk_count,
    created_at
FROM manual_metadata 
WHERE file_size > 100000000
ORDER BY file_size DESC;
