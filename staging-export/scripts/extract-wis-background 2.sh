#!/bin/bash

# WIS VDI Background Extraction Script
# This script runs the extraction in the background and logs progress

EXTRACT_DIR="/Volumes/EDIT/wis-extraction"
LOG_FILE="$EXTRACT_DIR/extraction.log"

echo "🚀 Starting WIS VDI background extraction..." | tee "$LOG_FILE"
echo "📅 Started at: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Function to check progress
check_progress() {
    if [ -f "$EXTRACT_DIR/MERCEDES.vdi" ]; then
        SIZE=$(du -sh "$EXTRACT_DIR/MERCEDES.vdi" | cut -f1)
        echo "📊 Current size: $SIZE" | tee -a "$LOG_FILE"
    fi
}

# Start extraction
cd "$EXTRACT_DIR"
echo "📦 Extracting MERCEDES.vdi (53.5GB)..." | tee -a "$LOG_FILE"
echo "⏱️  This will take 20-30 minutes" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Run extraction with progress monitoring
7z x Mercedes09.7z.001 MERCEDES.vdi -y 2>&1 | while IFS= read -r line; do
    echo "$line" >> "$LOG_FILE"
    # Check for progress updates
    if [[ "$line" =~ "Extracting" ]] || [[ "$line" =~ "%" ]]; then
        echo "$line"
    fi
done

# Check final result
if [ $? -eq 0 ]; then
    echo "" | tee -a "$LOG_FILE"
    echo "✅ Extraction completed successfully!" | tee -a "$LOG_FILE"
    check_progress
else
    echo "" | tee -a "$LOG_FILE"
    echo "❌ Extraction failed!" | tee -a "$LOG_FILE"
fi

echo "📅 Finished at: $(date)" | tee -a "$LOG_FILE"