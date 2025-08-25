#!/bin/bash

# ============================================
# WIS IMPORT SCRIPT - RUN THIS IN YOUR TERMINAL
# ============================================
# You successfully connected earlier with:
# psql "postgres://postgres:Thabomeanshappiness@db.ydevatqwkoccxhtejdor.supabase.co:6543/postgres"
#
# This script will import all WIS data using that connection
# ============================================

echo "═══════════════════════════════════════════"
echo "     WIS DATABASE IMPORT FOR UNIMOG HUB     "
echo "═══════════════════════════════════════════"
echo ""
echo "You're paying $4/month for IPv4 - let's use it!"
echo ""

# The connection that worked in your terminal
CONNECTION="postgres://postgres:Thabomeanshappiness@db.ydevatqwkoccxhtejdor.supabase.co:6543/postgres"

# Test connection first
echo "📡 Testing connection..."
psql "$CONNECTION" -c "SELECT 'Connected!' as status;" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Connection failed. Trying alternative..."
    CONNECTION="postgresql://postgres.ydevatqwkoccxhtejdor:Thabomeanshappiness@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"
    psql "$CONNECTION" -c "SELECT 'Connected!' as status;" 2>/dev/null
    
    if [ $? -ne 0 ]; then
        echo "❌ Still failing. Please run this command manually:"
        echo ""
        echo "psql \"postgres://postgres:Thabomeanshappiness@db.ydevatqwkoccxhtejdor.supabase.co:6543/postgres\""
        echo ""
        echo "If it connects, the import will work."
        exit 1
    fi
fi

echo "✅ Connection successful!"
echo ""

# Function to import with progress
import_file() {
    local file=$1
    local desc=$2
    printf "%-50s" "$desc"
    
    # Run SQL and capture result
    output=$(psql "$CONNECTION" -f "$file" 2>&1)
    
    if echo "$output" | grep -q "ERROR"; then
        echo "❌ Error"
        echo "$output" | grep "ERROR" | head -1
    else
        echo "✅ Done"
    fi
}

# Start import
echo "Starting import..."
echo "──────────────────"
echo ""

# Import procedures
echo "📚 IMPORTING PROCEDURES (33 chunks)"
echo "This will take 5-10 minutes..."
echo ""

count=1
for file in procedures-chunks/chunk-*.sql; do
    if [ -f "$file" ]; then
        import_file "$file" "  Chunk $count/33"
        ((count++))
    fi
done

echo ""
echo "📦 IMPORTING PARTS"
import_file "03-import-parts.sql" "  Mercedes parts database"

echo ""
echo "📢 IMPORTING BULLETINS"
import_file "04-import-bulletins.sql" "  Technical bulletins"

echo ""
echo "═══════════════════════════════════════════"
echo "              VERIFICATION                  "
echo "═══════════════════════════════════════════"

psql "$CONNECTION" -c "
SELECT 
  'Vehicle Models' as table_name,
  COUNT(*)::text as count
FROM wis_models
UNION ALL
SELECT 
  'Procedures' as table_name,
  COUNT(*)::text as count
FROM wis_procedures
UNION ALL
SELECT 
  'Parts' as table_name,
  COUNT(*)::text as count
FROM wis_parts
UNION ALL
SELECT 
  'Bulletins' as table_name,
  COUNT(*)::text as count
FROM wis_bulletins
ORDER BY table_name;"

echo ""
echo "═══════════════════════════════════════════"
echo "         🎉 IMPORT COMPLETE! 🎉            "
echo "═══════════════════════════════════════════"
echo ""
echo "Your $4/month IPv4 connection worked!"
echo "All WIS data has been imported."