-- Fix Function Search Path Warnings
-- These are WARNINGS only - adding search_path makes functions more secure
-- Won't break any functionality, just prevents potential schema injection attacks

-- Fix 1: update_event_coordinates trigger function
CREATE OR REPLACE FUNCTION public.update_event_coordinates()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF NEW.location_lat IS NOT NULL AND NEW.location_lng IS NOT NULL THEN
    NEW.location_coordinates := ST_SetSRID(ST_MakePoint(NEW.location_lng, NEW.location_lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$function$;


-- Fix 2: is_event_full function
CREATE OR REPLACE FUNCTION public.is_event_full(p_event_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $function$
  SELECT
    CASE
      WHEN e.max_participants IS NULL THEN false
      ELSE get_event_participant_count(e.id) >= e.max_participants
    END
  FROM events e
  WHERE e.id = p_event_id;
$function$;


-- Fix 3: get_event_participant_count function
CREATE OR REPLACE FUNCTION public.get_event_participant_count(p_event_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $function$
  SELECT COUNT(*)::integer
  FROM event_participants
  WHERE event_id = p_event_id
    AND status IN ('going', 'maybe');
$function$;


-- Fix 4: update_event_participants_updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_event_participants_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;


-- Fix 5: update_events_updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_events_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;


-- Note about postgis extension warning:
-- The "extension_in_public" warning for PostGIS can be safely ignored.
-- PostGIS is intentionally installed in the public schema by Supabase.
-- Moving it would break all mapping functionality and is not recommended.
