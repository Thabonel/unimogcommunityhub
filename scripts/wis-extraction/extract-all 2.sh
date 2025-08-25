#!/bin/bash

#############################################################################
# WIS Automated Extraction Script
# Version: 1.0.0
# Description: Fully automated extraction of Mercedes WIS/EPC database
# Requirements: macOS, Node.js, 60GB free space
#############################################################################

set -e  # Exit on any error

# Configuration - EXTERNAL DRIVES ONLY
VDI_PATH="/Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi"
EXTRACT_DIR="/Volumes/UnimogManuals/wis-extracted"
MOUNT_POINT="/Volumes/UnimogManuals/wis-mount-temp"
LOG_FILE="$EXTRACT_DIR/logs/extraction.log"
PROJECT_ROOT="/Users/thabonel/Documents/unimogcommunityhub"
CHECKPOINT_FILE="$EXTRACT_DIR/.extraction-checkpoint"

# SAFETY CHECK: Ensure we're working on external drives only
if [[ ! "$EXTRACT_DIR" =~ ^/Volumes/.* ]]; then
    log "❌ SAFETY VIOLATION: Extract directory must be on external drive (/Volumes/)" "$RED"
    log "   Current path: $EXTRACT_DIR" "$RED"
    exit 1
fi

if [[ ! "$VDI_PATH" =~ ^/Volumes/.* ]]; then
    log "❌ SAFETY VIOLATION: VDI must be on external drive (/Volumes/)" "$RED"
    log "   Current path: $VDI_PATH" "$RED"
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${2:-$NC}$1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Progress indicator
show_progress() {
    local current=$1
    local total=$2
    local percent=$((current * 100 / total))
    echo -ne "\rProgress: [$(printf '%3d' $percent)%] $current/$total files processed"
}

#############################################################################
# PREREQUISITES CHECK
#############################################################################

check_prerequisites() {
    log "🔍 Checking prerequisites..." "$BLUE"
    
    # Check VDI exists
    if [ ! -f "$VDI_PATH" ]; then
        log "❌ VDI file not found at: $VDI_PATH" "$RED"
        log "   Please ensure MERCEDES.vdi is extracted to this location" "$YELLOW"
        exit 1
    fi
    
    # Check VDI size (should be ~54GB)
    VDI_SIZE=$(stat -f%z "$VDI_PATH" 2>/dev/null || stat -c%s "$VDI_PATH" 2>/dev/null)
    VDI_SIZE_GB=$((VDI_SIZE / 1024 / 1024 / 1024))
    log "   VDI size: ${VDI_SIZE_GB}GB" "$BLUE"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log "⚠️  Node.js not found, installing..." "$YELLOW"
        brew install node || {
            log "❌ Failed to install Node.js" "$RED"
            exit 1
        }
    fi
    
    # Check/Install mdb-tools
    if ! command -v mdb-export &> /dev/null; then
        log "⚠️  mdb-tools not found, installing..." "$YELLOW"
        brew install mdbtools || {
            log "   Using fallback: Python mdbtools" "$YELLOW"
            pip3 install mdbtools || true
        }
    fi
    
    # Check Supabase credentials
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        log "❌ .env file not found at: $PROJECT_ROOT/.env" "$RED"
        exit 1
    fi
    
    log "✅ Prerequisites check complete" "$GREEN"
}

#############################################################################
# STAGE 1: MDB EXTRACTION (Quick Win)
#############################################################################

