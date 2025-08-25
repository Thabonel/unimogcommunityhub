#!/bin/bash

# Test importing a single file first
echo "Testing connection and import..."

# The exact connection string that worked for you
CONNECTION="postgres://postgres:Thabomeanshappiness@db.ydevatqwkoccxhtejdor.supabase.co:6543/postgres"

# First, test connection
echo "1. Testing connection..."
psql "$CONNECTION" -c "SELECT current_database();"

if [ $? -ne 0 ]; then
    echo "Connection failed. Trying alternative format..."
    # Try with environment variable
    export PGPASSWORD="Thabomeanshappiness"
    psql -h db.ydevatqwkoccxhtejdor.supabase.co -p 6543 -U postgres -d postgres -c "SELECT current_database();"
fi

echo ""
echo "2. Checking existing data..."
psql "$CONNECTION" -c "SELECT COUNT(*) as vehicle_models FROM wis_models;"

echo ""
echo "3. Running first procedure chunk..."
psql "$CONNECTION" -f procedures-chunks/chunk-01-procedures.sql

echo ""
echo "Done with test"