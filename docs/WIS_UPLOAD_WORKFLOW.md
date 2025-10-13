# WIS Documentation Upload & Processing Workflow

## Overview

The WIS system uses an ETL (Extract, Transform, Load) approach to populate the database:
1. **Upload** HTML/JSON documentation files to Supabase Storage
2. **Process** files with the ETL processor to extract structured data
3. **Populate** database with real WIS documentation

## Step 1: Prepare Your Files

Organize your WIS documentation in this structure:

```
/path/to/wis-files/
├── U435/
│   ├── procedures/
│   │   ├── oil_change.html
│   │   ├── brake_service.html
│   │   └── transmission_service.html
│   ├── bulletins/
│   │   ├── tsb_2020_001.html
│   │   └── tsb_2020_002.html
│   └── parts/
│       └── parts_catalog.json
├── U400/
│   ├── procedures/
│   │   └── engine_maintenance.html
│   └── bulletins/
│       └── tsb_2021_001.html
├── U500/
│   └── procedures/
│       └── hydraulic_system.html
└── [more models...]
```

**Important**: Model codes (U435, U400, etc.) should match your Unimog models.

## Step 2: Set Up Service Role Key

The upload script needs the service role key (not the anon key).

### Get Service Role Key:
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/api
2. Copy the `service_role` key (NOT the `anon` key)
3. Add to your environment:

```bash
# In your shell profile (~/.zshrc or ~/.bashrc)
export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
```

**NEVER commit the service role key to git!**

## Step 3: Run Bulk Upload

```bash
# Install dependencies if needed
npm install

# Run upload script
npx tsx scripts/upload-wis-docs.ts /path/to/wis-files

# Example with UnimogManuals drive
npx tsx scripts/upload-wis-docs.ts /Volumes/UnimogManuals/WIS-Prepared
```

The script will:
- ✅ Scan all HTML and JSON files recursively
- ✅ Upload to `wis-docs` bucket with path: `model/{ModelCode}/{type}/{filename}`
- ✅ Skip files that already exist
- ✅ Show progress for each file

Example output:
```
📂 Scanning directory: /Volumes/UnimogManuals/WIS-Prepared
📄 Found 45 files to upload

⬆️  Uploading: model/U435/procedures/oil_change.html
✅ Uploaded: model/U435/procedures/oil_change.html
⬆️  Uploading: model/U435/bulletins/tsb_2020_001.html
✅ Uploaded: model/U435/bulletins/tsb_2020_001.html
⏭️  Skipping (already exists): model/U435/parts/parts_catalog.json
...

╔══════════════════════════════════════════════════╗
║   Upload Complete                                ║
╚══════════════════════════════════════════════════╝

✅ Successfully uploaded: 44
⏭️  Skipped (already exist): 1
❌ Failed: 0
```

## Step 4: Process with ETL

After uploading files, use the Admin panel to process them:

1. **Go to Admin Panel**: Navigate to `/admin`
2. **Click "WIS Data Population" tab**
3. **Click "Populate Procedures"**

The ETL processor will:
- 📁 Scan `wis-docs` bucket for all HTML procedure files
- 🔍 Parse HTML to extract structured data (title, description, time, difficulty)
- 🏗️ Auto-create model/system/component hierarchy as needed
- 💾 Insert procedures into database (idempotent - no duplicates)

Example result:
```
Procedures: Successfully populated 44 procedures from HTML files
```

## File Format Requirements

### Procedures (HTML)

