#!/usr/bin/env node

/**
 * Enhanced Manual Processing Script using ImageMagick
 * Processes PDFs to extract both text chunks AND page images
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
const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 200;
const IMAGE_WIDTH = 800; // Max width for page images

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Connected to Supabase');

// Create temp directory for processing
const tempDir = path.join(__dirname, 'temp-imagemagick');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

async function downloadManual(filename) {
  console.log(`📥 Downloading ${filename}...`);
  
  const { data, error } = await supabase.storage
    .from('manuals')
    .download(filename);

  if (error) {
    console.error(`❌ Error downloading: ${error.message}`);
    return null;
  }

  console.log(`✅ Downloaded ${filename}`);
  return data;
}

async function extractText(pdfBuffer) {
  try {
    const data = await pdf(pdfBuffer);
    console.log(`📄 Extracted text from ${data.numpages} pages`);
    return { text: data.text, pageCount: data.numpages };
  } catch (error) {
    console.error('❌ Error extracting text:', error.message);
    return null;
  }
}

async function extractPageImages(pdfBuffer, filename) {
  console.log(`🖼️  Extracting page images using ImageMagick...`);
  
  try {
    // Save PDF to temp file
    const tempPdfPath = path.join(tempDir, `${filename}.pdf`);
    fs.writeFileSync(tempPdfPath, pdfBuffer);
    
    // Get page count
    const pdfData = await pdf(pdfBuffer);
    const pageCount = pdfData.numpages;
    
    console.log(`Converting ${Math.min(pageCount, 3)} pages (limited for testing)...`);
    
    const pageImages = [];
    
    // Convert each page using ImageMagick
    for (let pageNum = 0; pageNum < Math.min(pageCount, 3); pageNum++) {
      const outputPath = path.join(tempDir, `page-${pageNum + 1}.png`);
      
      try {
        console.log(`  🔄 Converting page ${pageNum + 1}...`);
        
        // Use ImageMagick to convert PDF page to PNG
        const command = `magick "${tempPdfPath}[${pageNum}]" -density 150 -quality 90 -resize ${IMAGE_WIDTH}x -background white -alpha remove "${outputPath}"`;
        
        const { stdout, stderr } = await execAsync(command);
        
        if (fs.existsSync(outputPath)) {
          const buffer = fs.readFileSync(outputPath);
          
          pageImages.push({
            pageNumber: pageNum + 1,
            buffer: buffer,
            filename: `page-${(pageNum + 1).toString().padStart(3, '0')}.png`
          });
          
          console.log(`  ✅ Converted page ${pageNum + 1} (${buffer.length} bytes)`);
          
          // Cleanup temp file
          fs.unlinkSync(outputPath);
        } else {
          console.log(`  ⚠️  No output file generated for page ${pageNum + 1}`);
        }
      } catch (pageError) {
        console.error(`  ❌ Error converting page ${pageNum + 1}:`, pageError.message);
      }
    }
    
    // Cleanup temp PDF
    fs.unlinkSync(tempPdfPath);
    
    console.log(`🖼️  Successfully extracted ${pageImages.length} page images`);
    return pageImages;
    
  } catch (error) {
    console.error('❌ Error extracting page images:', error.message);
    return [];
  }
}

async function uploadPageImages(pageImages, filename) {
  console.log(`☁️  Uploading page images to Supabase Storage...`);
  
  const uploadedImages = [];
  const manualSlug = filename.replace('.pdf', '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  for (const pageImage of pageImages) {
    try {
      const storagePath = `${manualSlug}/${pageImage.filename}`;
      
      const { data, error } = await supabase.storage
        .from('manual-images')
        .upload(storagePath, pageImage.buffer, {
          contentType: 'image/png',
          upsert: true
        });
      
      if (error) {
        console.error(`  ❌ Error uploading page ${pageImage.pageNumber}:`, error.message);
      } else {
        const imageUrl = `${supabaseUrl}/storage/v1/object/public/manual-images/${storagePath}`;
        uploadedImages.push({
          pageNumber: pageImage.pageNumber,
          imageUrl: imageUrl
        });
        console.log(`  ✅ Uploaded page ${pageImage.pageNumber}`);
      }
    } catch (uploadError) {
      console.error(`  ❌ Upload error for page ${pageImage.pageNumber}:`, uploadError.message);
    }
  }
  
  console.log(`☁️  Successfully uploaded ${uploadedImages.length} images`);
  return uploadedImages;
}

function createChunks(text, pageImages) {
  const chunks = [];
  const words = text.split(/\\s+/);
  
  for (let i = 0; i < words.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(' ');
    if (chunk.trim().length > 100) {
      const chunkIndex = chunks.length;
      const estimatedPageNumber = Math.floor(chunkIndex / 3) + 1;
      
      // Find corresponding page image
      const pageImage = pageImages.find(img => img.pageNumber === estimatedPageNumber);
      
      chunks.push({
        content: chunk,
        chunkIndex: chunkIndex,
        pageNumber: estimatedPageNumber,
        pageImageUrl: pageImage ? pageImage.imageUrl : null,
        hasVisualElements: !!pageImage,
        visualContentType: pageImage ? 'mixed' : 'text'
      });
    }
  }
  
  console.log(`✂️  Created ${chunks.length} chunks with ${pageImages.length} linked page images`);
  return chunks;
}

async function updateChunksWithImages(filename, chunks) {
  console.log('💾 Updating existing chunks with image data...');
  
  // Find the manual in processed_manuals
  const { data: manual, error: manualError } = await supabase
    .from('processed_manuals')
    .select('id')
    .eq('filename', filename)
    .single();
    
  if (manualError || !manual) {
    console.error('❌ Manual not found in processed_manuals:', filename);
    return false;
  }
  
  // Get existing chunks for this manual
  const { data: existingChunks, error: chunksError } = await supabase
    .from('manual_chunks')
    .select('id, chunk_index')
    .eq('manual_id', manual.id)
    .order('chunk_index');
    
  if (chunksError) {
    console.error('❌ Error fetching existing chunks:', chunksError.message);
    return false;
  }
  
  console.log(`Found ${existingChunks?.length || 0} existing chunks to update`);
  
  // Update chunks with image data
  let updatedCount = 0;
  for (const chunk of chunks) {
    const existingChunk = existingChunks?.find(ec => ec.chunk_index === chunk.chunkIndex);
    
    if (existingChunk) {
      const { error: updateError } = await supabase
        .from('manual_chunks')
        .update({
          page_image_url: chunk.pageImageUrl,
          has_visual_elements: chunk.hasVisualElements,
          visual_content_type: chunk.visualContentType
        })
        .eq('id', existingChunk.id);
        
      if (updateError) {
        console.error(`❌ Error updating chunk ${existingChunk.id}:`, updateError.message);
      } else {
        updatedCount++;
      }
    }
  }
  
  console.log(`✅ Updated ${updatedCount} chunks with image data`);
  return true;
}

async function processManual(filename) {
  console.log('\\n' + '='.repeat(60));
  console.log(`Processing: ${filename}`);
  console.log('='.repeat(60));

  try {
    // Download PDF
    const pdfBlob = await downloadManual(filename);
    if (!pdfBlob) return false;

    // Convert to buffer
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());

    // Extract text
    const textResult = await extractText(buffer);
    if (!textResult) return false;

    // Extract page images
    const pageImages = await extractPageImages(buffer, filename);
    
    // Upload page images to Supabase Storage
    const uploadedImages = await uploadPageImages(pageImages, filename);

    // Create chunks with image links
    const chunks = createChunks(textResult.text, uploadedImages);

    // Update existing chunks with image data
    return await updateChunksWithImages(filename, chunks);
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('\\n🚀 Processing Manuals with ImageMagick');
  console.log('='.repeat(60));
  
  // Test ImageMagick installation
  try {
    const { stdout } = await execAsync('magick --version');
    console.log('✅ ImageMagick version:', stdout.split('\\n')[0]);
  } catch (error) {
    console.error('❌ ImageMagick not found. Please install with: brew install imagemagick');
    process.exit(1);
  }

  // For testing, process just the first manual
  const testFilename = 'G600-Data-Summary.pdf';
  console.log(`\\nProcessing test manual: ${testFilename}`);

  const success = await processManual(testFilename);
  
  if (success) {
    console.log('\\n✅ Test processing complete!');
    console.log('🔗 Check the Barry interface to see page images');
    console.log('🖼️  Images stored in manual-images bucket');
  } else {
    console.log('\\n❌ Test processing failed');
  }
  
  // Cleanup temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
}

// Run immediately
main().catch(error => {
  console.error('\\n❌ Fatal error:', error.message);
  console.error(error.stack);
  process.exit(1);
});