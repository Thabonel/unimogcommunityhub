#!/bin/bash

# Simple WIS Web Data Extraction
# The method that actually works according to Mercedes forums

echo "🚀 Simple WIS Web Extraction"
echo "============================"
echo ""

# Create export directory
EXPORT_DIR="/Volumes/UnimogManuals/wis-complete-extraction"
mkdir -p "$EXPORT_DIR"

# Check if WIS is accessible
if curl -s http://localhost:9000 > /dev/null 2>&1; then
    echo "✅ WIS is accessible at http://localhost:9000"
else
    echo "❌ WIS not accessible. Make sure:"
    echo "   1. QEMU VM is running"
    echo "   2. Windows is logged in (Admin/12345)"
    echo "   3. WIS application is started"
    exit 1
fi

echo ""
echo "📋 Extracting Unimog data from WIS..."
echo ""

# Common Unimog models to search for
MODELS="U1000 U1100 U1200 U1300 U1400 U1500 U1600 U1700 U2000 U2100 U2150 U2400 U2450 U3000 U4000 U5000 U300 U400 U500 404 406 411 416 424 425 435"

# Create subdirectories
mkdir -p "$EXPORT_DIR/procedures"
mkdir -p "$EXPORT_DIR/parts"
mkdir -p "$EXPORT_DIR/bulletins"

# Extract data for each model
for MODEL in $MODELS; do
    echo "Searching for model $MODEL..."
    
    # Try to get procedures
    curl -s "http://localhost:9000/search?q=$MODEL" > "$EXPORT_DIR/procedures/${MODEL}.html" 2>/dev/null
    
    # Try API endpoints
    curl -s "http://localhost:9000/api/procedures?model=$MODEL" > "$EXPORT_DIR/procedures/${MODEL}.json" 2>/dev/null
    curl -s "http://localhost:9000/api/parts?model=$MODEL" > "$EXPORT_DIR/parts/${MODEL}.json" 2>/dev/null
    
    # Check file sizes
    if [ -s "$EXPORT_DIR/procedures/${MODEL}.html" ]; then
        echo "  ✓ Found data for $MODEL"
    fi
done

echo ""
echo "📊 Checking extracted data..."
echo ""

# Show what we extracted
echo "Procedures: $(ls -1 $EXPORT_DIR/procedures/ | wc -l) files"
echo "Parts: $(ls -1 $EXPORT_DIR/parts/ | wc -l) files"
echo "Total size: $(du -sh $EXPORT_DIR | cut -f1)"

echo ""
echo "✅ Extraction attempt complete!"
echo "📁 Data saved to: $EXPORT_DIR"
echo ""
echo "Note: If no data was extracted, you need the Transbase JDBC driver"
echo "Look in the Windows VM at: C:\\Program Files\\EWA\\database\\TransBase\\jdbc\\"