#!/bin/bash

# Setup Linux VM for WIS extraction using community-proven method
# Based on Mercedes forum research and qemu-nbd approach

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
VM_DIR="$EXTERNAL_DRIVE/ubuntu-extraction-vm"
VDI_FILE="$EXTERNAL_DRIVE/wis-extraction/MERCEDES.vdi"
EXTRACTION_DIR="$EXTERNAL_DRIVE/wis-database-extracted"

log "🐧 Setting up Linux VM for WIS extraction" "$BLUE"
log "Community-proven method: Ubuntu + qemu-nbd + NTFS mounting" "$BLUE"

# Check if we have VirtualBox
if ! command -v VBoxManage &> /dev/null; then
    log "❌ VirtualBox not found. Please install VirtualBox first." "$RED"
    exit 1
fi

# Create VM directory
mkdir -p "$VM_DIR"
mkdir -p "$EXTRACTION_DIR"

log "📁 VM Directory: $VM_DIR" "$YELLOW"
log "📁 Extraction Directory: $EXTRACTION_DIR" "$YELLOW"

# Check if Ubuntu ISO exists, if not download
UBUNTU_ISO="$VM_DIR/ubuntu-22.04-server-amd64.iso"
if [ ! -f "$UBUNTU_ISO" ]; then
    log "📥 Downloading Ubuntu Server 22.04..." "$YELLOW"
    log "💡 This will download ~1.5GB - please wait..." "$YELLOW"
    
    # Download Ubuntu Server (minimal)
    curl -L "https://releases.ubuntu.com/22.04/ubuntu-22.04.3-live-server-amd64.iso" \
         -o "$UBUNTU_ISO" \
         --progress-bar || {
        log "❌ Failed to download Ubuntu ISO" "$RED"
        exit 1
    }
    
    log "✅ Ubuntu ISO downloaded" "$GREEN"
fi

# VM Configuration
VM_NAME="WIS-Extraction-VM"
VM_DISK="$VM_DIR/ubuntu-disk.vdi"
VM_MEMORY=2048  # 2GB RAM
VM_VRAM=128     # 128MB video RAM

log "🔧 Creating VirtualBox VM: $VM_NAME" "$YELLOW"

# Remove existing VM if it exists
VBoxManage unregistervm "$VM_NAME" --delete 2>/dev/null || true

# Create new VM
VBoxManage createvm --name "$VM_NAME" --ostype "Ubuntu_64" --register --basefolder "$VM_DIR"

# Configure VM settings
VBoxManage modifyvm "$VM_NAME" \
    --memory $VM_MEMORY \
    --vram $VM_VRAM \
    --cpus 2 \
    --boot1 dvd \
    --boot2 disk \
    --nic1 nat \
    --natpf1 "ssh,tcp,,2222,,22" \
    --clipboard-mode bidirectional

# Create VM disk if it doesn't exist
if [ ! -f "$VM_DISK" ]; then
    log "💿 Creating VM disk (20GB)..." "$YELLOW"
    VBoxManage createmedium disk --filename "$VM_DISK" --size 20480 --format VDI
fi

# Attach storage
log "🔗 Attaching storage devices..." "$YELLOW"

# Add SATA controller
VBoxManage storagectl "$VM_NAME" --name "SATA" --add sata --controller IntelAhci

# Attach VM disk
VBoxManage storageattach "$VM_NAME" \
    --storagectl "SATA" \
    --port 0 \
    --device 0 \
    --type hdd \
    --medium "$VM_DISK"

# Attach Ubuntu ISO
VBoxManage storageattach "$VM_NAME" \
    --storagectl "SATA" \
    --port 1 \
    --device 0 \
    --type dvddrive \
    --medium "$UBUNTU_ISO"

# Attach WIS VDI as additional disk (read-only for safety)
log "🔗 Attaching WIS VDI file for extraction..." "$YELLOW"
VBoxManage storageattach "$VM_NAME" \
    --storagectl "SATA" \
    --port 2 \
    --device 0 \
    --type hdd \
    --medium "$VDI_FILE" \
    --mtype readonly

log "✅ VM created successfully!" "$GREEN"

# Create startup script for inside the VM
cat > "$EXTRACTION_DIR/extraction-commands.sh" << 'EOF'
#!/bin/bash
# Commands to run inside the Ubuntu VM for WIS extraction

echo "🔧 Installing required packages..."
sudo apt update
sudo apt install -y qemu-utils ntfs-3g tree

echo "🔗 Setting up NBD module..."
sudo modprobe nbd max_part=8

echo "📊 Checking available disks..."
sudo fdisk -l

echo "🔍 Looking for WIS VDI (should be /dev/sdc)..."
sudo qemu-nbd --connect=/dev/nbd0 /dev/sdc

echo "📋 Listing NBD partitions..."
sudo fdisk -l /dev/nbd0

