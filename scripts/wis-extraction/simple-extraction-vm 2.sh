#!/bin/bash

# Simple WIS extraction using Alpine Linux (lightweight)
# Community-proven qemu-nbd method in minimal VM

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${2}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Configuration
EXTERNAL_DRIVE="/Volumes/UnimogManuals"
VM_DIR="$EXTERNAL_DRIVE/alpine-extraction-vm"
VDI_FILE="$EXTERNAL_DRIVE/wis-extraction/MERCEDES.vdi"
EXTRACTION_DIR="$EXTERNAL_DRIVE/wis-database-extracted"

log "🏔️  Setting up Alpine Linux VM for WIS extraction" "$BLUE"
log "Lightweight approach: Alpine + qemu-nbd" "$BLUE"

# Clean up previous attempts
rm -rf "$VM_DIR"
mkdir -p "$VM_DIR"
mkdir -p "$EXTRACTION_DIR"

# Download Alpine Linux (much smaller - ~150MB)
ALPINE_ISO="$VM_DIR/alpine-virt-3.18.4-x86_64.iso"
if [ ! -f "$ALPINE_ISO" ]; then
    log "📥 Downloading Alpine Linux (150MB)..." "$YELLOW"
    curl -L "https://dl-cdn.alpinelinux.org/alpine/v3.18/releases/x86_64/alpine-virt-3.18.4-x86_64.iso" \
         -o "$ALPINE_ISO" \
         --progress-bar || {
        log "❌ Failed to download Alpine ISO" "$RED"
        exit 1
    }
    log "✅ Alpine ISO downloaded" "$GREEN"
fi

# Verify ISO file
if [ $(stat -f%z "$ALPINE_ISO" 2>/dev/null || echo 0) -lt 100000000 ]; then
    log "❌ Alpine ISO seems corrupted (too small)" "$RED"
    rm -f "$ALPINE_ISO"
    exit 1
fi

# VM Configuration
VM_NAME="WIS-Alpine-Extraction"
VM_DISK="$VM_DIR/alpine-disk.vdi"
VM_MEMORY=1024  # 1GB RAM (Alpine is lightweight)

log "🔧 Creating Alpine VM: $VM_NAME" "$YELLOW"

# Remove existing VM
VBoxManage unregistervm "$VM_NAME" --delete 2>/dev/null || true

# Create VM
VBoxManage createvm --name "$VM_NAME" --ostype "Linux26_64" --register --basefolder "$VM_DIR"

# Configure VM
VBoxManage modifyvm "$VM_NAME" \
    --memory $VM_MEMORY \
    --vram 16 \
    --cpus 2 \
    --boot1 dvd \
    --boot2 disk \
    --nic1 nat \
    --natpf1 "ssh,tcp,,2222,,22"

# Create disk
if [ ! -f "$VM_DISK" ]; then
    log "💿 Creating VM disk (5GB)..." "$YELLOW"
    VBoxManage createmedium disk --filename "$VM_DISK" --size 5120 --format VDI
fi

# Add storage controller
VBoxManage storagectl "$VM_NAME" --name "SATA" --add sata --controller IntelAhci

# Attach VM disk
VBoxManage storageattach "$VM_NAME" \
    --storagectl "SATA" \
    --port 0 \
    --device 0 \
    --type hdd \
    --medium "$VM_DISK"

# Attach Alpine ISO
VBoxManage storageattach "$VM_NAME" \
    --storagectl "SATA" \
    --port 1 \
    --device 0 \
    --type dvddrive \
    --medium "$ALPINE_ISO"

# Attach WIS VDI (read-only)
log "🔗 Attaching WIS VDI for extraction..." "$YELLOW"
VBoxManage storageattach "$VM_NAME" \
    --storagectl "SATA" \
    --port 2 \
    --device 0 \
    --type hdd \
    --medium "$VDI_FILE" \
    --mtype readonly

# Create extraction script for Alpine
cat > "$EXTRACTION_DIR/alpine-extraction.sh" << 'EOF'
#!/bin/bash
# Alpine Linux WIS extraction commands

echo "🏔️  Alpine Linux WIS Extraction"
echo "=============================="

echo "📦 Installing required packages..."
apk update
apk add qemu-utils ntfs-3g util-linux

echo "🔗 Loading NBD module..."
modprobe nbd max_part=8

echo "📊 Available disks:"
fdisk -l | grep "Disk /dev"