```html
<h1>Unimog 400 Series - Engine Oil Change</h1>

<div class="description">
  <p>Complete procedure for changing engine oil and filter.</p>
</div>

<div class="warning">
  ⚠️ WARNING: Engine must be warm but not hot.
</div>

<h2>Required Parts:</h2>
<ul>
  <li>Part #000 989 45 04 - Engine Oil Filter</li>
  <li>Part #A000 989 98 01 - Drain Plug Seal</li>
  <li>8L of Mercedes-Benz 229.5 Engine Oil</li>
</ul>

<h2>Procedure:</h2>
<ol>
  <li>Position vehicle on level ground</li>
  <li>Apply parking brake and chock wheels</li>
  <li>Locate oil drain plug under engine</li>
  <!-- More steps... -->
</ol>

<h2>Time Required:</h2>
<p>45 minutes</p>

<h2>Special Tools:</h2>
<ul>
  <li>Oil filter wrench</li>
  <li>19mm socket for drain plug</li>
</ul>
```

**Key elements the parser looks for**:
- `<h1>` - Procedure title
- First `<p>` or `.description` - Description
- `<h2>Time Required:</h2>` - Extracts time in minutes
- `.warning` or `.caution` - Counts warnings for difficulty
- All content before first `<h2>` - Overview text

### Parts (JSON)

```json
{
  "category": "Portal Axle Assembly",
  "model": "Unimog U400/U500",
  "parts": [
    {
      "number": "A 435 350 01 35",
      "description": "Portal Axle Housing - Front Left",
      "quantity": 1,
      "price": 3450.00,
      "notes": "Includes mounting hardware"
    },
    {
      "number": "A 435 350 01 36",
      "description": "Portal Axle Housing - Front Right",
      "quantity": 1,
      "price": 3450.00
    }
  ],
  "service_notes": "Replace seals when installing new housing",
  "related_procedures": ["54.20-P-2001A - Portal Axle Oil Change"]
}
```

### Bulletins (HTML)

```html
<h1>TSB 2020-001: Portal Axle Seal Leakage</h1>

<div class="bulletin-info">
  <p><strong>Bulletin Number:</strong> TSB-2020-001</p>
  <p><strong>Issue Date:</strong> January 15, 2020</p>
  <p><strong>Affected Vehicles:</strong> Unimog U400, U500 (2010-2018)</p>
</div>

<h2>Condition:</h2>
<p>Oil leakage from portal axle seals...</p>

<h2>Root Cause:</h2>
<p>Seal material degradation due to...</p>

<h2>Correction:</h2>
<ol>
  <li>Inspect portal axle seals for damage</li>
  <li>Replace with updated part number A 435 350 12 68</li>
  <!-- More steps... -->
</ol>
```

## Troubleshooting

### "Permission denied" errors
- Make sure you're using `SUPABASE_SERVICE_ROLE_KEY`, not `VITE_SUPABASE_ANON_KEY`
- The service role key has admin privileges

### "Bucket not found" errors
- Ensure `wis-docs` bucket exists in Supabase Storage
- Check bucket name is exactly `wis-docs` (lowercase, with hyphen)

### Files not processing in ETL
- Check file extension is `.html` or `.json`
- Verify file path follows: `model/{ModelCode}/{type}/{filename}`
- Check HTML has required elements (`<h1>` for title)

## Next Steps

Once procedures are working, we can extend the ETL processor to handle:
- **Service Bulletins**: Parse HTML bulletins and populate `wis_service_bulletins` table
- **Parts**: Parse JSON parts files and populate `wis_parts` table
- **Batch Processing**: Handle large uploads (50GB+) in chunks

## Architecture

```
Local Files                 Supabase Storage              Database
───────────                ─────────────────             ─────────

U435/procedures/          model/U435/procedures/        wis_models
  oil_change.html    →      oil_change.html      →      wis_systems
                                                         wis_components
U435/bulletins/           model/U435/bulletins/         wis_procedures
  tsb_2020_001.html  →      tsb_2020_001.html    →      wis_service_bulletins

U435/parts/               model/U435/parts/             wis_parts
  parts.json         →      parts.json           →      wis_parts
```

The ETL processor bridges Storage → Database by:
1. Scanning storage bucket for files
2. Downloading and parsing file content
3. Extracting structured data
4. Creating hierarchy (model → system → component)
5. Inserting into appropriate database tables
