#!/bin/bash

# Aggressive WIS Data Ripper
# Uses multiple forensic techniques to extract data from VDI/RAW files

set -e

# Configuration
INPUT_FILE="${1:-/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw}"
OUTPUT_DIR="/Volumes/UnimogManuals/wis-ripped-data"
TEMP_DIR="/tmp/wis_ripper_$$"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     WIS DATA AGGRESSIVE RIPPER        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Create directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$TEMP_DIR"

# Function to extract using strings command
extract_with_strings() {
    echo -e "${YELLOW}Method 1: String extraction...${NC}"
    
    # Extract all readable strings
    echo "Extracting ASCII strings..."
    strings -n 10 "$INPUT_FILE" > "$OUTPUT_DIR/strings_ascii.txt" 2>/dev/null || true
    
    echo "Extracting UTF-16 strings..."
    strings -e l -n 10 "$INPUT_FILE" > "$OUTPUT_DIR/strings_utf16.txt" 2>/dev/null || true
    
    # Filter for WIS-specific content
    echo "Filtering for procedures..."
    grep -E "(Remove|Install|Check|Replace|Adjust|Test|Repair)" "$OUTPUT_DIR/strings_ascii.txt" > "$OUTPUT_DIR/procedures_raw.txt" 2>/dev/null || true
    
    echo "Filtering for part numbers..."
    grep -E "[A-Z][0-9]{3}\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}" "$OUTPUT_DIR/strings_ascii.txt" > "$OUTPUT_DIR/parts_raw.txt" 2>/dev/null || true
    
    echo "Filtering for Unimog models..."
    grep -E "(Unimog|U[0-9]{3,4}|404|406|416|1300|1700)" "$OUTPUT_DIR/strings_ascii.txt" > "$OUTPUT_DIR/models_raw.txt" 2>/dev/null || true
}

# Function to extract using binwalk
extract_with_binwalk() {
    echo -e "${YELLOW}Method 2: Binwalk extraction...${NC}"
    
    if command -v binwalk >/dev/null 2>&1; then
        cd "$TEMP_DIR"
        binwalk -e -M -d 3 "$INPUT_FILE" 2>/dev/null || true
        
        # Find extracted files
        find . -type f -size +1k 2>/dev/null | while read -r file; do
            # Check if file contains database-like content
            if file "$file" | grep -qE "(database|data|index)"; then
                cp "$file" "$OUTPUT_DIR/" 2>/dev/null || true
            fi
        done
    else
        echo "Binwalk not installed. Install with: brew install binwalk"
    fi
}

# Function to carve specific file types
carve_files() {
    echo -e "${YELLOW}Method 3: File carving with foremost...${NC}"
    
    if command -v foremost >/dev/null 2>&1; then
        foremost -t all -o "$OUTPUT_DIR/carved" -i "$INPUT_FILE" 2>/dev/null || true
    else
        echo "Foremost not installed. Install with: brew install foremost"
    fi
}

# Function to extract using dd at known offsets
extract_known_offsets() {
    echo -e "${YELLOW}Method 4: Extracting at known offsets...${NC}"
    
    # Common offsets for database files in Windows systems
    OFFSETS=(
        $((0x2000000))   # 32MB offset
        $((0x4000000))   # 64MB offset
        $((0x8000000))   # 128MB offset
        $((0x10000000))  # 256MB offset
        $((0x20000000))  # 512MB offset
    )
    
    for offset in "${OFFSETS[@]}"; do
        echo "Checking offset $offset..."
        dd if="$INPUT_FILE" of="$TEMP_DIR/chunk_$offset.bin" bs=1M count=100 skip=$((offset/1048576)) 2>/dev/null || true
        
        # Check if chunk contains database signatures
        if hexdump -C "$TEMP_DIR/chunk_$offset.bin" | head -100 | grep -qE "(rfile|TABL|RECD|TransBase)"; then
            echo -e "${GREEN}Found potential database at offset $offset${NC}"
            cp "$TEMP_DIR/chunk_$offset.bin" "$OUTPUT_DIR/database_offset_$offset.bin"
        fi
    done
}

# Function to search for specific patterns
search_patterns() {
    echo -e "${YELLOW}Method 5: Pattern matching...${NC}"
    
    # Search for Transbase database signatures
    echo "Searching for Transbase signatures..."
    grep -aob "rfile" "$INPUT_FILE" 2>/dev/null | head -20 > "$OUTPUT_DIR/rfile_offsets.txt" || true
    
    # Search for common database headers
    hexdump -C "$INPUT_FILE" | grep -E "(53 51 4C 69 74 65|00 00 00 00 01 00 00 00)" | head -20 > "$OUTPUT_DIR/db_headers.txt" 2>/dev/null || true
}

