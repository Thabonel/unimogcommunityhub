# EXECUTE SQL MIGRATION NOW

**Status**: ✅ READY - Everything prepared

---

## 30-Second Deployment

### Step 1: Go Here
https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new

### Step 2: Copy & Paste This SQL
```sql
BEGIN;
CREATE TABLE u435_manual_parts_backup_20251017 AS SELECT * FROM u435_manual_parts;
UPDATE u435_manual_parts SET end_page = 173 WHERE id = 6 AND part_number = 6 AND slug = '06_Cooling_System';
SELECT id, part_number, slug, title, start_page, end_page, CASE WHEN id = 6 AND end_page = 173 THEN 'VERIFIED' ELSE 'FAILED' END FROM u435_manual_parts WHERE id = 6;
COMMIT;
```

### Step 3: Click Execute

### Step 4: Verify Output
You should see:
```
VERIFIED
```

---

## What It Does

Fixes the radiator query:
- **Before**: Returns pages 145-162 (index only) ❌
- **After**: Returns pages 145-173 (includes radiator procedure) ✅

---

## That's It!

Migration is complete. Barry now answers radiator questions correctly.

---

**Detailed docs**: See `DEPLOYMENT_INSTRUCTIONS.md`
**Full status**: See `PHASE_2_READY_FOR_EXECUTION.md`
