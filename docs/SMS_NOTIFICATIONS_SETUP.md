# SMS Notifications Setup Guide

## 🎯 Overview
Instant SMS alerts to your phone (+61402091189) whenever important events happen on Unimog Community Hub.

## 📱 What You'll Receive
Text messages for:
- ✅ New user signups
- ✅ New community posts
- ✅ New marketplace listings
- ✅ Feedback submissions
- ✅ New trips created
- ✅ Payment/subscription events
- ✅ System errors
- ⏸️ Comments (disabled by default - too many)
- ⏸️ Messages (disabled by default - too many)

## 🛠️ Setup Steps

### Step 1: Sign Up for Twilio
1. Go to https://www.twilio.com/try-twilio
2. Create free account (comes with $15 credit)
3. Verify your phone number: +61402091189

### Step 2: Get Twilio Credentials
1. From Twilio Console Dashboard:
   - Copy **Account SID** (starts with `AC...`)
   - Copy **Auth Token** (click "eye" icon to reveal)
2. Go to Phone Numbers → Buy a Number
   - Select Australia (+61) or US (+1) number
   - Copy the phone number in format: +61XXXXXXXXX

### Step 3: Add Secrets to Supabase
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor
2. Navigate to: Project Settings → Edge Functions
3. Add these secrets:

```
TWILIO_ACCOUNT_SID = AC...your_account_sid
TWILIO_AUTH_TOKEN = your_auth_token
TWILIO_PHONE_NUMBER = +61XXXXXXXXX (your Twilio number)
```

### Step 4: Deploy Edge Function
Run from project root:

```bash
# Deploy the SMS sending function
supabase functions deploy send-admin-sms --project-ref ydevatqwkoccxhtejdor

# Verify deployment
supabase functions list --project-ref ydevatqwkoccxhtejdor
```

### Step 5: Apply Database Migration
Run migration to create tables and triggers:

```bash
# Push migration to Supabase
supabase db push --project-ref ydevatqwkoccxhtejdor
```

Or manually in Supabase SQL Editor:
```sql
-- Run the migration file content from:
-- supabase/migrations/*_create_admin_sms_notifications.sql
```

### Step 6: Set Up Cron Job
In Supabase SQL Editor, run:

```sql
-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule Edge Function to run every minute
SELECT cron.schedule(
  'send-admin-sms',
  '* * * * *',  -- Every minute
  $$
  SELECT
    net.http_post(
        url:='https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/send-admin-sms',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer <TOKEN>"}'::jsonb
    ) as request_id;
  $$
);

-- Verify cron job is scheduled
SELECT * FROM cron.job WHERE jobname = 'send-admin-sms';
```

**Replace `YOUR_SUPABASE_ANON_KEY`** with your actual anon key from Supabase Project Settings → API.

### Step 7: Test the System
1. Go to Admin Panel → SMS Notifications tab
2. Click "Send Test SMS" button
3. Check your phone within 1 minute

Or manually via SQL:
```sql
SELECT queue_admin_sms(
  'error',
  gen_random_uuid(),
  '🧪 Test SMS from Unimog Community Hub'
);

-- Wait 1 minute, then check if it was sent
SELECT * FROM admin_sms_log ORDER BY created_at DESC LIMIT 5;
```

## 📊 Managing Notifications

### Via Admin Panel
1. Navigate to: `/admin` → "SMS Notifications" tab
2. Toggle master switch to enable/disable all SMS
3. Enable/disable individual event types
4. View SMS log history (last 50 messages)

### Via Database
```sql
-- Disable all SMS temporarily
UPDATE admin_sms_preferences
SET enabled = false
WHERE phone_number = '+61402091189';

-- Enable only critical events
UPDATE admin_sms_preferences SET
  notify_new_user = true,
  notify_new_post = false,
  notify_new_listing = false,
  notify_new_comment = false,
  notify_new_message = false,
  notify_feedback = true,
  notify_payment = true,
  notify_trip = false,
  notify_error = true
WHERE phone_number = '+61402091189';

-- Change phone number
UPDATE admin_sms_preferences
SET phone_number = '+61NEWPHONENUMBER'
WHERE admin_user_id = (SELECT id FROM auth.users WHERE email = 'thabonel0@gmail.com');
```

## 🔍 Monitoring & Debugging

