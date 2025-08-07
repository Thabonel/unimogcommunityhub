#!/bin/bash

# Apply Security Fixes to Supabase
# This script applies the security migration to fix warnings and errors

echo "🔒 Applying Security Fixes to Supabase..."
echo "This will fix:"
echo "  - user_subscriptions 406 error"
echo "  - RLS policies for all tables"
echo "  - Storage bucket policies"
echo "  - Missing indexes"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create a .env file with your Supabase credentials"
    exit 1
fi

# Load environment variables
source .env

# Check if Supabase URL and key are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Supabase credentials not found in .env"
    echo "Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file"
    exit 1
fi

echo "📝 Migration file: supabase/migrations/20250106_fix_security_warnings.sql"
echo ""
echo "⚠️  IMPORTANT: You need to run this migration in your Supabase Dashboard"
echo ""
echo "Steps to apply the migration:"
echo "1. Go to your Supabase Dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Click 'New Query'"
echo "4. Copy and paste the contents of: supabase/migrations/20250106_fix_security_warnings.sql"
echo "5. Click 'Run' to execute the migration"
echo ""
echo "Alternatively, if you have Supabase CLI installed:"
echo "  supabase db push --db-url \"$VITE_SUPABASE_URL\""
echo ""
echo "After running the migration, your security warnings should be resolved!"
echo ""
echo "Expected fixes:"
echo "✅ user_subscriptions table created with proper RLS"
echo "✅ All tables have RLS enabled"
echo "✅ Storage buckets have proper policies"
echo "✅ Performance indexes added"
echo "✅ Automatic user subscription creation on signup"

# Optionally, open the SQL file for easy copying
if command -v code &> /dev/null; then
    echo ""
    echo "Opening migration file in VS Code for easy copying..."
    code supabase/migrations/20250106_fix_security_warnings.sql
elif command -v open &> /dev/null; then
    echo ""
    echo "Opening migration file in default editor..."
    open supabase/migrations/20250106_fix_security_warnings.sql
fi