#!/usr/bin/env node

/**
 * List all PDF files in the manuals storage bucket
 */

import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

async function listManuals() {
  console.log('📚 Checking manuals in Supabase storage...\n');
  
  try {
    // List files in manuals bucket
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/manuals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prefix: '',
        limit: 1000,
        offset: 0
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to list files: ${error}`);
    }
    
    const files = await response.json();
    
    if (!files || files.length === 0) {
      console.log('❌ No files found in manuals bucket');
      console.log('\nTo add manuals:');
      console.log('1. Go to Supabase Dashboard > Storage');
      console.log('2. Select "manuals" bucket');
      console.log('3. Upload PDF files');
      return;
    }
    
    // Filter PDF files
    const pdfFiles = files.filter(file => 
      file.name && file.name.toLowerCase().endsWith('.pdf')
    );
    
    console.log(`✅ Found ${pdfFiles.length} PDF files in storage:\n`);
    console.log('=' + '='.repeat(50));
    
    pdfFiles.forEach((file, index) => {
      const sizeKB = file.metadata?.size ? (file.metadata.size / 1024).toFixed(2) : '?';
      const uploaded = file.created_at ? new Date(file.created_at).toLocaleDateString() : 'Unknown';
      
      console.log(`\n${index + 1}. ${file.name}`);
      console.log(`   Size: ${sizeKB} KB`);
      console.log(`   Uploaded: ${uploaded}`);
    });
    
    console.log('\n' + '='.repeat(51));
    console.log(`Total: ${pdfFiles.length} PDF files`);
    
    // Check if any are processed
    const processedResponse = await fetch(`${SUPABASE_URL}/rest/v1/manual_chunks?select=filename&limit=1`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });
    
    if (processedResponse.ok) {
      const processed = await processedResponse.json();
      if (processed && processed.length > 0) {
        console.log('\n✅ Some manuals are already processed for Barry AI');
      } else {
        console.log('\n⚠️ No manuals have been processed for Barry AI yet');
        console.log('To process: Go to /admin/manual-processing');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listManuals().catch(console.error);