# WIS Pilot SQL Fix - Analysis & Correction

**Date**: October 12, 2025
**Issue**: Original SQL used non-unique columns for upserts

---

## 🔴 Problem Found

### Original SQL Issue
```sql
-- WRONG: procedure_code does NOT have a UNIQUE constraint
UPDATE public.wis_procedures
SET title = '...'
WHERE procedure_code = '25.20.02'  -- ❌ Could match multiple rows!
```

### Database Schema Reality
```sql
-- wis_procedures UNIQUE constraints:
1. id (primary key)
2. source_fingerprint (UNIQUE) ✅
3. (component_id, procedure_code) WHERE component_id IS NOT NULL (UNIQUE)

-- procedure_code alone is NOT UNIQUE! ❌
```

**Impact**:
- UPDATE could modify multiple rows unexpectedly
- INSERT check wouldn't prevent duplicates properly
- Could create duplicate procedures with same code

---

## ✅ Solution Applied

### Fixed SQL Uses Correct UNIQUE Constraints

| Table | Column Used | Has UNIQUE? | Status |
|-------|-------------|-------------|--------|
| wis_procedures | `source_fingerprint` | ✅ YES | Fixed |
| wis_service_bulletins | `bulletin_number` | ✅ YES | Already correct |
| wis_parts | `mercedes_part_number` | ✅ YES | Already correct |

### Key Changes

**Before (WRONG)**:
```sql
WHERE procedure_code = '25.20.02'  -- Not unique!
```

**After (CORRECT)**:
```sql
WHERE source_fingerprint = 'pilot-25.20.02'  -- Has UNIQUE constraint ✅
```

---

## 📋 Fixed SQL File

**Location**: `/supabase/migrations/wis_pilot_inserts_FIXED.sql`

### What It Does

1. **Procedure 25.20.02**:
   - Uses `source_fingerprint = 'pilot-25.20.02'` for matching
   - Sets proper metadata (title, description, overview, status)
   - Includes `source_path` for tracking
   - Updates `updated_at` timestamp on updates

2. **Bulletin TSB-2020-001**:
   - Already using correct UNIQUE column (`bulletin_number`)
   - Enhanced with category and severity fields
   - More detailed content description

3. **Part A4353501268**:
   - Already using correct UNIQUE column (`mercedes_part_number`)
   - Includes status field

### Verification Queries Included

```sql
-- Check procedure
SELECT procedure_code, title, source_fingerprint, status
FROM public.wis_procedures
WHERE source_fingerprint = 'pilot-25.20.02';

-- Check bulletin
SELECT bulletin_number, title, severity, status
FROM public.wis_service_bulletins
WHERE bulletin_number = 'TSB-2020-001';

-- Check part
SELECT mercedes_part_number, description, category, status
FROM public.wis_parts
WHERE mercedes_part_number = 'A4353501268';

-- Count all pilot data
SELECT
  (SELECT count(*) FROM wis_procedures WHERE source_fingerprint LIKE 'pilot-%') as procedures,
  (SELECT count(*) FROM wis_service_bulletins WHERE bulletin_number LIKE 'TSB-%') as bulletins,
  (SELECT count(*) FROM wis_parts WHERE mercedes_part_number = 'A4353501268') as parts;
```

---

## 🎯 Design Pattern for WIS ETL

### Always Use UNIQUE Constraints for Upserts

```sql
-- ✅ CORRECT: Use source_fingerprint (has UNIQUE constraint)
WHERE source_fingerprint = 'hash-or-identifier'

-- ❌ WRONG: Use procedure_code (no UNIQUE constraint)
WHERE procedure_code = '25.20.02'

-- ✅ CORRECT: Use composite key with both parts
WHERE component_id = 'uuid' AND procedure_code = '25.20.02'

-- ✅ CORRECT: Match on null component_id + procedure_code
WHERE component_id IS NULL AND procedure_code = '25.20.02'
```

### ETL Worker Pattern

