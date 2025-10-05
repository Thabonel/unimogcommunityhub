# Quick Start Guide: Signup Monitoring & Prevention

## 🚀 One-Time Setup (Do This Now - 5 Minutes)

### Step 1: Install Monitoring in Supabase

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: **SQL Editor**
3. Copy/paste this SQL and run it:

```sql
-- Create signup health check view
CREATE OR REPLACE VIEW signup_health_check AS
SELECT
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as signups_last_hour,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '6 hours') as signups_last_6h,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as signups_last_24h,
    MAX(created_at) as last_signup_time,
    EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 as hours_since_last_signup,
    CASE
        WHEN MAX(created_at) IS NULL THEN '🚨 CRITICAL: NO SIGNUPS EVER'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 12 THEN '🚨 CRITICAL: No signups in 12+ hours'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 6 THEN '⚠️ WARNING: No signups in 6+ hours'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 2 THEN '⚡ NOTICE: No signups in 2+ hours'
        ELSE '✅ OK: Recent signup activity'
    END as health_status
FROM auth.users;
```

4. Click **Run** (Ctrl+Enter)
5. You should see: `Success. No rows returned`

✅ **Done!** Monitoring is now installed.

---

## 📅 Daily Routine (1 Minute Per Day)

### Morning Check: Are Signups Working?

Open Supabase SQL Editor and run:

```sql
SELECT * FROM signup_health_check;
```

**What you'll see:**

| signups_last_hour | signups_last_6h | signups_last_24h | hours_since_last_signup | health_status |
|-------------------|-----------------|------------------|-------------------------|---------------|
| 2                 | 15              | 47               | 0.3                     | ✅ OK: Recent signup activity |

**What it means:**
- **✅ OK** = Everything working normally
- **⚡ NOTICE** = No signups in 2+ hours (might be normal at night)
- **⚠️ WARNING** = No signups in 6+ hours (check if ads running)
- **🚨 CRITICAL** = No signups in 12+ hours (INVESTIGATE IMMEDIATELY!)

**If you see 🚨 CRITICAL:**
1. Test signup yourself at https://unimogcommunityhub.com/signup
2. If it fails, check Slack/Discord for user reports
3. See "Emergency Response" section below

---

## 🔧 Before Making Database Changes

**ALWAYS run this test first:**

1. Open Supabase SQL Editor
2. Run this query:

```sql
SELECT
    proname as function_name,
    CASE
        WHEN prosecdef THEN '✅ SECURITY DEFINER'
        ELSE '❌ MISSING SECURITY DEFINER'
    END as security_status
FROM pg_proc
WHERE proname IN (
    'handle_new_user',
    'handle_new_user_subscription',
    'notify_new_user',
    'notify_new_user_email'
)
ORDER BY proname;
```

**Expected Result:** All 4 functions show `✅ SECURITY DEFINER`

❌ **If ANY show ❌:** DO NOT make any changes! Fix that first using `docs/CRITICAL_SIGNUP_FIX.sql`

---

## 🚀 Before Every Deployment

### Pre-Deploy Checklist (5 Minutes)

**Step 1:** Test on Staging First
```bash
git push staging main:main
```

**Step 2:** Wait for Netlify staging deploy (2-3 min)

**Step 3:** Test signup on staging:
1. Go to: https://unimogcommunity-staging.netlify.app/signup
2. Sign up with: `test-$(date +%s)@test.com`
3. Verify: ✅ No "Database error" message

**Step 4:** Check database (in Supabase):
```sql
SELECT
    u.email,
    u.created_at,
    CASE WHEN p.id IS NOT NULL THEN '✅' ELSE '❌' END as has_profile,
    CASE WHEN us.id IS NOT NULL THEN '✅' ELSE '❌' END as has_subscription
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_subscriptions us ON u.id = us.user_id
ORDER BY u.created_at DESC
LIMIT 1;
```

**Expected:** Both `has_profile` and `has_subscription` show ✅

**Step 5:** If staging works, deploy to production:
```bash
git push origin main
```

