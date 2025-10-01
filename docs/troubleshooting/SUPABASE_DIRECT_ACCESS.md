# Supabase Direct Database Access Guide

## Overview
This guide explains how to configure and use direct database access to Supabase when the web-based Supabase client has limitations due to Row Level Security (RLS) policies or permission restrictions.

## Problem Statement
When using the Supabase JavaScript client with the anonymous key (`VITE_SUPABASE_ANON_KEY`), you may encounter:
- ❌ Cannot delete records due to RLS policies
- ❌ Cannot update certain tables
- ❌ Cannot bypass row-level security
- ❌ Limited to user-level permissions

## Solution: Direct Database Access

### Method 1: Supabase SQL Editor (Recommended)
The easiest way to make administrative changes is through the Supabase Dashboard:

1. Navigate to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
2. Run SQL commands directly with full admin privileges
3. No RLS restrictions apply in the SQL Editor

**Example:**
```sql
-- Delete records without RLS restrictions
DELETE FROM wis_procedures WHERE vehicle_id = 'some-uuid';

-- Update records directly
UPDATE wis_models SET description = 'New description' WHERE id = 'some-uuid';
```

### Method 2: Using Service Role Key (Programmatic)
For programmatic access that bypasses RLS:

#### Setup
1. Get your Service Role Key from Supabase Dashboard:
   - Go to Settings → API
   - Copy the `service_role` key (⚠️ NEVER expose this publicly)

2. Store it securely in `.env`:
```bash
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### JavaScript Implementation
```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Create client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Now you can perform admin operations
async function adminOperations() {
  // Delete without RLS restrictions
  const { error: deleteError } = await supabaseAdmin
    .from('wis_procedures')
    .delete()
    .eq('vehicle_id', 'some-uuid');
    
  // Update without restrictions
  const { error: updateError } = await supabaseAdmin
    .from('wis_models')
    .update({ description: 'New description' })
    .eq('id', 'some-uuid');
}
```

### Method 3: MCP (Model Context Protocol) with IPv4
If you're using Claude Desktop with MCP servers configured:

#### Configuration
Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres.ydevatqwkoccxhtejdor:password@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
      ]
    }
  }
}
```

#### Usage in Claude
```javascript
// Use the MCP postgres query tool
await mcp__postgres__query({
  sql: "DELETE FROM wis_procedures WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'"
});
```

**Note:** MCP connections may fail with IPv6 addresses. If you see `ENETUNREACH` errors, the database might not be accessible via IPv6.

### Method 4: Direct PostgreSQL Connection
For direct database access using psql or database tools:

#### Connection Details
```bash
# Connection string format
postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres

# Using psql
psql postgresql://postgres.ydevatqwkoccxhtejdor:password@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

#### Database Tools
- **TablePlus**: Use connection string in connection dialog
- **pgAdmin**: Configure server with host, port, database, username
- **DBeaver**: Use PostgreSQL driver with connection details

## Common Issues and Solutions

### Issue 1: RLS Blocking Operations
**Symptom:** Operations succeed but no changes occur
```javascript
// This might return success but not actually delete anything
const { error } = await supabase
  .from('table')
  .delete()
  .eq('id', 'some-id');
```

**Solution:** Use service role key or SQL Editor

### Issue 2: Missing Columns Error
**Symptom:** `column "xyz" of relation "table" does not exist`

**Solution:** Check schema first:
```sql
-- Check what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'your_table'
ORDER BY ordinal_position;

-- Add missing columns
ALTER TABLE your_table 
ADD COLUMN IF NOT EXISTS missing_column TEXT;
```

### Issue 3: IPv6 Connection Issues
**Symptom:** `connect ENETUNREACH` with IPv6 address

**Solution:** Use IPv4 connection string or Supabase Dashboard

## Security Best Practices

### ⚠️ NEVER Expose Service Role Key
- Never commit service role key to Git
- Never use in client-side code
- Never share in documentation
- Only use in secure server environments

### Use Environment Variables
```javascript
// ✅ Good
const key = process.env.SUPABASE_SERVICE_KEY;

// ❌ Bad
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### Implement Security Checks
```bash
# Add to pre-commit hooks
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/
if [ $? -eq 0 ]; then
  echo "ERROR: Hardcoded Supabase key detected!"
  exit 1
fi
```

## Practical Examples

### Example 1: Bulk Delete with Admin Access
```javascript
// scripts/admin-delete.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function bulkDelete() {
  // Delete all records matching criteria
  const { error, count } = await supabaseAdmin
    .from('wis_procedures')
    .delete()
    .like('procedure_code', 'U2000%');
    
  console.log(`Deleted ${count} records`);
}

bulkDelete();
```

### Example 2: Direct SQL for Complex Operations
```sql
-- Run in Supabase SQL Editor
BEGIN;

-- Delete old data
DELETE FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'
AND procedure_code LIKE 'U2000%';

-- Copy data from another vehicle
INSERT INTO wis_procedures (vehicle_id, procedure_code, title, category)
SELECT 
  '22222222-2222-2222-2222-222222222222',
  REPLACE(procedure_code, 'U1300L', 'U1700L'),
  REPLACE(title, 'U1300L', 'U1700L'),
  category
FROM wis_procedures
WHERE vehicle_id = '11111111-1111-1111-1111-111111111111';

COMMIT;
```

### Example 3: Check and Fix Schema Issues
```sql
-- Diagnostic query
SELECT 
  t.table_name,
  COUNT(c.column_name) as column_count,
  array_agg(c.column_name ORDER BY c.ordinal_position) as columns
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
AND t.table_name LIKE 'wis_%'
GROUP BY t.table_name;

-- Add missing columns safely
DO $$
BEGIN
  -- Check if column exists before adding
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wis_procedures' 
    AND column_name = 'parts_required'
  ) THEN
    ALTER TABLE wis_procedures ADD COLUMN parts_required TEXT[];
  END IF;
END $$;
```

## Troubleshooting Checklist

1. **Operations not working?**
   - [ ] Check if using anon key (limited permissions)
   - [ ] Check RLS policies on the table
   - [ ] Try operation in SQL Editor first
   - [ ] Use service role key if needed

2. **Connection issues?**
   - [ ] Verify connection string format
   - [ ] Check if using IPv4 (not IPv6)
   - [ ] Confirm credentials are correct
   - [ ] Test with `psql` command line tool

3. **Schema mismatches?**
   - [ ] Run diagnostic queries first
   - [ ] Check column existence before operations
   - [ ] Review recent migrations
   - [ ] Compare development vs production schemas

## Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Project Environment Variables](.env.example)

## Contact

For database access issues specific to this project:
- Check existing SQL scripts in `/scripts/` directory
- Review migration files in `/supabase/migrations/`
- Consult CLAUDE.md for project-specific configurations