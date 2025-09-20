# 📋 Complete WIS Extraction Attempts Documentation
## Everything We Tried to Extract the 54GB Mercedes WIS Database

---

## 🎯 Goal
Extract the complete Mercedes WIS (Workshop Information System) database from a 54GB VDI file containing:
- 10,000+ repair procedures for all Unimog models
- 100,000+ parts with Mercedes part numbers
- Service bulletins and technical updates
- Wiring diagrams and specifications
- Complete searchable database for the website

---

## 📁 What We Have
- **File**: `/Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi` (54GB)
- **Content**: Windows 7 VM with pre-installed Mercedes WIS/EPC
- **Credentials**: Admin / 12345
- **Database Location**: `C:\DB\WIS\wisnet\190618193631__L_09_19\`
- **Database Folders**: R0, R1, R2, R3, R4, R5, R6, R7, R8 (Transbase rfiles)

---

## 🔧 Attempt #1: VirtualBox (Failed)
**Problem**: Architecture incompatibility on Mac
```bash
VBoxManage startvm "MERCEDES-WIS"
# Error: VBOX_E_PLATFORM_ARCH_NOT_SUPPORTED
```
**Result**: ❌ VirtualBox can't run 32-bit VMs on Apple Silicon/newer Macs

---

## 🔧 Attempt #2: QEMU Emulation (Partial Success)
**Method**: Used QEMU to emulate x86 architecture
```bash
qemu-system-i386 -hda /Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi -m 2048 -vga std
```
**Result**: ✅ Windows booted, WIS application ran
**Problem**: 
- Difficult to transfer files from VM to Mac
- No copy/paste between host and guest
- Windows eventually crashed and corrupted

---

## 🔧 Attempt #3: Forensic Extraction (Failed)
**Method**: Extract strings directly from VDI
```bash
strings /Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi > wis-strings.txt
```
**Result**: ❌ Only got system strings, not database content
- Found UI text: "Unimog", "procedure" 
- No actual repair procedures or parts data

---

## 🔧 Attempt #4: Mount VDI on Mac (Failed)
**Method**: Convert VDI to mountable format
```bash
qemu-img convert -f vdi -O raw MERCEDES.vdi mercedes.raw
hdiutil attach mercedes.raw
```
**Problem**: ❌ 54GB conversion took too long, process timed out

---

## 🔧 Attempt #5: DbVisualizer with Transbase JDBC (Failed)
**Method**: Connect to WIS database using DbVisualizer
1. ✅ Installed DbVisualizer
2. ❌ Could not find Transbase JDBC driver in Windows VM
3. ❌ Online sources for driver were broken/unavailable
4. ❌ PostgreSQL driver incompatible with Transbase

**Connection Details Attempted**:
```
URL: jdbc:transbase://localhost:2054/wisnet
User: tbadmin
Password: (none)
```

---

## 🔧 Attempt #6: Port Forwarding for Network Access (Failed)
**Method**: Forward WIS ports to host
```bash
qemu-system-i386 -hda MERCEDES.vdi -m 2048 \
  -netdev user,id=net0,hostfwd=tcp::2054-:2054,hostfwd=tcp::9000-:9000 \
  -device e1000,netdev=net0
