-- Fix check_admin_access() function to use user_roles table instead of email domain
-- Run this in Supabase Dashboard SQL Editor

CREATE OR REPLACE FUNCTION public.check_admin_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID;
  has_admin_role BOOLEAN;
BEGIN
  SET search_path = '';

  -- Get the current user ID using auth.uid()
  current_user_id := (SELECT auth.uid());

  -- If no user is authenticated, return false
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Check if the user has admin role in user_roles table
  SELECT EXISTS(
    SELECT 1
    FROM public.user_roles
    WHERE user_id = current_user_id
    AND role = 'admin'
  ) INTO has_admin_role;

  RETURN COALESCE(has_admin_role, false);
END;
$function$;