The ETL worker should:
1. Generate SHA-256 hash of source file
2. Use hash as `source_fingerprint`
3. Upsert using `source_fingerprint` (guaranteed unique)
4. Store `procedure_code` as metadata (can have duplicates)

**Example**:
```typescript
const fingerprint = crypto.createHash('sha256')
  .update(fileContent)
  .digest('hex');

await supabase
  .from('wis_procedures')
  .upsert({
    source_fingerprint: fingerprint,  // UNIQUE key
    procedure_code: '25.20.02',       // Metadata (can duplicate)
    title: 'Engine Oil Change',
    // ... other fields
  }, {
    onConflict: 'source_fingerprint'  // Use the UNIQUE constraint
  });
```

---

## 🔍 Why This Matters

### Without Unique Constraints

```sql
-- Scenario: Two procedures with same code but different components
INSERT INTO wis_procedures (procedure_code, component_id, title)
VALUES
  ('25.20.02', 'component-A', 'Oil Change for U400'),
  ('25.20.02', 'component-B', 'Oil Change for U500');

-- Original SQL would UPDATE BOTH rows!
UPDATE wis_procedures
SET title = 'Unimog 400 - Engine Oil Change'
WHERE procedure_code = '25.20.02';
-- Result: Both rows get same title (WRONG!)
```

### With Unique Constraints

```sql
-- Using source_fingerprint ensures we update/insert exactly ONE row
UPDATE wis_procedures
SET title = 'Unimog 400 - Engine Oil Change'
WHERE source_fingerprint = 'pilot-25.20.02';
-- Result: Only the specific procedure is updated ✅
```

---

## 📊 Database Constraints Reference

### wis_procedures

```sql
-- Primary Key
wis_procedures_pkey ON (id)

-- Unique Constraints
wis_procedures_source_fingerprint_key ON (source_fingerprint)
wis_procedures_component_procedure_unique ON (component_id, procedure_code)
  WHERE component_id IS NOT NULL

-- Indexes (non-unique)
idx_wis_procedures_component ON (component_id)
idx_wis_procedures_difficulty ON (difficulty_rating)
idx_wis_procedures_search ON (search_vector)
idx_wis_procedures_source_path ON (source_path)
```

### wis_service_bulletins

```sql
-- Primary Key
wis_service_bulletins_pkey ON (id)

-- Unique Constraints
wis_service_bulletins_bulletin_number_key ON (bulletin_number) ✅

-- Indexes (non-unique)
idx_wis_bulletins_search ON (search_vector)
```

### wis_parts

```sql
-- Primary Key
wis_parts_pkey ON (id)

-- Unique Constraints
wis_parts_mercedes_part_number_key ON (mercedes_part_number) ✅
```

---

## 🚀 How to Use

### Step 1: Run Fixed SQL
```bash
# In Supabase Dashboard > SQL Editor
# Paste contents of wis_pilot_inserts_FIXED.sql
# Click "Run"
```

### Step 2: Verify Results
```bash
# Uncomment verification queries at end of file
# Run to check all 3 records inserted correctly
```

### Step 3: Test Idempotency
```bash
# Run the same SQL again
# Should UPDATE existing rows (not create duplicates)
# Check updated_at timestamp changed on procedure
```

---

## ✅ Testing Checklist

- [ ] Run fixed SQL in Supabase Studio
- [ ] Verify procedure inserted with correct source_fingerprint
- [ ] Verify bulletin inserted with correct bulletin_number
- [ ] Verify part inserted with correct part number
- [ ] Run SQL again (should UPDATE, not duplicate)
- [ ] Check updated_at changed on procedure
- [ ] Count records (should be 1 of each)

---

## 📚 Related Documents

- **ETL Status**: `/docs/wis-project/WIS_ETL_IMPLEMENTATION_STATUS.md`
- **ETL Fixes**: `/docs/wis-project/ETL_WORKER_FIXES_NEEDED.md`
- **Database Schema**: `/docs/memory/database-schema.md`

---

**Document Version**: 1.0
**Status**: Ready to use
**Tested**: ⏳ Pending user verification
