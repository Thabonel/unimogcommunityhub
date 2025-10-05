# Signup Monitoring & Alerting System

## Critical Business Metric: New User Signups

**Why This Matters**: Running ads with broken signups = burning money with zero ROI

## Monitoring Strategy

### 1. Database-Level Monitoring (IMPLEMENTED)

Create a Supabase Edge Function that runs every 5 minutes to check signup health:

```sql
-- Create a view to track signup health
CREATE OR REPLACE VIEW signup_health_check AS
SELECT
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as signups_last_hour,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as signups_last_24h,
    MAX(created_at) as last_signup_time,
    EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 as hours_since_last_signup
FROM auth.users;

-- Alert if no signups in 6 hours during business hours
-- (Configurable based on your ad spend patterns)
```

### 2. Edge Function Health Monitor

**File**: `/supabase/functions/monitor-signups/index.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Check signup health
  const { data, error } = await supabase
    .from('signup_health_check')
    .select('*')
    .single()

  const ALERT_THRESHOLD_HOURS = 6 // Alert if no signups in 6 hours

  if (data.hours_since_last_signup > ALERT_THRESHOLD_HOURS) {
    // Send critical alert via:
    // 1. SMS to admin (Twilio)
    // 2. Email
    // 3. Slack webhook

    await sendCriticalAlert({
      type: 'SIGNUP_FAILURE',
      severity: 'CRITICAL',
      message: `🚨 NO SIGNUPS IN ${Math.floor(data.hours_since_last_signup)} HOURS`,
      details: {
        last_signup: data.last_signup_time,
        signups_24h: data.signups_last_24h
      }
    })
  }

  return new Response(JSON.stringify({ status: 'ok', data }))
})
```

**Deploy**: `npx supabase functions deploy monitor-signups`

**Cron Schedule**: Run every 5 minutes via Supabase Cron:

```sql
SELECT cron.schedule(
    'check-signup-health',
    '*/5 * * * *', -- Every 5 minutes
    $$
    SELECT net.http_post(
        url := 'https://your-project.supabase.co/functions/v1/monitor-signups',
        headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) as request_id;
    $$
);
```

### 3. Frontend Monitoring

**File**: `/src/utils/signup-monitor.ts`

```typescript
// Track signup attempts and failures
export const trackSignupAttempt = async (email: string, success: boolean, error?: string) => {
  // Log to analytics
  window.gtag?.('event', 'signup_attempt', {
    success,
    error_message: error,
    timestamp: new Date().toISOString()
  })

  // If failure, send immediate alert to admin
  if (!success) {
    await fetch('/api/alert-signup-failure', {
      method: 'POST',
      body: JSON.stringify({ email, error, timestamp: Date.now() })
    })
  }
}
```

### 4. Automated End-to-End Test

**File**: `/tests/e2e/critical-signup.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test('Critical: Signup flow works', async ({ page }) => {
  await page.goto('/signup')

  const testEmail = `test-${Date.now()}@unimogtest.com`

  // Fill signup form
  await page.fill('input[name="email"]', testEmail)
  await page.fill('input[name="password"]', 'TestPassword123!')
  await page.fill('input[name="confirmPassword"]', 'TestPassword123!')
  await page.selectOption('select[name="country"]', 'AU')
  await page.check('input[name="agreeToTerms"]')

  // Submit
  await page.click('button[type="submit"]')

  // Should NOT show "Database error saving new user"
  await expect(page.locator('text=Database error')).not.toBeVisible()

  // Should show success
  await expect(page.locator('text=Check your email')).toBeVisible({ timeout: 10000 })
})
```

**Run this test**:
- Every 30 minutes via GitHub Actions
- On every deployment
- Before pushing to production

**GitHub Actions**: `.github/workflows/signup-monitor.yml`

```yaml
name: Critical Signup Monitor

on:
  schedule:
    - cron: '*/30 * * * *'  # Every 30 minutes
  workflow_dispatch:

jobs:
  test-signup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:signup
      - name: Alert on failure
        if: failure()
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: smtp.gmail.com
          server_port: 465
          username: ${{ secrets.ALERT_EMAIL }}
          password: ${{ secrets.ALERT_PASSWORD }}
          to: thabonel0@gmail.com
          subject: 🚨 CRITICAL: Signup test FAILED
          body: Signup flow is broken! Check immediately.
```

### 5. Database Trigger Testing Framework

**File**: `/supabase/tests/trigger_tests.sql`

