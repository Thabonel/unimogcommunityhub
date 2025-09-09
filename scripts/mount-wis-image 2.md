# Mount WIS/EPC Image Instructions

## GUI Method (Recommended - No Terminal Freezing)

### Option 1: Using Disk Utility

1. **Open Disk Utility**
   - Press `Cmd + Space` and type "Disk Utility"
   - Or go to Applications > Utilities > Disk Utility

2. **Mount the Image**
   - Click `File` > `Open Disk Image...`
   - Navigate to: `/Volumes/UnimogManuals/wis-extraction/`
   - Select `MERCEDES.img`
   - Click `Open`

3. **Access the Files**
   - The Windows partition will appear in Finder sidebar
   - Look for a volume named "Windows" or similar
   - Browse to find WIS/EPC files

### Option 2: Using Finder

1. **Navigate to the Image**
   - Open Finder
   - Press `Cmd + Shift + G`
   - Enter: `/Volumes/UnimogManuals/wis-extraction/`
   - Find `MERCEDES.img`

2. **Double-click to Mount**
   - Simply double-click the MERCEDES.img file
   - macOS will attempt to mount it automatically
   - If prompted, choose "Open with DiskImageMounter"

## Expected WIS/EPC File Locations

Once mounted, look for these directories:

```
/Volumes/[MountedDrive]/Program Files/Mercedes-Benz/WIS/
/Volumes/[MountedDrive]/Program Files/Mercedes-Benz/EPC/
/Volumes/[MountedDrive]/Program Files (x86)/Mercedes-Benz/
/Volumes/[MountedDrive]/WIS/
/Volumes/[MountedDrive]/EPC/
```

## Database Files to Look For

- `*.mdb` - Microsoft Access database files
- `*.dbf` - dBase database files  
- `*.db` - Generic database files
- `*.accdb` - Newer Access database format

## If Mounting Fails

The image might be corrupted or incomplete. Try:

1. **Use the RAW file instead**
   - Try mounting `MERCEDES.raw` using the same method

2. **Install NTFS Support**
   - Download NTFS for Mac (free trial available)
   - Or use macFUSE with NTFS-3G

3. **Alternative: Use VirtualBox**
   - Import the MERCEDES.vbox file directly
   - Start the VM to access files

## Next Steps After Mounting

1. Copy WIS/EPC database files to local drive
2. Use MDB Viewer Plus to open Access databases
3. Export to CSV/JSON format
4. Import into Supabase

## Tools You'll Need

- **MDB Viewer Plus**: http://www.alexnolan.net/software/mdb_viewer_plus.htm
- **LibreOffice**: https://www.libreoffice.org (for DBF files)
- **DB Browser for SQLite**: https://sqlitebrowser.org (if SQLite databases found)