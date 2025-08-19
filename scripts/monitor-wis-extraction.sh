#!/bin/bash

# Monitor WIS VDI extraction progress

echo "🔧 WIS VDI Extraction Monitor"
echo "============================="
echo ""

EXTRACTION_DIR="/Volumes/UnimogManuals/wis-extraction"
LOG_FILE="$EXTRACTION_DIR/extraction.log"
TARGET_FILE="$EXTRACTION_DIR/MERCEDES.vdi"
EXPECTED_SIZE=$((53500000000))  # 53.5GB in bytes

# Check if extraction is running
if pgrep -f "7z.*Mercedes09.7z" > /dev/null; then
    echo "✅ Extraction is running (PID: $(pgrep -f '7z.*Mercedes09.7z'))"
else
    echo "⚠️  No extraction process found"
fi

echo ""

# Monitor progress
while true; do
    # Check if VDI file exists
    if [ -f "$TARGET_FILE" ]; then
        CURRENT_SIZE=$(stat -f%z "$TARGET_FILE" 2>/dev/null || echo 0)
        SIZE_GB=$(echo "scale=2; $CURRENT_SIZE / 1073741824" | bc)
        PROGRESS=$(echo "scale=1; $CURRENT_SIZE * 100 / $EXPECTED_SIZE" | bc)
        
        echo -ne "\rProgress: ${SIZE_GB}GB / 53.5GB (${PROGRESS}%) "
        
        # Check if extraction is complete
        if [ "$CURRENT_SIZE" -ge "$EXPECTED_SIZE" ]; then
            echo ""
            echo ""
            echo "✅ Extraction complete!"
            echo "File size: ${SIZE_GB}GB"
            break
        fi
    else
        echo -ne "\rWaiting for extraction to start... "
    fi
    
    # Check if process is still running
    if ! pgrep -f "7z.*Mercedes09.7z" > /dev/null; then
        echo ""
        echo ""
        if [ -f "$TARGET_FILE" ]; then
            FINAL_SIZE=$(stat -f%z "$TARGET_FILE")
            FINAL_GB=$(echo "scale=2; $FINAL_SIZE / 1073741824" | bc)
            if [ "$FINAL_SIZE" -ge "$EXPECTED_SIZE" ]; then
                echo "✅ Extraction completed successfully!"
                echo "Final size: ${FINAL_GB}GB"
            else
                echo "⚠️  Extraction stopped prematurely"
                echo "Current size: ${FINAL_GB}GB (expected 53.5GB)"
                echo "Check $LOG_FILE for errors"
            fi
        else
            echo "❌ Extraction failed - no VDI file found"
            echo "Check $LOG_FILE for errors"
        fi
        break
    fi
    
    sleep 5
done

echo ""
echo "Next steps:"
echo "1. Mount the VDI: VBoxManage storageattach MERCEDES --storagectl SATA --port 0 --device 0 --type hdd --medium '$TARGET_FILE'"
echo "2. Start the VM: VBoxManage startvm MERCEDES --type headless"
echo "3. Run extraction: node scripts/wis-extraction-master.js"