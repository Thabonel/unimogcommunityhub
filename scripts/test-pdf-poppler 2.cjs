#!/usr/bin/env node

/**
 * Test script using pdf-poppler for PDF to image conversion
 */

const { createClient } = require('@supabase/supabase-js');
const pdf = require('pdf-poppler');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function testPdfPoppler() {
  console.log('🧪 Testing pdf-poppler conversion...');
  
  // Download a small manual for testing
  console.log('📥 Downloading test manual...');
  const { data, error } = await supabase.storage
    .from('manuals')
    .download('G600-Data-Summary.pdf');
    
  if (error) {
    console.error('❌ Download error:', error);
    return;
  }
  
  // Create temp directory
  const tempDir = path.join(__dirname, 'temp-poppler');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Save PDF to temp file
  const buffer = Buffer.from(await data.arrayBuffer());
  const tempPdfPath = path.join(tempDir, 'test.pdf');
  fs.writeFileSync(tempPdfPath, buffer);
  
  console.log(`📄 Saved PDF to ${tempPdfPath} (${buffer.length} bytes)`);
  
  try {
    console.log('🔄 Converting PDF to images...');
    
    const options = {
      format: 'png',
      out_dir: tempDir,
      out_prefix: 'page',
      page: 1 // Convert only first page for testing
    };
    
    const result = await pdf.convert(tempPdfPath, options);
    console.log('✅ Conversion result:', result);
    
    // Check for generated files
    const files = fs.readdirSync(tempDir).filter(f => f.endsWith('.png'));
    console.log('📸 Generated images:', files);
    
    if (files.length > 0) {
      const imagePath = path.join(tempDir, files[0]);
      const stats = fs.statSync(imagePath);
      console.log(`📊 Image size: ${stats.size} bytes`);
      
      // Test upload to Supabase
      const imageBuffer = fs.readFileSync(imagePath);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('manual-images')
        .upload('test/poppler-page-001.png', imageBuffer, {
          contentType: 'image/png',
          upsert: true
        });
        
      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
      } else {
        console.log('✅ Upload successful');
        
        const imageUrl = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/manual-images/test/poppler-page-001.png`;
        console.log(`🔗 Image URL: ${imageUrl}`);
      }
    }
    
  } catch (error) {
    console.error('❌ pdf-poppler error:', error);
  } finally {
    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

testPdfPoppler();