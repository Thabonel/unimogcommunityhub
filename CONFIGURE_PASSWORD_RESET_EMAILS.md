# Fix Password Reset Email Error

## Problem
"Could not send password reset email" error occurs because Supabase Auth email templates aren't configured.

## Solution: Configure Supabase Auth Email Templates

### Step 1: Go to Supabase Email Templates
1. Open Supabase Dashboard: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor
2. Navigate to **Authentication** → **Email Templates**
3. Find **Reset Password** template

### Step 2: Configure the Reset Password Template

**Subject Line:**
```
Reset your Unimog Community Hub password
```

**Email Body (HTML):**
```html
<h2>Reset your password</h2>
<p>Hi there,</p>
<p>Someone requested a password reset for your Unimog Community Hub account.</p>
<p>If this was you, click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>This link will expire in 24 hours.</p>
<br>
<p>Thanks,<br>The Unimog Community Hub Team</p>
```

### Step 3: Configure Email Settings (if not already done)

Go to **Authentication** → **Settings** → **SMTP Settings**

Check if SMTP is configured. If not, you have two options:

#### Option A: Use Supabase's Built-in Email (Easiest)
- Supabase provides a default email service
- Limited to 4 emails/hour on free tier
- No configuration needed - just enable the template

#### Option B: Use Custom SMTP (Production-ready)
If you want unlimited emails, configure your own SMTP:
- **Service**: Resend, SendGrid, Mailgun, or Gmail
- **Host**: smtp.resend.com (or your provider)
- **Port**: 587
- **Username**: Your SMTP username
- **Password**: Your SMTP password
- **From Email**: noreply@unimogcommunityhub.com

### Step 4: Test Password Reset

1. Go to https://unimogcommunityhub.com/forgot-password
2. Enter any email (even fake@test.com)
3. Should succeed without error
4. Check email inbox for reset link

## Quick Fix (Bypass Custom Email)

If you want to disable the custom confirmation email that might be causing issues, edit `ForgotPassword.tsx`:

```typescript
// Comment out lines 43-48:
/*
try {
  await sendPasswordResetConfirmation(email);
} catch (emailError) {
  console.error("Failed to send confirmation email:", emailError);
}
*/
```

This removes the redundant custom email and relies only on Supabase's built-in reset email.

## Current Issue
- Supabase Auth email template is likely not configured
- The error message shows: "Error sending recovery email"
- This comes from Supabase Auth, not your custom code

## Recommended Action
1. Configure the Reset Password email template in Supabase (steps above)
2. Test with a real email address
3. Optionally remove the custom confirmation email code
