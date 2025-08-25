# Complete WIS Database Extraction for UnimogCommunityHub

## Goal
Extract all 54GB+ of Mercedes WIS data and make it searchable/usable on the Unimog website for users to repair their vehicles.

## What We Need to Extract

### 1. Complete Database Contents
- **Procedures**: All repair/maintenance procedures (estimated 10,000+)
- **Parts Catalog**: Complete parts database with numbers (estimated 100,000+)
- **Wiring Diagrams**: Electrical schematics for all models
- **Service Bulletins**: Technical updates and recalls
- **Diagnostic Codes**: Fault codes and troubleshooting
- **Torque Specifications**: All bolt torque values
- **Fluid Capacities**: Oil, coolant, hydraulic specifications
- **Images/Diagrams**: Technical illustrations

### 2. Database Location in VDI
```
C:\DB\WIS\wisnet\                 # Main database
C:\Program Files\EWA\             # WIS application
C:\export\                        # Your exported files
```

## Extraction Strategy

### Step 1: Boot the VDI and Access WIS
```bash
# Start QEMU (single line!)
qemu-system-i386 -hda /Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi -m 2048 -vga std
```

Login: Admin / Password: 12345

### Step 2: Export Methods Inside Windows VM

#### Method A: WIS Built-in Export
1. Open WIS application
2. Use File → Export functions
3. Export to CSV/XML format
4. Categories to export:
   - Procedures by model
   - Parts by system
   - Bulletins by date

#### Method B: Direct Database Export
1. Open Command Prompt as Administrator
2. Navigate to database:
```cmd
cd C:\DB\WIS\wisnet\
dir /s *.* > database-inventory.txt
```

3. Use Transbase tools:
```cmd
cd C:\Program Files\EWA\database\TransBase WIS\
tbadm32.exe -export wisnet
```

#### Method C: Manual File Copy
1. Copy entire database folders:
   - C:\DB\WIS\wisnet\R0\ through R8\
   - All rfile* files
2. Create a batch file to automate:
```batch
@echo off
xcopy C:\DB\WIS\wisnet\*.* C:\export\wisnet\ /E /Y
xcopy "C:\Program Files\EWA\database\*.dll" C:\export\tools\ /Y
```

### Step 3: Transfer to Mac

#### Create HTTP Server in Windows:
```python
# In Windows VM, create simple-server.py:
import http.server
import socketserver
import os

os.chdir('C:\\export')
PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server at port {PORT}")
    httpd.serve_forever()
```

Run: `python simple-server.py`

#### On Mac, download files:
```bash
# Create extraction directory
mkdir -p /Volumes/UnimogManuals/wis-complete-extraction

# Download all files (replace IP with VM's IP)
wget -r -np -nH --cut-dirs=1 http://10.0.2.15:8000/ -P /Volumes/UnimogManuals/wis-complete-extraction/
```

### Step 4: Convert Transbase to PostgreSQL

#### Parse rfiles:
```javascript
// parse-transbase.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Transbase rfile mapping
const rfileMap = {
  'rfile00002': 'procedures',
  'rfile00003': 'parts',
  'rfile00004': 'bulletins',
  'rfile00005': 'models',
  'rfile00006': 'wiring'
};

// Parse binary rfiles to JSON
function parseRfile(filename) {
  const data = fs.readFileSync(filename);
  // Extract readable strings and structure
  const records = [];
  // Binary parsing logic here
  return records;
}

// Import to Supabase
async function importToDatabase(records, table) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const { error } = await supabase
    .from(`wis_${table}`)
    .insert(records);
}
```

### Step 5: Create Web Interface

#### Search Interface:
```typescript
// WISSearch.tsx
export function WISSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  const search = async () => {
    const { data } = await supabase
      .from('wis_procedures')
      .select('*')
      .textSearch('content', searchTerm);
    setResults(data);
  };
  
  return (
    <div>
      <Input 
        placeholder="Search procedures, parts, bulletins..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button onClick={search}>Search WIS</Button>
      
      {results.map(result => (
        <WISResult key={result.id} data={result} />
      ))}
    </div>
  );
}
```

## Database Schema for Full WIS

```sql
-- Enhanced schema for complete WIS data
CREATE TABLE wis_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_code TEXT UNIQUE,
  title TEXT,
  content TEXT, -- Full procedure text
  model_codes TEXT[],
  system_category TEXT,
  subsystem TEXT,
  difficulty TEXT,
  time_required INTEGER,
  tools_required TEXT[],
  parts_required TEXT[], -- Links to parts table
  images JSONB, -- Image references/data
  diagrams JSONB, -- Technical diagrams
  warnings TEXT[],
  prerequisites TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(title, '') || ' ' || 
      coalesce(content, '') || ' ' ||
      coalesce(system_category, '')
    )
  ) STORED
);

CREATE TABLE wis_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number TEXT UNIQUE,
  superseded_by TEXT,
  description TEXT,
  specifications JSONB,
  applicable_models TEXT[],
  system_category TEXT,
  price_estimate DECIMAL,
  availability TEXT,
  alternatives TEXT[],
  supplier_info JSONB,
  images JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wis_diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagram_code TEXT UNIQUE,
  title TEXT,
  type TEXT, -- 'wiring', 'hydraulic', 'mechanical'
  model_codes TEXT[],
  system TEXT,
  image_data TEXT, -- Base64 or URL
  vector_data JSONB, -- SVG or vector format
  interactive BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wis_bulletins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulletin_number TEXT UNIQUE,
  title TEXT,
  issue_date DATE,
  affected_models TEXT[],
  severity TEXT,
  description TEXT,
  solution TEXT,
  parts_required TEXT[],
  labor_hours DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Full-text search indexes
CREATE INDEX idx_procedures_search ON wis_procedures USING GIN(search_vector);
CREATE INDEX idx_parts_search ON wis_parts USING GIN(to_tsvector('english', description));
CREATE INDEX idx_bulletins_search ON wis_bulletins USING GIN(to_tsvector('english', title || ' ' || description));
```

## Expected Data Volume

From a complete WIS extraction:
- **Procedures**: 10,000-15,000 documents
- **Parts**: 100,000-150,000 items
- **Diagrams**: 5,000-10,000 images
- **Bulletins**: 1,000-2,000 notices
- **Total Storage**: 5-10GB after compression

## Alternative: Real-time VM Access

Instead of extracting everything, consider:
1. Keep WIS running in a VM server
2. Create API wrapper around WIS
3. Users query through your website
4. Website fetches from running WIS VM
5. Cache frequently accessed data

## Next Immediate Steps

1. **Boot the VDI** with QEMU
2. **Explore WIS** to understand data structure
3. **Test export** functions in WIS
4. **Copy sample data** to test conversion
5. **Build import pipeline** for PostgreSQL
6. **Create search interface** on website

This will give your users complete access to all WIS data for Unimog repairs!