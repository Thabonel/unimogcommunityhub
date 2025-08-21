#!/bin/bash

#############################################################################
# VirtualBox-based WIS Extraction
# Uses VirtualBox tools to access the VDI directly
#############################################################################

set -e

VDI_PATH="/Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi"
EXTRACT_DIR="/Volumes/UnimogManuals/wis-extracted"
VM_NAME="WIS_TEMP_EXTRACT"

echo "🔧 VirtualBox-based WIS Extraction"
echo "=================================="

# Clean up any existing VM
echo "⏳ Cleaning up existing VMs..."
VBoxManage unregistervm "$VM_NAME" --delete 2>/dev/null || true

# Create temporary VM
echo "⏳ Creating temporary VM..."
VBoxManage createvm --name "$VM_NAME" --ostype Windows10_64 --register

# Add storage controller
echo "⏳ Adding storage controller..."
VBoxManage storagectl "$VM_NAME" --name "SATA" --add sata --controller IntelAhci

# Attach VDI
echo "⏳ Attaching VDI..."
VBoxManage storageattach "$VM_NAME" --storagectl "SATA" --port 0 --device 0 --type hdd --medium "$VDI_PATH"

# Get partition information
echo ""
echo "📊 VDI Information:"
VBoxManage showmediuminfo "$VDI_PATH"

# Try using VBoxManage guestcontrol (won't work without running VM, but shows structure)
echo ""
echo "💡 To extract files, you would need to:"
echo "1. Start the VM: VBoxManage startvm $VM_NAME"
echo "2. Set up guest additions"
echo "3. Use shared folders to copy files out"
echo ""
echo "OR alternatively:"
echo "1. Use a file recovery tool like PhotoRec"
echo "2. Or use a Linux live CD to access the NTFS filesystem"

# For now, let's try using strings to extract some data
echo ""
echo "🔍 Attempting to extract MDB file paths from VDI..."
mkdir -p "$EXTRACT_DIR/discovered-paths"

# Search for MDB-related strings in the VDI
strings "$VDI_PATH" | grep -i "\.mdb" | head -20 > "$EXTRACT_DIR/discovered-paths/mdb-paths.txt" || true
strings "$VDI_PATH" | grep -i "mercedes" | head -20 > "$EXTRACT_DIR/discovered-paths/mercedes-strings.txt" || true
strings "$VDI_PATH" | grep -i "procedure" | head -20 > "$EXTRACT_DIR/discovered-paths/procedure-strings.txt" || true

echo "✅ String extraction complete. Check:"
echo "   - $EXTRACT_DIR/discovered-paths/mdb-paths.txt"
echo "   - $EXTRACT_DIR/discovered-paths/mercedes-strings.txt"  
echo "   - $EXTRACT_DIR/discovered-paths/procedure-strings.txt"

# Cleanup
VBoxManage unregistervm "$VM_NAME" --delete 2>/dev/null || true

echo ""
echo "💡 Next steps:"
echo "1. Review extracted strings to understand data structure"
echo "2. Consider using sample data while working on mounting solution"
echo "3. Or try mounting on a Linux system with better NTFS support"