### Check SMS Log
```sql
-- View recent SMS
SELECT
  created_at,
  event_type,
  LEFT(message, 60) as message_preview,
  status,
  error_message
FROM admin_sms_log
ORDER BY created_at DESC
LIMIT 20;

-- Count by status
SELECT status, COUNT(*)
FROM admin_sms_log
GROUP BY status;

-- Find failed SMS
SELECT * FROM admin_sms_log
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### Check Cron Job Status
```sql
-- View cron schedule
SELECT * FROM cron.job WHERE jobname = 'send-admin-sms';

-- View cron execution log
SELECT * FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'send-admin-sms')
ORDER BY start_time DESC
LIMIT 10;
```

### Test Edge Function Manually
```bash
curl -X POST \
  'https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/send-admin-sms' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## 💰 Cost Estimates

### Twilio Pricing (Australia)
- **Outbound SMS**: $0.0075 USD per message
- **Monthly Phone Number**: $1.00 USD/month

### Expected Usage
- **Light Activity** (5-10 events/day): 150-300 SMS/month = $1.13 - $2.25/month
- **Medium Activity** (15-25 events/day): 450-750 SMS/month = $3.38 - $5.63/month
- **High Activity** (30+ events/day): 900+ SMS/month = $6.75+/month

**Total**: ~$2-10 USD/month depending on site activity

### Free Tier
- Twilio gives $15 credit on free accounts
- This covers ~2000 SMS messages
- Enough for 3-6 months of notifications

## 🚨 Troubleshooting

### No SMS Received?
1. Check SMS log status: `SELECT * FROM admin_sms_log ORDER BY created_at DESC LIMIT 5;`
2. Verify phone number format: Must include country code `+61`
3. Check Twilio dashboard for delivery status
4. Verify cron job is running: `SELECT * FROM cron.job;`
5. Check Edge Function secrets are set correctly

### SMS Marked as 'Failed'?
- Check `error_message` column in `admin_sms_log`
- Common errors:
  - **Invalid phone number**: Check format (+61402091189)
  - **Twilio auth failed**: Verify Account SID and Auth Token
  - **Insufficient balance**: Add credit to Twilio account
  - **Geographic restrictions**: Some countries require special setup

### Cron Not Running?
```sql
-- Delete and recreate cron job
SELECT cron.unschedule('send-admin-sms');

SELECT cron.schedule(
  'send-admin-sms',
  '* * * * *',
  $$
  SELECT net.http_post(
    url:='https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/send-admin-sms',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

### Too Many SMS?
Disable high-volume events in Admin Panel:
- Comments (can be hundreds per day)
- Messages (can be hundreds per day)

Or adjust triggers in migration file.

## 📝 Example SMS Messages

```
🆕 New user signup: davidwswitt@gmail.com

📝 New post by tidesend: Check out my U1700L resto...

🛒 New listing by test@example.com: Portal axle seal kit - $45

💬 Feedback (bug): Login button not working on mo...

🗺️ New trip created: Alpine Adventure 2025

⚠️ Error: Database connection timeout in getPosts...

🧪 Test SMS from Unimog Community Hub - Your not...
```

## 🔐 Security Notes

1. **Secrets Storage**: Never commit Twilio credentials to Git
2. **RLS Policies**: Only admins can view SMS logs and preferences
3. **Rate Limiting**: Cron runs max once per minute (prevents spam)
4. **Phone Privacy**: Phone number only stored in database (not in code)

## 📚 Files Created

```
supabase/
├── migrations/
│   └── YYYYMMDDHHMMSS_create_admin_sms_notifications.sql
└── functions/
    └── send-admin-sms/
        ├── index.ts
        └── README.md

src/
└── components/
    └── admin/
        └── SMSNotifications.tsx

docs/
└── SMS_NOTIFICATIONS_SETUP.md (this file)
```

## ✅ Verification Checklist

Before going live:
- [ ] Twilio account created and verified
- [ ] Phone number purchased from Twilio
- [ ] Secrets added to Supabase Edge Functions
- [ ] Edge Function deployed successfully
- [ ] Database migration applied
- [ ] Cron job scheduled and verified
- [ ] Test SMS sent and received
- [ ] Admin panel SMS tab accessible
- [ ] Event toggles working correctly

## 🎉 You're Done!

Once setup is complete, you'll receive instant SMS alerts whenever something happens on your site. You can manage preferences from the Admin Panel → SMS Notifications tab.

**Questions?** Check the troubleshooting section or view SMS logs in the admin panel.

---

*Last Updated: October 4, 2025*
*Your Phone: +61402091189*
*Setup Time: ~15-20 minutes*
