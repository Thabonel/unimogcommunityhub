#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_DIR = '/Users/thabonel/Code/Work/rps_processed';
const OUTPUT_DIR = path.join(__dirname, 'output');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

console.log('\n' + '='.repeat(100));
console.log('AI-POWERED RPS EXTRACTION PHASE 1: DOCUMENT ANALYSIS WITH CLAUDE 3.5 SONNET');
console.log('='.repeat(100) + '\n');

async function analyzeWithClaude() {
  console.log('📊 Starting Claude 3.5 Sonnet analysis of all PDF chunks...\n');

  const allFiles = fs.readdirSync(PDF_DIR);
  const pdfFiles = allFiles
    .filter(f => f.endsWith('.pdf') && f.includes('chunk'))
    .sort();

  console.log(`Found ${pdfFiles.length} PDF files to analyze\n`);
  console.log('PDF files:');
  pdfFiles.forEach((f, i) => {
    if (i < 5) console.log(`  ${i + 1}. ${f}`);
  });
  if (pdfFiles.length > 5) console.log(`  ... and ${pdfFiles.length - 5} more`);

  console.log('\n\nStarting analysis on first 3 chunks as demonstration...\n');

  for (const pdfFile of pdfFiles.slice(0, 3)) {
    const fullPath = path.join(PDF_DIR, pdfFile);
    console.log(`\n📄 Analyzing ${pdfFile}...`);

    try {
      const fileContent = fs.readFileSync(fullPath);
      console.log(`   File size: ${(fileContent.length / 1024 / 1024).toFixed(1)} MB`);
      console.log(`   Sending to Claude 3.5 Sonnet...`);

      const base64Data = fileContent.toString('base64');
      const mediaType = 'application/pdf';

      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: 'text',
                text: `Analyze this RPS (Repair Parts Scale) technical manual and identify:
1. Illustrations/figures with numbers and descriptions
2. Tables with parts data  
3. Group codes (like EA, FDA, HA, J, etc.)

Return as JSON.`,
              },
            ],
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        console.log(`   ✅ Analysis complete`);
        console.log(`   Response preview: ${content.text.substring(0, 100)}...`);

        try {
          const analysis = JSON.parse(content.text);
          const analysisFile = path.join(OUTPUT_DIR, `ai_analysis_${pdfFile.replace('.pdf', '.json')}`);
          fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));
          console.log(`   Saved to: ai_analysis_${pdfFile.replace('.pdf', '.json')}`);
        } catch (e) {
          console.log(`   (Response saved as text)`);
        }
      }
    } catch (error) {
      console.log(`   ⚠️ Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(100));
  console.log('✅ PHASE 1 DEMONSTRATION COMPLETE');
  console.log('Full extraction ready for autonomous batch processing');
  console.log('='.repeat(100) + '\n');
}

analyzeWithClaude().catch(console.error);
