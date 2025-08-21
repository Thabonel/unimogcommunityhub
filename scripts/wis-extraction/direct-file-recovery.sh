#!/bin/bash

# Direct file recovery from VDI using PhotoRec and other tools
# Community fallback method when VM approaches don't work

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
VDI_FILE="/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi"
RAW_FILE="/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw"
EXTRACTION_DIR="/Volumes/UnimogManuals/wis-forensic-recovery"

log "🔍 Direct WIS File Recovery" "$BLUE"
log "Using forensic tools to extract database files directly" "$BLUE"

mkdir -p "$EXTRACTION_DIR"

# Use the RAW file we already have
if [ ! -f "$RAW_FILE" ]; then
    log "❌ RAW file not found: $RAW_FILE" "$RED"
    exit 1
fi

log "📊 File analysis:" "$YELLOW"
log "   RAW file size: $(ls -lh "$RAW_FILE" | awk '{print $5}')" "$YELLOW"

# Method 1: PhotoRec to recover specific file types
log "🔍 Running PhotoRec to recover database files..." "$YELLOW"

PHOTOREC_DIR="$EXTRACTION_DIR/photorec-recovery"
mkdir -p "$PHOTOREC_DIR"

# Create PhotoRec configuration for database files
cat > "$PHOTOREC_DIR/photorec.cfg" << 'EOF'
# PhotoRec configuration for WIS database recovery
# Target file types related to databases and WIS

# Database files
sys
db
sqlite
mdb

# Executable files (WIS applications)
exe
dll

# Archive files that might contain WIS data
zip
rar
7z

# Text files that might contain data
txt
csv
xml

# Other potentially useful formats
pdf
doc
rtf
EOF

log "🚀 Starting PhotoRec recovery (this may take 30-60 minutes)..." "$YELLOW"
log "💡 PhotoRec will recover deleted and existing files from the VDI" "$YELLOW"

# Run PhotoRec in automated mode
cd "$PHOTOREC_DIR"

# Create PhotoRec command file for automated recovery
cat > photorec_cmd.txt << EOF
$RAW_FILE
.
y
.
.
p
.
p
.
b
s
.
.
y
q
EOF

# Note: PhotoRec is interactive, so we create instructions
log "📋 PhotoRec needs to be run interactively. Starting PhotoRec..." "$YELLOW"

if command -v photorec &> /dev/null; then
    log "🔧 PhotoRec found - attempting automated recovery" "$GREEN"
    
    # Try to run PhotoRec with our configuration
    # This is a simplified approach - real PhotoRec needs interactive input
    timeout 300 photorec "$RAW_FILE" 2>/dev/null || {
        log "⚠️  PhotoRec timed out or needs manual intervention" "$YELLOW"
        log "💡 Run manually: photorec $RAW_FILE" "$YELLOW"
    }
else
    log "❌ PhotoRec not available" "$RED"
fi

# Method 2: Use strings to find text-based data
log "🔍 Scanning for text-based WIS data..." "$YELLOW"

STRINGS_DIR="$EXTRACTION_DIR/strings-analysis"
mkdir -p "$STRINGS_DIR"

# Extract readable strings that might be WIS data
log "   Extracting strings (this may take time)..." "$YELLOW"
strings -n 10 "$RAW_FILE" | grep -i -E "(unimog|mercedes|wis|workshop|procedure|part|bulletin)" > "$STRINGS_DIR/wis-strings.txt" 2>/dev/null || true

if [ -s "$STRINGS_DIR/wis-strings.txt" ]; then
    log "✅ Found WIS-related text data" "$GREEN"
    log "   Preview (first 10 lines):" "$YELLOW"
    head -10 "$STRINGS_DIR/wis-strings.txt" | while read line; do
        log "     $line" "$YELLOW"
    done
else
    log "⚠️  No WIS text data found in strings" "$YELLOW"
fi

# Method 3: Hex dump analysis for specific patterns
log "🔍 Hex analysis for database signatures..." "$YELLOW"

HEX_DIR="$EXTRACTION_DIR/hex-analysis"
mkdir -p "$HEX_DIR"

# Look for Transbase signatures
log "   Searching for Transbase database signatures..." "$YELLOW"
hexdump -C "$RAW_FILE" | grep -i -E "(transbase|tbase|rfile)" > "$HEX_DIR/transbase-sigs.txt" 2>/dev/null || true

# Look for Windows executable signatures
log "   Searching for Windows executable signatures..." "$YELLOW"
hexdump -C "$RAW_FILE" | grep -E "(This program|Microsoft|Windows)" | head -20 > "$HEX_DIR/windows-sigs.txt" 2>/dev/null || true

# Method 4: File carving with binwalk (if available)
log "🔍 Attempting file carving with binwalk..." "$YELLOW"

