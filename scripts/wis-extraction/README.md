# WIS Extraction Scripts

## 🛡️ EXTERNAL DRIVE SAFETY GUARANTEE
All scripts are hardcoded to work ONLY on external drives (`/Volumes/`). They will exit with an error if any attempt is made to extract to the local drive.

## Scripts Overview

### 🚀 Main Scripts (Just run these!)

#### `extract-all.sh` - Complete Extraction (2-3 hours)
```bash
./extract-all.sh
```
- Full WIS database extraction
- All file formats supported
- Complete upload to Supabase
- Automatic error recovery

#### `extract-mdb-only.sh` - Quick Win (30 minutes)
```bash
./extract-mdb-only.sh
```
- MDB database files only
- Gets you searchable data fast
- Best for immediate results

### 🤖 Support Scripts (Auto-called)

#### `upload-mdb-data.js`
- Converts MDB CSV to Supabase format
- Handles procedures, parts, bulletins, models
- Auto-retry on failures

#### `upload-files.js`
- Uploads all files to Supabase Storage
- Maintains folder structure
- Creates database entries for searchability

#### `verify-extraction.js`
- Checks extraction completeness
- Tests search functionality
- Generates detailed report

## File Structure After Extraction

```
/Volumes/UnimogManuals/wis-extracted/
├── mdb-data/          # Extracted CSV files from MDB databases
├── files/             # All WIS files organized by category
├── converted/         # Converted formats (CPG→PNG, etc.)
├── logs/             # Extraction logs
└── verification-report.json
```

## Safety Features

- ✅ **External drive verification** - Script exits if paths aren't on `/Volumes/`
- ✅ **Checkpoint system** - Resume from interruption
- ✅ **Progress tracking** - Real-time status updates
- ✅ **Error recovery** - Automatic retries with fallbacks
- ✅ **Safe cleanup** - Only removes external drive temp files

## Usage

1. Ensure VDI is at `/Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi`
2. Run extraction script (see above)
3. Monitor progress in logs
4. Check web interface when complete

Scripts handle everything automatically!