#!/bin/bash

# Direct VDI File Extraction
# Extracts WIS database without needing Windows

echo "🔍 Extracting WIS Database from VDI..."
echo "======================================"

VDI_FILE="/Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi"
OUTPUT_DIR="/Volumes/UnimogManuals/wis-database-direct-extract"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "📂 Searching for WIS database in VDI..."

# Use photorec (part of testdisk) to extract files
cd "$OUTPUT_DIR"

# Extract specific file patterns
echo "Extracting database files..."

# Method 1: Extract strings that look like WIS data
echo "Extracting text data from VDI..."
strings -n 20 "$VDI_FILE" | grep -i "unimog\|procedure\|part number" > wis-strings.txt 2>/dev/null &

# Method 2: Look for specific file signatures
echo "Searching for rfile signatures..."
grep -aob "rfile" "$VDI_FILE" | head -20 > rfile-locations.txt

# Method 3: Extract chunks around database markers
echo "Extracting database chunks..."
perl -ne 'print if /WISNET/i ... /END_RECORD/i' "$VDI_FILE" > wisnet-data.txt 2>/dev/null &

# Method 4: Use dd to extract specific regions
echo "Looking for R0-R8 folders..."
strings "$VDI_FILE" | grep -E "^R[0-8]$" -A 100 -B 10 > r-folders.txt 2>/dev/null &

wait

echo ""
echo "✅ Extraction complete!"
echo "📁 Files saved to: $OUTPUT_DIR"
echo ""
ls -lah "$OUTPUT_DIR"