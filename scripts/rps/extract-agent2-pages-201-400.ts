#!/usr/bin/env ts-node

/**
 * RPS Extraction Agent 2: Pages 201-400
 *
 * Systematically extracts all parts list data from PNG pages 201-400
 * Outputs complete JSON structure organized by GROUP_CODE
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface PartItem {
  item_number: string;
  designation: string;
  nsn: string;
  manufacturer_code: string;
  supplier_code: string;
  quantity_per_assembly: string;
  unit_of_issue: string;
  repair_grade: string;
  notes?: string;
}

interface GroupData {
  group_code: string;
  title: string;
  items: PartItem[];
  pages: number[];
  total_items: number;
}

const AI_ILLUSTRATIONS_DIR = '/Users/thabonel/Code/unimogcommunityhub/scripts/rps/output/ai_illustrations';
const OUTPUT_FILE = '/Users/thabonel/Code/unimogcommunityhub/scripts/rps/agent2-extraction-201-400.json';

// Get all PNG files in range 201-400
function getPngFilesInRange(start: number, end: number): string[] {
  const files: string[] = [];

  for (let i = start; i <= end; i++) {
    const pageNum = i.toString().padStart(4, '0');
    const filePath = path.join(AI_ILLUSTRATIONS_DIR, `rps_page_${pageNum}.png`);

    if (fs.existsSync(filePath)) {
      files.push(filePath);
    }
  }

  return files.sort();
}

// Extract page number from filename
function getPageNumber(filePath: string): number {
  const match = filePath.match(/rps_page_(\d{4})\.png$/);
  return match ? parseInt(match[1], 10) : 0;
}

// Read PNG as base64
function readPngAsBase64(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return buffer.toString('base64');
}

// Extract data from a single page
async function extractPageData(filePath: string): Promise<any> {
  const pageNum = getPageNumber(filePath);
  const base64Image = readPngAsBase64(filePath);

  console.log(`\nProcessing page ${pageNum}...`);

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: `Analyze this RPS (Repair Parts Schedule) page.

TASK:
1. Identify the GROUP CODE (e.g., DEA, DEB, etc.) from the page header
2. Identify the GROUP TITLE (e.g., "FUEL PUMP", "GOVERNOR AND SMOKE LIMITER")
3. If this is a parts list table page, extract ALL items with complete data:
   - item_number (e.g., 041, 042, 9002, 9003)
   - designation (part name/description)
   - nsn (NATO Stock Number - 13 digits, or /NIL if not assigned)
   - manufacturer_code (e.g., D8015/1, D8046/352)
   - supplier_code (e.g., 993 07 01, 006039)
   - quantity_per_assembly (number in NO OFF column)
   - unit_of_issue (from U column - usually blank)
   - repair_grade (from E column - letters like EA, X, M, LM, H)

4. If this is an illustration/diagram page (not a parts table), return page_type: "illustration"

OUTPUT FORMAT (JSON only, no explanation):
{
  "page_number": ${pageNum},
  "page_type": "parts_list" | "illustration",
  "group_code": "XXX",
  "group_title": "Title from page",
  "items": [
    {
      "item_number": "041",
      "designation": "SPRING (ALSO PART OF DEA 036)",
      "nsn": "D8046/352 993 07 01",
      "manufacturer_code": "D8046/352",
      "supplier_code": "993 07 01",
      "quantity_per_assembly": "2",
      "unit_of_issue": "",
      "repair_grade": "",
      "notes": "ALSO PART OF DEA 036"
    }
  ]
}

Extract ALL items from the page. Be thorough and accurate.`,
          },
        ],
      },
    ],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  try {
    // Extract JSON from response (may have markdown code blocks)
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const pageData = JSON.parse(jsonStr);
      console.log(`  ✓ Page ${pageNum}: ${pageData.page_type} - ${pageData.group_code || 'N/A'} (${pageData.items?.length || 0} items)`);
      return pageData;
    } else {
      console.log(`  ✗ Page ${pageNum}: Could not parse JSON response`);
      return null;
    }
  } catch (error) {
    console.error(`  ✗ Page ${pageNum}: JSON parse error:`, error);
    return null;
  }
}

// Consolidate extracted data by group
function consolidateByGroup(pagesData: any[]): Record<string, GroupData> {
  const groups: Record<string, GroupData> = {};

  for (const pageData of pagesData) {
    if (!pageData || pageData.page_type !== 'parts_list' || !pageData.group_code) {
      continue;
    }

    const groupCode = pageData.group_code;

    if (!groups[groupCode]) {
      groups[groupCode] = {
        group_code: groupCode,
        title: pageData.group_title || '',
        items: [],
        pages: [],
        total_items: 0,
      };
    }

    groups[groupCode].pages.push(pageData.page_number);

    if (pageData.items && Array.isArray(pageData.items)) {
      groups[groupCode].items.push(...pageData.items);
    }
  }

  // Calculate totals
  for (const groupCode in groups) {
    groups[groupCode].total_items = groups[groupCode].items.length;
    groups[groupCode].pages.sort((a, b) => a - b);
  }

  return groups;
}

// Main extraction function
async function main() {
  console.log('=== RPS Extraction Agent 2: Pages 201-400 ===\n');

  const pngFiles = getPngFilesInRange(201, 400);
  console.log(`Found ${pngFiles.length} PNG files in range 201-400\n`);

  const allPagesData: any[] = [];

  // Process each page
  for (let i = 0; i < pngFiles.length; i++) {
    const filePath = pngFiles[i];

    try {
      const pageData = await extractPageData(filePath);
      if (pageData) {
        allPagesData.push(pageData);
      }

      // Rate limiting: wait 1 second between requests
      if (i < pngFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }

  console.log(`\n\n=== Consolidating data by group ===\n`);

  const groupedData = consolidateByGroup(allPagesData);

  // Summary statistics
  const summary = {
    extraction_agent: 'Agent 2',
    page_range: '201-400',
    pages_processed: allPagesData.length,
    illustration_pages: allPagesData.filter(p => p.page_type === 'illustration').length,
    parts_list_pages: allPagesData.filter(p => p.page_type === 'parts_list').length,
    groups_found: Object.keys(groupedData).length,
    total_items_extracted: Object.values(groupedData).reduce((sum, g) => sum + g.total_items, 0),
    groups: groupedData,
  };

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2));

  console.log(`\n=== EXTRACTION COMPLETE ===`);
  console.log(`Pages processed: ${summary.pages_processed}`);
  console.log(`Parts list pages: ${summary.parts_list_pages}`);
  console.log(`Illustration pages: ${summary.illustration_pages}`);
  console.log(`Groups found: ${summary.groups_found}`);
  console.log(`Total items extracted: ${summary.total_items_extracted}`);
  console.log(`\nOutput saved to: ${OUTPUT_FILE}`);

  // Display group summary
  console.log(`\n=== GROUPS SUMMARY ===`);
  for (const [code, data] of Object.entries(groupedData)) {
    console.log(`${code}: ${data.title}`);
    console.log(`  - Pages: ${data.pages.join(', ')}`);
    console.log(`  - Items: ${data.total_items}`);
  }
}

main().catch(console.error);
