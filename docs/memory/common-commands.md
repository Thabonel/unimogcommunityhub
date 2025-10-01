# Common Commands & Operations

## Development Workflow

### Starting Development
```bash
npm run dev          # Start local development server
npm run build        # Test build locally
npm run lint         # Run ESLint checks
```

### Git & Deployment

#### Automatic Staging Deployment
```bash
git add -A
git commit -m "feat: description"
# Automatically pushes to staging after commit
git push staging main:main
```

#### Production Deployment (REQUIRES PERMISSION)
```bash
# NEVER run without explicit user permission
git push origin main
```

### Security Checks
```bash
# Check for hardcoded secrets
node scripts/check-secrets.js
node scripts/check-env.js

# Manual secret scan
grep -r "ydevatqwkoccxhtejdor.supabase.co" src/ scripts/
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/ scripts/
```

## Database Operations

### Supabase MCP Queries

#### Check User Subscriptions
```sql
SELECT u.email, us.subscription_type, us.is_free_access, us.current_period_end
FROM auth.users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id
ORDER BY u.created_at DESC
LIMIT 20;
```

#### Check Table Schema
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'table_name'
ORDER BY ordinal_position;
```

#### List All Tables
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Make User Admin
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Admin Panel Operations

### Grant Free Access
1. Navigate to: `/admin` → Users tab
2. Select user(s) with checkbox
3. Click "Grant Free Access" dropdown
4. Choose: "1 Year Free Access" or "Permanent Free Access"
5. Enter reason (appears in user tooltip)
6. Confirm

### View User Details
- Click external link icon next to email
- Opens in new tab: `/admin/users/[user-id]`

### Ban/Unban Users
- Ban: Click ban icon → Select duration → Enter reason
- Unban: Click green checkmark icon on banned user

## Manual Processing (Barry AI)

### Process New Unimog Manual
1. Navigate to: `/admin` → Manuals tab
2. Click "Upload Manual"
3. Select PDF file
4. System automatically:
   - Uploads to `manuals` storage bucket
   - Processes with Unstructured API
   - Creates chunks in `manual_chunks` table
   - Generates embeddings for AI search

### Check Manual Processing Status
```sql
SELECT name, COUNT(*) as chunk_count
FROM manual_chunks
GROUP BY name
ORDER BY name;
```

## Common Troubleshooting

### Build Fails on Staging
1. Check for platform-specific dependencies:
   ```bash
   grep -E "@rollup/rollup-(darwin|linux|win32)" package.json
   ```
2. If found, remove them - let build tools auto-detect

### Admin Panel Not Loading
1. Check user has admin role in database
2. Verify `is_admin` function exists:
   ```sql
   SELECT check_admin_access();
   ```

### Subscription Not Showing Correctly
1. Verify data in `user_subscriptions` table
2. Check column mapping in `use-users-data.ts`
3. Ensure `getUserSubscription()` returns all fields

## Environment Variables (Netlify Only)

**DO NOT** set locally - all development happens on Netlify staging:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_MAPBOX_ACCESS_TOKEN`
- `VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID`
- `VITE_STRIPE_LIFETIME_PRICE_ID`

If build fails locally due to missing env vars → **This is normal**, staging has them.
