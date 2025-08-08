# MacImageMount Instructions for WIS/EPC Extraction

## MacImageMount is Now Running!

### How to Use MacImageMount:

1. **Browse to Your Image File**
   - Click the "Browse" button in MacImageMount
   - Navigate to: `/Volumes/UnimogManuals/wis-extraction/`
   - Select `MERCEDES.img` (88GB file)

2. **Mount the Image**
   - Once selected, click "Mount" button
   - The image will be mounted to `/Volumes/`
   - A new volume will appear in Finder

3. **Access WIS/EPC Files**
   - Open Finder
   - Look for the newly mounted volume in the sidebar
   - Browse to find WIS/EPC data:
     - `Program Files/Mercedes-Benz/WIS/`
     - `Program Files/Mercedes-Benz/EPC/`
     - `Program Files (x86)/Mercedes-Benz/`

4. **Copy Database Files**
   Look for and copy these file types to your local drive:
   - `*.mdb` - Microsoft Access databases
   - `*.dbf` - dBase files
   - `*.db` - SQLite or other database files
   - `*.dat` - Data files

### Alternative: Try Disk Utility

If MacImageMount has issues with the 88GB file:

1. Open Disk Utility (Applications > Utilities)
2. File > Open Disk Image
3. Select `/Volumes/UnimogManuals/wis-extraction/MERCEDES.img`
4. Click Open

### What to Do After Mounting:

1. **Create a local working directory:**
   ```bash
   mkdir ~/Documents/unimogcommunityhub/wis-data-extraction
   ```

2. **Copy WIS/EPC database files to local drive**
   - This avoids working directly on the external drive
   - Prevents terminal freezing issues

3. **Install database viewers:**
   - MDB Viewer Plus: http://www.alexnolan.net/software/mdb_viewer_plus.htm
   - DB Browser for SQLite: https://sqlitebrowser.org
   - LibreOffice: https://www.libreoffice.org

### Troubleshooting:

- **If mounting fails:** The IMG file might be NTFS formatted. Install NTFS for Mac or macFUSE with NTFS-3G
- **If no files visible:** The partition might be hidden. Try mounting MERCEDES.raw instead
- **If MacImageMount crashes:** Use Disk Utility as fallback

### Next Steps:

Once you've located the WIS/EPC database files:
1. Copy them to local drive
2. Open with MDB Viewer Plus
3. Export to CSV/JSON
4. We'll import into Supabase using the existing schema