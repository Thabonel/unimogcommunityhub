#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.error('Get it from: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/api');
  console.error('Then run: export SUPABASE_SERVICE_ROLE_KEY="your-key-here"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function renamePendingManuals() {
  console.log('🔍 Searching for manuals with "pending" in their names...\n');

  try {
    // List all files in the manuals bucket
    const { data: files, error: listError } = await supabase.storage
      .from('manuals')
      .list('', { limit: 1000 });

    if (listError) {
      throw new Error(`Failed to list files: ${listError.message}`);
    }

    // Filter files with "pending" in the name
    const pendingFiles = files.filter(file =>
      file.name.toLowerCase().includes('pending')
    );

    if (pendingFiles.length === 0) {
      console.log('✅ No files with "pending" in their names found.');
      return;
    }

    console.log(`Found ${pendingFiles.length} file(s) with "pending" in the name:\n`);

    // Process each file
    for (const file of pendingFiles) {
      const oldName = file.name;

      // Generate new name by removing "pending_" patterns
      let newName = oldName;

      // Remove various pending patterns
      newName = newName.replace(/pending_\d+_[a-z0-9]+_\d+\s*[-_]\s*/gi, '');
      newName = newName.replace(/pending_\d+_[a-z0-9]+_/gi, '');
      newName = newName.replace(/pending_\d+_/gi, '');
      newName = newName.replace(/pending[-_]/gi, '');
      newName = newName.replace(/^pending/gi, '');

      // Clean up any double spaces or underscores
      newName = newName.replace(/\s+/g, ' ').trim();
      newName = newName.replace(/__+/g, '_');
      newName = newName.replace(/--+/g, '-');

      // Ensure the filename still has .pdf extension
      if (!newName.toLowerCase().endsWith('.pdf')) {
        newName = newName.replace(/\.pdf$/i, '') + '.pdf';
      }

      // Skip if the new name is the same
      if (newName === oldName) {
        console.log(`⚠️  Skipping "${oldName}" - no change needed`);
        continue;
      }

      console.log(`📝 Renaming:`);
      console.log(`   From: ${oldName}`);
      console.log(`   To:   ${newName}`);

      // Copy the file with the new name
      const { error: copyError } = await supabase.storage
        .from('manuals')
        .copy(oldName, newName);

      if (copyError) {
        console.error(`   ❌ Failed to copy: ${copyError.message}`);
        continue;
      }

      // Delete the old file
      const { error: deleteError } = await supabase.storage
        .from('manuals')
        .remove([oldName]);

      if (deleteError) {
        console.error(`   ⚠️  File copied but failed to delete original: ${deleteError.message}`);
        console.error(`      You may need to manually delete: ${oldName}`);
      } else {
        console.log(`   ✅ Successfully renamed!`);
      }

      // Update the manual_metadata table if the record exists
      const { data: metadata, error: metaError } = await supabase
        .from('manual_metadata')
        .select('id')
        .eq('filename', oldName)
        .single();

      if (metadata && !metaError) {
        const { error: updateError } = await supabase
          .from('manual_metadata')
          .update({
            filename: newName,
            title: newName.replace('.pdf', '').replace(/[-_]/g, ' '),
            updated_at: new Date().toISOString()
          })
          .eq('id', metadata.id);

        if (updateError) {
          console.error(`   ⚠️  Failed to update metadata: ${updateError.message}`);
        } else {
          console.log(`   ✅ Metadata updated`);
        }
      }

      // Also update manual_chunks if they exist
      if (metadata && !metaError) {
        const { error: chunksError } = await supabase
          .from('manual_chunks')
          .update({
            manual_filename: newName,
            updated_at: new Date().toISOString()
          })
          .eq('manual_id', metadata.id);

        if (!chunksError) {
          console.log(`   ✅ Chunks updated`);
        }
      }

      console.log('');
    }

    console.log('\n✨ Rename operation completed!');

    // Show final list of files
    console.log('\n📁 Current files in manuals bucket:');
    const { data: finalFiles } = await supabase.storage
      .from('manuals')
      .list('', { limit: 1000 });

    if (finalFiles) {
      finalFiles
        .filter(f => f.name.endsWith('.pdf'))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(file => {
          const sizeInMB = (file.metadata?.size || 0) / (1024 * 1024);
          console.log(`   - ${file.name} (${sizeInMB.toFixed(2)} MB)`);
        });
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
renamePendingManuals().catch(console.error);