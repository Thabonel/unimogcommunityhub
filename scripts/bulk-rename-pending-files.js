#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanFileName(originalName) {
  // Remove the "pending_" prefix and timestamp/random string
  // Format: pending_1758512873087_zqwm4uvsri_00 - General.pdf
  // Extract: 00 - General.pdf

  if (!originalName.startsWith('pending_')) {
    return originalName;
  }

  // Split by underscores and take everything after the third underscore
  const parts = originalName.split('_');
  if (parts.length >= 4) {
    // Join everything from the third underscore onwards
    const cleanName = parts.slice(3).join('_');
    return cleanName;
  }

  // Fallback: just remove "pending_" prefix
  return originalName.replace('pending_', '');
}

async function bulkRenamePendingFiles() {
  console.log('🚀 Starting bulk rename of pending files...\n');

  try {
    // Get all pending files
    const { data: files, error: listError } = await supabase.storage
      .from('manuals')
      .list('', {
        limit: 100,
        search: 'pending_'
      });

    if (listError) {
      console.error('❌ Error listing files:', listError);
      return;
    }

    const pendingFiles = files.filter(file => file.name.startsWith('pending_'));

    if (pendingFiles.length === 0) {
      console.log('✅ No pending files found to rename');
      return;
    }

    console.log(`📁 Found ${pendingFiles.length} pending files to rename:\n`);

    const renameOperations = [];

    for (const file of pendingFiles) {
      const oldName = file.name;
      const newName = await cleanFileName(oldName);

      console.log(`📝 ${oldName}`);
      console.log(`   → ${newName}\n`);

      renameOperations.push({ oldName, newName });
    }

    // Confirm before proceeding
    console.log('⚠️  This will rename all the above files. Continue? (Press Ctrl+C to cancel)\n');
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second pause

    console.log('🔄 Starting rename operations...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const { oldName, newName } of renameOperations) {
      try {
        // Check if target name already exists
        const { data: existingFile } = await supabase.storage
          .from('manuals')
          .download(newName);

        if (existingFile) {
          console.log(`⚠️  File ${newName} already exists, skipping...`);
          continue;
        }
      } catch (e) {
        // File doesn't exist, proceed with rename
      }

      // Move/rename the file
      const { error: moveError } = await supabase.storage
        .from('manuals')
        .move(oldName, newName);

      if (moveError) {
        console.log(`❌ Error renaming ${oldName}: ${moveError.message}`);
        errorCount++;
      } else {
        console.log(`✅ Renamed: ${oldName} → ${newName}`);
        successCount++;
      }
    }

    console.log(`\n📊 Rename Summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📁 Total processed: ${successCount + errorCount}`);

    if (successCount > 0) {
      console.log(`\n🎉 Successfully cleaned up ${successCount} pending files!`);
      console.log(`\n📝 Next steps:`);
      console.log(`   1. Check the admin interface to verify files appear correctly`);
      console.log(`   2. Update any database references if needed`);
      console.log(`   3. Test file downloads to ensure they work`);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
bulkRenamePendingFiles().catch(console.error);