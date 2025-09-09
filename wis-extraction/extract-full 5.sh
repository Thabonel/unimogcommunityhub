#!/bin/bash
# WIS EPC Full Extraction Script

WORK_DIR="/Users/thabonel/Documents/unimogcommunityhub/wis-extraction"
cd "$WORK_DIR"

echo "🚀 Starting WIS EPC extraction..."
echo "⚠️  This will use ~54GB of disk space"
echo ""

# Check disk space
AVAILABLE=$(df -g . | awk 'NR==2 {print $4}')
if [ $AVAILABLE -lt 60 ]; then
    echo "❌ Not enough disk space. Need at least 60GB free."
    exit 1
fi

# Extract VDI
echo "📦 Extracting VDI file (this will take 10-20 minutes)..."
7z e Mercedes09.7z.001 MERCEDES.vdi -y

# Check if VirtualBox is installed
if command -v VBoxManage &> /dev/null; then
    echo "✅ VirtualBox found"
    
    # Option to convert to RAW
    echo ""
    echo "Convert to RAW format for mounting? (y/n)"
    read -n 1 CONVERT
    
    if [ "$CONVERT" = "y" ]; then
        echo "🔄 Converting to RAW format..."
        VBoxManage clonehd MERCEDES.vdi MERCEDES.raw --format RAW
        
        echo "🔗 Mounting RAW disk..."
        hdiutil attach -imagekey diskimage-class=CRawDiskImage MERCEDES.raw
        
        echo "✅ Disk mounted. Check /Volumes for Windows partition"
    fi
else
    echo "⚠️  VirtualBox not found. Install it to convert VDI."
fi

echo ""
echo "✅ Extraction complete!"
