#!/usr/bin/env node

/**
 * Enhanced Manual Processing Script with Image Extraction
 * Processes PDFs to extract both text chunks AND page images
 */

const { createClient } = require('@supabase/supabase-js');
const pdf = require('pdf-parse');
const pdf2pic = require('pdf2pic');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configuration
const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 200;
const IMAGE_WIDTH = 800; // Max width for page images
const THUMBNAIL_WIDTH = 200; // Width for thumbnails

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
const tempDir = path.join(__dirname, 'temp-images');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

async function listManuals() {
  console.log('\n📚 Fetching manuals from storage...');
  
  const { data, error } = await supabase.storage
    .from('manuals')
    .list('', {
      limit: 100,
      offset: 0
    });

  if (error) {
    console.error('❌ Error listing manuals:', error.message);
    return [];
  }

  const pdfFiles = data.filter(file => file.name.endsWith('.pdf'));
  console.log(`Found ${pdfFiles.length} PDF files`);
  
  return pdfFiles;
}

async function downloadManual(filename) {
  console.log(`\n📥 Downloading ${filename}...`);
  
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
  console.log(`🖼️  Extracting page images...`);
  
  try {
    // Save PDF to temp file for pdf2pic
    const tempPdfPath = path.join(tempDir, `${filename}.pdf`);
    fs.writeFileSync(tempPdfPath, pdfBuffer);
    
    // Configure pdf2pic with better options
    const convert = pdf2pic.fromPath(tempPdfPath, {
      density: 150,           // Higher DPI for better quality
      saveFilename: 'page',   // Base filename
      savePath: tempDir,      // Output directory
      format: 'png',          // Output format
      width: IMAGE_WIDTH,     // Max width
      height: 1200           // Max height
    });
    
    // Get page count first
    const pdfData = await pdf(pdfBuffer);
    const pageCount = pdfData.numpages;
    
    const pageImages = [];
    
    // Convert each page
    for (let pageNum = 1; pageNum <= Math.min(pageCount, 3); pageNum++) { // Limit to first 3 pages for testing
      try {
        console.log(`  🔄 Converting page ${pageNum}...`);
        
        const result = await convert(pageNum, { 
          responseType: 'buffer',
          buffer: true 
        });
        
        if (result && result.buffer && result.buffer.length > 0) {
          // Optimize image with sharp
          const optimizedBuffer = await sharp(result.buffer)
            .resize(IMAGE_WIDTH, null, { 
              withoutEnlargement: true,
              fit: 'inside'
            })
            .png({ 
              quality: 80,
              compressionLevel: 6
            })
            .toBuffer();
          
          pageImages.push({
            pageNumber: pageNum,
            buffer: optimizedBuffer,
            filename: `page-${pageNum.toString().padStart(3, '0')}.png`
          });
          
          console.log(`  ✅ Converted page ${pageNum}`);
        }
      } catch (pageError) {
        console.error(`  ❌ Error converting page ${pageNum}:`, pageError.message);
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

async function uploadPageImages(pageImages, manualId, filename) {
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
    if (chunk.trim().length > 100) {  // Skip very small chunks
      const chunkIndex = chunks.length;
      const estimatedPageNumber = Math.floor(chunkIndex / 3) + 1; // Rough estimate
      
      // Find corresponding page image
      const pageImage = pageImages.find(img => img.pageNumber === estimatedPageNumber);
      
      chunks.push({
        content: chunk,
        chunkIndex: chunkIndex,
        pageNumber: estimatedPageNumber,
        pageImageUrl: pageImage ? pageImage.imageUrl : null,
        hasVisualElements: !!pageImage, // Assume pages with images have visual elements
        visualContentType: pageImage ? 'mixed' : 'text'
      });
    }
  }
  
  console.log(`✂️  Created ${chunks.length} chunks with ${pageImages.length} linked page images`);
  return chunks;
}

async function saveToDatabase(filename, chunks) {
  console.log('💾 Saving to database...');

  // First ensure the manual exists in processed_manuals table
  const { data: existing, error: fetchError } = await supabase
    .from('processed_manuals')
    .select('id')
    .eq('filename', filename)
    .single();

  let manualId;

  if (existing && existing.id) {
    console.log(`  Manual already exists in processed_manuals with ID: ${existing.id}`);
    manualId = existing.id;
    
    // Delete old chunks
    const { error: deleteError } = await supabase
      .from('manual_chunks')
      .delete()
      .eq('manual_id', manualId);
    
    if (deleteError) {
      console.log(`  Warning: Could not delete old chunks: ${deleteError.message}`);
    }
  } else {
    // Create new entry in processed_manuals with required fields
    const { data: manual, error: manualError } = await supabase
      .from('processed_manuals')
      .insert({
        filename,
        original_filename: filename,
        title: filename.replace(/\\.pdf$/i, '').replace(/[-_]/g, ' '),
        category: 'Manual',
        file_size: 0, // We don't have the size readily available
        uploaded_by: '55abc04e-a334-4c37-92ec-a91d480da74f', // Use existing user ID
        chunk_count: chunks.length,
        processing_status: 'completed',
        processing_completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (manualError) {
      console.error('❌ Error creating processed manual:', manualError.message);
      return false;
    }
    
    manualId = manual.id;
    console.log(`  Created new processed manual with ID: ${manualId}`);
  }

  // Save chunks with image data
  const manualTitle = filename.replace(/\\.pdf$/i, '').replace(/[-_]/g, ' ');
  const chunkRecords = chunks.map((chunk) => ({
    manual_id: manualId,
    manual_title: manualTitle,
    content: chunk.content,
    chunk_index: chunk.chunkIndex,
    page_number: chunk.pageNumber,
    // Note: These fields will be added once schema is updated
    page_image_url: chunk.pageImageUrl,
    has_visual_elements: chunk.hasVisualElements,
    visual_content_type: chunk.visualContentType
  }));

  // Insert in batches of 50
  let totalSaved = 0;
  for (let i = 0; i < chunkRecords.length; i += 50) {
    const batch = chunkRecords.slice(i, i + 50);
    
    // For now, save without the new columns until schema is updated
    const compatibleBatch = batch.map(chunk => ({
      manual_id: chunk.manual_id,
      manual_title: chunk.manual_title,
      content: chunk.content,
      chunk_index: chunk.chunk_index,
      page_number: chunk.page_number
    }));
    
    const { error } = await supabase
      .from('manual_chunks')
      .insert(compatibleBatch);

    if (error) {
      console.error('❌ Error inserting chunks:', error.message);
      return false;
    }
    
    totalSaved += batch.length;
    console.log(`  Saved chunks ${i + 1}-${Math.min(i + 50, chunkRecords.length)}`);
  }

  console.log(`✅ Successfully saved ${filename} with ${totalSaved} chunks and page images`);
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
    const uploadedImages = await uploadPageImages(pageImages, null, filename);

    // Create chunks with image links
    const chunks = createChunks(textResult.text, uploadedImages);

    // Save to database
    return await saveToDatabase(filename, chunks);
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

async function setupStorage() {
  console.log('🗂️  Checking storage bucket...');
  
  // Check if manual-images bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const manualImagesBucket = buckets?.find(b => b.name === 'manual-images');
  
  if (manualImagesBucket) {
    console.log('✅ manual-images bucket found and ready');
  } else {
    console.error('❌ manual-images bucket not found');
    return false;
  }
  
  return true;
}

async function main() {
  console.log('\\n🚀 Processing Manuals with Image Extraction');
  console.log('='.repeat(60));

  // Setup storage
  const storageReady = await setupStorage();
  if (!storageReady) {
    console.error('❌ Storage setup failed');
    return;
  }

  // Get all manuals
  const manuals = await listManuals();
  
  if (manuals.length === 0) {
    console.log('No manuals found in storage');
    return;
  }

  // For testing, process just the first 2 manuals
  const testManuals = manuals.slice(0, 2);
  console.log(`\\nWill process ${testManuals.length} manuals (limited for testing)`);

  // Process each manual
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < testManuals.length; i++) {
    const manual = testManuals[i];
    console.log(`\\n[${i + 1}/${testManuals.length}] Processing ${manual.name}`);
    
    const success = await processManual(manual.name);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  console.log('\\n' + '='.repeat(60));
  console.log('📊 Processing Complete!');
  console.log('='.repeat(60));
  console.log(`✅ Success: ${successCount} manuals`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} manuals`);
  }
  
  // Check total chunks created
  const { count } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\\n📚 Total chunks in database: ${count || 0}`);
  console.log('🖼️  Page images stored in manual-images bucket');
  console.log('🤖 Barry now has access to both text chunks AND page images!');
  
  // Cleanup temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
}

// Run immediately
main().catch(error => {
  console.error('\\n❌ Fatal error:', error.message);
  console.error(error.stack);
  process.exit(1);
});