#!/usr/bin/env node

/**
 * Upload WIS files as text/plain
 * Workaround for MIME type restrictions
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const WIS_FILES = [
  '/Volumes/UnimogManuals/wis-ready-to-upload/bulletins/tsb_2020_001_portal_axle.html',
  '/Volumes/UnimogManuals/wis-ready-to-upload/manuals/unimog_400_oil_change.html',
  '/Volumes/UnimogManuals/wis-ready-to-upload/parts/unimog_portal_axle_parts.json'
];

async function uploadWISFiles() {
  console.log('📤 Uploading WIS Files as text/plain\n');
  
  let uploaded = 0;
  let failed = 0;
  
  for (const filePath of WIS_FILES) {
    try {
      if (!(await fs.access(filePath).then(() => true).catch(() => false))) {
        console.log(`⚠️ File not found: ${filePath}`);
        continue;
      }
      
      const content = await fs.readFile(filePath, 'utf-8');
      const fileName = path.basename(filePath);
      const fileExt = path.extname(fileName);
      const category = filePath.includes('/bulletins/') ? 'bulletins' : 
                     filePath.includes('/manuals/') ? 'manuals' : 
                     filePath.includes('/parts/') ? 'parts' : 'misc';
      
      console.log(`📄 Uploading ${fileName} (${content.length} chars)...`);
      
      // Upload as text/plain to bypass MIME restrictions
      const storagePath = `${category}/${Date.now()}_${fileName}`;
      const { data, error } = await supabase.storage
        .from('wis-manuals')
        .upload(storagePath, content, {
          contentType: 'text/plain', // Use allowed MIME type
          upsert: false
        });
      
      if (error) {
        console.error(`❌ Failed to upload ${fileName}:`, error.message);
        failed++;
      } else {
        console.log(`✅ Uploaded: ${fileName} → ${data.path}`);
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('wis-manuals')
          .getPublicUrl(data.path);
        
        console.log(`   URL: ${urlData.publicUrl}`);
        uploaded++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
      failed++;
    }
    
    console.log('');
  }
  
  console.log('📊 Upload Summary:');
  console.log(`  Uploaded: ${uploaded} files`);
  console.log(`  Failed: ${failed} files`);
  console.log(`  Success Rate: ${((uploaded / WIS_FILES.length) * 100).toFixed(1)}%`);
}

uploadWISFiles().catch(console.error);