echo "📁 Creating mount point..."
sudo mkdir -p /mnt/wis

echo "🔧 Mounting Windows partition (usually partition 2)..."
sudo mount -t ntfs-3g /dev/nbd0p2 /mnt/wis -o ro

echo "🔍 Searching for WIS files..."
echo "Looking for Transbase database files..."
sudo find /mnt/wis -name "*.sys" -o -name "rfile*" -o -name "tbase*" 2>/dev/null | head -20

echo "Looking for WIS directories..."
sudo find /mnt/wis -type d -iname "*wis*" -o -iname "*mercedes*" -o -iname "*workshop*" 2>/dev/null | head -10

echo "Looking for WIS executables..."
sudo find /mnt/wis -name "*.exe" -iname "*wis*" 2>/dev/null | head -10

echo "📂 Directory structure in /mnt/wis:"
sudo ls -la /mnt/wis/ 2>/dev/null | head -20

echo ""
echo "🎯 MANUAL EXTRACTION COMMANDS:"
echo "1. Copy WIS directory:"
echo "   sudo cp -r /mnt/wis/path/to/WIS /home/ubuntu/wis-extracted/"
echo ""
echo "2. Copy specific database files:"
echo "   sudo cp /mnt/wis/path/to/database/tbase.sys /home/ubuntu/wis-extracted/"
echo "   sudo cp /mnt/wis/path/to/database/rfile* /home/ubuntu/wis-extracted/"
echo ""
echo "3. When done, cleanup:"
echo "   sudo umount /mnt/wis"
echo "   sudo qemu-nbd --disconnect /dev/nbd0"
echo ""
echo "4. Copy extracted files to shared folder (if available)"
EOF

chmod +x "$EXTRACTION_DIR/extraction-commands.sh"

# Create post-extraction script
cat > "$EXTRACTION_DIR/process-extracted-data.sh" << 'EOF'
#!/bin/bash
# Process extracted WIS data for import to PostgreSQL

echo "🔍 Processing extracted WIS data..."

WIS_DIR="/home/ubuntu/wis-extracted"

if [ -d "$WIS_DIR" ]; then
    echo "✅ WIS data found in $WIS_DIR"
    
    echo "📊 File inventory:"
    find "$WIS_DIR" -type f | sort
    
    echo ""
    echo "🔧 Looking for Transbase files:"
    find "$WIS_DIR" -name "tbase.sys" -o -name "rfile*"
    
    echo ""
    echo "🔧 Looking for WIS executables:"
    find "$WIS_DIR" -name "*.exe"
    
    echo ""
    echo "📋 Next steps:"
    echo "1. Install Transbase or use tbexport if available"
    echo "2. Export database tables to CSV format"
    echo "3. Copy CSV files to host system"
    echo "4. Import to PostgreSQL database"
    
else
    echo "❌ No WIS data found. Check extraction commands."
fi
EOF

chmod +x "$EXTRACTION_DIR/process-extracted-data.sh"

log "\n🎯 VM SETUP COMPLETE!" "$GREEN"
log "===================" "$GREEN"

log "\n📋 Next Steps:" "$BLUE"
log "1. Start the VM:" "$YELLOW"
log "   VBoxManage startvm \"$VM_NAME\" --type gui" "$YELLOW"

log "\n2. Install Ubuntu Server (basic installation)" "$YELLOW"
log "   - Choose minimal installation" "$YELLOW"
log "   - Set username: ubuntu, password: ubuntu" "$YELLOW"
log "   - Install OpenSSH server for easier access" "$YELLOW"

log "\n3. After Ubuntu installation, run extraction script:" "$YELLOW"
log "   cd /home/ubuntu" "$YELLOW"
log "   # Copy from host or recreate the extraction script" "$YELLOW"

log "\n4. Alternative - SSH access:" "$YELLOW"
log "   ssh -p 2222 ubuntu@localhost" "$YELLOW"
log "   (After Ubuntu is installed and SSH is configured)" "$YELLOW"

log "\n📁 Files created:" "$BLUE"
log "   VM: $VM_DIR/$VM_NAME" "$YELLOW"
log "   Extraction script: $EXTRACTION_DIR/extraction-commands.sh" "$YELLOW"
log "   Processing script: $EXTRACTION_DIR/process-extracted-data.sh" "$YELLOW"

log "\n🔧 VM Details:" "$BLUE"
log "   Name: $VM_NAME" "$YELLOW"
log "   Memory: ${VM_MEMORY}MB" "$YELLOW"
log "   Disk: $VM_DISK" "$YELLOW"
log "   WIS VDI: Attached as /dev/sdc (read-only)" "$YELLOW"

log "\n💡 The VM has access to the WIS VDI file and can mount it using qemu-nbd tools" "$GREEN"
log "This follows the exact community-proven method for WIS extraction!" "$GREEN"
EOF