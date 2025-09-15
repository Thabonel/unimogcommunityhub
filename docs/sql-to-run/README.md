# SQL Files Repository

This folder contains **353 SQL files** from across the entire Unimog Community Hub project, centralized for easy access.

## 🚀 PRIORITY FILES - Run These First

### Fix Performance Warnings (373 → ~0)
1. **`fix_rls_performance_part1.sql`** - Core RLS policies optimization
2. **`fix_rls_performance_part2.sql`** - Remaining RLS policies optimization

**Expected Result**: Eliminates 95%+ of the 373 performance warnings

### Make User Admin
- **`make-admin.sql`** - Grant admin privileges to a user

## 📁 File Categories

### Database Migrations (`supabase/migrations/`)
- **200+ migration files** from the project history
- Follow chronological naming: `YYYYMMDD_description.sql`

### Performance Optimizations
- `fix_rls_performance_part1.sql` ⭐ **START HERE**
- `fix_rls_performance_part2.sql` ⭐ **START HERE**
- `20250915000000_remove_unused_profiles_indexes.sql`
- `20250915000001_remove_unused_indexes_phase2.sql`

### WIS-EPC System
- `wis-epc-add-server*.sql` - Add WIS servers
- `wis-epc-fix-tier*.sql` - Fix WIS tiers
- `create_wis_suggestions_function.sql` - WIS search functionality

### Storage & Buckets
- `fix-storage-buckets-final.sql`
- `create-storage-buckets-direct.sql`
- `fix-profile-photos-bucket.sql`

### Community Features
- `create-community-tables.sql`
- `setup-rss-feeds.sql`

### Import Scripts
- `00-master-import-guide.sql` - WIS import instructions
- `01-create-vehicle-models.sql` - Vehicle model data
- `02-import-procedures.sql` - WIS procedures
- `03-import-parts.sql` - Parts catalog
- `04-import-bulletins.sql` - Service bulletins

## 🔧 How to Run SQL Files

### Option 1: Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project → **SQL Editor**
3. Copy file contents and paste
4. Click **Run**

### Option 2: Command Line (if available)
```bash
supabase db push  # For migration files only
```

### Option 3: Direct Database Connection
```bash
psql your_connection_string < filename.sql
```

## ⚠️ Important Notes

- **Start with priority files** marked with ⭐
- **Test on staging first** for major changes
- **Backup database** before running destructive operations
- **Many files are duplicates** from different development phases
- **Migration files** should be run in chronological order

## 🎯 Quick Wins

For immediate performance improvement, just run these 2 files:
1. `fix_rls_performance_part1.sql`
2. `fix_rls_performance_part2.sql`

This will solve your 373 performance warnings!

---
*📁 Total Files: 353 | 🚀 Last Updated: September 15, 2025*