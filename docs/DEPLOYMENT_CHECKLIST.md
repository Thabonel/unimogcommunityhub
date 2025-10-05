# 🚀 Production Deployment Checklist

## ⚠️ CRITICAL: This checklist prevents the Oct 5th signup disaster from happening again

**What happened**: Notification triggers were added without SECURITY DEFINER, blocking ALL signups for 3 days while running expensive ads.

**Cost**: $XXX in wasted ad spend with 0 conversions

---

## Pre-Deployment Checks

### 1. Database Changes (If Any)

#### A. Run Trigger Tests
```sql
-- In Supabase SQL Editor:
SELECT * FROM test_signup_triggers();
```

**Expected Result**: All tests show `PASS` status

❌ **If ANY test fails**: DO NOT DEPLOY. Investigate and fix first.

#### B. Verify All Triggers Have SECURITY DEFINER
```sql
-- Check trigger functions
SELECT
    proname as function_name,
    prosecdef as is_security_definer,
    CASE
        WHEN prosecdef = false THEN '❌ MISSING SECURITY DEFINER'
        ELSE '✅ OK'
    END as status
FROM pg_proc
WHERE proname IN (
    'handle_new_user',
    'handle_new_user_subscription',
    'notify_new_user',
    'notify_new_user_email'
);
```

**Expected**: All should have `is_security_definer = true`

#### C. Test Signup on Staging
1. Go to staging: `https://unimogcommunity-staging.netlify.app/signup`
2. Sign up with test email: `staging-test-{timestamp}@test.com`
3. Verify:
   - ✅ No "Database error saving new user"
   - ✅ Confirmation email received
   - ✅ User appears in Supabase auth.users

#### D. Verify User Records Created
```sql
-- Check last signup on staging
SELECT
    u.id,
    u.email,
    u.created_at,
    CASE WHEN p.id IS NOT NULL THEN '✅' ELSE '❌ MISSING' END as has_profile,
    CASE WHEN us.id IS NOT NULL THEN '✅' ELSE '❌ MISSING' END as has_subscription
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_subscriptions us ON u.id = us.user_id
ORDER BY u.created_at DESC
LIMIT 1;
```

**Expected**: Both has_profile and has_subscription show ✅

---

### 2. Frontend Changes

#### A. Build Test
```bash
npm run build
```

**Expected**: Build succeeds with no errors

#### B. Test Critical Flows Locally
- [ ] Signup flow works
- [ ] Login flow works
- [ ] Password reset works
- [ ] No console errors

---

### 3. Edge Functions (If Changed)

#### A. Deploy to Staging First
```bash
npx supabase functions deploy function-name --project-ref staging-ref
```

#### B. Test Edge Function
```bash
curl -X POST https://staging-project.supabase.co/functions/v1/function-name \
  -H "Authorization: Bearer ANON_KEY" \
  -d '{"test": true}'
```

---

## Deployment Process

### Step 1: Deploy to Staging
```bash
git push staging main:main
```

### Step 2: Smoke Test Staging (5 minutes)
1. **Test Signup**:
   - Go to staging signup page
   - Create test account
   - Verify successful signup

2. **Test Login**:
   - Log in with test account
   - Verify dashboard loads

3. **Check Console**:
   - Open browser DevTools
   - Look for any errors
   - Check Network tab for failed requests

### Step 3: Monitor Staging (15 minutes)
- Watch for any error reports
- Check Supabase logs
- Verify no degradation in performance

### Step 4: Deploy to Production (ONLY IF STAGING PASSES)
```bash
git push origin main
```

### Step 5: IMMEDIATE Post-Deploy Verification (< 2 minutes)

#### A. Test Signup on Production
1. Go to `https://unimogcommunityhub.com/signup`
2. Sign up with test email: `production-test-{timestamp}@test.com`
3. **MUST SEE**: Confirmation email / success message
4. **MUST NOT SEE**: "Database error saving new user"

#### B. Verify in Database
```sql
-- Check signup just happened
SELECT
    u.email,
    u.created_at,
    EXTRACT(EPOCH FROM (NOW() - u.created_at)) / 60 as minutes_ago
FROM auth.users u
ORDER BY u.created_at DESC
LIMIT 1;
```

**Expected**: `minutes_ago` should be < 5 minutes

---

## Post-Deployment Monitoring (1 hour)

### Check Every 15 Minutes

#### 1. Signup Health
```sql
SELECT * FROM signup_health_check;
```

#### 2. Error Logs
Check Supabase dashboard → Logs → Auth for any errors

#### 3. Analytics
- Check Google Analytics for signup completions
- Verify ad conversion tracking working

---

## 🚨 Emergency Rollback

If signup breaks in production:

### Immediate Action (< 2 minutes)
```sql
-- Disable notification triggers
DROP TRIGGER IF EXISTS trigger_notify_new_user ON auth.users;
DROP TRIGGER IF EXISTS trigger_notify_new_user_email ON auth.users;
```

### Verify Fix (< 1 minute)
Test signup immediately - should work

### Full Rollback (< 5 minutes)
```bash
# Revert to last known good commit
git revert HEAD
git push origin main

# Wait for Netlify deployment
# Test signup again
```

---

## Deployment Sign-Off

**Date**: ___________
**Deployed By**: ___________
**Commit SHA**: ___________

### Pre-Deployment
- [ ] All trigger tests PASS
- [ ] Staging signup works
- [ ] Build succeeds
- [ ] No console errors

### Post-Deployment
- [ ] Production signup tested successfully
- [ ] User created in database
- [ ] Profile and subscription created
- [ ] No errors in Supabase logs

### Monitoring (1 hour)
- [ ] 15 min: Signup health OK
- [ ] 30 min: No errors reported
- [ ] 45 min: Analytics tracking working
- [ ] 60 min: All systems nominal

**Deployment Status**: ✅ SUCCESS / ❌ FAILED / 🔄 ROLLED BACK

---

## Lessons Learned (Oct 5th Incident)

### What Went Wrong
1. Added notification triggers without SECURITY DEFINER
2. No automated testing of signup flow
3. No monitoring alerts for signup failures
4. Discovered only when user reported it (3 days later)

### What We Fixed
1. ✅ All trigger functions now have SECURITY DEFINER
2. ✅ Created trigger test function
3. ✅ This deployment checklist
4. ✅ Documented in /docs/CRITICAL_SIGNUP_FIX.sql

### Prevention Measures
1. ✅ Mandatory pre-deployment trigger tests
2. ✅ Immediate post-deploy signup verification
3. ✅ Monitoring system (see SIGNUP_MONITORING.md)
4. ⏳ TODO: Automated E2E tests every 30 min
5. ⏳ TODO: Signup health alerts to admin phone

---

## Notes

**NEVER SKIP THIS CHECKLIST**

Even for "minor" changes - the Oct 5th incident was caused by adding what seemed like a simple notification feature.

**When in doubt, test on staging first.**

It's better to delay production deploy by 30 minutes than to break signups for 3 days.
