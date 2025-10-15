# Signup Monitoring System - Setup Guide

## Overview

This system monitors user signup health and automatically sends email alerts when signups stop working.

## What Was Installed

### 1. Database Components
- **signup_health_check** view - Real-time signup health dashboard
- **signup_health_log** table - Historical health check data
- **check_signup_health()** function - Analyzes signup health and determines if alerts needed
- **send_signup_alert()** function - Sends email alerts when issues detected

### 2. Edge Function
- **signup-health-check** - Cron-triggered function that runs health checks

### 3. Alert Thresholds
- **OK**: Signups within last 2 hours
- **NOTICE**: No signups in 2+ hours
- **WARNING**: No signups in 6+ hours (sends alert)
- **CRITICAL**: No signups in 12+ hours (sends alert)

## Setup Steps

### Step 1: Apply Database Migration

Run in Supabase SQL Editor:

```bash
# The migration file is ready - just needs to be applied
# File: supabase/migrations/20251015000002_create_signup_monitoring_system.sql
```

Or run directly in SQL Editor - the migration creates:
- signup_health_check view
- signup_health_log table
- check_signup_health() function
- send_signup_alert() function

### Step 2: Deploy Edge Function

```bash
# Deploy the signup-health-check edge function
supabase functions deploy signup-health-check
```

### Step 3: Set Up Supabase Cron Job

1. Go to Supabase Dashboard → Database → Cron Jobs
2. Click "Create a new cron job"
3. Configure:
   - **Name**: `signup-health-check`
   - **Schedule**: `*/30 * * * *` (every 30 minutes)
   - **SQL Command**:
   ```sql
   SELECT net.http_post(
     url := 'https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/signup-health-check',
     headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
   );
   ```

### Step 4: Test the System

**Manual Test**:
```sql
-- Check current health status
SELECT * FROM signup_health_check;

-- Run a health check manually
SELECT * FROM check_signup_health();

-- Test alert (if health is WARNING or CRITICAL)
SELECT send_signup_alert();

-- View health check history
SELECT * FROM signup_health_log ORDER BY check_time DESC LIMIT 10;
```

### Step 5: Verify Email Alerts Work

1. Wait for a health check to run (or manually trigger)
2. If signup status is WARNING or CRITICAL, you should receive an email
3. Check `admin_email_log` table:
   ```sql
   SELECT * FROM admin_email_log
   WHERE event_type = 'error'
   ORDER BY created_at DESC LIMIT 5;
   ```

## How It Works

### Every 30 Minutes:
1. Cron triggers `signup-health-check` Edge Function
2. Function calls `send_signup_alert()`
3. Alert function calls `check_signup_health()`
4. Health check analyzes signup activity
5. If WARNING or CRITICAL (and no alert sent in last hour):
   - Queues email via `queue_admin_email()`
   - Logs health status in `signup_health_log`
6. Email function processes queued emails and sends them

### Alert Suppression:
- Alerts only sent once per hour (prevents spam)
- Only sends if status is WARNING or CRITICAL
- Tracks last alert time in `signup_health_log`

## What You'll Receive

### Email Alert Example:
```
Subject: ALERT: Signup System Health - CRITICAL

Signup Health Alert

Status: CRITICAL
Message: No signups in 12+ hours - Possible signup failure

Details:
- Signups last hour: 0
- Signups last 6 hours: 0
- Signups last 24 hours: 0
- Hours since last signup: 14.5

Action Required: Check signup system immediately
Admin Panel: https://unimogcommunityhub.com/admin
Database: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor
```

## Manual Monitoring

### Quick Health Check:
```sql
SELECT * FROM signup_health_check;
```

### View Alert History:
```sql
SELECT
  check_time,
  health_status,
  signups_last_hour,
  hours_since_last_signup,
  alert_sent
FROM signup_health_log
ORDER BY check_time DESC
LIMIT 20;
```

### Force Alert (for testing):
```sql
-- This will send an alert if health is WARNING or CRITICAL
SELECT send_signup_alert();
```

## Troubleshooting

### No Alerts Received

1. Check email preferences:
   ```sql
   SELECT * FROM admin_email_preferences;
   ```

2. Check email log:
   ```sql
   SELECT * FROM admin_email_log ORDER BY created_at DESC LIMIT 10;
   ```

3. Check health log:
   ```sql
   SELECT * FROM signup_health_log ORDER BY check_time DESC LIMIT 10;
   ```

### Cron Not Running

1. Verify cron job exists in Supabase Dashboard
2. Check cron execution logs in Dashboard → Database → Cron Jobs
3. Manually test edge function:
   ```bash
   curl -X POST \
     'https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/signup-health-check' \
     -H 'Authorization: Bearer <TOKEN>'
   ```

### False Alerts

If you're getting alerts but signups are working:

1. Check actual signup activity:
   ```sql
   SELECT COUNT(*), MAX(created_at)
   FROM auth.users
   WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

2. Adjust thresholds in the migration if needed (e.g., change 6 hours to 12 hours for WARNING)

## SMS Alerts (Optional - Currently Disabled)

SMS alerts require Vonage API setup:
1. Sign up for Vonage account
2. Add environment variables to Supabase Edge Functions:
   - `VONAGE_API_KEY`
   - `VONAGE_API_SECRET`
   - `VONAGE_FROM_NUMBER`
3. Uncomment SMS code in `send_signup_alert()` function

## Maintenance

### Cleanup Old Logs (Optional)

Run monthly to prevent signup_health_log table from growing too large:

```sql
DELETE FROM signup_health_log
WHERE check_time < NOW() - INTERVAL '30 days';
```

## Success Criteria

You'll know the system is working when:
- ✅ `signup_health_check` view shows current status
- ✅ Cron job runs every 30 minutes
- ✅ Emails arrive when signup health degrades
- ✅ No more silent signup failures

## Quick Reference Commands

```sql
-- Check health now
SELECT * FROM signup_health_check;

-- View recent checks
SELECT * FROM signup_health_log ORDER BY check_time DESC LIMIT 10;

-- Manual alert (testing)
SELECT send_signup_alert();

-- Count signups today
SELECT COUNT(*) FROM auth.users WHERE created_at::date = CURRENT_DATE;
```

## Prevention

This system ensures you'll **never again** have silent signup failures. If signups stop working, you'll know within 30 minutes (or at most 6 hours if threshold not reached).

---

**Status**: Ready to deploy
**Last Updated**: 2025-10-15
**Dependencies**: admin_email_preferences, queue_admin_email function
