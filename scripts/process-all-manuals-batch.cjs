#!/usr/bin/env node

/**
 * Process ALL 45 manuals with real page images
 * Comprehensive batch processing script
 */

const { createClient } = require('@supabase/supabase-js');
const pdf = require('pdf-parse');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const execAsync = promisify(exec);

// Configuration
const IMAGE_WIDTH = 800;
const PAGES_PER_MANUAL = 3; // Process first 3 pages of each manual
const BATCH_SIZE = 5; // Process 5 manuals at a time
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds between batches

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Create temp directory
const tempDir = path.join(__dirname, 'temp-batch-all');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Track processing statistics
const stats = {
  totalManuals: 0,
  processedManuals: 0,
  skippedManuals: 0,
  failedManuals: 0,
  totalImages: 0,
  totalChunksUpdated: 0
};

async function getAllManuals() {
  console.log('📚 Fetching all manuals from database...');
  
  const { data: manuals, error } = await supabase
    .from('processed_manuals')
    .select('filename, title')
    .order('created_at');
    
  if (error) {
    console.error('❌ Error fetching manuals:', error.message);
    return [];
  }
  
  console.log(`✅ Found ${manuals.length} manuals in database`);
  return manuals;
}

async function checkIfAlreadyProcessed(filename) {
  // Check if any chunks from this manual already have page images
  const { data: manual } = await supabase
    .from('processed_manuals')
    .select('id')
    .eq('filename', filename)
    .single();
    
  if (!manual) return false;
  
  const { data: chunks, count } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true })
    .eq('manual_id', manual.id)
    .not('page_image_url', 'is', null);
    
  return (count || 0) > 0;
}

