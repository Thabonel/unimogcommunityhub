#!/bin/bash

# Import Intelligent WIS System Data
# This script imports the component taxonomy and intelligent media system data

echo "🚀 Starting Intelligent WIS System Import..."
echo ""

# Check if we have the required files
if [ ! -f "scripts/populate-wis-data.sql" ]; then
    echo "❌ Error: populate-wis-data.sql not found"
    exit 1
fi

if [ ! -f "supabase/migrations/20250917192800_create_intelligent_wis_system.sql" ]; then
    echo "❌ Error: migration file not found"
    exit 1
fi

# Set Supabase configuration
SUPABASE_URL=${VITE_SUPABASE_URL}
SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Error: Missing Supabase configuration"
    echo "Required environment variables:"
    echo "  - VITE_SUPABASE_URL"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "📋 Manual Import Instructions:"
    echo "1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new"
    echo "2. Copy and run: scripts/populate-wis-data.sql"
    echo "3. Verify results with the SELECT statements at the end"
    exit 1
fi

# Function to run SQL via curl
run_sql() {
    local sql_file=$1
    local description=$2

    echo "📄 Running: $description..."

    response=$(curl -s -X POST \
        "$SUPABASE_URL/rest/v1/rpc/sql_execute" \
        -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
        -H "Content-Type: application/json" \
        -H "apikey: $SUPABASE_SERVICE_KEY" \
        -d "{\"query\":\"$(cat $sql_file | sed 's/"/\\"/g' | sed 's/$/\\n/' | tr -d '\n')\"}")

    if echo "$response" | grep -q "error"; then
        echo "❌ Error running $sql_file:"
        echo "$response"
        return 1
    else
        echo "✅ Success: $description"
        return 0
    fi
}

# Method 1: Try API import (requires service key)
echo "🔄 Method 1: Attempting API import..."

# Try to run the populate script
if run_sql "scripts/populate-wis-data.sql" "Import component taxonomy and parts data"; then
    echo "✅ API import successful!"

    # Verify the import
    echo ""
    echo "🔍 Verifying import results..."

    # Create a verification query
    cat > /tmp/verify_import.sql << EOF
SELECT
  'Component Taxonomy' as table_name, COUNT(*) as count
FROM wis_component_taxonomy
UNION ALL
SELECT 'Parts Catalog', COUNT(*) FROM wis_parts_catalog
UNION ALL
SELECT 'Component Relationships', COUNT(*) FROM wis_component_relationships;
EOF

    if run_sql "/tmp/verify_import.sql" "Verify import results"; then
        echo "✅ Import verification complete!"
    fi

    rm -f /tmp/verify_import.sql

else
    echo "❌ API import failed, falling back to manual instructions..."
    echo ""
    echo "📋 Manual Import Instructions:"
    echo "1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new"
    echo "2. Copy and paste the contents of: scripts/populate-wis-data.sql"
    echo "3. Click 'RUN' to execute"
    echo "4. Verify you see results like:"
    echo "   • Component Taxonomy: 18 rows"
    echo "   • Parts Catalog: 10 rows"
    echo "   • Component Relationships: 3 rows"
    echo ""
    echo "📁 File location: $(pwd)/scripts/populate-wis-data.sql"
    exit 1
fi

echo ""
echo "🎉 Intelligent WIS System Import Complete!"
echo ""
echo "📊 What was imported:"
echo "  • Component taxonomy (hierarchical structure)"
echo "  • Parts catalog with Mercedes part numbers"
echo "  • Component relationships and dependencies"
echo "  • Sample data from U435 Unimog (1974-1991)"
echo ""
echo "🔄 Next steps:"
echo "  1. Test Barry integration with new semantic search"
echo "  2. Implement context-aware media loading"
echo "  3. Replace bulk media dump with intelligent recommendations"
echo ""
echo "🧪 Test the system:"
echo "  • Ask Barry: 'Show me crankshaft replacement parts'"
echo "  • Search for: 'OM352 engine components'"
echo "  • Browse media by component category"