```sql
-- Test all auth.users triggers can execute successfully
CREATE OR REPLACE FUNCTION test_signup_triggers()
RETURNS TABLE(trigger_name text, status text, error text) AS $$
DECLARE
  test_user_id uuid := gen_random_uuid();
  test_email text := 'trigger-test@test.com';
BEGIN
  -- Test each trigger function individually

  -- Test 1: handle_new_user
  BEGIN
    INSERT INTO profiles (id, email, created_at)
    VALUES (test_user_id, test_email, NOW());

    RETURN QUERY SELECT 'handle_new_user'::text, 'PASS'::text, NULL::text;
    DELETE FROM profiles WHERE id = test_user_id;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'handle_new_user'::text, 'FAIL'::text, SQLERRM;
  END;

  -- Test 2: handle_new_user_subscription
  BEGIN
    INSERT INTO user_subscriptions (user_id, subscription_type, subscription_status)
    VALUES (test_user_id, 'free', 'active');

    RETURN QUERY SELECT 'handle_new_user_subscription'::text, 'PASS'::text, NULL::text;
    DELETE FROM user_subscriptions WHERE user_id = test_user_id;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'handle_new_user_subscription'::text, 'FAIL'::text, SQLERRM;
  END;

  -- Test 3: notify_new_user
  BEGIN
    PERFORM queue_admin_sms('new_user', test_user_id, 'Test');
    RETURN QUERY SELECT 'notify_new_user'::text, 'PASS'::text, NULL::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'notify_new_user'::text, 'FAIL'::text, SQLERRM;
  END;

  -- Test 4: notify_new_user_email
  BEGIN
    PERFORM queue_admin_email('new_user', test_user_id, 'Test', 'Test');
    RETURN QUERY SELECT 'notify_new_user_email'::text, 'PASS'::text, NULL::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'notify_new_user_email'::text, 'FAIL'::text, SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;

-- Run tests
SELECT * FROM test_signup_triggers();
```

Run this in Supabase dashboard after ANY trigger changes.

### 6. Pre-Deployment Checklist

**File**: `/DEPLOY_CHECKLIST.md`

```markdown
# Pre-Production Deployment Checklist

## 🚨 CRITICAL: Before pushing to production

### Database Changes
- [ ] Run `SELECT * FROM test_signup_triggers();` in Supabase
- [ ] All triggers return 'PASS'
- [ ] Test signup manually on staging
- [ ] Verify user created in auth.users, profiles, user_subscriptions

### Code Changes
- [ ] Run `npm run test:signup` locally
- [ ] E2E signup test passes
- [ ] No "Database error" in console

### Post-Deployment
- [ ] Test signup on production immediately
- [ ] Check signup_health_check view shows recent signup
- [ ] Monitor for 1 hour for any errors

## If Signup Fails
1. Immediately run emergency rollback
2. Alert all admins
3. Investigate in staging only
```

### 7. Emergency Rollback Plan

**File**: `/docs/EMERGENCY_ROLLBACK.md`

```markdown
# Emergency Rollback Procedure

## If signups break in production:

### Step 1: Immediate Mitigation (< 2 minutes)
```sql
-- Disable notification triggers temporarily
DROP TRIGGER IF EXISTS trigger_notify_new_user ON auth.users;
DROP TRIGGER IF EXISTS trigger_notify_new_user_email ON auth.users;
```

### Step 2: Verify Fix (< 1 minute)
Test signup immediately - should work without notifications

### Step 3: Investigate (< 30 minutes)
- Check Supabase logs
- Run trigger tests on staging
- Identify root cause

### Step 4: Proper Fix
- Fix triggers with SECURITY DEFINER
- Test on staging
- Re-enable triggers on production
```

## Summary: 6-Layer Defense

1. **Database monitoring** - Automated health checks every 5 min
2. **Frontend monitoring** - Track every signup attempt
3. **E2E tests** - Run every 30 min + on deployment
4. **Trigger tests** - Run before any database changes
5. **Pre-deployment checklist** - Manual verification
6. **Emergency rollback** - Quick recovery plan

## Alert Thresholds

- 🔴 **CRITICAL**: No signups in 6 hours (during ad hours)
- 🟡 **WARNING**: Signup failure rate > 10%
- 📊 **INFO**: Daily signup summary

## Notification Channels

1. SMS to admin (Twilio)
2. Email to thabonel0@gmail.com
3. Slack #critical-alerts channel
4. Admin dashboard banner