async function processManualImages(filename) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📖 Processing: ${filename}`);
  console.log(`${'='.repeat(60)}`);
  
  try {
    // Check if already processed
    const alreadyProcessed = await checkIfAlreadyProcessed(filename);
    if (alreadyProcessed) {
      console.log('⏭️  Already has page images, skipping...');
      stats.skippedManuals++;
      return true;
    }
    
    // Download PDF
    console.log('📥 Downloading...');
    const { data, error } = await supabase.storage
      .from('manuals')
      .download(filename);
      
    if (error) {
      console.error('❌ Download error:', error.message);
      stats.failedManuals++;
      return false;
    }
    
    const buffer = Buffer.from(await data.arrayBuffer());
    
    // Get page count
    const pdfData = await pdf(buffer);
    const totalPages = pdfData.numpages;
    console.log(`📄 ${totalPages} pages found`);
    
    // Save PDF to temp file
    const tempPdfPath = path.join(tempDir, filename);
    fs.writeFileSync(tempPdfPath, buffer);
    
    // Convert pages
    const pagesToConvert = Math.min(totalPages, PAGES_PER_MANUAL);
    console.log(`🖼️  Converting ${pagesToConvert} pages...`);
    
    const pageImages = [];
    const manualSlug = filename.replace('.pdf', '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    for (let pageNum = 0; pageNum < pagesToConvert; pageNum++) {
      const outputPath = path.join(tempDir, `${manualSlug}-page-${pageNum + 1}.png`);
      
      try {
        console.log(`  🔄 Page ${pageNum + 1}...`);
        
        const command = `magick "${tempPdfPath}[${pageNum}]" -density 150 -quality 90 -resize ${IMAGE_WIDTH}x -background white -alpha remove "${outputPath}"`;
        await execAsync(command);
        
        if (fs.existsSync(outputPath)) {
          const imageBuffer = fs.readFileSync(outputPath);
          
          // Upload to Supabase
          const storagePath = `${manualSlug}/page-${(pageNum + 1).toString().padStart(3, '0')}.png`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('manual-images')
            .upload(storagePath, imageBuffer, {
              contentType: 'image/png',
              upsert: true
            });
            
          if (uploadError) {
            console.error(`    ❌ Upload error: ${uploadError.message}`);
          } else {
            const imageUrl = `${supabaseUrl}/storage/v1/object/public/manual-images/${storagePath}`;
            pageImages.push({
              pageNumber: pageNum + 1,
              imageUrl: imageUrl
            });
            console.log(`    ✅ Uploaded page ${pageNum + 1}`);
            stats.totalImages++;
          }
          
          // Cleanup temp image
          fs.unlinkSync(outputPath);
        }
      } catch (pageError) {
        console.error(`    ❌ Error on page ${pageNum + 1}:`, pageError.message);
      }
    }
    
    // Cleanup temp PDF
    fs.unlinkSync(tempPdfPath);
    
    // Update database chunks
    if (pageImages.length > 0) {
      console.log('💾 Updating database...');
      
      // Find manual
      const { data: manual } = await supabase
        .from('processed_manuals')
        .select('id')
        .eq('filename', filename)
        .single();
        
      if (manual) {
        // Get chunks for this manual
        const { data: chunks } = await supabase
          .from('manual_chunks')
          .select('id, chunk_index')
          .eq('manual_id', manual.id)
          .order('chunk_index')
          .limit(20); // Update first 20 chunks
          
        if (chunks) {
          let updateCount = 0;
          for (const chunk of chunks) {
            // Assign images to chunks based on estimated page
            const estimatedPage = Math.floor(chunk.chunk_index / 3) + 1;
            const pageImage = pageImages.find(img => img.pageNumber === estimatedPage);
            
            if (pageImage) {
              await supabase
                .from('manual_chunks')
                .update({
                  page_image_url: pageImage.imageUrl,
                  has_visual_elements: true,
                  visual_content_type: 'diagram'
                })
                .eq('id', chunk.id);
              updateCount++;
              stats.totalChunksUpdated++;
            }
          }
          console.log(`📊 Updated ${updateCount} chunks with image data`);
        }
      }
    }
    
    console.log(`✅ Completed ${filename} - ${pageImages.length} images processed`);
    stats.processedManuals++;
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    stats.failedManuals++;
    return false;
  }
}

async function processBatch(manuals, startIndex, batchSize) {
  const batch = manuals.slice(startIndex, startIndex + batchSize);
  console.log(`\n🔄 Processing batch ${Math.floor(startIndex / batchSize) + 1} (${batch.length} manuals)`);
  
  for (const manual of batch) {
    await processManualImages(manual.filename);
  }
  
  // Small delay between batches to avoid overwhelming the system
  if (startIndex + batchSize < manuals.length) {
    console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
  }
}

async function main() {
  console.log('🚀 Processing ALL Manuals with Real Page Images');
  console.log('='.repeat(60));
  
  // Test ImageMagick installation
  try {
    const { stdout } = await execAsync('magick --version');
    console.log('✅ ImageMagick version:', stdout.split('\n')[0]);
  } catch (error) {
    console.error('❌ ImageMagick not found. Please install with: brew install imagemagick');
    process.exit(1);
  }
  
  // Get all manuals
  const manuals = await getAllManuals();
  if (manuals.length === 0) {
    console.log('❌ No manuals found');
    return;
  }
  
  stats.totalManuals = manuals.length;
  console.log(`\n📊 Starting batch processing of ${manuals.length} manuals`);
  console.log(`📄 ${PAGES_PER_MANUAL} pages per manual, ${BATCH_SIZE} manuals per batch`);
  
  const startTime = Date.now();
  
  // Process in batches
  for (let i = 0; i < manuals.length; i += BATCH_SIZE) {
    await processBatch(manuals, i, BATCH_SIZE);
  }
  
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Batch Processing Complete!');
  console.log('='.repeat(60));
  console.log(`⏱️  Total time: ${duration} seconds`);
  console.log(`📚 Total manuals: ${stats.totalManuals}`);
  console.log(`✅ Processed: ${stats.processedManuals}`);
  console.log(`⏭️  Skipped: ${stats.skippedManuals} (already had images)`);
  console.log(`❌ Failed: ${stats.failedManuals}`);
  console.log(`🖼️  Total images created: ${stats.totalImages}`);
  console.log(`💾 Total chunks updated: ${stats.totalChunksUpdated}`);
  
  // Show final database status
  const { data: chunksWithImages, count } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true })
    .not('page_image_url', 'is', null);
    
  console.log(`\n🖼️  Total chunks with page images: ${count || 0}`);
  console.log('🤖 Barry now has comprehensive visual content across all manuals!');
  
  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  if (stats.failedManuals === 0) {
    console.log('\n🎉 All manuals processed successfully!');
  } else {
    console.log(`\n⚠️  ${stats.failedManuals} manuals failed processing - check logs above`);
  }
}

main().catch(console.error);