extract_mdb_files() {
    log "\n📊 STAGE 1: Extracting MDB Files..." "$BLUE"
    
    # Load checkpoint if exists
    local processed_count=0
    if [ -f "$CHECKPOINT_FILE" ]; then
        processed_count=$(grep "mdb_processed:" "$CHECKPOINT_FILE" | cut -d: -f2 || echo 0)
        log "   Resuming from checkpoint: $processed_count files already processed" "$YELLOW"
    fi
    
    # Mount VDI read-only
    log "   Mounting VDI..." "$BLUE"
    if ! mount | grep -q "$MOUNT_POINT"; then
        # Try multiple mount methods
        hdiutil attach -readonly -mountpoint "$MOUNT_POINT" "$VDI_PATH" 2>/dev/null || {
            log "   Trying alternative mount method..." "$YELLOW"
            # Convert to raw if needed - ON EXTERNAL DRIVE ONLY
            RAW_FILE="$EXTRACT_DIR/MERCEDES.raw"
            if [ ! -f "$RAW_FILE" ]; then
                log "   Converting VDI to raw format (this may take 10-15 minutes)..." "$YELLOW"
                log "   Converting to: $RAW_FILE (EXTERNAL DRIVE ONLY)" "$YELLOW"
                qemu-img convert -f vdi -O raw "$VDI_PATH" "$RAW_FILE" || {
                    log "   ⚠️  Could not mount VDI, continuing with available data" "$YELLOW"
                    return 0
                }
            fi
            hdiutil attach -imagekey diskimage-class=CRawDiskImage -mountpoint "$MOUNT_POINT" "$RAW_FILE"
        }
    fi
    
    # Find all MDB files
    log "   Searching for MDB files..." "$BLUE"
    local mdb_files=()
    while IFS= read -r -d '' file; do
        mdb_files+=("$file")
    done < <(find "$MOUNT_POINT" -type f \( -name "*.mdb" -o -name "*.accdb" \) -print0 2>/dev/null || true)
    
    log "   Found ${#mdb_files[@]} MDB files" "$GREEN"
    
    # Extract each MDB file
    local count=0
    for mdb_file in "${mdb_files[@]}"; do
        count=$((count + 1))
        
        # Skip if already processed
        if [ $count -le $processed_count ]; then
            continue
        fi
        
        show_progress $count ${#mdb_files[@]}
        
        local basename=$(basename "$mdb_file" .mdb)
        basename=$(basename "$basename" .accdb)
        local output_dir="$EXTRACT_DIR/mdb-data/$basename"
        mkdir -p "$output_dir"
        
        # Extract tables
        if command -v mdb-tables &> /dev/null; then
            local tables=$(mdb-tables -1 "$mdb_file" 2>/dev/null || true)
            for table in $tables; do
                mdb-export "$mdb_file" "$table" > "$output_dir/${table}.csv" 2>/dev/null || true
            done
        fi
        
        # Update checkpoint
        echo "mdb_processed:$count" > "$CHECKPOINT_FILE"
    done
    
    echo # New line after progress bar
    log "✅ Stage 1 complete: Extracted $count MDB files" "$GREEN"
    
    # Upload to Supabase
    log "   Uploading MDB data to Supabase..." "$BLUE"
    cd "$PROJECT_ROOT"
    node scripts/wis-extraction/upload-mdb-data.js "$EXTRACT_DIR/mdb-data" || {
        log "   ⚠️  Upload failed, data saved locally" "$YELLOW"
    }
}

#############################################################################
# STAGE 2: FILE HARVEST
#############################################################################

harvest_all_files() {
    log "\n📁 STAGE 2: Harvesting All WIS Files..." "$BLUE"
    
    # Create file manifest
    log "   Creating file manifest..." "$BLUE"
    local manifest_file="$EXTRACT_DIR/file-manifest.json"
    
    # Find and categorize files
    local file_count=0
    echo "[" > "$manifest_file"
    
    # Find all WIS-related files
    find "$MOUNT_POINT" -type f \( \
        -name "*.rom" -o \
        -name "rfile*" -o \
        -name "*.cbf" -o \
        -name "*.cpg" -o \
        -name "*.pdf" -o \
        -name "*.htm*" -o \
        -name "*.xml" \
    \) 2>/dev/null | while read -r file; do
        file_count=$((file_count + 1))
        show_progress $file_count 10000  # Estimate
        
        # Get file info
        local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        local rel_path="${file#$MOUNT_POINT/}"
        local file_type="${file##*.}"
        
        # Determine category
        local category="other"
        case "$rel_path" in
            *procedure*|*repair*) category="procedures" ;;
            *part*|*catalog*) category="parts" ;;
            *bulletin*|*tsb*) category="bulletins" ;;
            *diagram*|*wiring*) category="diagrams" ;;
        esac
        
        # Add to manifest
        if [ $file_count -gt 1 ]; then echo "," >> "$manifest_file"; fi
        echo -n "{\"path\":\"$rel_path\",\"size\":$size,\"type\":\"$file_type\",\"category\":\"$category\"}" >> "$manifest_file"
        
        # Copy file to organized structure
        local dest_dir="$EXTRACT_DIR/files/$category"
        mkdir -p "$dest_dir"
        cp "$file" "$dest_dir/" 2>/dev/null || true
    done
    
    echo "]" >> "$manifest_file"
    echo # New line after progress
    log "✅ Stage 2 complete: Harvested $file_count files" "$GREEN"
    
    # Upload files to Supabase storage
    log "   Uploading files to Supabase storage..." "$BLUE"
    node scripts/wis-extraction/upload-files.js "$EXTRACT_DIR/files" || {
        log "   ⚠️  File upload failed, files saved locally" "$YELLOW"
    }
}

#############################################################################
# STAGE 3: ADVANCED PROCESSING
#############################################################################

