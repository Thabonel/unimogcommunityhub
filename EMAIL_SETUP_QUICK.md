# 📧 Email Notifications - Quick Setup (5 Minutes)

## Step 1: Sign up for Resend (2 min)

1. Go to: https://resend.com/signup
2. Sign up with your email (thabonel0@gmail.com)
3. Verify your email
4. **Get API Key**:
   - Click "API Keys" in sidebar
   - Click "Create API Key"
   - Name it: "Unimog Hub Notifications"
   - Click "Create"
   - **Copy the API key** (starts with `re_`)

## Step 2: Add Domain (Optional but recommended)

For production emails from `notifications@unimogcommunityhub.com`:

1. In Resend dashboard, click "Domains"
2. Click "Add Domain"
3. Enter: `unimogcommunityhub.com`
4. Follow DNS setup instructions (add TXT/MX records to your domain)

**OR skip this** and use `onboarding@resend.dev` for testing (100 emails/day limit)

## Step 3: Add API Key to Supabase (1 min)

Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/functions

Add this secret:

```
Name: RESEND_API_KEY
Value: re_[your API key from step 1]
```

Click "Save"

## Step 4: Deploy Edge Function (1 min)

Run in terminal:

```bash
cd /Users/thabonel/Code/unimogcommunityhub
supabase functions deploy send-admin-email --project-ref ydevatqwkoccxhtejdor --no-verify-jwt
```

## Step 5: Apply Database Migration (1 min)

1. Open: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
2. Copy everything from `docs/setup-email-notifications.sql`
3. Paste and click "Run"

## ✅ Done!

You'll now receive instant emails to **thabonel0@gmail.com** for:
- 🆕 New user signups
- 📝 New community posts
- 🛒 New marketplace listings
- 💬 Feedback submissions
- 🗺️ New trips
- ⚠️ Errors

## 💰 Cost

- **Free tier**: 3,000 emails/month
- **After that**: $20/month for 50,000 emails
- **Much cheaper than SMS!**

## 🧪 Test

After setup, run in SQL Editor:

```sql
SELECT queue_admin_email(
  'error',
  gen_random_uuid(),
  '🧪 Test Email - Notifications Active',
  'This is a test email from Unimog Community Hub!'
);
```

Check your inbox within 1 minute!
