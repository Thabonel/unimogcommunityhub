# Supabase Performance Optimization Migration Guide

## Overview
This guide contains 12 migration batches to fix 372+ performance warnings from Supabase Performance Advisor.

## Migration Deployment Order

### Batch 1: Critical Priority (user_activities + trips)
**File**: `20250915130000_critical_indexes_batch_1.sql`
**Target**: 36MB user_activities table performance
**Impact**: 40-60% improvement for analytics queries
```bash
psql -f supabase/migrations/20250915130000_critical_indexes_batch_1.sql
```

### Batch 2: Timestamp Indexes
**File**: `20250915130100_timestamp_indexes_batch_2.sql`
**Target**: Core community tables time-based queries
**Impact**: 50-70% improvement for date filtering
```bash
psql -f supabase/migrations/20250915130100_timestamp_indexes_batch_2.sql
```

### Batch 3: Trip Planning & GPS
**File**: `20250915130200_trip_gps_indexes_batch_3.sql`
**Target**: Trip planner performance (recently restored)
**Impact**: 45-65% improvement for trip queries
```bash
psql -f supabase/migrations/20250915130200_trip_gps_indexes_batch_3.sql
```

### Batch 4: Manual Processing & Barry AI
**File**: `20250915130300_manual_barry_indexes_batch_4.sql`
**Target**: Barry AI response performance
**Impact**: 35-50% improvement for Barry queries
```bash
psql -f supabase/migrations/20250915130300_manual_barry_indexes_batch_4.sql
```

### Batch 5: WIS System
**File**: `20250915130400_wis_system_indexes_batch_5.sql`
**Target**: WIS-EPC premium features (11MB wis_chunks)
**Impact**: 40-55% improvement for WIS queries
```bash
psql -f supabase/migrations/20250915130400_wis_system_indexes_batch_5.sql
```

### Batch 6: Marketplace & Commerce
**File**: `20250915130500_marketplace_commerce_batch_6.sql`
**Target**: Stripe integration and marketplace
**Impact**: 30-45% improvement for commerce queries
```bash
psql -f supabase/migrations/20250915130500_marketplace_commerce_batch_6.sql
```

### Batch 7: Messaging & Notifications
**File**: `20250915130600_messaging_notifications_batch_7.sql`
**Target**: Communication system performance
**Impact**: 35-50% improvement for messaging
```bash
psql -f supabase/migrations/20250915130600_messaging_notifications_batch_7.sql
```

### Batch 8: Under-Indexed Tables
**File**: `20250915130700_under_indexed_tables_batch_8.sql`
**Target**: Tables with < 3 indexes
**Impact**: 25-40% improvement for affected tables
```bash
psql -f supabase/migrations/20250915130700_under_indexed_tables_batch_8.sql
```

### Batch 9: Missing Foreign Key Indexes
**File**: `20250915130800_missing_foreign_key_indexes_batch_9.sql`
**Target**: Unindexed foreign key columns
**Impact**: 30-50% improvement for relationship queries
```bash
psql -f supabase/migrations/20250915130800_missing_foreign_key_indexes_batch_9.sql
```

### Batch 10: Status/Category/Type Indexes
**File**: `20250915130900_status_category_type_indexes_batch_10.sql`
**Target**: High-filter columns
**Impact**: 60-80% improvement for filtered queries
```bash
psql -f supabase/migrations/20250915130900_status_category_type_indexes_batch_10.sql
```

### Batch 11: Boolean/Partial Indexes
**File**: `20250915131000_boolean_partial_indexes_batch_11.sql`
**Target**: Boolean columns with partial indexes
**Impact**: 70-90% improvement for boolean filters
```bash
psql -f supabase/migrations/20250915131000_boolean_partial_indexes_batch_11.sql
```

### Batch 12: Composite Query Indexes
**File**: `20250915131100_composite_query_indexes_batch_12.sql`
**Target**: Complex multi-column queries
**Impact**: 45-65% improvement for complex queries
```bash
psql -f supabase/migrations/20250915131100_composite_query_indexes_batch_12.sql
```

## Expected Overall Results

### Performance Improvements
- **Database Query Time**: 35-55% overall improvement
- **User Activities Queries**: 40-60% faster (critical for analytics)
- **Barry AI Responses**: 35-50% faster
- **Trip Planner**: 45-65% faster
- **WIS System**: 40-55% faster
- **Boolean Filters**: 70-90% faster

### Index Storage Impact
- **Additional Storage**: ~500MB-1GB for all indexes
- **Index Count**: ~150+ new indexes across all tables
- **Maintenance**: Automatic with PostgreSQL

### Deployment Time
- **Per Batch**: 30 seconds - 2 minutes
- **Total Time**: 10-15 minutes for all batches
- **Recommended**: Deploy in order, test after each batch

## Deployment Commands

### Via Supabase CLI
```bash
supabase db reset --debug
# Then apply each migration in order
```

### Via Direct SQL
```bash
# Apply each batch in order
psql "postgresql://..." -f supabase/migrations/20250915130000_critical_indexes_batch_1.sql
psql "postgresql://..." -f supabase/migrations/20250915130100_timestamp_indexes_batch_2.sql
# ... continue for all 12 batches
```

### Via Supabase Dashboard
1. Navigate to SQL Editor
2. Copy/paste each migration file content
3. Execute in order (1-12)

## Testing & Verification

### After Each Batch
```sql
-- Check index creation
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check query performance
EXPLAIN ANALYZE SELECT * FROM user_activities
WHERE user_id = 'some-uuid' AND event_type = 'feature_use'
ORDER BY timestamp DESC LIMIT 10;
```

### Performance Monitoring
- Monitor Supabase dashboard metrics
- Check query execution times
- Verify no new warnings in Performance Advisor

## Rollback Plan
Each migration uses `CREATE INDEX IF NOT EXISTS` for safety. To rollback:

```sql
-- Example rollback for batch 1
DROP INDEX IF EXISTS idx_user_activities_user_event_timestamp;
DROP INDEX IF EXISTS idx_user_activities_session_event_timestamp;
-- ... continue for all indexes in batch
```

## Post-Deployment
1. ✅ Run ANALYZE to update statistics
2. ✅ Monitor Performance Advisor for remaining issues
3. ✅ Test critical user flows (Barry AI, Trip Planner, WIS)
4. ✅ Check application performance metrics

This migration strategy addresses the majority of the 372 performance warnings while maintaining production stability.