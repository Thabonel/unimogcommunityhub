# Manual Security Fix Required - Admin Privileges Needed

## Issue Summary
17 database functions have search path security vulnerabilities that require manual fixing with admin/postgres privileges.

## Current Status
- ❌ **17 functions still vulnerable** (require postgres/admin privileges to fix)
- ✅ **1 function already secure** (`wis_suggest_prefix` with specific signature)

## Functions Requiring Manual Fix

The following functions are owned by `postgres` and cannot be modified with current MCP credentials:

1. `check_column_exists(table_name text, column_name text)`
2. `get_group_member_count(group_id_param uuid)`
3. `get_shared_trips(p_user_id uuid)`
4. `is_group_admin(group_id_param uuid, user_id_param uuid)`
5. `is_group_member(group_id_param uuid, user_id_param uuid)`
6. `search_enhanced_manual_chunks(search_query text, content_type_filter text, min_quality numeric, limit_results integer)`
7. `user_is_group_admin_safe(group_id_param uuid, user_id_param uuid)`
8. `user_is_group_member_safe(group_id_param uuid, user_id_param uuid)`
9. `wis_get_media_urls(document_id text)`
10. `wis_import_bulletins(payload jsonb)`
11. `wis_import_parts(payload jsonb)`
12. `wis_import_procedures(payload jsonb)`
13. `wis_media_url(bucket text, file_name text, expires_in integer)`
14. `wis_search(search_query text, result_limit integer)`
15. `wis_search_by_type(search_query text, type_filter text, result_limit integer)`
16. `wis_semantic_search(query_embedding vector, similarity_threshold double precision, limit_rows integer)`
17. `wis_suggest_prefix(prefix text, max_results integer)`

## Manual Fix Commands

Run these commands as a postgres/admin user in Supabase SQL Editor:

```sql
-- Fix all vulnerable functions individually
ALTER FUNCTION public.check_column_exists(table_name text, column_name text) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_group_member_count(group_id_param uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_shared_trips(p_user_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_group_admin(group_id_param uuid, user_id_param uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_group_member(group_id_param uuid, user_id_param uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.search_enhanced_manual_chunks(search_query text, content_type_filter text, min_quality numeric, limit_results integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.user_is_group_admin_safe(group_id_param uuid, user_id_param uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.user_is_group_member_safe(group_id_param uuid, user_id_param uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_get_media_urls(document_id text) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_import_bulletins(payload jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_import_parts(payload jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_import_procedures(payload jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_media_url(bucket text, file_name text, expires_in integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_search(search_query text, result_limit integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_search_by_type(search_query text, type_filter text, result_limit integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_semantic_search(query_embedding vector, similarity_threshold double precision, limit_rows integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_suggest_prefix(prefix text, max_results integer) SET search_path = public, pg_temp;
```

## Verification Query

After running the fixes, verify all functions are secure:

```sql
SELECT
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as function_signature,
    CASE
        WHEN p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%' THEN '✅ SECURE'
        ELSE '❌ STILL VULNERABLE'
    END as security_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname IN (
    'get_shared_trips', 'wis_import_parts', 'wis_import_procedures',
    'get_group_member_count', 'is_group_admin', 'is_group_member',
    'wis_import_bulletins', 'wis_suggest_prefix', 'user_is_group_member_safe',
    'user_is_group_admin_safe', 'wis_search', 'search_enhanced_manual_chunks',
    'wis_search_by_type', 'wis_get_media_urls', 'wis_semantic_search',
    'check_column_exists', 'wis_media_url'
)
AND n.nspname = 'public'
ORDER BY security_status, p.proname;
```

## Expected Result

After successful fixes, all functions should show `✅ SECURE` status.

## Security Impact

These functions currently have search path vulnerabilities that could potentially be exploited. The fix sets a secure search path that prevents malicious schema injection attacks.

## Next Steps

1. Run the manual fix commands in Supabase SQL Editor as an admin user
2. Run the verification query to confirm all functions are secure
3. Monitor application functionality to ensure no breaking changes