echo "🔍 The WIS VDI should appear as /dev/sdc"
echo "Connecting with qemu-nbd..."
qemu-nbd --connect=/dev/nbd0 /dev/sdc

echo "📋 NBD partitions:"
fdisk -l /dev/nbd0

echo "📁 Creating mount point..."
mkdir -p /mnt/wis

echo "🔧 Mounting Windows partition..."
echo "Trying partition 2 (main Windows partition)..."
mount -t ntfs-3g /dev/nbd0p2 /mnt/wis -o ro

if [ $? -eq 0 ]; then
    echo "✅ Windows partition mounted successfully!"
    
    echo "🔍 Searching for WIS database files..."
    echo ""
    echo "=== Transbase Database Files ==="
    find /mnt/wis -name "tbase.sys" -o -name "rfile*" 2>/dev/null | head -10
    
    echo ""
    echo "=== WIS Directories ==="
    find /mnt/wis -type d -iname "*wis*" -o -iname "*mercedes*" -o -iname "*workshop*" 2>/dev/null | head -10
    
    echo ""
    echo "=== WIS Executables ==="
    find /mnt/wis -name "*.exe" -iname "*wis*" 2>/dev/null | head -10
    
    echo ""
    echo "=== Root Directory Structure ==="
    ls -la /mnt/wis/ | head -20
    
    echo ""
    echo "🎯 FOUND WIS FILES - MANUAL COPY COMMANDS:"
    echo "=========================================="
    echo ""
    echo "1. Create extraction directory:"
    echo "   mkdir -p /tmp/wis-extracted"
    echo ""
    echo "2. Copy WIS directories (replace /path/to/ with actual path):"
    echo "   cp -r /mnt/wis/Program*/Mercedes*/WIS* /tmp/wis-extracted/"
    echo "   cp -r /mnt/wis/Mercedes* /tmp/wis-extracted/"
    echo "   cp -r /mnt/wis/WIS* /tmp/wis-extracted/"
    echo ""
    echo "3. Copy database files specifically:"
    echo "   find /mnt/wis -name 'tbase.sys' -exec cp {} /tmp/wis-extracted/ \\;"
    echo "   find /mnt/wis -name 'rfile*' -exec cp {} /tmp/wis-extracted/ \\;"
    echo ""
    echo "4. List what was extracted:"
    echo "   ls -la /tmp/wis-extracted/"
    echo ""
    echo "5. When done, cleanup:"
    echo "   umount /mnt/wis"
    echo "   qemu-nbd --disconnect /dev/nbd0"
    
else
    echo "❌ Failed to mount partition 2, trying partition 1..."
    mount -t ntfs-3g /dev/nbd0p1 /mnt/wis -o ro
    
    if [ $? -eq 0 ]; then
        echo "✅ Partition 1 mounted - checking contents..."
        ls -la /mnt/wis/
    else
        echo "❌ Could not mount any partition"
        echo "Manual partition check needed"
    fi
fi

echo ""
echo "💾 To save extracted files, you'll need to:"
echo "1. Set up shared folders in VirtualBox, or"
echo "2. Use SCP to copy files to host system, or" 
echo "3. Create a temporary file share"
EOF

chmod +x "$EXTRACTION_DIR/alpine-extraction.sh"

log "✅ Alpine VM created successfully!" "$GREEN"

log "\n🎯 ALPINE VM READY!" "$GREEN"
log "=================" "$GREEN"

log "\n📋 Start the VM:" "$BLUE"
log "VBoxManage startvm \"$VM_NAME\" --type gui" "$YELLOW"

log "\n🏔️  Alpine Setup (in VM console):" "$BLUE"
log "1. Login as root (no password initially)" "$YELLOW"
log "2. Setup network: setup-interfaces" "$YELLOW"
log "3. Start networking: service networking start" "$YELLOW"
log "4. Run the extraction script or commands manually" "$YELLOW"

log "\n📁 Created files:" "$BLUE"
log "   VM: $VM_DIR" "$YELLOW"
log "   Extraction script: $EXTRACTION_DIR/alpine-extraction.sh" "$YELLOW"

log "\n💡 Alpine is perfect for this task:" "$GREEN"
log "   - Only 150MB download" "$YELLOW"
log "   - Fast boot and minimal memory usage" "$YELLOW"
log "   - Has all the tools we need (qemu-utils, ntfs-3g)" "$YELLOW"
log "   - Can mount and extract WIS data efficiently" "$YELLOW"

log "\n🔧 The WIS VDI is attached as /dev/sdc (read-only for safety)" "$GREEN"
EOF