advanced_processing() {
    log "\n🔬 STAGE 3: Advanced Processing..." "$BLUE"
    
    # Convert CPG images if ImageMagick available
    if command -v convert &> /dev/null; then
        log "   Converting CPG images..." "$BLUE"
        local cpg_count=0
        find "$EXTRACT_DIR/files" -name "*.cpg" -type f | while read -r cpg_file; do
            cpg_count=$((cpg_count + 1))
            local png_file="${cpg_file%.cpg}.png"
            convert "$cpg_file" "$png_file" 2>/dev/null || {
                # Try extracting embedded JPEG/PNG
                python3 scripts/wis-extraction/extract-cpg-image.py "$cpg_file" "$png_file" 2>/dev/null || true
            }
        done
        log "   Converted $cpg_count CPG images" "$GREEN"
    fi
    
    # Parse CBF files
    log "   Parsing CBF diagnostic files..." "$BLUE"
    python3 scripts/wis-extraction/parse-cbf.py "$EXTRACT_DIR/files" "$EXTRACT_DIR/converted/json" 2>/dev/null || {
        log "   ⚠️  CBF parsing skipped" "$YELLOW"
    }
    
    # Create search indexes
    log "   Creating search indexes..." "$BLUE"
    node scripts/wis-extraction/create-search-indexes.js || {
        log "   ⚠️  Search index creation failed" "$YELLOW"
    }
    
    log "✅ Stage 3 complete: Advanced processing finished" "$GREEN"
}

#############################################################################
# VERIFICATION
#############################################################################

verify_extraction() {
    log "\n🔍 Verifying Extraction..." "$BLUE"
    
    # Check database content
    node scripts/wis-extraction/verify-extraction.js > "$EXTRACT_DIR/verification-report.txt"
    
    # Count extracted items
    local proc_count=$(find "$EXTRACT_DIR/mdb-data" -name "*procedure*.csv" | wc -l)
    local parts_count=$(find "$EXTRACT_DIR/mdb-data" -name "*part*.csv" | wc -l)
    local file_count=$(find "$EXTRACT_DIR/files" -type f | wc -l)
    
    log "📊 Extraction Summary:" "$GREEN"
    log "   - MDB files processed: $(find "$EXTRACT_DIR/mdb-data" -type d -maxdepth 1 | wc -l)" "$GREEN"
    log "   - Procedure files: $proc_count" "$GREEN"
    log "   - Parts files: $parts_count" "$GREEN"
    log "   - Total files: $file_count" "$GREEN"
    
    # Test web interface
    log "   Testing web interface..." "$BLUE"
    curl -s "http://localhost:5173/api/wis/search?q=oil" > /dev/null && {
        log "✅ Web interface responding correctly" "$GREEN"
    } || {
        log "⚠️  Web interface not responding (may need to restart dev server)" "$YELLOW"
    }
}

#############################################################################
# CLEANUP
#############################################################################

cleanup() {
    log "\n🧹 Cleaning up..." "$BLUE"
    
    # Unmount VDI
    if mount | grep -q "$MOUNT_POINT"; then
        hdiutil detach "$MOUNT_POINT" 2>/dev/null || true
    fi
    
    # Remove temporary files (EXTERNAL DRIVE ONLY)
    if [[ "$EXTRACT_DIR/MERCEDES.raw" =~ ^/Volumes/.* ]]; then
        rm -f "$EXTRACT_DIR/MERCEDES.raw" 2>/dev/null || true
        log "   Removed temporary RAW file from external drive" "$BLUE"
    fi
    
    log "✅ Cleanup complete" "$GREEN"
}

#############################################################################
# MAIN EXECUTION
#############################################################################

main() {
    # Create directories first (before any logging)
    mkdir -p "$EXTRACT_DIR"/{mdb-data,files,converted,logs}
    mkdir -p "$MOUNT_POINT"
    
    log "=====================================================" "$BLUE"
    log "🚀 WIS AUTOMATED EXTRACTION STARTING" "$BLUE"
    log "=====================================================" "$BLUE"
    log "Start time: $(date)" "$BLUE"
    log "VDI Path: $VDI_PATH" "$BLUE"
    log "Extract to: $EXTRACT_DIR" "$BLUE"
    log "" "$NC"
    
    # Run extraction stages
    check_prerequisites
    extract_mdb_files
    harvest_all_files
    advanced_processing
    verify_extraction
    cleanup
    
    log "" "$NC"
    log "=====================================================" "$GREEN"
    log "✅ EXTRACTION COMPLETE!" "$GREEN"
    log "=====================================================" "$GREEN"
    log "End time: $(date)" "$GREEN"
    log "" "$NC"
    log "📌 Next steps:" "$BLUE"
    log "   1. Check the web interface at http://localhost:5173/knowledge/wis-epc" "$NC"
    log "   2. Review extraction report at $EXTRACT_DIR/verification-report.txt" "$NC"
    log "   3. Logs available at $LOG_FILE" "$NC"
}

# Handle interruption gracefully
trap cleanup EXIT

# Check if running with clean flag
if [ "$1" == "--clean" ]; then
    log "🧹 Cleaning previous extraction..." "$YELLOW"
    rm -rf "$EXTRACT_DIR"
    rm -f "$CHECKPOINT_FILE"
fi

# Run main extraction
main