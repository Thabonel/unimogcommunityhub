#!/bin/bash

# Execute Storage Migration via Supabase CLI
# This script uses the Supabase CLI to execute the SQL migration

echo "🔧 Executing Storage Migration via Supabase CLI"
echo "==============================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if project is linked
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ No Supabase project configuration found."
    echo "Please run 'supabase login' and 'supabase link' first"
    exit 1
fi

echo "📁 Executing migration file..."

# Execute the migration SQL file
supabase db push --include-all --include-seed

echo "✅ Migration pushed to remote database"

# Alternative: Execute SQL file directly
echo "📄 Alternatively, execute SQL directly:"
echo "supabase db query --file execute_storage_migration.sql"

echo "🎉 Migration execution completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Test photo uploads in your application"
echo "2. Check Supabase Dashboard → Storage → Policies"
echo "3. Verify all buckets exist with correct permissions"