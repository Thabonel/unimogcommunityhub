# WIS Database Migration Scripts

This directory contains the SQL scripts for migrating to the new hierarchical WIS database structure.

## Migration Order

Run these scripts in order through the Supabase dashboard or CLI:

### 1. Schema Creation
```sql
-- File: 01_create_hierarchical_wis_schema.sql
-- Creates the new hierarchical database tables and relationships
-- Drops existing WIS tables and recreates with proper structure
```

### 2. Sample Data
```sql
-- File: 02_insert_sample_wis_data.sql
-- Inserts sample hierarchical data for U435 model
-- Creates proper Mercedes-style procedure structure
```

### 3. Database Functions
```sql
-- File: 03_create_wis_functions.sql
-- Creates database functions for tree navigation and search
-- Required for the new WIS interface to work properly
```

## What This Migration Does

### Before (Current Flat Structure)
- Single `wis_procedures` table with 850 duplicated records
- No hierarchical organization
- Template/placeholder data instead of real procedures
- Poor performance due to loading all data at once

### After (New Hierarchical Structure)
- **Models** → **Systems** → **Components** → **Procedures** → **Steps**
- Proper Mercedes numbering system (25.20.02)
- Cross-referenced parts, tools, and service bulletins
- Optimized for tree navigation and search

## New Database Structure

```
wis_models (U435, U400, etc.)
├── wis_systems (01-Engine, 25-Axles, etc.)
│   ├── wis_components (10-Assembly, 20-Portal Hubs, etc.)
│   │   └── wis_procedures (25.20.02-Replace Seals, etc.)
│   │       ├── wis_procedure_steps (Step 1, 2, 3...)
│   │       ├── wis_procedure_parts (Required parts)
│   │       ├── wis_procedure_tools (Required tools)
│   │       └── wis_procedure_relationships (Cross-references)
├── wis_service_bulletins (Technical bulletins)
└── wis_user_bookmarks (User saved procedures)
```

## Sample Data Included

The migration creates sample data for **U435 Unimog** including:
- Complete system hierarchy (Engine, Axles, Brakes, etc.)
- Portal Hub procedures with real step-by-step instructions
- Parts list with Mercedes part numbers
- Tools requirements with special tool numbers
- Service bulletins with relationships
- Cross-referenced related procedures

## Key Features Enabled

1. **Hierarchical Navigation**: Browse by Model → System → Component → Procedure
2. **Advanced Search**: Full-text search across procedures, parts, and bulletins
3. **Cross-References**: Automatic related procedure suggestions
4. **Professional Data**: Real Mercedes-style procedures with proper numbering
5. **Rich Metadata**: Safety warnings, torque specs, verification points
6. **User Features**: Bookmarks, ratings, personal notes

## Running the Migration

### Option 1: Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and run each file in order (01, 02, 03)

### Option 2: Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db reset
# Then run migrations normally
```

### Option 3: Manual Execution
```bash
# Using psql directly (if you have connection string)
psql "your-connection-string" < 01_create_hierarchical_wis_schema.sql
psql "your-connection-string" < 02_insert_sample_wis_data.sql
psql "your-connection-string" < 03_create_wis_functions.sql
```

## Verification

After running all migrations, verify the structure:

```sql
-- Check model hierarchy
SELECT
    m.model_code,
    COUNT(DISTINCT s.id) as systems,
    COUNT(DISTINCT c.id) as components,
    COUNT(DISTINCT p.id) as procedures
FROM wis_models m
LEFT JOIN wis_systems s ON m.id = s.model_id
LEFT JOIN wis_components c ON s.id = c.system_id
LEFT JOIN wis_procedures p ON c.id = p.component_id
GROUP BY m.id, m.model_code;

-- Test tree navigation function
SELECT * FROM get_wis_tree((SELECT id FROM wis_models WHERE model_code = 'U435'));

-- Test search function
SELECT * FROM wis_comprehensive_search('portal hub seal', 'procedures');
```

Expected results:
- U435 model with 16 systems, 9+ components, 7+ procedures
- Tree function returns hierarchical structure
- Search returns relevant procedures with rankings

## Next Steps

After running these migrations:
1. Update the WIS React components to use new API endpoints
2. Test the tree navigation in the frontend
3. Verify search functionality works properly
4. Add more real procedure data as available

## Rollback Plan

If needed, you can rollback by:
1. Restoring from a Supabase backup taken before migration
2. Or dropping the new tables and recreating the old structure

**Important**: Always backup your database before running these migrations!