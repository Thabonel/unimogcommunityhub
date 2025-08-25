# WIS VM Troubleshooting Guide

## ⚠️ Current Issue
**Error**: "Failed to open a session for the virtual machine MERCEDES"
**VirtualBox Error**: NS_ERROR_FAILURE (0x80004005) - The VM session was aborted

## 🔧 Resolution Steps

### Option 1: Manual VirtualBox Fix (Recommended)

1. **Quit VirtualBox Completely**
   - Close all VirtualBox windows
   - Open Activity Monitor (Applications → Utilities)
   - Search for "VirtualBox" or "Virtual"
   - Force quit any VirtualBox processes

2. **Restart VirtualBox Services**
   ```bash
   sudo killall -9 VBoxSVC VBoxNetDHCP VBoxHeadless VirtualBoxVM
   sudo launchctl unload /Library/LaunchDaemons/org.virtualbox.startup.plist 2>/dev/null
   sudo launchctl load /Library/LaunchDaemons/org.virtualbox.startup.plist 2>/dev/null
   ```

3. **Clear VirtualBox Settings**
   - Open VirtualBox GUI
   - Go to File → Preferences
   - Click "Extensions" tab
   - Ensure extensions are loaded
   - Click OK

4. **Start VM from GUI**
   - Open VirtualBox application
   - Select "WIS_Mercedes" VM
   - Click the green "Start" arrow
   - Choose "Normal Start"

### Option 2: Alternative Access Methods

#### A. Direct VDI Import (Fresh Start)
1. Open VirtualBox GUI
2. Click "New" button
3. Name: "Mercedes_WIS_Clean"
4. Type: Microsoft Windows
5. Version: Windows 7 (32-bit)
6. Memory: 2048 MB
7. Hard disk: Use an existing virtual hard disk file
8. Browse to: `/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi`
9. Click Create
10. Start the new VM

#### B. VMware Fusion Alternative
If VirtualBox continues to fail:
1. Download VMware Fusion (free for personal use)
2. Convert VDI to VMDK:
   ```bash
   VBoxManage clonehd "/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi" \
                      "/Volumes/UnimogManuals/wis-extraction/MERCEDES.vmdk" \
                      --format VMDK
   ```
3. Import VMDK into VMware Fusion

#### C. Parallels Desktop Alternative
1. Install Parallels Desktop trial
2. Import existing VM
3. Select the VDI file directly

### Option 3: System-Level Fixes

#### Reset VirtualBox Kernel Extensions
```bash
# Check loaded extensions
kextstat | grep -i virtualbox

# Reload extensions (requires admin password)
sudo kextunload -b org.virtualbox.kext.VBoxDrv
sudo kextload -b org.virtualbox.kext.VBoxDrv
sudo kextload -b org.virtualbox.kext.VBoxNetFlt
sudo kextload -b org.virtualbox.kext.VBoxNetAdp
sudo kextload -b org.virtualbox.kext.VBoxUSB
```

#### macOS Security Settings
1. System Preferences → Security & Privacy
2. Click the lock to make changes
3. Allow apps from "Oracle America, Inc."
4. Restart Mac if prompted

### Option 4: Extract Without VM

Since the WIS content is in a proprietary database format within the Windows system, if VM access fails completely:

1. **Use Windows Machine**
   - Copy VDI to Windows computer
   - Install VirtualBox on Windows
   - Import and run VM there

2. **Boot Camp**
   - Install Windows via Boot Camp
   - Copy VDI to Windows partition
   - Run VM natively in Windows

3. **Cloud VM Service**
   - Upload VDI to cloud service (AWS, Azure)
   - Create Windows VM instance
   - Mount VDI and access WIS

## 📊 VDI Information

- **Location**: `/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi`
- **Size**: 54GB
- **Format**: VirtualBox Disk Image
- **OS**: Windows 7 32-bit
- **Content**: Mercedes WIS/EPC System

## 🎯 Once VM is Running

1. **Access WIS Application**
   - Look for WIS icon on desktop
   - Or check Start Menu → All Programs → Mercedes

2. **Navigate to Visual Content**
   - Wiring Diagrams
   - Exploded Views
   - Component Locations
   - Service Procedures

3. **Export Methods**
   - File → Print → Microsoft Print to PDF
   - Use Snipping Tool (Start → All Programs → Accessories)
   - Third-party screenshot tools if installed

## 💡 Quick Diagnostic Commands

```bash
# Check VirtualBox version
VBoxManage --version

# List all VMs
VBoxManage list vms

# Check VM info
VBoxManage showvminfo "WIS_Mercedes"

# Check disk info
VBoxManage showhdinfo "/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi"

# Check VirtualBox processes
ps aux | grep -i virtualbox

# Check system logs for VirtualBox errors
grep -i virtualbox /var/log/system.log | tail -20
```

## 🔍 Common Error Solutions

| Error | Solution |
|-------|----------|
| NS_ERROR_FAILURE | Restart VirtualBox services |
| VERR_VMX_NO_VMX | Enable virtualization in BIOS |
| VERR_ACCESS_DENIED | Check file permissions |
| VERR_ALREADY_EXISTS | Remove duplicate VM entries |
| Session locked | Kill VirtualBox processes |

## 📞 If All Else Fails

1. **Reinstall VirtualBox**
   - Download latest version from virtualbox.org
   - Uninstall current version
   - Restart Mac
   - Install fresh copy

2. **Contact Support**
   - VirtualBox Forums: forums.virtualbox.org
   - Check for known macOS issues

3. **Alternative Approach**
   - The WIS system stores images in a proprietary database
   - Without VM access, direct extraction is not possible
   - Consider finding a Windows machine for extraction

---

*Last Updated: 2025-01-20*
*Issue: VirtualBox session abort on macOS*