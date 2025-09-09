#!/usr/bin/env node

/**
 * Test Raw Upload
 * Upload files without explicit content type to bypass MIME restrictions
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testRawUpload() {
  console.log('🧪 Testing Raw Uploads (no content type specified)\n');
  
  // Test HTML file
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>WIS Test Manual</title>
</head>
<body>
    <h1>Unimog 400 Oil Change</h1>
    <p>This is a test WIS manual file.</p>
</body>
</html>`;

  // Test JSON file  
  const jsonContent = JSON.stringify({
    "part_number": "A0001234567",
    "description": "Portal Axle Component",
    "unimog_models": ["U400", "U500"],
    "price": "€1,245.00"
  }, null, 2);

  const testFiles = [
    { name: 'test-manual.html', content: htmlContent },
    { name: 'test-parts.json', content: jsonContent }
  ];

  for (const testFile of testFiles) {
    try {
      console.log(`📤 Testing ${testFile.name}...`);
      
      // Upload without specifying contentType
      const { data, error } = await supabase.storage
        .from('wis-manuals')
        .upload(`test/${testFile.name}`, testFile.content, {
          upsert: true
          // No contentType specified - let Supabase detect it
        });
      
      if (error) {
        console.error(`❌ Failed: ${error.message}`);
      } else {
        console.log(`✅ Success: ${data.path}`);
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('wis-manuals')
          .getPublicUrl(data.path);
        
        console.log(`   URL: ${urlData.publicUrl}`);
      }
      
    } catch (error) {
      console.error(`❌ Error uploading ${testFile.name}:`, error.message);
    }
    
    console.log('');
  }
}

testRawUpload().catch(console.error);