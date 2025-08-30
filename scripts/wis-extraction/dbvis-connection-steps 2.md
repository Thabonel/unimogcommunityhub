# 🚀 DbVisualizer Quick Connection Guide

## STEP 1: Login to Windows VM
The QEMU window should be showing Windows 7 booting.
- **Username**: Admin
- **Password**: 12345

## STEP 2: Start WIS Application
Once logged in:
1. Double-click the **Mercedes WIS** icon on the desktop
2. Wait for WIS to fully load (you'll see 3 icons)
3. Leave it running in the background

## STEP 3: Connect DbVisualizer to WIS

### In DbVisualizer window:

1. **Click** the **"+"** button (Create New Connection) in the left panel

2. **Choose Driver**: 
   - Select "Generic JDBC" from the dropdown
   - Or if available, select "Transbase"

3. **Enter Connection Details**:
   ```
   Connection Name: WIS Mercedes Database
   Database URL:    jdbc:transbase://localhost:2054/wisnet
   Database Userid: tbadmin
   Database Password: (leave empty - no password)
   ```

4. **Driver Settings** (if using Generic JDBC):
   - Click "Driver Manager" button
   - Add new driver called "Transbase"
   - Driver Class: `transbase.jdbc.Driver`
   - JAR file: Will need to download or copy from VM

5. **Test Connection**:
   - Click "Connect" or "Test Connection"
   - You should see "Connection successful"

## STEP 4: Export Data

### Option A: Use SQL Commander
1. Go to **SQL Commander** tab
2. Run these queries to export:

```sql
-- Export procedures
SELECT * FROM procedures;

-- Export parts  
SELECT * FROM parts;

-- Export bulletins
SELECT * FROM bulletins;

-- Export diagrams
SELECT * FROM diagrams;
```

3. Right-click results → Export → CSV

### Option B: Use Database Export
1. Right-click on **wisnet** database in left panel
2. Select **Export Database**
3. Choose:
   - Format: CSV
   - Include: Data only
   - Output folder: `/Volumes/UnimogManuals/wis-complete-extraction/`

## STEP 5: Import to Website

Once exported, run:
```bash
cd /Users/thabonel/Documents/unimogcommunityhub
node scripts/wis-extraction/automated-wis-extraction.js
```

## Troubleshooting

### Can't connect?
1. Make sure WIS is running in the VM
2. Try IP address instead: `jdbc:transbase://10.0.2.15:2054/wisnet`
3. Check QEMU network: Should be using NAT by default

### No Transbase driver?
1. Download from: http://www.transaction.de/en/download.html
2. Or copy from VM: `C:\Program Files\EWA\database\TransBase\jdbc\transbase.jar`
3. Add JAR to DbVisualizer Driver Manager

### Tables not showing?
1. Refresh the connection
2. Check Schema dropdown - select "PUBLIC" or "WISNET"
3. Look under Tables section in tree

## Success Indicators
✅ Connection shows green status  
✅ You can see tables: procedures, parts, bulletins, diagrams  
✅ SQL queries return data  
✅ Export creates CSV files