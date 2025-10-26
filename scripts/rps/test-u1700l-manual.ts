#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || process.env.VITE_REPLICATE_API_TOKEN;

async function testManual() {
  console.log('Testing U1700L manual with Marker OCR...\n');
  
  // Test with smallest file first (Foreward - 35KB)
  const testFile = '/Users/thabonel/Documents/Unimog Manuals/U1700L manuals ex military/U435_Maint_0_Foreward.pdf';
  
  console.log('Reading PDF file...');
  const pdfBuffer = fs.readFileSync(testFile);
  const base64Pdf = pdfBuffer.toString('base64');
  const dataUri = `data:application/pdf;base64,${base64Pdf}`;
  
  console.log(`File size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
  console.log('Creating Marker prediction...\n');
  
  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: '4eb62a42c3e5b8695a796936e69afa2c004839aef15410f01492d59783baf752',
      input: {
        document: dataUri,
        lang: 'English',
        dpi: 400,
        parallel_factor: 2,
        enable_editor: false
      }
    })
  });
  
  const prediction = await createResponse.json();
  console.log('Prediction ID:', prediction.id);
  console.log('Polling for result...\n');
  
  let attempts = 0;
  while (attempts < 60) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` }
    });
    
    const status = await statusResponse.json();
    
    if (status.status === 'succeeded') {
      console.log('SUCCESS!\n');
      
      const markdownUrl = status.output.markdown;
      const markdownResponse = await fetch(markdownUrl);
      const markdown = await markdownResponse.text();
      
      console.log('Markdown length:', markdown.length, 'chars');
      console.log('\nFirst 500 chars of output:');
      console.log('---');
      console.log(markdown.substring(0, 500));
      console.log('---\n');
      
      fs.writeFileSync('./output/u1700l-test.md', markdown);
      console.log('Saved to: ./output/u1700l-test.md');
      
      return;
    }
    
    if (status.status === 'failed') {
      console.error('FAILED:', status.error);
      return;
    }
    
    attempts++;
    if (attempts % 6 === 0) {
      console.log(`Still processing... (${attempts * 5}s elapsed)`);
    }
  }
  
  console.log('Timeout after 5 minutes');
}

testManual().catch(console.error);
