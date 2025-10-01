# User Types & Subscription Management

## User Type Classification (3 Tiers)

### 1. 🟠 Trial Users
- **Display**: Orange badge "Trial" or "Trial (ends MMM d)"
- **Database**: `subscription_type: "free"` with optional `trial_ends_at`
- **Access**: Limited features, 30 days to upgrade
- **Example**: New signups who haven't paid or received free access

### 2. 🟢 Free Premium (Admin-Granted)
Two subtypes based on `current_period_end`:

#### 2a. Permanent Free Premium
- **Display**: Green badge "Free Premium (Permanent)"
- **Database**:
  - `subscription_type: "premium"`
  - `is_free_access: true`
  - `current_period_end: null`
- **Access**: Full premium features, no expiration
- **Examples**:
  - thabonel0@gmail.com (admin)
  - davidwswitt@gmail.com
  - tidesendmanrina@yahoo.com

#### 2b. Time-Limited Free Premium
- **Display**: Purple badge "Free Premium (expires MMM d, yyyy)"
- **Database**:
  - `subscription_type: "premium"`
  - `is_free_access: true`
  - `current_period_end: [date]`
- **Access**: Full premium features until expiration
- **Examples**: 7 early signups with 1-year access (expires Oct 1, 2026)

### 3. 🟡 Lifetime Member (Paid)
- **Display**: Gold badge "Lifetime Member"
- **Database**:
  - `subscription_type: "premium"`
  - `stripe_customer_id: [exists]`
  - `is_free_access: false`
- **Access**: Full premium features, paid $500
- **Current Count**: 0 (will show when first customer pays)

## Admin Operations

### Grant Free Access (Bulk)
1. Go to Admin → Users
2. Select users (checkbox)
3. Click "Grant Free Access" dropdown
4. Choose:
   - "1 Year Free Access" → Sets `current_period_end` to +1 year
   - "Permanent Free Access" → Sets `current_period_end` to null
5. Enter reason (shows in tooltips)

### Check User Subscription Status
```sql
SELECT
  u.email,
  us.subscription_type,
  us.is_free_access,
  us.free_access_reason,
  us.current_period_end,
  us.stripe_customer_id
FROM auth.users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id
WHERE u.email = 'user@example.com';
```

### User Subscription Fields Reference
- `subscription_type`: "free" or "premium"
- `subscription_status`: "active", "inactive", "canceled"
- `is_free_access`: true if admin-granted, false if paid/trial
- `free_access_reason`: Text explaining why access was granted
- `stripe_customer_id`: Exists if user paid via Stripe
- `trial_ends_at`: Date when trial expires (30-day trials)
- `current_period_end`: Expiration date (null = permanent)

## Display Logic (UserTableRow.tsx)

```typescript
// Priority order for determining badge:
1. Trial with trial_ends_at → "Trial (ends [date])"
2. Premium + is_free_access + no expires_at → "Free Premium (Permanent)"
3. Premium + is_free_access + has expires_at → "Free Premium (expires [date])"
4. Premium + stripe_customer_id + not is_free_access → "Lifetime Member"
5. Fallback → "Trial"
```

## Current User Breakdown
- **Trial**: 1 user (thabo.nel@sbs.com.au)
- **Free Premium (Permanent)**: 6 users
- **Free Premium (1 Year)**: 7 users (expires Oct 1, 2026)
- **Lifetime Members**: 0 users
