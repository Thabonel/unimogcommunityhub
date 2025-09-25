-- Fix pg_trgm extension that broke storage function output formatting
-- The issue: pg_trgm was created in the wrong schema, corrupting storage API responses

-- Drop the incorrectly installed pg_trgm
DROP EXTENSION IF EXISTS pg_trgm CASCADE;

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Install pg_trgm in the correct extensions schema
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO public;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;