# WIS EPC Manual Extraction Guide

Since the automated extraction is having issues, here's how to do it manually:

## Option 1: Extract Full VDI (Recommended)

### Step 1: Open Terminal and Extract
```bash
cd /Volumes/EDIT/wis-extraction
7z x Mercedes09.7z.001 -y
```

This will take 20-30 minutes and extract:
- MERCEDES.vdi (53.5 GB)
- MERCEDES.vbox
- VirtualBox installer files

### Step 2: Import to VirtualBox
1. Open VirtualBox
2. Machine → Add
3. Navigate to `/Volumes/EDIT/wis-extraction`
4. Select `MERCEDES.vbox`
5. Click "Add"

### Step 3: Configure Shared Folder
1. Select MERCEDES VM → Settings → Shared Folders
2. Add new folder:
   - Folder Path: `/Volumes/EDIT/wis-extraction/wis-data`
   - Folder Name: `wis-export`
   - Auto-mount: ✓
   - Make Permanent: ✓

### Step 4: Start VM and Extract Data
1. Start the MERCEDES VM
2. Windows will boot (Windows 7)
3. Open Windows Explorer
4. Navigate to: `\\VBOXSVR\wis-export`
5. Copy these folders:
   - `C:\Program Files\Mercedes-Benz\*` → `\\VBOXSVR\wis-export\`

## Option 2: Extract Without VirtualBox

If you don't want to run the VM:

### Step 1: Extract and Mount VDI
```bash
# Extract VDI
cd /Volumes/EDIT/wis-extraction
7z x Mercedes09.7z.001 MERCEDES.vdi -y

# Convert to raw (requires VirtualBox)
VBoxManage clonehd MERCEDES.vdi MERCEDES.raw --format RAW

# Mount on macOS
hdiutil attach -imagekey diskimage-class=CRawDiskImage MERCEDES.raw
```

### Step 2: Access Windows Files
The Windows partition will mount under `/Volumes/`
Look for folders like:
- `/Volumes/Windows/Program Files/Mercedes-Benz/WIS`
- `/Volumes/Windows/Program Files/Mercedes-Benz/EPC`

## Option 3: Quick Data Access (Fastest)

Since I've already created the WIS viewer that works with Supabase:

1. **Use the sample data** (already working):
   - Go to: http://localhost:5173/knowledge/wis-epc
   - Search for procedures
   - This proves the system works

2. **Extract specific data later**:
   - We can extract just what you need
   - No need for the full 53.5GB

## What's Actually in WIS EPC?

The VM contains:
- **WIS**: Workshop Information System (repair procedures)
- **EPC**: Electronic Parts Catalog
- **WDS**: Wiring Diagram System
- **TSB**: Technical Service Bulletins

Each has thousands of files in proprietary formats that need conversion.

## My Recommendation

1. **Start with the sample data** - it's already working
2. **Extract the full VDI only if you need complete data**
3. **Consider using a Windows PC** if you have one - much easier to access the data

The sample data I created covers the main Unimog models and common procedures. This might be enough for your 500 members initially!

Would you like to:
- A) Continue with full extraction (20-30 min)
- B) Work with sample data for now
- C) Try a different approach?