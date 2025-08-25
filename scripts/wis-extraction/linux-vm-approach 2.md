# Linux VM Approach for WIS Extraction
## Based on Community Research Findings

The Mercedes community has confirmed that **Linux VM with qemu-nbd tools** is a proven method for WIS VDI extraction when OSFMount (Windows) is not available.

## Community-Proven Linux VM Method

### Step 1: Create Ubuntu VM on External Drive
```bash
# Download Ubuntu Server ISO (minimal)
# Create VM with sufficient disk space on external drive
# VM Location: /Volumes/UnimogManuals/ubuntu-vm/
```

### Step 2: Install Required Tools in Ubuntu VM
```bash
sudo apt update
sudo apt install qemu-utils
sudo apt install ntfs-3g
sudo modprobe nbd max_part=8
```

### Step 3: Mount VDI with qemu-nbd
```bash
# Inside Ubuntu VM
sudo qemu-nbd --connect=/dev/nbd0 /path/to/MERCEDES.vdi
sudo fdisk -l /dev/nbd0  # List partitions
sudo mkdir /mnt/wis
sudo mount /dev/nbd0p2 /mnt/wis  # Mount main Windows partition
```

### Step 4: Extract WIS Database Files
```bash
# Look for Transbase files
find /mnt/wis -name "*.sys" -o -name "rfile*" -o -name "tbase*"
find /mnt/wis -type d -iname "*wis*" -o -iname "*mercedes*"

# Copy entire WIS directories
cp -r /mnt/wis/path/to/WIS /external/drive/wis-extraction/
```

### Step 5: Export Transbase Data
```bash
# Use Transbase CLI tools (if available)
tbexport -database WIS -table PROCEDURES -format CSV
tbexport -database WIS -table PARTS -format CSV
tbexport -database WIS -table BULLETINS -format CSV
```

## Alternative: Docker Approach
Based on community feedback, Docker can also run the extraction tools:

```bash
# Run Ubuntu container with VDI access
docker run -it --privileged \
  -v /Volumes/UnimogManuals:/data \
  ubuntu:latest bash

# Install tools inside container
apt update && apt install qemu-utils ntfs-3g
```

## Expected File Structure (from Community Reports)

```
WIS Installation/
├── Database/
│   ├── tbase.sys          # Main Transbase system file
│   ├── rfile000           # Transbase data file 1
│   ├── rfile001           # Transbase data file 2
│   └── ...                # Additional rfiles (up to rfile008)
├── WIS.exe                # Main WIS application
├── EWA-net.exe           # EPC application
└── Documentation/
```

## Community Resources Referenced:
- **Scribd Installation Guides**: Step-by-step VDI mounting with Linux
- **benzworld.org**: Technical discussions on Transbase extraction
- **German Mercedes Forums**: Native language guides with detailed steps

## Success Indicators:
- ✅ VDI mounts successfully with qemu-nbd
- ✅ NTFS partition is readable
- ✅ WIS directory structure found
- ✅ Transbase files (tbase.sys, rfile000+) located
- ✅ Database export tools functional

## Next Steps After Successful Extraction:
1. Copy all Transbase database files to host system
2. Set up Transbase environment for data export
3. Export tables to CSV format
4. Import CSV data to PostgreSQL tables
5. Implement search functionality in web interface

This approach bypasses all macOS NTFS mounting limitations and follows the exact method used by the Mercedes diagnostic community.