#!/bin/bash

# Direct Forensic Extraction of WIS Database from RAW/VDI Image
# This script extracts the Transbase database files directly from the disk image
# without needing to boot Windows

set -e

# Configuration
RAW_FILE="/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw"
OUTPUT_DIR="/Volumes/UnimogManuals/wis-forensic-extract"
MOUNT_POINT="/tmp/wis_mount"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== WIS Database Forensic Extraction ===${NC}"
echo "This script extracts WIS database files directly from the disk image"
echo ""

# Check if raw file exists
if [ ! -f "$RAW_FILE" ]; then
    echo -e "${YELLOW}RAW file not found. Converting VDI to RAW...${NC}"
    VDI_FILE="/Volumes/UnimogManuals/MERCEDES.vdi"
    if [ -f "$VDI_FILE" ]; then
        qemu-img convert -f vdi -O raw "$VDI_FILE" "$RAW_FILE"
        echo -e "${GREEN}VDI converted to RAW successfully${NC}"
    else
        echo -e "${RED}Neither RAW nor VDI file found. Please check paths.${NC}"
        exit 1
    fi
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"
mkdir -p "$MOUNT_POINT"

echo -e "${YELLOW}Step 1: Mounting NTFS partition from RAW image...${NC}"

# Find NTFS partition offset using fdisk
echo "Analyzing partition table..."
PARTITION_INFO=$(fdisk -l "$RAW_FILE" 2>/dev/null | grep -E "NTFS|Microsoft" | head -1)
if [ -z "$PARTITION_INFO" ]; then
    echo -e "${RED}No NTFS partition found. Trying alternative method...${NC}"
    # Try with parted
    PARTITION_INFO=$(parted "$RAW_FILE" unit B print 2>/dev/null | grep ntfs | head -1)
fi

# Extract partition offset
SECTOR_SIZE=512
if echo "$PARTITION_INFO" | grep -q "^/dev"; then
    # fdisk format
    START_SECTOR=$(echo "$PARTITION_INFO" | awk '{print $2}')
    OFFSET=$((START_SECTOR * SECTOR_SIZE))
else
    # parted format
    OFFSET=$(echo "$PARTITION_INFO" | awk '{print $2}' | sed 's/B//')
fi

echo "NTFS partition found at offset: $OFFSET"

# Mount the NTFS partition as read-only
echo -e "${YELLOW}Step 2: Mounting NTFS partition...${NC}"
sudo mount -t ntfs -o ro,offset=$OFFSET,loop "$RAW_FILE" "$MOUNT_POINT" 2>/dev/null || {
    echo -e "${YELLOW}Standard mount failed. Trying with ntfs-3g...${NC}"
    sudo mount -t ntfs-3g -o ro,offset=$OFFSET,loop "$RAW_FILE" "$MOUNT_POINT"
}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Partition mounted successfully${NC}"
else
    echo -e "${RED}Failed to mount partition. Trying forensic carving...${NC}"
    # Fall back to forensic carving
    echo -e "${YELLOW}Using testdisk/photorec for forensic recovery...${NC}"
    cd "$OUTPUT_DIR"
    photorec /d "$OUTPUT_DIR/recovered" /cmd "$RAW_FILE" partition_none,options,mode_ext2,fileopt,everything,enable,search
fi

echo -e "${YELLOW}Step 3: Extracting WIS database files...${NC}"

# Known WIS database locations
WIS_PATHS=(
    "DB/WIS/wisnet"
    "db/wis/wisnet"
    "Program Files/EWA/database"
    "Program Files (x86)/EWA/database"
    "EWA/database"
)

# Search for rfile* files
for path in "${WIS_PATHS[@]}"; do
    FULL_PATH="$MOUNT_POINT/$path"
    if [ -d "$FULL_PATH" ]; then
        echo -e "${GREEN}Found WIS database at: $FULL_PATH${NC}"
        
        # Copy all rfile* files
        echo "Copying database files..."
        cp -r "$FULL_PATH"/* "$OUTPUT_DIR/" 2>/dev/null || true
        
        # Also look for related files
        find "$FULL_PATH" -type f \( -name "rfile*" -o -name "*.tbd" -o -name "*.tbx" -o -name "*.idx" \) -exec cp {} "$OUTPUT_DIR/" \; 2>/dev/null || true
    fi
done

# Alternative: Search entire mounted filesystem for rfile* files
echo -e "${YELLOW}Step 4: Comprehensive search for database files...${NC}"
find "$MOUNT_POINT" -type f -name "rfile*" 2>/dev/null | while read -r file; do
    echo "Found: $file"
    cp "$file" "$OUTPUT_DIR/" 2>/dev/null || true
done

# Also search for Transbase executables and tools
echo -e "${YELLOW}Step 5: Extracting Transbase tools...${NC}"
find "$MOUNT_POINT" -type f \( -name "*.exe" -o -name "*.dll" \) -path "*/TransBase*" 2>/dev/null | while read -r file; do
    echo "Found tool: $file"
    mkdir -p "$OUTPUT_DIR/tools"
    cp "$file" "$OUTPUT_DIR/tools/" 2>/dev/null || true
done

# Unmount
echo -e "${YELLOW}Step 6: Cleaning up...${NC}"
sudo umount "$MOUNT_POINT" 2>/dev/null || true
rmdir "$MOUNT_POINT" 2>/dev/null || true

echo -e "${GREEN}=== Extraction Complete ===${NC}"
echo "Files extracted to: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Check $OUTPUT_DIR for rfile* database files"
echo "2. Run the parser script to convert data to SQL"
echo "3. Import to Supabase"

# List what was extracted
echo ""
echo -e "${YELLOW}Extracted files:${NC}"
ls -lh "$OUTPUT_DIR" 2>/dev/null | head -20

# Check file sizes
TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" 2>/dev/null | cut -f1)
echo ""
echo -e "${GREEN}Total extracted size: $TOTAL_SIZE${NC}"