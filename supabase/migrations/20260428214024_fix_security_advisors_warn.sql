-- Fix 1: promote_validated_answer — mutable search_path
-- Trigger function needs search_path fixed to prevent search_path injection.
CREATE OR REPLACE FUNCTION public.promote_validated_answer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $function$
DECLARE
  positive_count INTEGER;
  existing_kb_id UUID;
  query_keywords TEXT[];
BEGIN
  IF NOT NEW.is_correct THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO positive_count
  FROM barry_answer_feedback
  WHERE user_query = NEW.user_query
    AND is_correct = true;

  SELECT id INTO existing_kb_id
  FROM barry_knowledge_base
  WHERE barry_response_template = NEW.barry_response
  LIMIT 1;

  IF existing_kb_id IS NOT NULL THEN
    UPDATE barry_knowledge_base
    SET validation_count = positive_count,
        confidence_score = LEAST(0.5 + (positive_count * 0.15), 1.0),
        validated_by_user = (positive_count >= 3),
        last_validated_at = NOW()
    WHERE id = existing_kb_id;
  ELSIF positive_count >= 3 THEN
    SELECT array_agg(word) INTO query_keywords
    FROM (
      SELECT DISTINCT unnest(
        string_to_array(
          regexp_replace(lower(NEW.user_query), '[^\w\s]', ' ', 'g'),
          ' '
        )
      ) AS word
      WHERE length(word) > 3
        AND word NOT IN ('what', 'how', 'does', 'the', 'that', 'this', 'with', 'from', 'have', 'your')
    ) words;

    INSERT INTO barry_knowledge_base (
      question_keywords,
      barry_response_template,
      confidence_score,
      validated_by_user,
      validation_count,
      last_validated_at,
      priority
    ) VALUES (
      COALESCE(query_keywords, ARRAY[lower(NEW.user_query)]),
      NEW.barry_response,
      LEAST(0.5 + (positive_count * 0.15), 1.0),
      true,
      positive_count,
      NOW(),
      5
    );
  END IF;

  RETURN NEW;
END;
$function$;

-- Fix 2: barry_learned_responses INSERT policy — restrict to service_role only.
-- The "Allow service insert" policy previously applied to all roles (WITH CHECK (true)).
-- Only edge functions (service_role) should write learned responses.
DROP POLICY IF EXISTS "Allow service insert" ON public.barry_learned_responses;

CREATE POLICY "Allow service insert"
ON public.barry_learned_responses
FOR INSERT
TO service_role
WITH CHECK (true);

-- Fix 3: dreamlit_auth_admin_executor — executes arbitrary SQL as SECURITY DEFINER.
-- Highest-risk function. anon and authenticated must not be able to call it.
REVOKE EXECUTE ON FUNCTION public.dreamlit_auth_admin_executor(text)
  FROM anon, authenticated;

-- Fix 4: Admin-only functions — revoke from anon.
-- These functions modify privileged state and must not be reachable by unauthenticated requests.

REVOKE EXECUTE ON FUNCTION public.grant_free_access(uuid)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.grant_free_access(uuid, uuid)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.approve_manual_for_processing(uuid)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.reject_manual_upload(uuid, text)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.approve_notice_submission(uuid, uuid, text)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.reject_notice_submission(uuid, uuid, text, text)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.process_manual_rpc(text, text)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.queue_admin_email(text, uuid, text, text)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.queue_admin_sms(text, uuid, text)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.sync_verification_status()
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.cleanup_old_security_events()
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.get_manual_processing_stats()
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.get_manual_processing_status()
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.get_verification_stats()
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.start_user_trial(uuid, timestamptz, timestamptz)
  FROM anon;

-- Fix 5: WIS admin functions — revoke from anon.
-- These are ingest/admin operations called only by edge functions (service_role).

REVOKE EXECUTE ON FUNCTION public.wis_create_plan_release(text, text)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.wis_create_samples(integer, text, uuid)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.wis_start_ingest_job(uuid, text)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.wis_update_ingest_job(uuid, text, integer, jsonb, jsonb, text)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.wis_record_ingest_error(uuid, text, text, text, jsonb, text)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.wis_upsert_plan_item(text, text, text, text, text, text, jsonb)
  FROM anon;
