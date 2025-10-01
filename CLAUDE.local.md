# Personal UnimogCommunityHub Quick Reference

> **Note**: This file is gitignored and stays on your local machine only.
> Use it for personal shortcuts, frequently used queries, and private notes.

## My Common Tasks

### Grant Free Access to Users
1. Navigate to `/admin` → Users tab
2. Select user(s) with checkbox
3. Click "Grant Free Access" → Choose type
4. Enter reason, confirm

### Check My Admin Account
```sql
SELECT * FROM user_subscriptions WHERE user_id = 'f91c4216-27cb-4b39-ba52-01dd95765b21';
```

### Quick User Subscription Check
```sql
SELECT u.email, us.subscription_type, us.is_free_access, us.current_period_end
FROM auth.users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id
WHERE u.email = '[email-here]';
```

## My Shortcuts

### Admin Accounts
- **My Admin**: thabonel0@gmail.com (Permanent Free Premium)
- **My Test**: thabo.nel@sbs.com.au (Trial)

### URLs
- **Staging**: https://unimogcommunity-staging.netlify.app
- **Production**: https://unimogcommunityhub.com
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor

### Deployment
- Staging: Auto-push after commits
- Production: ONLY with explicit permission (ask first!)

## Frequently Used Queries

### List All Admins
```sql
SELECT u.email, ur.role
FROM user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

### Count Users by Type
```sql
SELECT
  CASE
    WHEN us.trial_ends_at IS NOT NULL THEN 'Trial'
    WHEN us.is_free_access = true AND us.current_period_end IS NULL THEN 'Free Premium (Permanent)'
    WHEN us.is_free_access = true AND us.current_period_end IS NOT NULL THEN 'Free Premium (Time-Limited)'
    WHEN us.stripe_customer_id IS NOT NULL THEN 'Lifetime Member'
    ELSE 'Unknown'
  END as user_type,
  COUNT(*) as count
FROM user_subscriptions us
GROUP BY user_type
ORDER BY count DESC;
```

### Find Users Expiring Soon
```sql
SELECT
  u.email,
  us.current_period_end,
  EXTRACT(DAY FROM us.current_period_end - NOW()) as days_remaining
FROM user_subscriptions us
JOIN auth.users u ON u.id = us.user_id
WHERE us.current_period_end IS NOT NULL
  AND us.current_period_end > NOW()
  AND us.current_period_end < NOW() + INTERVAL '30 days'
ORDER BY us.current_period_end ASC;
```

## Notes to Self

### User Type Colors (Remember!)
- 🟠 Orange = Trial
- 🟢 Green = Free Premium (Permanent)
- 🟣 Purple = Free Premium (Expires)
- 🟡 Gold = Lifetime Member (Paid $500)

### Common Mistakes to Avoid
- ❌ Never use direct SQL on `storage.objects` table
- ❌ Never push to production without asking
- ❌ Never commit secrets to Git
- ✅ Always test on staging first
- ✅ Always run security checks before pushing

### Quick Fixes
- Build fails with EBADPLATFORM? Check for platform-specific deps
- User not showing as admin? Check `user_roles` table
- Subscription badge wrong? Check `use-users-data.ts` column mapping

## Session-Specific Notes
<!-- Add temporary notes here during work sessions, clean up when done -->

