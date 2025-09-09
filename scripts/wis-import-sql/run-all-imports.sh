#!/bin/bash

# WIS Complete Import Script
# Uses psql to import all data

CONNECTION="postgres://postgres:Thabomeanshappiness@db.ydevatqwkoccxhtejdor.supabase.co:6543/postgres"

echo "🚀 Starting WIS Database Import"
echo "================================"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql is not installed. Please install PostgreSQL client tools."
    exit 1
fi

# Function to run SQL file
run_sql() {
    local file=$1
    local description=$2
    echo "📋 $description"
    psql "$CONNECTION" -f "$file" -q
    if [ $? -eq 0 ]; then
        echo "✅ Success"
    else
        echo "❌ Failed - continuing anyway"
    fi
    echo ""
}

# Step 1: Vehicle Models
echo "STEP 1: VEHICLE MODELS"
echo "─────────────────────"
run_sql "01-create-vehicle-models-fixed.sql" "Creating 42 vehicle models"

# Step 2: Procedures (33 chunks)
echo "STEP 2: PROCEDURES (33 chunks)"
echo "──────────────────────────────"
for i in {01..33}; do
    if [ -f "procedures-chunks/chunk-${i}-procedures.sql" ]; then
        run_sql "procedures-chunks/chunk-${i}-procedures.sql" "Chunk $i of 33"
    fi
done

# Step 3: Parts
echo "STEP 3: PARTS"
echo "─────────────"
run_sql "03-import-parts.sql" "Importing Mercedes parts"

# Step 4: Bulletins
echo "STEP 4: BULLETINS"
echo "────────────────"
run_sql "04-import-bulletins.sql" "Importing technical bulletins"

# Verification
echo "VERIFICATION"
echo "────────────"
psql "$CONNECTION" -c "SELECT 
  (SELECT COUNT(*) FROM wis_models) as models,
  (SELECT COUNT(*) FROM wis_procedures) as procedures,
  (SELECT COUNT(*) FROM wis_parts) as parts,
  (SELECT COUNT(*) FROM wis_bulletins) as bulletins;"

echo ""
echo "🎉 Import complete!"