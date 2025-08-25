#!/bin/bash

#############################################################################
# Quick MDB Extraction Script
# Fastest way to get searchable WIS data (30 minutes)
#############################################################################

set -e

# Configuration - EXTERNAL DRIVES ONLY
VDI_PATH="/Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi"
EXTRACT_DIR="/Volumes/UnimogManuals/wis-extracted"
PROJECT_ROOT="/Users/thabonel/Documents/unimogcommunityhub"

# SAFETY CHECK: Ensure we're working on external drives only
if [[ ! "$EXTRACT_DIR" =~ ^/Volumes/.* ]]; then
    echo -e "${RED}❌ SAFETY VIOLATION: Extract directory must be on external drive (/Volumes/)${NC}"
    echo "   Current path: $EXTRACT_DIR"
    exit 1
fi

if [[ ! "$VDI_PATH" =~ ^/Volumes/.* ]]; then
    echo -e "${RED}❌ SAFETY VIOLATION: VDI must be on external drive (/Volumes/)${NC}"
    echo "   Current path: $VDI_PATH"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create directories first
mkdir -p "$EXTRACT_DIR"/{mdb-data,logs}

echo -e "${BLUE}🚀 Quick MDB Extraction Starting...${NC}"
echo -e "${BLUE}This will extract searchable data in ~30 minutes${NC}\n"

# Check for mdb-tools
if ! command -v mdb-export &> /dev/null; then
    echo -e "${YELLOW}Installing mdb-tools...${NC}"
    brew install mdbtools || {
        echo -e "${YELLOW}Using Python fallback...${NC}"
        pip3 install mdbtools
    }
fi

# Mount VDI
echo -e "${BLUE}Mounting VDI...${NC}"
MOUNT_POINT="/Volumes/UnimogManuals/wis-mount-temp"
mkdir -p "$MOUNT_POINT"

hdiutil attach -readonly -mountpoint "$MOUNT_POINT" "$VDI_PATH" 2>/dev/null || {
    echo -e "${YELLOW}Trying alternative mount...${NC}"
    # Try raw conversion ON EXTERNAL DRIVE ONLY
    RAW_FILE="$EXTRACT_DIR/MERCEDES.raw"
    if [ ! -f "$RAW_FILE" ]; then
        echo -e "${YELLOW}Converting to raw (10-15 min) to EXTERNAL DRIVE...${NC}"
        echo "Converting to: $RAW_FILE"
        qemu-img convert -f vdi -O raw "$VDI_PATH" "$RAW_FILE"
    fi
    hdiutil attach -imagekey diskimage-class=CRawDiskImage -mountpoint "$MOUNT_POINT" "$RAW_FILE"
}

# Find and extract MDB files
echo -e "${BLUE}Extracting MDB files...${NC}"
find "$MOUNT_POINT" -name "*.mdb" -o -name "*.accdb" 2>/dev/null | while read -r mdb; do
    basename=$(basename "$mdb" .mdb)
    basename=$(basename "$basename" .accdb)
    
    echo "  Processing: $basename"
    mkdir -p "$EXTRACT_DIR/mdb-data/$basename"
    
    # Extract tables
    if command -v mdb-tables &> /dev/null; then
        mdb-tables -1 "$mdb" 2>/dev/null | while read -r table; do
            mdb-export "$mdb" "$table" > "$EXTRACT_DIR/mdb-data/$basename/${table}.csv" 2>/dev/null || true
        done
    fi
done

# Upload to Supabase
echo -e "${BLUE}Uploading to Supabase...${NC}"
cd "$PROJECT_ROOT"
node scripts/wis-extraction/upload-mdb-data.js "$EXTRACT_DIR/mdb-data"

# Cleanup
hdiutil detach "$MOUNT_POINT" 2>/dev/null || true
# Remove temporary files (EXTERNAL DRIVE ONLY)
if [[ "$EXTRACT_DIR/MERCEDES.raw" =~ ^/Volumes/.* ]]; then
    rm -f "$EXTRACT_DIR/MERCEDES.raw"
    echo -e "${BLUE}Removed temporary RAW file from external drive${NC}"
fi

echo -e "\n${GREEN}✅ Quick extraction complete!${NC}"
echo -e "Check your WIS viewer at: http://localhost:5173/knowledge/wis-epc"