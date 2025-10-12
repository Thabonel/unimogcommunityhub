# Create WIS Storage Buckets - Setup Guide

**Why Not SQL Migration**: Supabase storage buckets require special permissions and cannot be created via SQL migrations. Must use Management API or Dashboard UI.

---

## Option 1: Automated Script (Recommended)

Use the automated creation script via Supabase Management API:

### Step 1: Get Supabase Access Token
1. Go to https://supabase.com/dashboard/account/tokens
2. Click **Generate New Token**
3. Give it a name (e.g., "WIS Bucket Creation")
4. Copy the token

### Step 2: Run the Script
```bash
SUPABASE_ACCESS_TOKEN=<your-token> npx tsx scripts/create-wis-storage-buckets.ts
```

**The script will**:
- Create all 3 buckets with correct settings
- Skip if buckets already exist (idempotent)
- Verify creation and display results
- Handle errors gracefully

### Step 3: Configure RLS Policies
The script creates buckets but **RLS policies must still be configured manually** (see section below).

---

## Option 2: Manual Dashboard UI Setup

If you prefer manual setup or the script fails, follow these steps:

---

## Manual Setup: Create Buckets via Dashboard

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

---

## Configure RLS Policies (Required for All Buckets)

**Important**: RLS policies must be configured manually via Dashboard, regardless of whether you created buckets via script or manually.

### wis-docs Bucket Policies

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

---

### wis-archives Bucket Policies

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

---

### wis-media Bucket Policies

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
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY> npx tsx scripts/run-wis-etl.ts
```

---

## Cleanup (If Needed)

To delete a bucket:
1. Go to Storage → Select bucket
2. Click **Settings** (gear icon)
3. Scroll to bottom → **Delete bucket**
4. Confirm deletion

**Warning**: Deleting a bucket deletes ALL files inside!
