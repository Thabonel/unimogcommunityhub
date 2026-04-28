-- Restrict SECURITY DEFINER function access
--
-- All these functions have SECURITY DEFINER — they run as postgres regardless of caller.
-- Strategy:
--   Section A (trigger functions):   REVOKE from PUBLIC, anon, authenticated
--   Section B (admin/system):        REVOKE from PUBLIC, anon, authenticated
--   Section C (user-facing RPCs):    REVOKE from PUBLIC + anon only; authenticated keeps access
--
-- After this migration:
--   anon_security_definer_function_executable       → cleared for all 128 functions
--   authenticated_security_definer_function_executable → cleared for ~46 admin/trigger functions
--   Remaining authenticated warnings are user-facing RPCs where access is intentional.
--
-- Unresolvable advisors (documented, not fixed):
--   spatial_ref_sys rls_disabled_in_public — PostGIS table owned by Supabase, cannot alter
--   extension_in_public (postgis, citext) — Supabase-managed extensions, cannot move
--   public_bucket_allows_listing (14 buckets) — intentional; app requires listing


-- ============================================================
-- SECTION A: Trigger functions
-- Called by database triggers only; direct execution by clients is never valid.
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.handle_new_user()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_subscription()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_message()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_user()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_user_email()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_post_comment()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_post_like()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.promote_validated_answer()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_content_metrics()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_gpx_tracks_updated_at()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_gpx_waypoints_updated_at()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_notice_stats()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_profiles_updated_at()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_qa_issues_updated_at()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_tracks_updated_at()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_trip_distance()
  FROM PUBLIC, anon, authenticated;


-- ============================================================
-- SECTION B: Admin / system-only functions
-- Should only be callable by service_role (edge functions) or postgres.
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.dreamlit_auth_admin_executor(text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_free_access(uuid)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_free_access(uuid, uuid)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.approve_manual_for_processing(uuid)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reject_manual_upload(uuid, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.approve_notice_submission(uuid, uuid, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reject_notice_submission(uuid, uuid, text, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.process_manual_rpc(text, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.queue_admin_email(text, uuid, text, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.queue_admin_sms(text, uuid, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_verification_status()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_security_events()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_manual_processing_stats()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_manual_processing_status()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_verification_stats()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.start_user_trial(uuid, timestamp with time zone, timestamp with time zone)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.alert_if_signup_broken()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_signup_endpoints()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_signup_health()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.send_signup_alert()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.wis_create_plan_release(text, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.wis_create_samples(integer, text, uuid)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.wis_start_ingest_job(uuid, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.wis_update_ingest_job(uuid, text, integer, jsonb, jsonb, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.wis_record_ingest_error(uuid, text, text, text, jsonb, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.wis_upsert_plan_item(text, text, text, text, text, text, jsonb)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_available_server()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_column_exists(text, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.list_manual_files(text)
  FROM PUBLIC, anon, authenticated;


-- ============================================================
-- SECTION C: User-facing RPC functions
-- Revoke PUBLIC + anon access. Authenticated retains explicit EXECUTE grant.
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.calculate_trip_distance(jsonb, jsonb)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_admin_access()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_device_limit(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_download_limit(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_trial_status(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_conversation(uuid, uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_notification(uuid, text, text, text, text, uuid, uuid, text)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.decrement_feedback_votes()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.decrement_feedback_votes(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.decrement_saved_count(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.delete_gpx_track(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.find_conversation_by_participants(uuid[])
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.find_events_nearby(numeric, numeric, numeric, text)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_donation_stats()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_event_summary(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_gpx_track_with_points(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_group_member_count(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_popular_wis_content(integer)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_post_comment_count(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_post_like_count(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_posts_with_engagement(integer, integer)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_procedure_bulletins(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_procedure_parts(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_procedure_tools(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_recommended_events_for_user(uuid, integer)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_referencing_procedures(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_related_procedures(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_shared_trips(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_trending_content()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_trending_content(text, timestamp with time zone, integer)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_unread_message_count()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_unread_message_count(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_usage_statistics(uuid, uuid, integer)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_gpx_tracks(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_subscription()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_subscription(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_wis_catalog(text)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_wis_items(text, text[], text, integer)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_wis_procedure_details(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_active_subscription(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(app_role)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(text)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(bigint, text)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_feedback_votes(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_product_clicks(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_saved_count(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_view_count()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_safe(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_group_admin(uuid, uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_group_member(uuid, uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_trial_active()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_trial_active(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_user_admin(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_conversation_as_read(bigint)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_conversation_as_read(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_message_as_read()
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_message_as_read(bigint)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_message_as_read(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.record_download(uuid, text, text, bigint)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.search_manual_chunks(text, integer, double precision)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.search_manual_chunks(vector, integer, double precision)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.search_procedures(text)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.search_wis_content(text, double precision)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.search_wis_content(text, text, text)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.start_free_trial(uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_has_liked_post(uuid, uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_is_group_admin_safe(uuid, uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_is_group_member_safe(uuid, uuid)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.wis_comprehensive_search(text)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.wis_log_query(text, text, text)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.wis_media_url(text, text, integer)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.wis_search2(text, text, integer)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.wis_suggest_prefix(text, text, integer)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.wis_suggest_titles(text, text, integer)
  FROM PUBLIC, anon;
