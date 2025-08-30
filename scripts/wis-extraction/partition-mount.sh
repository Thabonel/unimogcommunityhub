#!/bin/bash

# Direct partition mounting approach based on community feedback
# Raw disk contains Windows partitions that we can mount directly

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
RAW_FILE="/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw"
EXTRACT_DIR="/Volumes/UnimogManuals/wis-extraction"
DATABASE_DIR="$EXTRACT_DIR/database-files"

log "🔍 Direct Partition Mounting Approach" "$BLUE"
log "Based on community research - mount Windows partitions directly" "$BLUE"

# Create extraction directories
mkdir -p "$DATABASE_DIR"

# Partition information from file command:
# partition 1: start-CHS (0x0,32,33), startsector 2048, 204800 sectors
# partition 2: start-CHS (0xc,223,20), startsector 206848, 185092096 sectors

# Calculate partition offsets (sector size = 512 bytes)
PART1_OFFSET=$((2048 * 512))         # 1048576 bytes
PART2_OFFSET=$((206848 * 512))       # 105938944 bytes

log "📊 Partition Analysis:" "$YELLOW"
log "   Partition 1: Offset $PART1_OFFSET ($(($PART1_OFFSET / 1024 / 1024))MB)" "$YELLOW"
log "   Partition 2: Offset $PART2_OFFSET ($(($PART2_OFFSET / 1024 / 1024))MB)" "$YELLOW"

# Try mounting partition 2 (main Windows partition)
log "🔧 Attempting to mount main Windows partition (partition 2)..." "$YELLOW"

MOUNT_POINT="$EXTRACT_DIR/windows-mount"
mkdir -p "$MOUNT_POINT"

# Method 1: Try hdiutil with specific partition
log "   Method 1: hdiutil with partition offset" "$YELLOW"
if hdiutil attach "$RAW_FILE" -section 206848 204800 -mountpoint "$MOUNT_POINT" -readonly 2>/dev/null; then
    log "✅ Successfully mounted Windows partition" "$GREEN"
    MOUNT_SUCCESS=true
else
    log "❌ hdiutil partition mount failed" "$RED"
    MOUNT_SUCCESS=false
fi

# Method 2: Try loopback device approach
if [ "$MOUNT_SUCCESS" = false ]; then
    log "   Method 2: Create disk image from partition" "$YELLOW"
    
    # Extract partition 2 to separate file
    PART2_FILE="$EXTRACT_DIR/windows-partition.img"
    
    if ! [ -f "$PART2_FILE" ]; then
        log "   Extracting Windows partition..." "$YELLOW"
        dd if="$RAW_FILE" of="$PART2_FILE" bs=512 skip=206848 count=185092096 2>/dev/null
        log "✅ Windows partition extracted" "$GREEN"
    fi
    
    # Try mounting the extracted partition
    if hdiutil attach "$PART2_FILE" -mountpoint "$MOUNT_POINT" -readonly 2>/dev/null; then
        log "✅ Successfully mounted extracted Windows partition" "$GREEN"
        MOUNT_SUCCESS=true
    else
        log "❌ Extracted partition mount failed" "$RED"
    fi
fi

# If successful, search for WIS database files
if [ "$MOUNT_SUCCESS" = true ]; then
    log "🔍 Searching for WIS database files..." "$YELLOW"
    
    # Search for Transbase files mentioned in community research
    FOUND_FILES=0
    
    # Look for common WIS/Transbase files
    for pattern in "*.sys" "rfile*" "tbase*" "*WIS*" "*Mercedes*" "*Database*"; do
        find "$MOUNT_POINT" -iname "$pattern" 2>/dev/null | while read -r file; do
            log "📁 Found: $file" "$GREEN"
            
            # Copy to database directory
            mkdir -p "$DATABASE_DIR/$(basename "$(dirname "$file")")"
            cp "$file" "$DATABASE_DIR/$(basename "$(dirname "$file)")/" 2>/dev/null || true
            FOUND_FILES=$((FOUND_FILES + 1))
        done
    done
    
    # Look for specific directories mentioned in community guides
    for dir_pattern in "*WIS*" "*Mercedes*" "*Workshop*" "*Database*" "*Transbase*"; do
        find "$MOUNT_POINT" -type d -iname "$dir_pattern" 2>/dev/null | head -5 | while read -r dir; do
            log "📂 Found directory: $dir" "$GREEN"
            
            # Copy entire directory structure
            dest_dir="$DATABASE_DIR/$(basename "$dir")"
            cp -r "$dir" "$dest_dir" 2>/dev/null || true
            
            # List contents
            if [ -d "$dest_dir" ]; then
                log "   Contents:" "$YELLOW"
                ls -la "$dest_dir" | head -10 | while read -r line; do
                    log "     $line" "$YELLOW"
                done
            fi
        done
    done
    
    # Look for .exe files that might be WIS
    find "$MOUNT_POINT" -name "*.exe" -iname "*wis*" 2>/dev/null | head -5 | while read -r exe; do
        log "🔧 Found WIS executable: $exe" "$GREEN"
        # Copy the directory containing the executable
        exe_dir=$(dirname "$exe")
        dest_dir="$DATABASE_DIR/$(basename "$exe_dir")"
        cp -r "$exe_dir" "$dest_dir" 2>/dev/null || true
    done
    
    # Unmount
    hdiutil detach "$MOUNT_POINT" 2>/dev/null || diskutil unmount "$MOUNT_POINT" 2>/dev/null
    log "✅ Windows partition unmounted" "$GREEN"
    
else
    log "❌ Could not mount Windows partition" "$RED"
    log "💡 Alternative approaches:" "$YELLOW"
    log "   1. Use Windows machine with OSFMount (community recommended)" "$YELLOW"
    log "   2. Create Linux VM with qemu-nbd" "$YELLOW"
    log "   3. Use PhotoRec forensic recovery" "$YELLOW"
fi

# Summary
log "\n📋 EXTRACTION RESULTS" "$BLUE"
log "==================" "$BLUE"

if [ -d "$DATABASE_DIR" ] && [ "$(find "$DATABASE_DIR" -type f 2>/dev/null | wc -l)" -gt 0 ]; then
    log "✅ Files extracted to: $DATABASE_DIR" "$GREEN"
    log "📊 Extracted files and directories:" "$YELLOW"
    find "$DATABASE_DIR" -type f 2>/dev/null | head -20 | while read -r file; do
        log "   📄 $(basename "$file") ($(ls -lh "$file" | awk '{print $5}'))" "$YELLOW"
    done
    
    log "\n🔄 Next Steps for WIS Data:" "$BLUE"
    log "1. Look for Transbase database files (tbase.sys, rfile000-rfile008)" "$YELLOW"
    log "2. Find WIS installation directory with executables" "$YELLOW"
    log "3. Use Transbase CLI tools (tbrun, tbexport) to export data" "$YELLOW"
    log "4. Convert exported CSV to PostgreSQL format" "$YELLOW"
    
else
    log "⚠️  No files extracted successfully" "$YELLOW"
    log "💡 Community-recommended next steps:" "$YELLOW"
    log "1. Try OSFMount on Windows (most reliable method)" "$YELLOW"
    log "2. Use Ubuntu VM with qemu-nbd tools" "$YELLOW"
    log "3. Contact Mercedes community forums for specific guidance" "$YELLOW"
fi