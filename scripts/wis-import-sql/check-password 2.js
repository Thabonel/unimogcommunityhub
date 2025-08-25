#!/usr/bin/env node

console.log('🔑 Password Debugging');
console.log('=====================\n');

const password = 'Thabomeanshappiness';

console.log('Password details:');
console.log(`- Length: ${password.length} characters`);
console.log(`- Contains special chars: ${/[^a-zA-Z0-9]/.test(password) ? 'Yes' : 'No'}`);
console.log(`- URL encoded: ${encodeURIComponent(password)}`);
console.log(`- Same after encoding: ${password === encodeURIComponent(password) ? 'Yes' : 'No'}\n`);

console.log('Connection string formats to try manually:\n');

console.log('1. Transaction Pooler (what worked in your terminal):');
console.log(`psql "postgres://postgres:${password}@db.ydevatqwkoccxhtejdor.supabase.co:6543/postgres"`);
console.log('');

console.log('2. Direct connection:');
console.log(`psql "postgresql://postgres:${password}@db.ydevatqwkoccxhtejdor.supabase.co:5432/postgres"`);
console.log('');

console.log('3. Session Pooler (IPv4):');
console.log(`psql "postgresql://postgres.ydevatqwkoccxhtejdor:${password}@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"`);
console.log('');

console.log('📋 IMPORTANT: Since you can connect via psql in terminal,');
console.log('let\'s use that directly for the import!\n');

// Create a working import script using psql
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importScript = `#!/bin/bash

# WIS Import using the connection that works in your terminal
CONNECTION="postgres://postgres:${password}@db.ydevatqwkoccxhtejdor.supabase.co:6543/postgres"

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
`;

fs.writeFileSync(path.join(__dirname, 'working-import.sh'), importScript, { mode: 0o755 });

console.log('✅ Created working-import.sh script\n');
console.log('To run the import:');
console.log('1. cd /Users/thabonel/Documents/unimogcommunityhub/scripts/wis-import-sql');
console.log('2. ./working-import.sh\n');
console.log('This uses the exact connection that worked in your terminal!');