# Function to extract NTFS streams
extract_ntfs_streams() {
    echo -e "${YELLOW}Method 6: NTFS stream extraction...${NC}"
    
    if command -v ntfscat >/dev/null 2>&1; then
        # Try to extract MFT
        ntfscat "$INPUT_FILE" -n 0 > "$OUTPUT_DIR/mft.bin" 2>/dev/null || true
        
        # Extract specific files if we know their MFT entries
        for i in {1..1000}; do
            ntfscat "$INPUT_FILE" -n "$i" > "$TEMP_DIR/file_$i.bin" 2>/dev/null || true
            
            # Check if it's a database file
            if [ -s "$TEMP_DIR/file_$i.bin" ]; then
                if strings "$TEMP_DIR/file_$i.bin" | grep -qE "(rfile|TransBase|wisnet)"; then
                    cp "$TEMP_DIR/file_$i.bin" "$OUTPUT_DIR/ntfs_file_$i.bin"
                fi
            fi
        done
    else
        echo "ntfs-3g not installed. Install with: brew install ntfs-3g"
    fi
}

# Function to use photorec for recovery
use_photorec() {
    echo -e "${YELLOW}Method 7: PhotoRec recovery...${NC}"
    
    if command -v photorec >/dev/null 2>&1; then
        cd "$OUTPUT_DIR"
        # Create photorec config
        cat > photorec.cfg <<EOF
search,1
fileopt,everything,enable
options,mode_ext2,paranoid_no
EOF
        
        photorec /d "$OUTPUT_DIR/photorec_recovered" /cmd "$INPUT_FILE" partition_none,options,mode_ext2,fileopt,everything,enable,search 2>/dev/null || true
    else
        echo "PhotoRec not installed. Install with: brew install testdisk"
    fi
}

# Function to create a hex dump for manual analysis
create_hexdump() {
    echo -e "${YELLOW}Method 8: Creating hex dump samples...${NC}"
    
    # Create hex dumps at interesting offsets
    for mb in 0 100 500 1000 2000; do
        offset=$((mb * 1048576))
        echo "Hex dump at ${mb}MB..."
        hexdump -C "$INPUT_FILE" -s $offset -n 4096 > "$OUTPUT_DIR/hexdump_${mb}mb.txt" 2>/dev/null || true
    done
}

# Main extraction process
echo -e "${BLUE}Starting aggressive extraction...${NC}"
echo "Input: $INPUT_FILE"
echo "Output: $OUTPUT_DIR"
echo ""

# Run all extraction methods
extract_with_strings
extract_known_offsets
search_patterns
extract_ntfs_streams
create_hexdump

# Optional methods (slower)
if [ "$2" == "--full" ]; then
    extract_with_binwalk
    carve_files
    use_photorec
fi

# Post-processing
echo -e "${YELLOW}Post-processing extracted data...${NC}"

# Combine and deduplicate strings
if [ -f "$OUTPUT_DIR/strings_ascii.txt" ]; then
    # Extract unique procedures
    grep -E "^(Remove|Install|Check|Replace|Adjust|Test|Repair)" "$OUTPUT_DIR/strings_ascii.txt" | \
        sort -u > "$OUTPUT_DIR/procedures_unique.txt" 2>/dev/null || true
    
    # Extract unique part numbers
    grep -oE "[A-Z][0-9]{3}\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}" "$OUTPUT_DIR/strings_ascii.txt" | \
        sort -u > "$OUTPUT_DIR/parts_unique.txt" 2>/dev/null || true
fi

# Create summary
echo -e "${GREEN}=== Extraction Summary ===${NC}" | tee "$OUTPUT_DIR/summary.txt"
echo "Output directory: $OUTPUT_DIR" | tee -a "$OUTPUT_DIR/summary.txt"
echo "" | tee -a "$OUTPUT_DIR/summary.txt"

if [ -f "$OUTPUT_DIR/procedures_unique.txt" ]; then
    PROC_COUNT=$(wc -l < "$OUTPUT_DIR/procedures_unique.txt")
    echo "Procedures found: $PROC_COUNT" | tee -a "$OUTPUT_DIR/summary.txt"
fi

if [ -f "$OUTPUT_DIR/parts_unique.txt" ]; then
    PARTS_COUNT=$(wc -l < "$OUTPUT_DIR/parts_unique.txt")
    echo "Part numbers found: $PARTS_COUNT" | tee -a "$OUTPUT_DIR/summary.txt"
fi

# Size of extracted data
TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" 2>/dev/null | cut -f1)
echo "Total extracted size: $TOTAL_SIZE" | tee -a "$OUTPUT_DIR/summary.txt"

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}Extraction complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Review extracted data in: $OUTPUT_DIR"
echo "2. Run Python parser: python scripts/parse-transbase-rfiles.py $OUTPUT_DIR"
echo "3. Import parsed data to Supabase"
echo ""
echo "For more aggressive extraction, run: $0 $INPUT_FILE --full"