# Database Schema Quick Reference

## Core Tables

### user_subscriptions
**Purpose**: Track user subscription levels and access
```sql
Columns:
- id: uuid (PK)
- user_id: uuid (FK to auth.users)
- subscription_type: text ('free' | 'premium')
- subscription_status: text ('active' | 'inactive' | 'canceled')
- is_free_access: boolean (admin granted)
- free_access_reason: text (why access was granted)
- stripe_customer_id: text (if paid via Stripe)
- stripe_subscription_id: text
- trial_ends_at: timestamptz (30-day trial end date)
- current_period_end: timestamptz (expiration date, null = permanent)
- cancel_at_period_end: boolean
- created_at: timestamptz
- updated_at: timestamptz
```

### profiles
**Purpose**: User profile information
```sql
Columns:
- id: uuid (PK, FK to auth.users)
- email: text
- full_name: text
- avatar_url: text
- bio: text
- location: text
- website: text
- created_at: timestamptz
- updated_at: timestamptz
```

### user_roles
**Purpose**: Admin and role management
```sql
Columns:
- id: uuid (PK)
- user_id: uuid (FK to auth.users, UNIQUE)
- role: text ('admin' | 'moderator' | 'user')
- created_at: timestamptz
```

### manual_chunks
**Purpose**: Processed Unimog manual content for Barry AI
```sql
Columns:
- id: uuid (PK)
- name: text (manual filename)
- chunk_number: integer
- content: text (chunk content)
- embedding: vector(1536) (for semantic search)
- metadata: jsonb
- created_at: timestamptz
```

### gpx_tracks
**Purpose**: User-uploaded GPS tracks for trip planning
```sql
Columns:
- id: uuid (PK)
- user_id: uuid (FK to auth.users)
- name: text
- description: text
- file_path: text (storage bucket path)
- total_distance: numeric
- total_elevation_gain: numeric
- total_elevation_loss: numeric
- created_at: timestamptz
- updated_at: timestamptz
```

### marketplace_listings
**Purpose**: Parts and vehicles for sale
```sql
Columns:
- id: uuid (PK)
- user_id: uuid (FK to auth.users)
- title: text
- description: text
- price: numeric
- category: text ('parts' | 'vehicles' | 'services')
- condition: text ('new' | 'used' | 'refurbished')
- location: text
- images: text[] (array of storage URLs)
- status: text ('active' | 'sold' | 'inactive')
- created_at: timestamptz
- updated_at: timestamptz
```

### feedback_submissions
**Purpose**: User feedback and support tickets
```sql
Columns:
- id: uuid (PK)
- user_id: uuid (nullable)
- email: text
- category: text
- message: text
- priority: text ('low' | 'medium' | 'high')
- status: text ('open' | 'in_progress' | 'resolved' | 'closed')
- admin_response: text
- responded_at: timestamptz
- created_at: timestamptz
```

## Database Functions

### check_admin_access()
Returns true if current user is admin
```sql
CREATE OR REPLACE FUNCTION check_admin_access()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### is_admin()
Check if specific user ID is admin
```sql
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_uuid
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql;
```

## RLS Policies

### Standard Pattern
Most tables follow this RLS pattern:
```sql
-- Users can read their own data
CREATE POLICY "Users can read own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can do anything
CREATE POLICY "Admins have full access" ON table_name
  FOR ALL USING (check_admin_access());
```

## Storage Buckets

### manuals
- **Purpose**: Unimog PDF manuals
- **Public**: Yes (RLS via public bucket)
- **Path Structure**: `{manual-name}.pdf`
- **Size Limit**: 50MB per file
- **Allowed Types**: application/pdf

### avatars
- **Purpose**: User profile pictures
- **Public**: Yes
- **Path Structure**: `{user-id}/{filename}`
- **Size Limit**: 2MB per file
- **Allowed Types**: image/jpeg, image/png, image/webp

### vehicles
- **Purpose**: User vehicle photos
- **Public**: Yes
- **Path Structure**: `{user-id}/{vehicle-id}/{filename}`
- **Size Limit**: 5MB per file
- **Allowed Types**: image/jpeg, image/png, image/webp

## Critical Migration Notes

### NEVER Use Direct SQL on Storage Tables
❌ **WRONG**:
```sql
UPDATE storage.objects
SET name = 'new-name.pdf'
WHERE name = 'old-name.pdf';
```

✅ **CORRECT**:
```typescript
const { data, error } = await supabase.storage
  .from('bucket-name')
  .move('old-name.pdf', 'new-name.pdf');
```

**Reason**: Direct SQL corrupts Supabase's internal serialization, causing null IDs and API failures.

## Common Queries

### Get All Users with Subscriptions
```sql
SELECT
  u.id,
  u.email,
  u.created_at as signup_date,
  us.subscription_type,
  us.is_free_access,
  us.current_period_end,
  CASE
    WHEN ur.role = 'admin' THEN true
    ELSE false
  END as is_admin
FROM auth.users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;
```

### Count Users by Type
```sql
SELECT
  subscription_type,
  is_free_access,
  CASE
    WHEN current_period_end IS NULL THEN 'permanent'
    ELSE 'time_limited'
  END as duration_type,
  COUNT(*) as user_count
FROM user_subscriptions
GROUP BY subscription_type, is_free_access, duration_type
ORDER BY user_count DESC;
```

### Find Expiring Free Access
```sql
SELECT
  u.email,
  us.current_period_end,
  EXTRACT(DAY FROM us.current_period_end - NOW()) as days_remaining
FROM user_subscriptions us
JOIN auth.users u ON u.id = us.user_id
WHERE us.is_free_access = true
  AND us.current_period_end IS NOT NULL
  AND us.current_period_end > NOW()
ORDER BY us.current_period_end ASC;
```
