# 📤 Windows to Mac File Transfer Guide

## Method 1: Using HFS (HTTP File Server) - EASIEST
This is the simplest method that always works!

### Step 1: Download HFS in Windows
1. **Open Internet Explorer** in Windows
2. **Go to**: `www.rejetto.com/hfs/`
3. **Download** HFS.exe (it's portable, no install needed)
4. **Save to Desktop**

### Step 2: Run HFS
1. **Double-click HFS.exe** on Desktop
2. **Windows Firewall popup**: Click "Allow Access"
3. HFS window opens

### Step 3: Add WIS Files to HFS
1. **In HFS window**, drag and drop these folders:
   - Navigate to `C:\DB\WIS\wisnet\190618193631__L_09_19\`
   - Drag the **R0, R1, R2... R8** folders into HFS window
   - Or click "Add Files" button and browse to add them

### Step 4: Start Server
1. HFS shows: **"Server is working on port 80"**
2. Note the IP address shown (like 10.0.2.15)

### Step 5: Download on Mac
Open Terminal on Mac and run:
```bash
cd /Volumes/UnimogManuals
mkdir wis-transfer
cd wis-transfer
wget -r http://10.0.2.15/
```

---

## Method 2: Using Python (If HFS doesn't work)

### In Windows:
1. **Download Python** if not installed:
   - Go to `python.org/downloads/release/python-2718/`
   - Download Windows installer
   - Install with defaults

2. **Open Command Prompt**
3. **Navigate to WIS folder**:
   ```
   cd C:\DB\WIS\wisnet\190618193631__L_09_19
   ```

4. **Start simple server**:
   ```
   python -m SimpleHTTPServer 8080
   ```

5. **On Mac**, download:
   ```bash
   wget -r http://localhost:8080/
   ```

---

## Method 3: Using ZIP and Split

### In Windows:
1. **Select all R folders** (R0-R8)
2. **Right-click** → Send to → Compressed folder
3. This creates a large ZIP file

### If ZIP is too large:
1. **Download 7-Zip**: `www.7-zip.org`
2. **Install 7-Zip**
3. **Right-click folders** → 7-Zip → Add to archive
4. **Set "Split to volumes"**: 1000M (1GB chunks)
5. Creates multiple files you can transfer one by one

---

## Method 4: Using FTP Server

### Quick FTP Server in Windows:
1. **Download FileZilla Server** (if needed)
2. Or use **Windows built-in FTP**:
   ```
   Control Panel → Programs → Turn Windows features on/off
   Check "Internet Information Services" → FTP Server
   ```

---

## Method 5: Direct Network Share (SMB)

### In Windows:
1. **Right-click** on wisnet folder
2. **Properties** → Sharing → Advanced Sharing
3. **Check** "Share this folder"
4. **Share name**: wisnet
5. **Permissions**: Everyone - Full Control

### On Mac:
1. **Finder** → Go → Connect to Server
2. **Enter**: `smb://10.0.2.15/wisnet`
3. **Login**: Admin / 12345
4. Copy files

---

## SIMPLEST: Just use HFS.exe
Most Windows users say HFS is the easiest:
1. Download HFS.exe
2. Drag files into it
3. Download from Mac with wget

Tell me when Windows loads and I'll help you through whichever method you prefer!