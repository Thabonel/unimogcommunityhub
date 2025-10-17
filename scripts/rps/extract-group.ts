#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { callSonnet, callHaiku, loadPrompt, extractJSON, withRetry } from './anthropic-client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Part {
  item_number: string;
  niin: string;
  nsn?: string;
  description: string;
  quantity?: number;
  repair_grade?: 'L' | 'M' | 'H';
}

interface Illustration {
  figure_number: string;
  page_number: number;
  title?: string;
  description?: string;
  callouts?: Record<string, any>;
}

interface GroupData {
  group_code: string;
  group_name: string;
  rps_number: string;
  page_start: number;
  page_end?: number;
  parts: Part[];
  illustrations: Illustration[];
}

const RPS_CHUNKS_DIR = '/Users/thabonel/Code/Work/rps_processed';
const OUTPUT_DIR = path.join(__dirname, 'output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Step 1: Discover groups in a chunk using Sonnet
 */
async function discoverChunk(chunkNumber: string) {
  console.log(`\n📋 Discovering groups in chunk ${chunkNumber}...`);

  const chunkFile = fs.readdirSync(RPS_CHUNKS_DIR)
    .find(f => f.includes(`chunk_${chunkNumber.padStart(3, '0')}`));

  if (!chunkFile) {
    throw new Error(`Chunk ${chunkNumber} not found in ${RPS_CHUNKS_DIR}`);
  }

  const pdfPath = path.join(RPS_CHUNKS_DIR, chunkFile);
  const promptTemplate = loadPrompt('sonnet_discovery');

  const response = await withRetry(() =>
    callSonnet(promptTemplate, pdfPath, 8192)
  );

  const discovery = extractJSON(response.content);

  const outputPath = path.join(OUTPUT_DIR, `chunk_${chunkNumber}_discovery.json`);
  fs.writeFileSync(outputPath, JSON.stringify(discovery, null, 2));

  console.log(`✅ Discovery complete. Found ${discovery.groups_found?.length || 0} groups`);
  console.log(`📄 Saved to: ${outputPath}`);

  return discovery;
}

/**
 * Step 2: Extract parts table using Haiku
 */
async function extractParts(groupCode: string, chunkNumber: string, pageStart: number, pageEnd: number) {
  console.log(`\n⚡ Extracting parts for Group ${groupCode}...`);

  const chunkFile = fs.readdirSync(RPS_CHUNKS_DIR)
    .find(f => f.includes(`chunk_${chunkNumber.padStart(3, '0')}`));

  if (!chunkFile) {
    throw new Error(`Chunk ${chunkNumber} not found`);
  }

  const pdfPath = path.join(RPS_CHUNKS_DIR, chunkFile);
  const promptTemplate = loadPrompt('haiku_parts_extraction');

  const customPrompt = promptTemplate
    .replace('[GROUP_CODE]', groupCode)
    .replace('[START]', pageStart.toString())
    .replace('[END]', pageEnd.toString());

  const response = await withRetry(() =>
    callHaiku(customPrompt, pdfPath, 8192)
  );

  const parts: Part[] = extractJSON(response.content);

  console.log(`✅ Extracted ${parts.length} parts`);

  return parts;
}

/**
 * Step 3: Analyze illustrations using Sonnet
 */
async function analyzeIllustrations(groupCode: string, chunkNumber: string) {
  console.log(`\n🔍 Analyzing illustrations for Group ${groupCode}...`);

  const chunkFile = fs.readdirSync(RPS_CHUNKS_DIR)
    .find(f => f.includes(`chunk_${chunkNumber.padStart(3, '0')}`));

  if (!chunkFile) {
    throw new Error(`Chunk ${chunkNumber} not found`);
  }

  const pdfPath = path.join(RPS_CHUNKS_DIR, chunkFile);
  const promptTemplate = loadPrompt('sonnet_illustrations');

  const response = await withRetry(() =>
    callSonnet(promptTemplate, pdfPath, 8192)
  );

  const illustrationData = extractJSON(response.content);

  console.log(`✅ Analyzed ${illustrationData.illustrations?.length || 0} illustrations`);

  return illustrationData.illustrations || [];
}

/**
 * Step 4: Validate data using Haiku
 */
async function validateParts(parts: Part[]) {
  console.log(`\n✅ Validating ${parts.length} parts...`);

  const promptTemplate = loadPrompt('haiku_validation');
  const dataToValidate = JSON.stringify(parts, null, 2);

  const fullPrompt = `${promptTemplate}\n\nINPUT:\n${dataToValidate}`;

  const response = await withRetry(() =>
    callHaiku(fullPrompt, undefined, 4096)
  );

  const validation = extractJSON(response.content);

  if (!validation.valid) {
    console.log(`⚠️ Validation found ${validation.errors?.length || 0} errors`);
    validation.errors?.forEach((err: any) => {
      console.log(`  - Item ${err.item_number}: ${err.message}`);
    });
  } else {
    console.log(`✅ All parts valid`);
  }

  return validation;
}

/**
 * Main extraction workflow for a single group
 */
async function extractGroup(groupCode: string, chunkNumber: string) {
  console.log(`\n🚀 Starting extraction for Group ${groupCode} from chunk ${chunkNumber}`);

  try {
    // Step 1: Discover (if not already done)
    const discoveryPath = path.join(OUTPUT_DIR, `chunk_${chunkNumber}_discovery.json`);
    let discovery;

    if (fs.existsSync(discoveryPath)) {
      console.log(`📋 Using existing discovery: ${discoveryPath}`);
      discovery = JSON.parse(fs.readFileSync(discoveryPath, 'utf-8'));
    } else {
      discovery = await discoverChunk(chunkNumber);
    }

    // Find group in discovery
    const groupInfo = discovery.groups_found?.find((g: any) => g.group_code === groupCode);
    if (!groupInfo) {
      throw new Error(`Group ${groupCode} not found in chunk ${chunkNumber}`);
    }

    console.log(`📌 Group ${groupCode}: ${groupInfo.group_name}`);
    console.log(`📄 Pages: ${groupInfo.page_start}-${groupInfo.page_end}`);

    // Step 2: Extract parts (Haiku)
    const parts = await extractParts(
      groupCode,
      chunkNumber,
      groupInfo.page_start,
      groupInfo.page_end
    );

    // Step 3: Validate parts (Haiku)
    const validation = await validateParts(parts);

    // Step 4: Analyze illustrations (Sonnet)
    const illustrations = await analyzeIllustrations(groupCode, chunkNumber);

    // Combine into final group data
    const groupData: GroupData = {
      group_code: groupCode,
      group_name: groupInfo.group_name,
      rps_number: '02155',
      page_start: groupInfo.page_start,
      page_end: groupInfo.page_end,
      parts,
      illustrations,
    };

    // Save output
    const outputPath = path.join(OUTPUT_DIR, `group_${groupCode.toLowerCase()}_complete.json`);
    fs.writeFileSync(outputPath, JSON.stringify(groupData, null, 2));

    console.log(`\n✅ Extraction complete!`);
    console.log(`📄 Output: ${outputPath}`);
    console.log(`📊 Stats:`);
    console.log(`   - Parts: ${parts.length}`);
    console.log(`   - Illustrations: ${illustrations.length}`);
    console.log(`   - Validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);

    return groupData;
  } catch (error) {
    console.error(`\n❌ Extraction failed:`, error);
    throw error;
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const groupCode = args.find(arg => arg.startsWith('--group='))?.split('=')[1];
  const chunkNumber = args.find(arg => arg.startsWith('--chunk='))?.split('=')[1];
  const discoverOnly = args.includes('--discover-only');

  if (!groupCode && !discoverOnly) {
    console.error('Usage:');
    console.error('  tsx extract-group.ts --discover-only --chunk=003');
    console.error('  tsx extract-group.ts --group=AA --chunk=003');
    process.exit(1);
  }

  if (discoverOnly && chunkNumber) {
    discoverChunk(chunkNumber)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else if (groupCode && chunkNumber) {
    extractGroup(groupCode, chunkNumber)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

export { extractGroup, discoverChunk, extractParts, analyzeIllustrations, validateParts };
