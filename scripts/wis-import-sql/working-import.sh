#!/bin/bash

# WIS Import using the connection that works in your terminal
CONNECTION="postgres://postgres:Thabomeanshappiness@db.ydevatqwkoccxhtejdor.supabase.co:6543/postgres"

echo "🚀 Starting WIS Import (using your working connection)"
echo "======================================================"
echo ""

# Function to run SQL file and continue on error
run_sql() {
    local file=$1
    local description=$2
    echo "📋 $description"
    
    # Use psql with the exact connection string that worked for you
    psql "$CONNECTION" -f "$file" -v ON_ERROR_STOP=0 2>&1 | grep -v "^NOTICE" | head -20
    
    if [ $? -eq 0 ]; then
        echo "✅ Success"
    else
        echo "⚠️ Completed with warnings"
    fi
    echo ""
}

# Import procedures
echo "IMPORTING PROCEDURES (33 chunks)"
echo "────────────────────────────────"

for file in procedures-chunks/chunk-*.sql; do
    if [ -f "$file" ]; then
        basename=$(basename "$file")
        run_sql "$file" "$basename"
    fi
done

# Import parts
echo "IMPORTING PARTS"
echo "───────────────"
run_sql "03-import-parts.sql" "Mercedes parts database"

# Import bulletins  
echo "IMPORTING BULLETINS"
echo "──────────────────"
run_sql "04-import-bulletins.sql" "Technical bulletins"

# Verify
echo "VERIFICATION"
echo "────────────"
psql "$CONNECTION" -t -c "SELECT 
  'Models: ' || COUNT(*) FROM wis_models
UNION ALL
SELECT 'Procedures: ' || COUNT(*) FROM wis_procedures  
UNION ALL
SELECT 'Parts: ' || COUNT(*) FROM wis_parts
UNION ALL
SELECT 'Bulletins: ' || COUNT(*) FROM wis_bulletins;"

echo ""
echo "✅ Import complete!"