```
**Result**: ❌ Ports forwarded but Transbase not accessible without JDBC driver

---

## 🔧 Attempt #7: Windows File Transfer Methods (Failed)
**Attempted**:
1. **Python SimpleHTTPServer**: Python not installed in Windows VM
2. **PowerShell Web Server**: Commands too complex to type manually
3. **Shared Folders**: QEMU doesn't support easy folder sharing
4. **WeTransfer Upload**: Would work but Windows IE outdated

---

## 🔧 Attempt #8: Direct File Copy in Windows (Partial)
**Method**: Copy database to C:\export in Windows
**Result**: ✅ User successfully copied files to C:\export
**Problem**: ❌ Files stuck inside VDI, couldn't extract to Mac

---

## 🔧 Attempt #9: 7-Zip Extraction (Failed)
```bash
brew install p7zip
7z x MERCEDES.vdi
```
**Result**: ❌ VDI format not supported by 7-zip

---

## 🔧 Attempt #10: TestDisk Recovery (Failed)
```bash
brew install testdisk
photorec MERCEDES.vdi
```
**Result**: ❌ Would take hours to scan 54GB

---

## 🔧 Attempt #11: Alternative Database Tools
**Tried**:
- **H2 Database Browser**: Doesn't support Transbase
- **SQuirreL SQL**: Would need JDBC driver
- **DbSchema**: Download failed

---

## 🔧 Attempt #12: Direct Binary Extraction (Limited Success)
```bash
grep -aob "rfile" MERCEDES.vdi > rfile-locations.txt
perl -ne 'print if /WISNET/i ... /END_RECORD/i' MERCEDES.vdi > wisnet-data.txt
```
**Result**: ⚠️ Found file signatures but not usable data

---

## 🔧 Attempt #13: VirtualBox Recovery (Failed)
**Found existing VirtualBox VMs**:
- WIS_TEMP_EXTRACT
- WIS-Extraction-VM
- MERCEDES-WIS

**Problem**: ❌ All VMs in "aborted" state, won't start

---

## 🔧 Attempt #14: Raw Disk Mount (Failed)
```bash
hdiutil attach -imagekey diskimage-class=CRawDiskImage -nomount MERCEDES.vdi
sudo mount -t ntfs /dev/disk6 /tmp/wis-mount
```
**Result**: ❌ Requires admin password, NTFS mount not working

---

## 🔧 Attempt #15: Windows Safe Mode (Failed)
**Method**: Boot Windows in Safe Mode to avoid crashes
**Result**: ❌ Windows kept crashing even in Safe Mode

---

## 📊 What We Learned

### ✅ Successful Parts:
1. Windows VM boots with QEMU
2. WIS application runs and shows data
3. Database exists at `C:\DB\WIS\wisnet\`
4. Database folders R0-R8 contain the data
5. Web interface runs on port 9000

### ❌ Blocking Issues:
1. **No Transbase JDBC driver available**
2. **Can't transfer files from QEMU VM to Mac**
3. **Windows VM becomes corrupted after multiple sessions**
4. **VDI file locked when VM crashes**
5. **No simple extraction tool exists**

---

## 🎯 What Actually Works (Community Methods)

### Method 1: DbVisualizer (Standard Method)
**Requirements**: 
- Transbase JDBC driver (must obtain from Mercedes or forums)
- Working Windows VM
- DbVisualizer or similar database client

### Method 2: Direct File Copy
**Requirements**:
- Stable Windows VM
- File transfer method (FTP, HTTP server, USB)
- Parser for Transbase rfiles

### Method 3: Community Downloads
- MHH AUTO Forum has extracted databases
- BenzWorld has CSV exports
- Mercedes forums share converted data

---

## 💡 Recommendations

### Immediate Solution:
1. **Download pre-extracted WIS data from Mercedes forums**
2. **Build website structure with sample data**
3. **Import real data when available**

### Long-term Solution:
1. **Get stable Windows environment** (real PC or better VM)
2. **Obtain Transbase JDBC driver** from forums
3. **Use DbVisualizer** to export to CSV/SQL
4. **Import to PostgreSQL**

### Alternative Approach:
1. **Find someone who has already extracted WIS**
2. **Trade/share data with Mercedes community**
3. **Use cloud-based WIS access services**

---

## 📝 Files Created During Process

### Scripts:
- `/scripts/wis-extraction/automated-wis-extraction.js`
- `/scripts/wis-extraction/extract-from-wis-web.sh`
- `/scripts/wis-extraction/wis-web-scraper.js`
- `/scripts/wis-extraction/direct-wis-extraction.py`
- `/scripts/wis-extraction/dbvis-wis-extraction.sh`
- `/scripts/wis-extraction/extract-vdi-files.sh`

### Documentation:
- `/docs/WIS-DBVISUALIZER-SIMPLE-GUIDE.md`
- `/scripts/wis-extraction/COMPLETE-WIS-EXTRACTION-PLAN.md`
- `/scripts/wis-extraction/SIMPLE-EXTRACTION-METHOD.md`
- `/scripts/wis-extraction/FINAL-SIMPLE-SOLUTION.md`
- `/scripts/wis-extraction/dbvis-connection-steps.md`

### Partial Extractions:
- `/Volumes/UnimogManuals/wis-database-direct-extract/wis-strings.txt` (843KB)
- `/Volumes/UnimogManuals/wis-forensic-recovery/strings-analysis/wis-strings.txt` (25MB)

---

## 🚨 Current Status

**Windows VM**: Corrupted, crashes on boot
**VDI File**: Intact but locked
**Database Location**: Known (`C:\DB\WIS\wisnet\`)
**Extraction**: Not completed
**Website**: Ready to receive data

---

## ✅ Next Steps

1. **Option A**: Find Transbase JDBC driver online
2. **Option B**: Get help from Mercedes community 
3. **Option C**: Use professional data recovery service
4. **Option D**: Build website with sample data first

---

## 📞 Community Resources

- **MHH AUTO Forum**: https://mhhauto.com/Thread-EPC-WIS-ASRA-direct-database-Connection
- **BenzWorld**: https://www.benzworld.org/forums/
- **Mercedes Subreddit**: r/mercedes_benz
- **Search Terms**: "WIS DbVisualizer export", "Transbase JDBC", "Mercedes WIS extraction"

---

*Generated: August 22, 2025*
*Total Time Spent: ~3 hours*
*Result: Pending - Need Transbase JDBC driver or community help*