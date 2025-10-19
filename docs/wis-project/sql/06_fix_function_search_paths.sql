-- Fix search_path for all functions flagged by Supabase linter
-- Sets search_path = '' for security (prevents search_path hijacking attacks)

alter function public.find_conversation_by_participants(uuid[])
  set search_path = '';

alter function public.get_posts_with_engagement(integer, integer)
  set search_path = '';

alter function public.notify_new_feedback()
  set search_path = '';

alter function public.notify_new_feedback_email()
  set search_path = '';

alter function public.notify_new_listing()
  set search_path = '';

alter function public.notify_new_listing_email()
  set search_path = '';

alter function public.notify_new_post()
  set search_path = '';

alter function public.notify_new_post_email()
  set search_path = '';

alter function public.notify_new_trip()
  set search_path = '';

alter function public.notify_new_trip_email()
  set search_path = '';

alter function public.queue_admin_email(text, uuid, text, text)
  set search_path = '';

alter function public.queue_admin_sms(text, uuid, text)
  set search_path = '';

alter function public.search_barry_cache(vector, double precision, integer)
  set search_path = '';

alter function public.test_signup_triggers()
  set search_path = '';

alter function public.update_user_preferences_updated_at()
  set search_path = '';

alter function public.wis_create_plan_release(text, text)
  set search_path = '';

alter function public.wis_record_ingest_error(uuid, text, text, text, jsonb, text)
  set search_path = '';

alter function public.wis_start_ingest_job(uuid, text)
  set search_path = '';

alter function public.wis_update_ingest_job(uuid, text, integer, jsonb, jsonb, text)
  set search_path = '';

alter function public.wis_upsert_plan_item(text, text, text, text, text, text, jsonb)
  set search_path = '';
