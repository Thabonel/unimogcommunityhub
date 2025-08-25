# WIS Database Import Context - August 24, 2025

## CRITICAL: Task After Restart
Import 3,234 procedures, 197+ parts, and bulletins into Supabase WIS tables using MCP connection.

## Current Situation

### What's In Database Now (Almost Empty):
- **wis_models**: 5 vehicles ✅ (U1300L, U1700L/435 Series, U2150L, U435, U500)
- **wis_procedures**: Only 3 test procedures ❌ (Need 3,234!)
- **wis_parts**: Only ~15 parts ❌ (Need 197+ Mercedes parts)
- **wis_bulletins**: Only 1 bulletin ❌ (Need many more)

### Data Ready for Import at `/Volumes/UnimogManuals/`:

#### 1. PROCEDURES - HIGHEST PRIORITY
**Location**: `/Volumes/UnimogManuals/wis-generated-data/procedures.json`
- **Count**: 3,234 procedures
- **Structure**: JSON array with:
  ```json
  {
    "procedure_code": "U300-ENG-OIL-REM-tgvnp",
    "title": "Remove and Install Oil System - Unimog U300",
    "model": "U300",
    "system": "Engine",
    "subsystem": "Oil System",
    "content": "Full markdown content with steps...",
    "steps": [...],
    "tools_required": [...],
    "parts_required": [...],
    "safety_warnings": [...],
    "time_estimate": 120,
    "difficulty": "medium"
  }
  ```
- **Import Challenge**: Need to map model names to vehicle_ids in wis_models table

#### 2. PARTS DATABASE
**Location**: `/Volumes/UnimogManuals/MERCEDES-FINAL-DATABASE/mercedes_complete_import.sql`
- **Count**: 197 parts
- **Format**: Ready-to-run SQL with ON CONFLICT handling
- **Structure**: Direct INSERT statements
- **Import**: Can execute directly via MCP

#### 3. BULLETINS
**Location**: `/Volumes/UnimogManuals/wis-generated-data/bulletins.json`
- **Count**: 1,594 lines
- **Format**: JSON
- **Import**: Parse and convert to SQL

#### 4. Alternative SQL Files
- `/Volumes/UnimogManuals/WIS-FINAL-COMPLETE/wis_final_import.sql` - Another SQL import
- `/Volumes/UnimogManuals/WIS-CLEAN-EXTRACT/` - May have more data

## Import Strategy After Restart

### Step 1: Test MCP Connection
```sql
SELECT COUNT(*) FROM wis_models;
```

### Step 2: Create Vehicle Mapping
Map model names from JSON to vehicle_ids:
- "U300" → Need to add to wis_models
- "U400" → Need to add to wis_models  
- "U1300L" → '11111111-1111-1111-1111-111111111111'
- "U1700L" → '22222222-2222-2222-2222-222222222222'
- "U2150L" → '33333333-3333-3333-3333-333333333333'
- "U435" → '44444444-4444-4444-4444-444444444444'
- "U500" → '55555555-5555-5555-5555-555555555555'

### Step 3: Import Parts (Easy)
```bash
# Read SQL file
cat /Volumes/UnimogManuals/MERCEDES-FINAL-DATABASE/mercedes_complete_import.sql
# Execute via MCP postgres query
```

### Step 4: Import Procedures (Complex)
```python
# Pseudo-code for import process:
1. Read procedures.json
2. For each procedure:
   - Map model to vehicle_id (or create new vehicle)
   - Convert tools_required array to PostgreSQL array
   - Map category/subcategory
   - Insert with proper escaping
3. Execute in batches of 100
```

### Step 5: Import Bulletins
Similar to procedures but simpler structure

## Technical Requirements

### Database Schema (Already Exists):
```sql
wis_procedures (
  id UUID,
  vehicle_id UUID REFERENCES wis_models(id),
  procedure_code TEXT,
  title TEXT,
  category TEXT,
  subcategory TEXT,
  description TEXT,
  content TEXT,  -- This gets the full markdown content
  difficulty_level INTEGER,
  estimated_time_minutes INTEGER,
  tools_required TEXT[],  -- PostgreSQL array
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### MCP Connection (Should Work After Restart):
- **Config Location**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Database**: postgres.ydevatqwkoccxhtejdor
- **Issue Before**: IPv6 connection failing (2406:da18...)
- **After Restart**: Should reconnect properly

## Code to Execute After Restart

### 1. Quick Test
```sql
-- Via MCP
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'wis_%';
```

### 2. Import Parts SQL
```javascript
// Read and execute
const sql = fs.readFileSync('/Volumes/UnimogManuals/MERCEDES-FINAL-DATABASE/mercedes_complete_import.sql', 'utf8');
// Execute via mcp__postgres__query
```

### 3. Process Procedures JSON
```javascript
const procedures = JSON.parse(
  fs.readFileSync('/Volumes/UnimogManuals/wis-generated-data/procedures.json', 'utf8')
);

// Map models and insert
for (const proc of procedures) {
  const vehicleId = mapModelToVehicleId(proc.model);
  // Build INSERT statement
  // Execute via MCP
}
```

## Expected Outcome

After successful import:
- **3,234 procedures** with full content, steps, tools
- **197+ parts** with descriptions
- **Multiple bulletins** with technical updates
- WIS page fully functional with real data
- Ready for Phase 3: Chunking for Barry AI

## Files Created During Session

1. `/Users/thabonel/Desktop/WIS_DEPLOYMENT.sql` - Initial deployment
2. `/Users/thabonel/Desktop/WIS_MORE_DATA.sql` - Additional sample data
3. `/Users/thabonel/Desktop/CHECK_WIS_DATA.sql` - Status check query
4. `/Users/thabonel/Documents/unimogcommunityhub/BACKUP_RESTORATION_GUIDE.md` - Backup info
5. This file: `WIS_IMPORT_CONTEXT.md` - Context for after restart

## Important Notes

- U1700L is the 435 Series - most common in Australia, needs prominence
- Data is NOT chunked for AI yet - that's Phase 3
- System categories (Engine, Transmission, Axles) need to match category field
- The page filters work but need data to be useful
- Barry can't search this until we chunk it

## On Restart, Start Here:
1. Test MCP: `SELECT COUNT(*) FROM wis_procedures;`
2. If working, proceed with import
3. If not, check IPv6 vs IPv4 connection issues
4. Once imported, move to Phase 3: Chunking for Barry AI