# Barry AI Emergency Recovery Procedures

**Date Created**: 2025-09-30
**Purpose**: Quick rollback if database-first routing causes issues
**Backup Location**: `/docs/functions/BARRY_DEPLOYED_BACKUP_2025-09-30.ts`

---

## 🚨 WHEN TO ROLLBACK

Roll back IMMEDIATELY if:
- Barry gives no response (complete failure)
- Error rate > 10% for 5 consecutive minutes
- User complaints about broken functionality
- Database timeouts causing ChatGPT fallbacks > 50%
- Any production critical issue

## 📋 PRE-ROLLBACK CHECKLIST

Before rolling back, collect data:
1. Check Supabase Edge Function logs (last 10 minutes)
2. Screenshot current error messages
3. Note which queries are failing
4. Check database health: `SELECT COUNT(*) FROM u435_manual_index WHERE is_active = true;`
5. Document time of failure

## 🔄 ROLLBACK PROCEDURE (5 Minutes)

### Step 1: Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select project: `unimogcommunityhub` (or your project ID)
3. Navigate to: **Edge Functions** → **chat-with-barry**

### Step 2: Restore Backup Version
1. Click **Edit Function**
2. **Select All** (Cmd+A / Ctrl+A) and **Delete**
3. Open backup file: `/docs/functions/BARRY_DEPLOYED_BACKUP_2025-09-30.ts`
4. Copy **entire file contents**
5. Paste into Supabase editor
6. Click **Deploy** (green button, top right)

### Step 3: Verify Deployment
1. Wait for deployment status: **Deployed** (green checkmark)
2. Check deployment time matches current time
3. Test immediately with known working queries

### Step 4: Verification Tests

**Test 1 - Known Working Query**:
```
Query: "how do I replace the radiator"
Expected: Manual mode with PDFs showing
Timeout: Should respond < 3 seconds
```

**Test 2 - General Query**:
```
Query: "write a letter to my boss"
Expected: ChatGPT mode, helpful letter
Timeout: Should respond < 3 seconds
```

**Test 3 - Edge Case**:
```
Query: "what is barry"
Expected: ChatGPT mode, explanation
Timeout: Should respond < 2 seconds
```

### Step 5: Monitor for 10 Minutes
- Watch Supabase Edge Function logs
- Check for error messages
- Verify response times < 3 seconds
- Confirm no 500 errors

## 📊 POST-ROLLBACK ANALYSIS

Document the failure:

**What broke**:
- [ ] Routing logic error
- [ ] Database timeout
- [ ] Query threshold too strict
- [ ] Non-technical filter caught technical queries
- [ ] Other: _________________

**Error messages seen**: (copy from logs)

**Affected users**: (how many complaints)

**Time to detect**: _______ minutes

**Time to rollback**: _______ minutes

**Total downtime**: _______ minutes

## 🔍 DIAGNOSTIC QUERIES

If rollback doesn't fix issue, run these:

```sql
-- Check if manual index is healthy
SELECT COUNT(*), COUNT(DISTINCT system_category) as categories
FROM u435_manual_index
WHERE is_active = true;
-- Expected: ~696 rows, ~8-10 categories

-- Check if search function exists
SELECT proname, prosrc FROM pg_proc WHERE proname = 'search_manual_index';
-- Expected: Function definition returned

-- Test search manually
SELECT * FROM search_manual_index('radiator', 1);
-- Expected: At least 1 result

-- Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'u435_manual_index';
-- Expected: Simple read policy or no RLS

-- Check Edge Function environment variables
-- Go to: Settings → Edge Functions → chat-with-barry → Environment
-- Verify: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY all set
```

## 🚨 IF ROLLBACK FAILS

If restoring backup doesn't fix issue:

### Nuclear Option: Use BARRY_REFERENCE_VERSION
1. Open: `/docs/functions/BARRY_REFERENCE_VERSION.ts`
2. Deploy that version instead
3. This is the "known good" version from 11:38am

### Contact Support Checklist
- [ ] Supabase project ID
- [ ] Edge Function name: `chat-with-barry`
- [ ] Error logs (last 1 hour)
- [ ] Database query results from diagnostic section
- [ ] Rollback attempt timestamp
- [ ] User impact (how many affected)

## 📝 LESSONS LEARNED TEMPLATE

After incident resolved, document:

**What went wrong**:

**Why it wasn't caught in testing**:

**How to prevent in future**:

**Changes to deployment process**:

---

## 🔗 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Edge Functions**: https://supabase.com/dashboard/project/_/functions
- **Database**: https://supabase.com/dashboard/project/_/editor
- **Logs**: https://supabase.com/dashboard/project/_/logs/edge-functions

## 📞 Emergency Contacts

- Supabase Support: support@supabase.com
- User: Thabo Nel
- Project: UnimogCommunityHub

---

**Remember**: It's better to rollback quickly and analyze later than to leave users with broken functionality. 5 minute rollback >> 30 minute debugging.

**Last Updated**: 2025-09-30
**Next Review**: After any Barry deployment