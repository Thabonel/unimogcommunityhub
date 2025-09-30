# WIS/EPC Extraction Manual Guide

## ⚠️ Critical Issue Summary
**Claude cannot write files to your actual filesystem.** All file operations must be performed manually by you.

## 📁 Current Status
- **Incomplete VDI**: 15GB file at `/Volumes/EDIT/wis-extraction/MERCEDES.vdi` (unusable)
- **Archive Location**: `/Volumes/EDIT/UNIMOG MANUALS/BIG UNIMOG MANUALS/Benz1/Mercedes09.7z.001`
- **Target**: Need 53.5GB full extraction

## 🚀 Step-by-Step Manual Extraction

### Step 1: Prepare HFS+ Drive
```bash
# Check your drives
diskutil list

# Format drive as HFS+ (Mac OS Extended) if needed
# Replace disk2 with your actual disk identifier
diskutil eraseDisk HFS+ "UnimogManuals" disk2
```

### Step 2: Extract VDI from Archives
```bash
# Navigate to archive location
cd "/Volumes/EDIT/UNIMOG MANUALS/BIG UNIMOG MANUALS/Benz1"

# Create extraction directory on HFS+ drive
mkdir -p "/Volumes/UnimogManuals/wis-extraction"

# Extract using 7zip (will take 30-45 minutes)
7z x Mercedes09.7z.001 -o"/Volumes/UnimogManuals/wis-extraction"

# OR using The Unarchiver app:
# 1. Right-click Mercedes09.7z.001
# 2. Open With → The Unarchiver
# 3. Select UnimogManuals as destination
```

### Step 3: Verify Extraction
```bash
# Check file size (should be ~53.5GB)
ls -lah "/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi"

# Expected output:
# -rw-r--r--  1 user  staff  53.5G  Date Time  MERCEDES.vdi
```

### Step 4: Mount VDI File

#### Option A: Using VirtualBox
```bash
# Create VM if not exists
VBoxManage createvm --name MERCEDES_WIS --register

# Add SATA controller
VBoxManage storagectl MERCEDES_WIS --name SATA --add sata

# Attach VDI
VBoxManage storageattach MERCEDES_WIS \
  --storagectl SATA \
  --port 0 \
  --device 0 \
  --type hdd \
  --medium "/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi"

# Start VM (headless)
VBoxManage startvm MERCEDES_WIS --type headless
```

#### Option B: Convert to DMG (Mac Native)
```bash
# Convert VDI to DMG
VBoxManage clonemedium disk \
  "/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi" \
  "/Volumes/UnimogManuals/wis-extraction/MERCEDES.dmg" \
  --format RAW

# Mount DMG
hdiutil attach "/Volumes/UnimogManuals/wis-extraction/MERCEDES.dmg"
```

### Step 5: Locate WIS/EPC Data
Once mounted, look for these locations:
```bash
# Common WIS/EPC installation paths
/Volumes/MERCEDES/Program Files/Mercedes-Benz/
/Volumes/MERCEDES/Program Files (x86)/Mercedes-Benz/
/Volumes/MERCEDES/Mercedes/
/Volumes/MERCEDES/WIS/
/Volumes/MERCEDES/EPC/
/Volumes/MERCEDES/StarFinder/
```

### Step 6: Install Required Tools
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install extraction tools
brew install p7zip
brew install mdbtools  # For Access databases
brew install sqlite3   # For SQLite databases
brew install node      # For running extraction scripts
```

### Step 7: Run Extraction Scripts
```bash
# Navigate to project
cd /Users/thabonel/Documents/unimogcommunityhub

# Install dependencies
npm install

# Run master extraction script
node scripts/wis-extraction-master.js

# Or run specific steps:
node scripts/wis-extraction-master.js mount
node scripts/wis-extraction-master.js scan
node scripts/wis-extraction-master.js extract
node scripts/wis-extraction-master.js upload
```

## 📊 Database Structure (Already Created)
The following tables exist in your Supabase instance:
- `wis_models` - Vehicle models
- `wis_systems` - Vehicle systems  
- `wis_procedures` - Repair procedures
- `wis_parts` - Parts catalog
- `wis_diagrams` - Technical diagrams
- `wis_epc_sessions` - User sessions

## 🔧 Manual Data Import (If Scripts Fail)

### Extract Access Database Manually
```bash
# List tables in .mdb file
mdb-tables "/path/to/database.mdb"

# Export table to CSV
mdb-export "/path/to/database.mdb" "TableName" > output.csv

# Convert to SQL
mdb-schema "/path/to/database.mdb" postgres > schema.sql
```

### Import to Supabase via SQL Editor
1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
2. Paste and run SQL inserts

### Sample SQL Insert
```sql
INSERT INTO wis_procedures (
  procedure_code,
  title,
  content,
  model,
  system
) VALUES (
  'U1300L_ENGINE_OIL',
  'Engine Oil Change Procedure',
  'Complete procedure content here...',
  'U1300L',
  'Engine'
);
```

## 🧪 Test Your Extraction
1. Start dev server: `npm run dev`
2. Navigate to: http://localhost:5173/knowledge/wis-epc
3. Verify data appears in the interface

## ⚠️ Common Issues & Solutions

### Issue: 7z command not found
```bash
# Install p7zip
brew install p7zip
```

### Issue: VBoxManage not found
```bash
# Add VirtualBox to PATH
export PATH="/Applications/VirtualBox.app/Contents/MacOS:$PATH"
```

### Issue: Permission denied
```bash
# Use sudo for mount operations
sudo mkdir -p /Volumes/MERCEDES_WIS
sudo mount -t ntfs /dev/disk2s1 /Volumes/MERCEDES_WIS
```

### Issue: Cannot read NTFS
```bash
# Install NTFS support
brew install --cask osxfuse
brew install ntfs-3g
```

## 📝 Progress Checklist
- [ ] Format drive as HFS+
- [ ] Extract 53.5GB VDI from archives
- [ ] Mount VDI or convert to DMG
- [ ] Locate WIS/EPC installations
- [ ] Install extraction tools
- [ ] Run extraction scripts
- [ ] Verify data in Supabase
- [ ] Test WIS viewer interface
- [ ] Clean up 15GB incomplete file

## 🆘 Need Help?
If extraction fails, you can:
1. Share the mounted drive paths for manual inspection
2. Run `find /Volumes/MERCEDES -name "*.mdb" -o -name "*.db"` to locate databases
3. ZIP and upload sample database files for analysis

## 📊 Expected Results
After successful extraction:
- **Procedures**: 1000+ repair procedures
- **Parts**: 10000+ part numbers
- **Diagrams**: 500+ technical diagrams
- **Models**: All Unimog models (U1300L, U1700, etc.)

## 🎯 Next Steps After Extraction
1. Optimize database indexes
2. Configure full-text search
3. Set up diagram viewer
4. Add offline caching
5. Deploy to production