**Step 6:** IMMEDIATELY test signup on production:
1. Go to: https://unimogcommunityhub.com/signup
2. Sign up with test email
3. Verify it works

---

## 🚨 Emergency Response

### If Signups Are Broken in Production

**DON'T PANIC - You have a 2-minute fix:**

#### Option 1: Quick Rollback (Recommended)

1. Open Supabase SQL Editor
2. Run this to temporarily disable notifications:

```sql
DROP TRIGGER IF EXISTS trigger_notify_new_user ON auth.users;
DROP TRIGGER IF EXISTS trigger_notify_new_user_email ON auth.users;
```

3. Test signup immediately - should work now
4. You just bought time to investigate properly

#### Option 2: Git Rollback

```bash
git revert HEAD
git push origin main
# Wait for Netlify deploy
# Test signup
```

#### Option 3: Contact Support

If both above fail:
1. Check Supabase status: https://status.supabase.com
2. Check Netlify status: https://www.netlifystatus.com
3. Post in community channels

---

## 📖 Complete Documentation Reference

For detailed information, see:

| File | Purpose | When to Use |
|------|---------|-------------|
| `CRITICAL_SIGNUP_FIX.sql` | The original fix | If SECURITY DEFINER missing |
| `DEPLOYMENT_CHECKLIST.md` | Full deploy protocol | Before every production deploy |
| `SIGNUP_MONITORING.md` | Complete monitoring strategy | Setting up advanced alerts |
| `FIXED_TRIGGER_TEST.sql` | Advanced testing | Deep database validation |
| `POST_INCIDENT_SUMMARY.md` | What happened | Understanding the incident |

---

## 🎯 Common Scenarios

### Scenario 1: "I just pushed code to staging"
**Action:** Follow "Before Every Deployment" checklist above

### Scenario 2: "I need to add a new database trigger"
**Action:**
1. Test on staging first
2. Add `SECURITY DEFINER` if it touches user data
3. Run validation query
4. Follow deployment checklist

### Scenario 3: "A user says they can't sign up"
**Action:**
1. Check `SELECT * FROM signup_health_check;`
2. Try signing up yourself
3. Check Supabase logs (Dashboard → Logs → Auth)
4. If broken, run emergency response

### Scenario 4: "I want to check if signups are healthy"
**Action:**
```sql
SELECT * FROM signup_health_check;
```

### Scenario 5: "I'm running ads and want to monitor conversions"
**Action:**
- Check `signup_health_check` every few hours
- Monitor Google Analytics for signup events
- Set up Slack/Email alerts (see SIGNUP_MONITORING.md)

---

## ⏰ Recommended Schedule

**Daily (1 min):**
- Morning: `SELECT * FROM signup_health_check;`

**Before deployments (5 min):**
- Follow pre-deploy checklist
- Test on staging
- Verify on production

**Weekly (5 min):**
- Review signup trends
- Check for any user reports
- Verify monitoring still working

**Monthly (15 min):**
- Review all prevention docs
- Update emergency contacts
- Test emergency rollback procedure

---

## 🆘 Quick Commands Cheat Sheet

```sql
-- Check signup health
SELECT * FROM signup_health_check;

-- Verify SECURITY DEFINER
SELECT proname, CASE WHEN prosecdef THEN '✅' ELSE '❌' END
FROM pg_proc WHERE proname IN (
    'handle_new_user', 'handle_new_user_subscription',
    'notify_new_user', 'notify_new_user_email'
);

-- Emergency: Disable notifications
DROP TRIGGER IF EXISTS trigger_notify_new_user ON auth.users;
DROP TRIGGER IF EXISTS trigger_notify_new_user_email ON auth.users;

-- Check recent signups
SELECT email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;
```

---

## ✅ You're All Set!

**What you just set up:**
- ✅ Real-time signup health monitoring
- ✅ Pre-deployment validation
- ✅ Emergency rollback procedure
- ✅ Daily health checks

**Your signups are now monitored and protected!** 🎉

**Questions?** Reference the detailed docs in `/docs/` folder.
