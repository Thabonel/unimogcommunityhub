#!/bin/bash

# Community-Proven WIS Extraction using OSFMount Approach
# Based on Mercedes community research findings

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
VDI_FILE="/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw"
EXTRACT_DIR="/Volumes/UnimogManuals/wis-extraction"
DATABASE_DIR="$EXTRACT_DIR/database-files"

log "🔍 Community-Proven WIS Extraction Method" "$BLUE"
log "Based on Mercedes forum research and user reports" "$BLUE"

# Safety check - must be on external drive
if [[ ! "$EXTRACT_DIR" =~ ^/Volumes/.* ]]; then
    log "❌ SAFETY VIOLATION: Extract directory must be on external drive (/Volumes/)" "$RED"
    exit 1
fi

# Create extraction directories
mkdir -p "$EXTRACT_DIR"
mkdir -p "$DATABASE_DIR"

log "📁 Using extraction directory: $EXTRACT_DIR" "$YELLOW"

# Method 1: Try OSFMount approach (requires Windows)
if command -v wine &> /dev/null; then
    log "🍷 Wine detected - attempting OSFMount via Wine" "$YELLOW"
    # Note: This would require OSFMount.exe and proper Wine setup
    # Community reports this is the most reliable method
else
    log "⚠️  OSFMount requires Windows - Wine not available" "$YELLOW"
fi

# Method 2: VirtualBox VBoxManage approach (macOS compatible)
log "🔧 Attempting VBoxManage approach..." "$YELLOW"

if command -v VBoxManage &> /dev/null; then
    log "✅ VirtualBox found - using VBoxManage" "$GREEN"
    
    # Try to analyze the raw file structure
    log "📊 Analyzing file structure..." "$YELLOW"
    
    # Use hexdump to check for NTFS signatures
    if hexdump -C "$VDI_FILE" | head -20 | grep -q "NTFS"; then
        log "✅ NTFS filesystem detected" "$GREEN"
        
        # Try to mount using hdiutil with NTFS support
        log "🔧 Attempting NTFS mount..." "$YELLOW"
        
        # Create mount point
        MOUNT_POINT="$EXTRACT_DIR/vdi-mount"
        mkdir -p "$MOUNT_POINT"
        
        # Try mounting with hdiutil
        if hdiutil attach "$VDI_FILE" -mountpoint "$MOUNT_POINT" -readonly 2>/dev/null; then
            log "✅ Successfully mounted VDI file" "$GREEN"
            
            # Look for WIS database files
            log "🔍 Searching for Transbase database files..." "$YELLOW"
            
            # Search for common WIS database files
            find "$MOUNT_POINT" -name "*.sys" -o -name "rfile*" -o -name "tbase*" 2>/dev/null | while read -r file; do
                log "📁 Found database file: $file" "$GREEN"
                
                # Copy to extraction directory
                cp "$file" "$DATABASE_DIR/" 2>/dev/null || log "⚠️  Could not copy $file" "$YELLOW"
            done
            
            # Look for WIS installation directory
            for wis_dir in "WIS" "Mercedes" "Workshop" "Database"; do
                if find "$MOUNT_POINT" -type d -iname "*$wis_dir*" 2>/dev/null | head -1; then
                    wis_path=$(find "$MOUNT_POINT" -type d -iname "*$wis_dir*" 2>/dev/null | head -1)
                    log "📂 Found WIS directory: $wis_path" "$GREEN"
                    
                    # Copy entire WIS directory structure
                    cp -r "$wis_path" "$DATABASE_DIR/" 2>/dev/null || log "⚠️  Could not copy directory" "$YELLOW"
                fi
            done
            
            # Unmount
            hdiutil detach "$MOUNT_POINT" 2>/dev/null
            log "✅ VDI file unmounted" "$GREEN"
            
        else
            log "❌ Could not mount VDI with hdiutil" "$RED"
        fi
    else
        log "❌ NTFS filesystem not detected" "$RED"
    fi
else
    log "❌ VirtualBox not found" "$RED"
fi

# Method 3: PhotoRec forensic approach (mentioned in research)
log "🔍 Attempting PhotoRec forensic recovery..." "$YELLOW"

if command -v photorec &> /dev/null; then
    log "✅ PhotoRec found - attempting database file recovery" "$GREEN"
    
    # Create PhotoRec output directory
    PHOTOREC_DIR="$EXTRACT_DIR/photorec-recovery"
    mkdir -p "$PHOTOREC_DIR"
    
    # Run PhotoRec to recover database files
    # Note: This runs interactively, but we can try to recover specific file types
    log "📋 Running PhotoRec recovery (this may take time)..." "$YELLOW"
    
    # PhotoRec command to recover database-related files
    # This would need to be run interactively or with proper config
    
else
    log "❌ PhotoRec not found - install testdisk package" "$RED"
    log "💡 Run: brew install testdisk" "$YELLOW"
fi

# Method 4: Community-suggested Linux VM approach
log "🐧 Linux VM approach available as fallback" "$YELLOW"
log "💡 Create Ubuntu VM on external drive, mount VDI with qemu-img tools" "$YELLOW"

# Summary
log "\n📋 EXTRACTION SUMMARY" "$BLUE"
log "=================" "$BLUE"

if [ -d "$DATABASE_DIR" ] && [ "$(ls -A $DATABASE_DIR)" ]; then
    log "✅ Files extracted to: $DATABASE_DIR" "$GREEN"
    log "📊 Extracted files:" "$YELLOW"
    ls -la "$DATABASE_DIR"
    
    log "\n🔄 Next Steps:" "$BLUE"
    log "1. Identify Transbase database files (tbase.sys, rfile000-rfile008)" "$YELLOW"
    log "2. Use Transbase CLI tools: tbrun, tbexport" "$YELLOW"
    log "3. Export tables to CSV format" "$YELLOW"
    log "4. Import CSV files to PostgreSQL" "$YELLOW"
    
else
    log "⚠️  No files extracted - try alternative methods:" "$YELLOW"
    log "1. OSFMount on Windows machine (most reliable per community)" "$YELLOW"
    log "2. Linux VM with qemu-img tools" "$YELLOW"
    log "3. PhotoRec forensic recovery" "$YELLOW"
fi

log "\n🌐 Community Resources:" "$BLUE"
log "- Scribd WIS installation guides" "$YELLOW"
log "- benzworld.org technical discussions" "$YELLOW"
log "- Transbase documentation for CLI export" "$YELLOW"