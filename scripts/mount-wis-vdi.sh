#!/bin/bash

# Mount WIS VDI for extraction
echo "🔧 WIS VDI Mount Script"
echo "======================"
echo ""

VDI_PATH="/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi"
VM_NAME="MERCEDES_WIS"
MOUNT_POINT="/Volumes/WIS_DRIVE"

# Check if VDI exists
if [ ! -f "$VDI_PATH" ]; then
    echo "❌ VDI not found at: $VDI_PATH"
    exit 1
fi

echo "✅ Found VDI: $VDI_PATH"
echo "   Size: $(ls -lh "$VDI_PATH" | awk '{print $5}')"

# Check if VM already exists
if VBoxManage list vms | grep -q "\"$VM_NAME\""; then
    echo "⚠️  VM already exists. Removing old VM..."
    VBoxManage unregistervm "$VM_NAME" --delete 2>/dev/null
fi

# Create new VM
echo ""
echo "Creating VirtualBox VM..."
VBoxManage createvm --name "$VM_NAME" --ostype Windows7_64 --register

# Add storage controller
VBoxManage storagectl "$VM_NAME" --name "SATA Controller" --add sata --controller IntelAhci

# Attach VDI
echo "Attaching VDI to VM..."
VBoxManage storageattach "$VM_NAME" --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium "$VDI_PATH"

# Try to mount using different methods
echo ""
echo "Attempting to mount VDI..."

# Method 1: Using VirtualBox's internal tools
echo "Method 1: VBoxManage mount..."
VBoxManage guestproperty enumerate "$VM_NAME" 2>/dev/null

# Method 2: Convert to DMG for macOS mounting
echo ""
echo "Method 2: Converting to DMG for macOS..."
DMG_PATH="/Volumes/UnimogManuals/wis-extraction/MERCEDES.dmg"

if [ -f "$DMG_PATH" ]; then
    echo "DMG already exists, skipping conversion"
else
    echo "Converting VDI to raw format first..."
    RAW_PATH="/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw"
    VBoxManage clonemedium "$VDI_PATH" "$RAW_PATH" --format RAW
    
    echo "Converting raw to DMG..."
    hdiutil convert "$RAW_PATH" -format UDRO -o "$DMG_PATH"
    rm "$RAW_PATH"
fi

# Mount the DMG
echo ""
echo "Mounting DMG..."
hdiutil attach "$DMG_PATH" -readonly -mount required

echo ""
echo "✅ Mount complete. Check /Volumes for mounted drives."
echo ""
echo "Available volumes:"
ls -la /Volumes/

echo ""
echo "To unmount later:"
echo "  hdiutil detach /Volumes/[mounted_name]"
echo "  VBoxManage unregistervm $VM_NAME --delete"