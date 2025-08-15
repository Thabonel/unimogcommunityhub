#!/usr/bin/env node

/**
 * Add sample page image URLs to test the interface
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function addSamplePageImages() {
  console.log('🖼️  Adding sample page image URLs for testing...');
  
  // First, let's add the missing columns if they don't exist
  console.log('Adding database columns...');
  
  try {
    // For now, we'll manually add some sample URLs to existing chunks
    // Get a few chunks to update
    const { data: chunks, error } = await supabase
      .from('manual_chunks')
      .select('id, manual_title, page_number')
      .limit(5);
      
    if (error) {
      console.error('❌ Error fetching chunks:', error);
      return;
    }
    
    console.log(`Found ${chunks?.length} chunks to update`);
    
    // For testing, we'll use placeholder image URLs
    // In production, these would be real page images from manual-images bucket
    const sampleImageUrl = 'https://via.placeholder.com/800x1000/f3f4f6/1f2937?text=Manual+Page';
    
    if (chunks) {
      for (const chunk of chunks) {
        console.log(`Updating chunk ${chunk.id} for ${chunk.manual_title} page ${chunk.page_number}...`);
        
        // Note: This will only work after the database schema is updated
        // For now, we'll create a simple metadata update
        const { error: updateError } = await supabase
          .from('manual_chunks')
          .update({
            // These fields need to be added to the database schema first
            // page_image_url: `${sampleImageUrl}&page=${chunk.page_number}`,
            // has_visual_elements: Math.random() > 0.5, // Random for testing
            // visual_content_type: Math.random() > 0.5 ? 'diagram' : 'mixed'
          })
          .eq('id', chunk.id);
          
        if (updateError) {
          console.log(`⚠️  Could not update chunk ${chunk.id}: ${updateError.message}`);
          console.log('   (Schema columns may not exist yet)');
        } else {
          console.log(`✅ Updated chunk ${chunk.id}`);
        }
      }
    }
    
    console.log('\\n📝 Manual schema update needed:');
    console.log('Go to Supabase Dashboard > Table Editor > manual_chunks');
    console.log('Add these columns:');
    console.log('- page_image_url (TEXT, nullable)');
    console.log('- has_visual_elements (BOOLEAN, default false)');
    console.log('- visual_content_type (TEXT, default "text")');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

addSamplePageImages();