#!/usr/bin/env node

/**
 * Script to apply profile display name fixes
 * Run this to ensure all profiles have proper display names
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixProfiles() {
  console.log('🔄 Starting profile display name fix...\n');

  try {
    // 1. Fetch all profiles that need fixing
    console.log('📋 Fetching profiles with missing display names...');
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, display_name, full_name')
      .or('display_name.is.null,full_name.is.null');

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${profiles?.length || 0} profiles that need fixing.\n`);

    if (!profiles || profiles.length === 0) {
      console.log('✅ All profiles already have display names!');
      return;
    }

    // 2. Update each profile
    let successCount = 0;
    let errorCount = 0;

    for (const profile of profiles) {
      const emailUsername = profile.email?.split('@')[0] || 'user';
      
      const updateData = {
        display_name: profile.display_name || profile.full_name || emailUsername,
        full_name: profile.full_name || profile.display_name || emailUsername,
        updated_at: new Date().toISOString()
      };

      console.log(`Updating profile for ${profile.email}:`);
      console.log(`  display_name: ${updateData.display_name}`);
      console.log(`  full_name: ${updateData.full_name}`);

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (updateError) {
        console.error(`  ❌ Error: ${updateError.message}`);
        errorCount++;
      } else {
        console.log(`  ✅ Updated successfully`);
        successCount++;
      }
      console.log('');
    }

    // 3. Summary
    console.log('📊 Summary:');
    console.log(`  ✅ Successfully updated: ${successCount} profiles`);
    if (errorCount > 0) {
      console.log(`  ❌ Failed to update: ${errorCount} profiles`);
    }

    // 4. Verify the fix
    console.log('\n🔍 Verifying the fix...');
    const { data: remainingProfiles, error: verifyError } = await supabase
      .from('profiles')
      .select('id')
      .or('display_name.is.null,full_name.is.null');

    if (verifyError) {
      console.error('Could not verify:', verifyError);
    } else {
      if (remainingProfiles && remainingProfiles.length > 0) {
        console.log(`⚠️  ${remainingProfiles.length} profiles still need fixing.`);
      } else {
        console.log('✅ All profiles now have display names!');
      }
    }

  } catch (error) {
    console.error('❌ Error fixing profiles:', error);
    process.exit(1);
  }
}

// Run the fix
fixProfiles().then(() => {
  console.log('\n✨ Profile fix complete!');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});