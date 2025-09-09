#!/usr/bin/env node

/**
 * Create WIS Bucket Directly
 * Creates the wis-manuals bucket using direct API calls
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Creating WIS Infrastructure Directly\n');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createBucket() {
  console.log('📦 Creating wis-manuals bucket...');
  
  // First try to create the bucket
  const { data, error } = await supabase.storage.createBucket('wis-manuals', {
    public: true,
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png', 
      'image/webp',
      'text/plain',
      'application/zip'
    ],
    fileSizeLimit: 52428800 // 50MB
  });
  
  if (error) {
    console.error('❌ Bucket creation failed:', error);
    return false;
  }
  
  console.log('✅ Bucket created successfully:', data);
  return true;
}

async function createTable() {
  console.log('\n💾 Creating wis_documents table...');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS public.wis_documents (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size BIGINT,
      file_hash TEXT UNIQUE,
      category TEXT,
      original_path TEXT,
      uploaded_at TIMESTAMPTZ DEFAULT NOW(),
      metadata JSONB DEFAULT '{}'
    );
    
    CREATE INDEX IF NOT EXISTS idx_wis_documents_hash ON public.wis_documents(file_hash);
    CREATE INDEX IF NOT EXISTS idx_wis_documents_category ON public.wis_documents(category);
    
    ALTER TABLE public.wis_documents ENABLE ROW LEVEL SECURITY;
  `;
  
  try {
    // Use rpc to execute raw SQL
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    });
    
    if (error) {
      console.error('❌ Table creation failed:', error);
      console.log('Trying alternative method...');
      
      // Alternative: Try inserting into a test table to see if it exists
      const { data: testData, error: testError } = await supabase
        .from('wis_documents')
        .select('id')
        .limit(1);
      
      if (testError && testError.code === '42P01') {
        console.log('Table definitely does not exist');
        return false;
      } else {
        console.log('✅ Table appears to exist or was created');
        return true;
      }
    }
    
    console.log('✅ Table created successfully');
    return true;
  } catch (error) {
    console.error('❌ Table creation error:', error);
    return false;
  }
}

async function testUpload() {
  console.log('\n📤 Testing file upload...');
  
  const testContent = `WIS Test File
Created: ${new Date().toISOString()}
Purpose: Testing WIS upload functionality`;
  
  const fileName = `test-${Date.now()}.txt`;
  
  try {
    const { data, error } = await supabase.storage
      .from('wis-manuals')
      .upload(`test/${fileName}`, testContent, {
        contentType: 'text/plain'
      });
    
    if (error) {
      console.error('❌ Upload failed:', error);
      return false;
    }
    
    console.log('✅ Upload successful:', data.path);
    
    // Try to get the public URL
    const { data: urlData } = supabase.storage
      .from('wis-manuals')
      .getPublicUrl(data.path);
    
    console.log('📄 Public URL:', urlData.publicUrl);
    
    // Clean up test file
    await supabase.storage
      .from('wis-manuals')
      .remove([data.path]);
    
    console.log('🗑️ Cleaned up test file');
    
    return true;
  } catch (error) {
    console.error('❌ Upload test failed:', error);
    return false;
  }
}

async function main() {
  try {
    // Create bucket
    const bucketOk = await createBucket();
    
    // Create table
    const tableOk = await createTable();
    
    // Test upload if bucket was created
    let uploadOk = false;
    if (bucketOk) {
      uploadOk = await testUpload();
    }
    
    console.log('\n📊 Results:');
    console.log('  Bucket:', bucketOk ? '✅' : '❌');
    console.log('  Table:', tableOk ? '✅' : '❌');
    console.log('  Upload:', uploadOk ? '✅' : '❌');
    
    if (bucketOk && tableOk && uploadOk) {
      console.log('\n🎉 WIS infrastructure created successfully!');
      console.log('You can now run: npm run wis:upload');
    } else {
      console.log('\n⚠️ Some components failed to create');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

main().catch(console.error);