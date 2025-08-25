#!/usr/bin/env node

/**
 * Process multiple manuals with real page images
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
const MANUALS_TO_PROCESS = [
  'G603-Unimog-all-types-Light-Repair.pdf',
  'G604-1-Unimog-all-types-Medium-Repair.pdf',
  'G609-10-Overhaul-of-Brake-Caliper-Assemblies.pdf',
  'G618-1-Unimog-all-types-Technical-Inspection.pdf'
];

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Create temp directory
const tempDir = path.join(__dirname, 'temp-batch');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

async function processManualImages(filename) {
  console.log('\\n' + '='.repeat(50));
  console.log(`📖 Processing: ${filename}`);
  console.log('='.repeat(50));
  
  try {
    // Download PDF
    console.log('📥 Downloading...');
    const { data, error } = await supabase.storage
      .from('manuals')
      .download(filename);
      
    if (error) {
      console.error('❌ Download error:', error.message);
      return false;
    }
    
    const buffer = Buffer.from(await data.arrayBuffer());
    
    // Get page count
    const pdfData = await pdf(buffer);
    console.log(`📄 ${pdfData.numpages} pages found`);
    
    // Save PDF to temp file
    const tempPdfPath = path.join(tempDir, filename);
    fs.writeFileSync(tempPdfPath, buffer);
    
    // Convert first 2 pages for each manual
    const pagesToConvert = Math.min(pdfData.numpages, 2);
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
          .limit(10); // Update first 10 chunks
          
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
            }
          }
          console.log(`📊 Updated ${updateCount} chunks with image data`);
        }
      }
    }
    
    console.log(`✅ Completed ${filename} - ${pageImages.length} images processed`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Processing Multiple Manuals with Real Page Images');
  console.log('='.repeat(60));
  
  let successCount = 0;
  let failCount = 0;
  
  for (const filename of MANUALS_TO_PROCESS) {
    const success = await processManualImages(filename);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log('\\n' + '='.repeat(60));
  console.log('📊 Batch Processing Complete!');
  console.log(`✅ Success: ${successCount} manuals`);
  console.log(`❌ Failed: ${failCount} manuals`);
  
  // Show final status
  const { data: chunksWithImages, count } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true })
    .not('page_image_url', 'is', null);
    
  console.log(`\\n🖼️  Total chunks with page images: ${count || 0}`);
  console.log('🤖 Barry now has enhanced visual content!');
  
  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
}

main().catch(console.error);