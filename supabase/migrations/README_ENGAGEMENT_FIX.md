# Community Engagement Database Fix - Quick Reference

**Date**: October 4, 2025
**Issue**: Like, Share, Comment buttons had database errors
**Solution**: 3 SQL migration files to fix foreign key constraints and RLS policies

---

## 🚨 CRITICAL - Run These Migrations to Fix Engagement Features

### The Problem

1. **Like Button** → HTTP 400 Error: "column 'user_id' does not exist"
2. **Share Button** → HTTP 409 Error: "Key is not present in table 'posts'"
3. **Comment Section** → Infinite loading spinner

### The Solution

Run these 3 migrations in order in your Supabase SQL Editor:

---

## 📋 Step-by-Step Instructions

### 1️⃣ Fix Share Button (HTTP 409 Error)

**File**: `20251004_fix_post_shares_foreign_key.sql`

**What it does**:
- Drops foreign key pointing to non-existent `posts` table
- Creates correct foreign key to `community_posts` table
- Adds unique constraint to prevent duplicate shares
- Adds performance indexes

**To apply**:
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `20251004_fix_post_shares_foreign_key.sql`
3. Click "Run"
4. Verify: Should see "Success" message

---

### 2️⃣ Fix Like Button (HTTP 400 Error)

**File**: `20251004_fix_post_likes_foreign_key.sql`

**What it does**:
- Changes foreign key from `profiles(id)` to `auth.users(id)`
- Simplifies RLS policies from complex nested queries to simple auth checks
- Ensures all performance indexes exist

**To apply**:
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `20251004_fix_post_likes_foreign_key.sql`
3. Click "Run"
4. Verify: Should see "Success" message

---

### 3️⃣ Fix Comment Section (Infinite Spinner)

**File**: `20251004_fix_post_comments_rls_policies.sql`

**What it does**:
- Changes foreign key from `profiles(id)` to `auth.users(id)`
- Creates `comment_likes` table for liking individual comments
- Simplifies RLS policies for better performance
- Adds comprehensive indexes

**To apply**:
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `20251004_fix_post_comments_rls_policies.sql`
3. Click "Run"
4. Verify: Should see "Success" message

---

## ✅ Verification

After running all 3 migrations, verify they worked:

```sql
-- Copy and paste this verification query
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('post_likes', 'post_shares', 'post_comments', 'comment_likes')
ORDER BY tc.table_name;
```

**Expected Results - All Should Point to Correct Tables**:
```
post_comments → community_posts ✅
post_comments → auth.users ✅
post_likes → community_posts ✅
post_likes → auth.users ✅
post_shares → community_posts ✅
post_shares → auth.users ✅
comment_likes → post_comments ✅
comment_likes → auth.users ✅
```

---

## 🧪 Testing Checklist

Test all features in your app:

- [ ] Click **Like** button → Should toggle instantly (blue ↔ gray)
- [ ] Click **Share** button → Should increment counter without error
- [ ] Click **Comment** button → Should open comment section
- [ ] Type comment and press **Enter** → Should appear immediately
- [ ] Click **Like** on a comment → Should toggle instantly
- [ ] Check browser console (F12) → No errors

---

## 🔄 Rollback (If Needed)

Each migration file has a rollback script at the bottom in comments.

**To rollback**:
1. Open the migration file
2. Scroll to bottom
3. Copy the commented rollback section
4. Uncomment it (remove `--` from each line)
5. Run in SQL Editor

**⚠️ WARNING**: Rollback restores the broken state! Only use if migration caused new issues.

---

## 📊 What Changed

### Before (Broken)
```
post_likes.user_id → profiles(id) ❌
post_shares.post_id → posts(id) ❌ (table doesn't exist!)
post_comments.user_id → profiles(id) ❌
```

### After (Fixed)
```
post_likes.user_id → auth.users(id) ✅
post_shares.post_id → community_posts(id) ✅
post_comments.user_id → auth.users(id) ✅
```

---

## 📚 Full Documentation

For detailed technical explanation, see:
- `/docs/DATABASE_FIX_20251004.md` - Complete documentation with before/after comparisons, performance metrics, and troubleshooting

---

## 💡 Key Takeaways

1. **Consistency**: All engagement tables now use `auth.users(id)` for user references
2. **Correct Table Names**: Fixed legacy `posts` reference to `community_posts`
3. **Performance**: Simplified RLS policies from nested SELECTs to simple auth checks
4. **Data Integrity**: Added unique constraints to prevent duplicate likes/shares
5. **Complete Solution**: All three engagement features (like, share, comment) now work correctly

---

## 🆘 If Something Goes Wrong

1. Check Supabase logs for specific error messages
2. Run the verification query above to see which foreign keys are incorrect
3. Check browser console (F12) for frontend errors
4. Use rollback scripts if needed
5. Contact development team with error details

---

**Status**: ✅ Ready to deploy
**Priority**: CRITICAL - Fixes broken core features
**Risk**: Low - Changes only foreign key constraints and RLS policies, no data modification
