#!/bin/bash

# WIS Data Extraction Script using DbVisualizer CLI
# This script automates the extraction of WIS data to CSV files

echo "🚀 WIS Database Extraction Tool"
echo "================================"

# Configuration
EXPORT_DIR="/Volumes/UnimogManuals/wis-complete-extraction"
DBVIS_CMD="/Applications/DbVisualizer.app/Contents/Resources/dbviscmd.sh"

# Create export directory
mkdir -p "$EXPORT_DIR"
mkdir -p "$EXPORT_DIR/procedures"
mkdir -p "$EXPORT_DIR/parts"
mkdir -p "$EXPORT_DIR/bulletins"
mkdir -p "$EXPORT_DIR/diagrams"

echo "📁 Export directory: $EXPORT_DIR"
echo ""

# Wait for WIS to be ready
echo "⏳ Waiting for WIS database to be ready..."
echo "   Please login to Windows with Admin/12345 and start WIS"
echo "   Press Enter when WIS is running..."
read -p ""

# Create connection script for DbVisualizer
cat > /tmp/wis-connection.sql << 'EOF'
-- Connect to WIS Transbase database
@connect wisnet jdbc:transbase://localhost:2054/wisnet tbadmin

-- Test connection
SELECT 'Connection successful' AS status;
EOF

# Create export scripts for each table
cat > /tmp/export-procedures.sql << 'EOF'
@connect wisnet jdbc:transbase://localhost:2054/wisnet tbadmin
@export set filename="/Volumes/UnimogManuals/wis-complete-extraction/procedures/procedures.csv" format="CSV" HeaderRow="true";
SELECT * FROM procedures;
@export off;
EOF

cat > /tmp/export-parts.sql << 'EOF'
@connect wisnet jdbc:transbase://localhost:2054/wisnet tbadmin
@export set filename="/Volumes/UnimogManuals/wis-complete-extraction/parts/parts.csv" format="CSV" HeaderRow="true";
SELECT * FROM parts;
@export off;
EOF

cat > /tmp/export-bulletins.sql << 'EOF'
@connect wisnet jdbc:transbase://localhost:2054/wisnet tbadmin
@export set filename="/Volumes/UnimogManuals/wis-complete-extraction/bulletins/bulletins.csv" format="CSV" HeaderRow="true";
SELECT * FROM bulletins;
@export off;
EOF

cat > /tmp/export-diagrams.sql << 'EOF'
@connect wisnet jdbc:transbase://localhost:2054/wisnet tbadmin
@export set filename="/Volumes/UnimogManuals/wis-complete-extraction/diagrams/diagrams.csv" format="CSV" HeaderRow="true";
SELECT * FROM diagrams;
@export off;
EOF

echo "📊 Starting data export..."
echo ""

# Export procedures
echo "📋 Exporting procedures..."
"$DBVIS_CMD" -connection wisnet -sql /tmp/export-procedures.sql

# Export parts
echo "🔩 Exporting parts catalog..."
"$DBVIS_CMD" -connection wisnet -sql /tmp/export-parts.sql

# Export bulletins
echo "📢 Exporting service bulletins..."
"$DBVIS_CMD" -connection wisnet -sql /tmp/export-bulletins.sql

# Export diagrams
echo "⚡ Exporting wiring diagrams..."
"$DBVIS_CMD" -connection wisnet -sql /tmp/export-diagrams.sql

echo ""
echo "✅ Export complete!"
echo "📁 Files saved to: $EXPORT_DIR"
echo ""

# Show file sizes
echo "📊 Export summary:"
du -sh "$EXPORT_DIR"/*/*.csv

echo ""
echo "🎯 Next step: Run the import script to load data into Supabase"