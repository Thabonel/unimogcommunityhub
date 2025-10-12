# Create WIS Storage Buckets - Manual Setup Guide

**Why Manual**: Supabase storage buckets require special permissions and must be created via Dashboard UI or Management API, not SQL migrations.

---

## Step-by-Step: Create Buckets via Supabase Dashboard

### 1. Navigate to Storage

1. Go to https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor
2. Click **Storage** in left sidebar
3. Click **New bucket** button

---

### 2. Create `wis-docs` Bucket

**Settings**:
- **Name**: `wis-docs`
- **Public bucket**: ✅ **Enabled** (checked)
- **File size limit**: `52428800` (50MB)
- **Allowed MIME types**:
  - `text/html`
  - `application/pdf`

**RLS Policies** (after bucket created):

Navigate to: Storage → wis-docs bucket → Policies tab

**Policy 1: Public Read**
- Name: `Public read access`
- Allowed operation: `SELECT`
- Policy definition: `true` (everyone can read)

**Policy 2: Authenticated Write**
- Name: `Authenticated users can upload`
- Allowed operation: `INSERT`
- Policy definition:
  ```sql
  (auth.role() = 'authenticated'::text)
  ```

**Policy 3: Service Role All Access**
- Name: `Service role full access`
- Allowed operation: `ALL`
- Policy definition:
  ```sql
  (auth.role() = 'service_role'::text)
  ```

---

### 3. Create `wis-archives` Bucket

**Settings**:
- **Name**: `wis-archives`
- **Public bucket**: ❌ **Disabled** (unchecked)
- **File size limit**: `52428800` (50MB)
- **Allowed MIME types**:
  - `application/json`
  - `application/zip`
  - `application/x-tar`

**RLS Policies**:

**Policy 1: Service Role Access**
- Name: `Service role full access`
- Allowed operation: `ALL`
- Policy definition:
  ```sql
  (auth.role() = 'service_role'::text)
  ```

**Policy 2: Premium Users Read**
- Name: `Premium users can read`
- Allowed operation: `SELECT`
- Policy definition:
  ```sql
  EXISTS (
    SELECT 1
    FROM public.user_subscriptions
    WHERE user_id = auth.uid()
      AND subscription_type = 'premium'
      AND subscription_status = 'active'
  )
  ```

---

### 4. Create `wis-media` Bucket

**Settings**:
- **Name**: `wis-media`
- **Public bucket**: ✅ **Enabled** (checked)
- **File size limit**: `10485760` (10MB)
- **Allowed MIME types**:
  - `image/png`
  - `image/jpeg`
  - `image/jpg`
  - `image/gif`
  - `image/webp`
  - `video/mp4`

**RLS Policies**:

**Policy 1: Public Read**
- Name: `Public read access`
- Allowed operation: `SELECT`
- Policy definition: `true`

**Policy 2: Authenticated Write**
- Name: `Authenticated users can upload`
- Allowed operation: `INSERT`
- Policy definition:
  ```sql
  (auth.role() = 'authenticated'::text)
  ```

**Policy 3: Service Role All Access**
- Name: `Service role full access`
- Allowed operation: `ALL`
- Policy definition:
  ```sql
  (auth.role() = 'service_role'::text)
  ```

---

## Verification

After creating all 3 buckets, verify via SQL:

```sql
SELECT
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name IN ('wis-docs', 'wis-archives', 'wis-media')
ORDER BY name;
```

**Expected Result**:
```
name          | public | file_size_limit | allowed_mime_types
wis-docs      | true   | 52428800        | {text/html, application/pdf}
wis-archives  | false  | 52428800        | {application/json, application/zip, application/x-tar}
wis-media     | true   | 10485760        | {image/png, image/jpeg, ...}
```

---

## Quick Reference

| Bucket | Public | Size Limit | Purpose |
|--------|--------|------------|---------|
| wis-docs | ✅ Yes | 50MB | Procedure/bulletin HTML & PDF files |
| wis-archives | ❌ No | 50MB | Parts JSON, private archives (premium only) |
| wis-media | ✅ Yes | 10MB | Images, diagrams, videos |

---

## Troubleshooting

### Can't Create Policies

If you can't create policies via Dashboard:
1. Go to **Storage** → **Policies**
2. Click **New Policy**
3. Select bucket from dropdown
4. Choose operation type
5. Enter policy definition SQL

### Policy Syntax Errors

Use the SQL Editor's policy helper:
```sql
-- Test policy logic separately first
SELECT EXISTS (
  SELECT 1
  FROM public.user_subscriptions
  WHERE user_id = auth.uid()
);
```

### ETL Worker Can't Upload

Ensure you're using **Service Role Key** (not Anon Key):
```bash
# Service role bypasses RLS
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... npx tsx scripts/run-wis-etl.ts
```

---

## Cleanup (If Needed)

To delete a bucket:
1. Go to Storage → Select bucket
2. Click **Settings** (gear icon)
3. Scroll to bottom → **Delete bucket**
4. Confirm deletion

**Warning**: Deleting a bucket deletes ALL files inside!
