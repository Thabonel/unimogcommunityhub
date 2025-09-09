#!/bin/bash

echo "🔧 Fixing Supabase imports..."

# Counter for fixed files
count=0

# Find all TypeScript and TSX files and fix imports
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
  # Check if file contains the incorrect import
  if grep -q "from ['\"]\@/lib/supabase['\"]" "$file" 2>/dev/null; then
    # Fix the import using sed
    sed -i '' "s|from ['\"]\@/lib/supabase['\"]|from '@/lib/supabase-client'|g" "$file"
    echo "✅ Fixed: $file"
    ((count++))
  fi
  
  # Also fix integrations/supabase imports
  if grep -q "from ['\"]\@/integrations/supabase/client['\"]" "$file" 2>/dev/null; then
    sed -i '' "s|from ['\"]\@/integrations/supabase/client['\"]|from '@/lib/supabase-client'|g" "$file"
    echo "✅ Fixed: $file"
    ((count++))
  fi
done

echo ""
echo "✨ All Supabase imports have been standardized to use @/lib/supabase-client"