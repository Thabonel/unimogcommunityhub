-- Increase file size limits for manual storage buckets from 100MB to 200MB
-- This allows uploading large manual files up to 200MB

UPDATE storage.buckets
SET file_size_limit = 209715200  -- 200MB in bytes
WHERE name IN ('manuals', 'pending-manuals');