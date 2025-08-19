#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript/TSX files
const files = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

let filesFixed = 0;
let totalFiles = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Replace incorrect import paths
    content = content.replace(
      /from ['"]@\/lib\/supabase['"]/g,
      'from \'@/lib/supabase-client\''
    );
    
    // Also fix any direct integrations/supabase imports
    content = content.replace(
      /from ['"]@\/integrations\/supabase\/client['"]/g,
      'from \'@/lib/supabase-client\''
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
      filesFixed++;
    }
    totalFiles++;
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Total files scanned: ${totalFiles}`);
console.log(`   Files fixed: ${filesFixed}`);
console.log(`\n✨ All Supabase imports have been standardized to use @/lib/supabase-client`);