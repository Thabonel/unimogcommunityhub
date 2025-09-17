-- Fix function search path security vulnerabilities
-- This addresses the security warnings from Supabase advisors
-- Reference: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

-- Set secure search path for approve_manual_for_processing function
ALTER FUNCTION public.approve_manual_for_processing()
SET search_path = public;

-- Set secure search path for reject_manual_upload function
ALTER FUNCTION public.reject_manual_upload()
SET search_path = public;

-- Set secure search path for update_document_search_vector function
ALTER FUNCTION public.update_document_search_vector()
SET search_path = public;

-- Set secure search path for update_document_rating_aggregate function
ALTER FUNCTION public.update_document_rating_aggregate()
SET search_path = public;

-- Set secure search path for increment_download_count function
ALTER FUNCTION public.increment_download_count()
SET search_path = public;

-- Comment: This migration fixes the "Function Search Path Mutable" security warnings
-- by explicitly setting the search_path to 'public' for all affected functions.
-- This prevents potential search path injection attacks.