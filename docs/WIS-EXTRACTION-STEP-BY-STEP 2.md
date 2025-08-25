# Mercedes WIS Database Extraction - Step by Step Guide

## Current Status
✅ **Sample data uploaded successfully** to Workshop Database
- 2 procedures
- 2 parts  
- 1 bulletin
- 3 models

## What You Need to Do Next

### Step 1: Install DbVisualizer (10 minutes)

1. **Download DbVisualizer**
   ```bash
   # Option A: Direct download
   open https://www.dbvis.com/download/
   
   # Option B: Via Homebrew
   brew install --cask dbvisualizer
   ```

2. **Install DbVisualizer**
   - Download the macOS version
   - Open the DMG file
   - Drag DbVisualizer to Applications
   - Launch DbVisualizer

### Step 2: Mount the WIS VDI File (15 minutes)

Since you have the MERCEDES.vdi file at `/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi`, you have several options:

#### Option A: Using VirtualBox (Free)
```bash
# 1. Install VirtualBox if not already installed
brew install --cask virtualbox

# 2. Create a new VM
VBoxManage createvm --name "WIS-Extraction" --ostype Windows10_64 --register

# 3. Attach the VDI
VBoxManage storagectl "WIS-Extraction" --name "SATA Controller" --add sata
VBoxManage storageattach "WIS-Extraction" --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium "/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi"

# 4. Start the VM
VBoxManage startvm "WIS-Extraction"
```

#### Option B: Using Parallels Desktop (If you have it)
1. Open Parallels Desktop
2. File → Open → Select the MERCEDES.vdi
3. Parallels will convert and mount it
4. Start the VM

#### Option C: Direct Mount on macOS (Experimental)
```bash
# Convert VDI to raw format (already done - you have MERCEDES.raw)
# Mount the raw file
hdiutil attach -imagekey diskimage-class=CRawDiskImage -nomount "/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw"

# Find the Windows partition
diskutil list

# Mount the Windows partition (replace diskX with actual disk)
sudo mkdir /Volumes/WIS
sudo mount -t ntfs /dev/diskXs1 /Volumes/WIS
```

### Step 3: Start WIS Database Service

Once the VDI is mounted/running:

1. **In the Windows VM:**
   - Navigate to `C:\Program Files\EWA net\`
   - Run `StartWIS.exe` or `EWA.exe`
   - This starts the Transbase database on port 2054

2. **Verify Transbase is running:**
   ```bash
   # From your Mac, check if port 2054 is accessible
   telnet localhost 2054
   ```

### Step 4: Configure DbVisualizer

1. **Add Transbase JDBC Driver**
   - In DbVisualizer: Tools → Driver Manager
   - Click "+" to add new driver
   - Name: "Transbase"
   - URL Format: `jdbc:transbase://<host>:<port>/<database>`
   
2. **Add the JDBC JAR**
   - You need the Transbase JDBC driver from the WIS installation
   - Location in VM: `C:\Program Files\EWA net\database\TransBase EWA\jdbc\transbase.jar`
   - Copy this file to your Mac
   - In DbVisualizer, add this JAR to the driver

3. **Create Connection**
   - Database → Create Database Connection
   - Name: "Mercedes WIS"
   - Driver: Transbase (the one you just created)
   - Database URL: `jdbc:transbase://localhost:2054/wisnet`
   - Database Userid: `tbadmin`
   - Database Password: (leave empty)
   - Click "Connect"

### Step 5: Export Data from DbVisualizer

Once connected, you'll see the WIS database tables. The main tables are:

1. **PROCEDURES** - All repair procedures
2. **PARTS** - Parts catalog
3. **DIAGRAMS** - Image references
4. **BULLETINS** - Technical bulletins
5. **VEHICLES** - Model information

To export each table:

1. Right-click on table name
2. Select "Export Table"
3. Choose format:
   - **CSV** for easy processing
   - **SQL** for direct import
   - **JSON** for our extraction script
4. Save to `~/Documents/wis-extracted-data/`

### Step 6: Process and Upload Extracted Data

Once you have the exported files:

```bash
# 1. Place exported files in the extraction directory
mkdir -p ~/Documents/wis-extracted-data
# Copy your exported CSV/JSON files here

# 2. Update the extraction script to read these files
cd /Users/thabonel/Documents/unimogcommunityhub

# 3. Run the extraction with real data
node scripts/wis-extraction/process-exported-data.js

# This will:
# - Read the exported files
# - Transform to Supabase schema
# - Upload in batches
# - Show progress
```

## Alternative: Using SQL Queries in DbVisualizer

If the tables have different names or structures, run these queries in DbVisualizer to explore:

```sql
-- Show all tables
SELECT * FROM INFORMATION_SCHEMA.TABLES;

-- Show columns for a specific table
SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'PROCEDURES';

-- Sample data from procedures
SELECT * FROM PROCEDURES LIMIT 10;

-- Count records
SELECT 
  (SELECT COUNT(*) FROM PROCEDURES) as procedures_count,
  (SELECT COUNT(*) FROM PARTS) as parts_count,
  (SELECT COUNT(*) FROM BULLETINS) as bulletins_count;
```

## Troubleshooting

### Issue: Cannot connect to Transbase
**Solution:** Ensure WIS is running in the VM and port forwarding is enabled:
```bash
# In VirtualBox, set up port forwarding
VBoxManage modifyvm "WIS-Extraction" --natpf1 "transbase,tcp,,2054,,2054"
```

### Issue: DbVisualizer won't connect
**Solution:** Try using the VM's IP directly:
```bash
# In the VM, find IP address
ipconfig

# Use that IP in DbVisualizer connection:
jdbc:transbase://[VM-IP]:2054/wisnet
```

### Issue: Tables are empty
**Solution:** The ROM files might not be attached. In the VM:
1. Run `C:\Program Files\EWA net\Admin\AdminTool.exe`
2. Attach ROM files to database
3. Restart WIS

## Expected Data Volumes

Based on the 54GB VDI, you should expect approximately:
- **Procedures**: 100,000+ records
- **Parts**: 50,000+ records
- **Diagrams**: 10,000+ images
- **Bulletins**: 5,000+ records
- **Models**: 50+ Unimog variants

## Next Steps After Extraction

1. **Verify Data Quality**
   ```bash
   # Check extracted files
   ls -la ~/Documents/wis-extracted-data/
   ```

2. **Run Upload Script**
   ```bash
   node scripts/wis-extraction/extract-wis-data.js
   ```

3. **Check Workshop Database**
   - Go to https://unimogcommunity-staging.netlify.app/knowledge/wis
   - Search for procedures
   - Verify data is complete

## Support

If you encounter issues:
1. Check the extraction logs in `wis-extracted-data/`
2. The sample data upload worked, so the connection is good
3. Focus on getting the VDI mounted and WIS running
4. DbVisualizer is the most reliable way to export the data

The infrastructure is ready - we just need to get the actual WIS data exported!