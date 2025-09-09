# Deploy Address Fields Migration

## Issue
The address and currency fields in the user profile are not saving because the database columns don't exist.

## Solution
A migration has been created to add the missing columns:
- `street_address`
- `city`
- `state`
- `postal_code`
- `phone_number`
- `currency`

## To Deploy the Migration

### Option 1: Using Supabase CLI (Recommended)
```bash
# Run this command and enter your database password when prompted
npx supabase db push
```

### Option 2: Using Supabase Dashboard
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250125_add_address_fields_to_profiles.sql`
4. Click "Run" to execute the migration

### Option 3: Direct SQL
If you have direct database access, you can run the migration directly:
```sql
-- Contents of supabase/migrations/20250125_add_address_fields_to_profiles.sql
```

## Verification
After running the migration, verify the columns were added:
1. Go to Table Editor in Supabase Dashboard
2. Select the `profiles` table
3. Check that the new columns are present
4. Test saving address information in the application

## Note
The application code is already set up to use these fields. Once the migration is deployed, the address and currency saving functionality will work immediately.