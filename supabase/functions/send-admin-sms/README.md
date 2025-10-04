# Admin SMS Notifications Edge Function

## Overview
Automatically sends SMS notifications to the site admin (Thabo) when key events happen on the platform.

## How It Works
1. **Database Triggers**: When events occur (new user, post, listing, etc.), triggers call `queue_admin_sms()`
2. **Queue**: SMS details are stored in `admin_sms_log` table with status 'pending'
3. **Cron Job**: This Edge Function runs every minute via Supabase Cron
4. **Send**: Function fetches pending SMS, sends via Twilio, updates status to 'sent' or 'failed'

## Events Tracked
- ✅ New user signups
- ✅ New community posts
- ✅ New marketplace listings
- ✅ Feedback submissions
- ✅ New trips created
- ⏸️ Comments (disabled by default - too many)
- ⏸️ Messages (disabled by default - too many)

## Setup Instructions

### 1. Get Twilio Credentials
1. Sign up at https://www.twilio.com/try-twilio
2. Get a phone number from Twilio Console
3. Copy your Account SID and Auth Token

### 2. Add Environment Variables to Supabase
Go to Supabase Dashboard → Project Settings → Edge Functions → Add secret:

```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Deploy Edge Function
```bash
supabase functions deploy send-admin-sms
```

### 4. Set Up Cron Job
In Supabase SQL Editor:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule Edge Function to run every minute
SELECT cron.schedule(
  'send-admin-sms',
  '* * * * *',  -- Every minute
  $$
  SELECT
    net.http_post(
        url:='https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/send-admin-sms',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) as request_id;
  $$
);
```

### 5. Apply Database Migration
```bash
supabase db push
```

## Admin Phone Number
- Configured: +61402091189 (Australia)
- Can be updated in `admin_sms_preferences` table

## Toggle Notifications
In Admin Panel → SMS Notifications:
- Enable/disable all SMS
- Toggle individual event types
- View SMS log history

## Testing
Send test notification:
```sql
SELECT queue_admin_sms(
  'new_user',
  gen_random_uuid(),
  '🧪 Test SMS notification from Unimog Community Hub'
);
```

Then wait up to 1 minute for the cron job to process it.

## Costs
- Twilio SMS: ~$0.0075 per SMS (Australia)
- Expected volume: 5-20 SMS/day
- Monthly cost: ~$1-5 USD

## Troubleshooting

### No SMS received?
1. Check `admin_sms_log` table for status
2. Verify phone number format (+61402091189)
3. Check Twilio dashboard for delivery status
4. Ensure cron job is running: `SELECT * FROM cron.job;`

### SMS marked as 'failed'?
- Check `error_message` column in `admin_sms_log`
- Verify Twilio credentials in Edge Function secrets
- Check Twilio account balance

### Want to stop notifications temporarily?
```sql
UPDATE admin_sms_preferences SET enabled = false WHERE phone_number = '+61402091189';
```

## File Structure
```
supabase/
├── migrations/
│   └── YYYYMMDDHHMMSS_create_admin_sms_notifications.sql
└── functions/
    └── send-admin-sms/
        ├── index.ts
        └── README.md (this file)
```