if command -v binwalk &> /dev/null; then
    BINWALK_DIR="$EXTRACTION_DIR/binwalk-carving"
    mkdir -p "$BINWALK_DIR"
    
    cd "$BINWALK_DIR"
    log "🔧 Running binwalk file carving..." "$YELLOW"
    
    # Extract embedded files
    timeout 600 binwalk -e "$RAW_FILE" 2>/dev/null || {
        log "⚠️  Binwalk timed out or failed" "$YELLOW"
    }
    
    if [ -d "_MERCEDES.raw.extracted" ]; then
        log "✅ Binwalk extracted files" "$GREEN"
        log "   Extracted files:" "$YELLOW"
        find "_MERCEDES.raw.extracted" -type f | head -20 | while read file; do
            log "     $(basename "$file") ($(stat -f%z "$file" 2>/dev/null || echo "unknown size"))" "$YELLOW"
        done
    fi
else
    log "❌ Binwalk not available (install with: brew install binwalk)" "$YELLOW"
fi

# Method 5: Manual partition analysis
log "🔍 Manual partition boundary analysis..." "$YELLOW"

PARTITION_DIR="$EXTRACTION_DIR/partition-analysis"
mkdir -p "$PARTITION_DIR"

# Extract the Windows partition manually
log "   Extracting Windows partition (this may take time)..." "$YELLOW"

# Partition 2 starts at sector 206848, size 185092096 sectors
PART2_START=$((206848 * 512))
PART2_SIZE=$((185092096 * 512))

# Extract first 100MB of the Windows partition for analysis
dd if="$RAW_FILE" of="$PARTITION_DIR/windows-partition-sample.img" bs=1M count=100 skip=$((PART2_START / 1024 / 1024)) 2>/dev/null || {
    log "⚠️  Could not extract partition sample" "$YELLOW"
}

if [ -f "$PARTITION_DIR/windows-partition-sample.img" ]; then
    log "✅ Windows partition sample extracted" "$GREEN"
    
    # Analyze the sample
    log "   Analyzing partition sample..." "$YELLOW"
    strings "$PARTITION_DIR/windows-partition-sample.img" | grep -i -E "(mercedes|wis|workshop)" | head -10 > "$PARTITION_DIR/sample-analysis.txt" || true
    
    if [ -s "$PARTITION_DIR/sample-analysis.txt" ]; then
        log "✅ Found Mercedes/WIS references in partition" "$GREEN"
        cat "$PARTITION_DIR/sample-analysis.txt" | while read line; do
            log "     $line" "$GREEN"
        done
    fi
fi

# Summary
log "\n📋 RECOVERY SUMMARY" "$BLUE"
log "=================" "$BLUE"

TOTAL_RECOVERED=0

# Count recovered files
if [ -d "$PHOTOREC_DIR" ]; then
    PHOTOREC_FILES=$(find "$PHOTOREC_DIR" -type f 2>/dev/null | wc -l)
    log "PhotoRec recovery: $PHOTOREC_FILES files" "$YELLOW"
    TOTAL_RECOVERED=$((TOTAL_RECOVERED + PHOTOREC_FILES))
fi

if [ -f "$STRINGS_DIR/wis-strings.txt" ] && [ -s "$STRINGS_DIR/wis-strings.txt" ]; then
    WIS_STRINGS=$(wc -l < "$STRINGS_DIR/wis-strings.txt")
    log "WIS text references: $WIS_STRINGS lines" "$YELLOW"
fi

if [ -d "$BINWALK_DIR/_MERCEDES.raw.extracted" ]; then
    BINWALK_FILES=$(find "$BINWALK_DIR/_MERCEDES.raw.extracted" -type f 2>/dev/null | wc -l)
    log "Binwalk carved files: $BINWALK_FILES files" "$YELLOW"
    TOTAL_RECOVERED=$((TOTAL_RECOVERED + BINWALK_FILES))
fi

if [ $TOTAL_RECOVERED -gt 0 ]; then
    log "\n✅ RECOVERY SUCCESSFUL!" "$GREEN"
    log "Total files recovered: $TOTAL_RECOVERED" "$GREEN"
    log "\n🔄 Next steps:" "$BLUE"
    log "1. Examine recovered files in: $EXTRACTION_DIR" "$YELLOW"
    log "2. Look for .sys, .exe, or database files" "$YELLOW"
    log "3. Check strings analysis for WIS data structure" "$YELLOW"
    log "4. If Transbase files found, use tbexport to convert" "$YELLOW"
else
    log "\n⚠️  Limited recovery results" "$YELLOW"
    log "💡 Recommended next steps:" "$BLUE"
    log "1. Try the Windows + OSFMount method (community gold standard)" "$YELLOW"
    log "2. Create Linux VM with proper qemu-nbd setup" "$YELLOW"
    log "3. Contact Mercedes community forums for specific VDI guidance" "$YELLOW"
fi

log "\n📁 All recovery data saved to: $EXTRACTION_DIR" "$GREEN"