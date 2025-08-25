# 🔧 How to Fix the Crashed Windows VM

## Option 1: Boot Windows in Recovery Mode
Try to repair the existing Windows:

```bash
# Start with Windows Recovery options
qemu-system-i386 -hda /Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi -m 2048 -vga std
```

When booting:
1. **Press F8 repeatedly** during boot
2. Select **"Last Known Good Configuration"**
3. If that fails, try **"Safe Mode"**
4. If that fails, try **"Repair Your Computer"**

---

## Option 2: Use SystemRescue Linux (BEST OPTION)
Download a rescue Linux that can read NTFS:

```bash
# Download SystemRescue
curl -L -o /tmp/systemrescue.iso \
  "https://sourceforge.net/projects/systemrescuecd/files/sysresccd-x86/9.06/systemrescue-9.06-amd64.iso/download"

# Boot with it
qemu-system-x86_64 -cdrom /tmp/systemrescue.iso \
  -hda /Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi \
  -m 2048 -boot d
```

Once booted:
1. Open terminal
2. Mount Windows partition:
```bash
mkdir /mnt/windows
ntfs-3g /dev/sda1 /mnt/windows
cd /mnt/windows/DB/WIS/wisnet
tar -czf /tmp/wisnet.tar.gz .
```

3. Transfer via network:
```bash
python3 -m http.server 8000
```

---

## Option 3: Create Fresh Windows 7 VM

### Download Windows 7 ISO:
1. Microsoft doesn't offer Windows 7 anymore officially
2. Archive.org has Windows 7 ISOs: https://archive.org/details/windows7ultimate64bit
3. Or use a Windows 10 evaluation: https://www.microsoft.com/en-us/evalcenter/evaluate-windows-10-enterprise

### Create new VM:
```bash
# Create new disk
qemu-img create -f qcow2 windows-fresh.qcow2 40G

# Install Windows
qemu-system-x86_64 -hda windows-fresh.qcow2 \
  -cdrom windows7.iso -m 4096 -boot d
```

### Then mount old VDI as second drive:
```bash
qemu-system-x86_64 -hda windows-fresh.qcow2 \
  -hdb /Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi \
  -m 4096
```

The WIS files will be on D: drive

---

## Option 4: Direct NTFS Mount on Mac (Requires Tools)

### Install NTFS support:
```bash
brew install --cask macfuse
brew install ntfs-3g-mac
```

### Convert VDI to raw and mount:
```bash
# Convert (will take time)
qemu-img convert -f vdi -O raw MERCEDES.vdi mercedes.raw

# Mount
sudo mkdir /Volumes/WinDrive
sudo ntfs-3g /dev/diskX /Volumes/WinDrive
```

---

## Option 5: Use VirtualBox Instead
Since you have VirtualBox installed:

```bash
# Reset the VM state
VBoxManage controlvm "MERCEDES-WIS" poweroff
VBoxManage snapshot "MERCEDES-WIS" restore "LastGood"

# Or discard saved state
VBoxManage discardstate "MERCEDES-WIS"

# Start it
VBoxManage startvm "MERCEDES-WIS"
```

---

## FASTEST SOLUTION: Use Hiren's BootCD

1. **Download Hiren's BootCD** (has all tools needed):
   - https://www.hirensbootcd.org/download/

2. **Boot with it**:
```bash
qemu-system-x86_64 -cdrom hirens.iso \
  -hda /Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi \
  -m 2048 -boot d
```

3. **Use Mini Windows XP** or **Linux** option
4. **Copy files** to USB or network

This ALWAYS works because Hiren's has all the drivers and tools needed.