# Quick WIS Import Guide

Since the database password authentication is having issues, let's use the Supabase SQL Editor directly.

## 🚀 Fastest Import Method

### Step 1: Open SQL Editor
Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new

### Step 2: Run Vehicle Models
1. Copy ALL contents from: `01-create-vehicle-models-fixed.sql`
2. Paste in SQL Editor
3. Click "Run"

### Step 3: Import Procedures (33 chunks)
For each file in `procedures-chunks/` folder:
1. Open `chunk-01-procedures.sql`
2. Copy ALL contents
3. Paste in SQL Editor
4. Click "Run"
5. Repeat for chunk-02 through chunk-33

**Tip**: You can have multiple SQL Editor tabs open to speed this up!

### Step 4: Import Parts
1. Copy ALL contents from: `03-import-parts.sql`
2. Paste in SQL Editor
3. Click "Run"

### Step 5: Import Bulletins
1. Copy ALL contents from: `04-import-bulletins.sql`
2. Paste in SQL Editor
3. Click "Run"

## ⚡ Super Fast Method (All at once)

If you want to try running multiple chunks together:

1. Open 5-6 SQL Editor tabs
2. Paste different chunks in each tab
3. Run them simultaneously
4. The database can handle parallel imports

## 📊 Verify Success

After importing, run this query:
```sql
SELECT 
  (SELECT COUNT(*) FROM wis_models) as models,
  (SELECT COUNT(*) FROM wis_procedures) as procedures,
  (SELECT COUNT(*) FROM wis_parts) as parts,
  (SELECT COUNT(*) FROM wis_bulletins) as bulletins;
```

Expected:
- models: 42
- procedures: 6,468
- parts: 197+
- bulletins: varies

## 🔧 Alternative: Check Your Password

Your password in Supabase might be different from what you entered. To verify:

1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/database
2. Click "Reset database password"
3. Set a new password you're sure of
4. Update the .env file with the new password
5. Try the import script again

The password shown in the dashboard connection strings is not your actual password - it's a placeholder `[YOUR-PASSWORD]` that you need to replace with your real password.