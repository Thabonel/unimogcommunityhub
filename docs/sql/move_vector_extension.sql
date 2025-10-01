-- Move vector extension from public schema to dedicated extensions schema
-- Run this in Supabase Dashboard SQL Editor

-- IMPORTANT: This requires careful execution as it affects the vector extension
-- used for AI embeddings. Test thoroughly after running.

-- Step 1: Create extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- Step 2: Move vector extension to extensions schema
-- Note: This needs to be done carefully as it may affect existing tables
ALTER EXTENSION vector SET SCHEMA extensions;

-- Step 3: Update search_path to include extensions schema
-- This ensures vector types are still accessible
ALTER DATABASE postgres SET search_path = "$user", public, extensions;

-- Step 4: Grant usage on extensions schema to authenticated users
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO anon;

-- Note: After running this, you may need to update any direct references
-- to vector types in your application code to use extensions.vector
-- However, most references should continue to work due to search_path