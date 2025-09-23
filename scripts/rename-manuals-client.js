#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_ANON_KEY = <SUPABASE_ANON_KEY>

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function renamePendingManuals() {
  console.log('🔄 Calling rename-manuals Edge Function...\n');

  try {
    // First, let's sign in as admin (you'll need to be logged in)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('⚠️  You need to be logged in. Attempting to sign in...');

      // Try to sign in with the admin account
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'thabonel0@gmail.com',
        password: 'password123' // You'll need to provide the actual password
      });

      if (signInError) {
        console.error('❌ Failed to sign in:', signInError.message);
        console.log('\nPlease sign in manually first and then run this script again.');
        process.exit(1);
      }
    }

    // Call the Edge Function to rename manuals
    const { data, error } = await supabase.functions.invoke('rename-manuals');

    if (error) {
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (!data || !data.success) {
      throw new Error(`Processing failed: ${data?.error || 'Unknown error'}`);
    }

    // Display results
    console.log('✅ Rename operation completed!\n');

    if (data.processed && data.processed.length > 0) {
      console.log('📝 Processed files:');
      data.processed.forEach(result => {
        const icon = result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⚠️';
        console.log(`   ${icon} ${result.oldName}`);
        if (result.status === 'success') {
          console.log(`      → ${result.newName}`);
        } else {
          console.log(`      ${result.message}`);
        }
      });
    }

    if (data.currentFiles && data.currentFiles.length > 0) {
      console.log('\n📁 Current files in manuals bucket:');
      data.currentFiles
        .filter(f => f.name.endsWith('.pdf'))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(file => {
          const sizeInMB = file.size / (1024 * 1024);
          console.log(`   - ${file.name} (${sizeInMB.toFixed(2)} MB)`);
        });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
renamePendingManuals().catch(console.error);