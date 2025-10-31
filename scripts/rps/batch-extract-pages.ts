import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ANTHROPIC_API_KEY = <ANTHROPIC_API_KEY>
if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable not set');
  process.exit(1);
}

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// Pages to extract
const START_PAGE = parseInt(process.argv[2] || '101');
const END_PAGE = parseInt(process.argv[3] || '200');

const DOCS_DIR = join(process.cwd(), 'docs');
const ILLUSTRATIONS_DIR = join(DOCS_DIR, 'rps', 'ai_illustrations');

async function extractPage(pageNumber: number): Promise<boolean> {
  const paddedPage = String(pageNumber).padStart(4, '0');
  const imagePath = join(ILLUSTRATIONS_DIR, `rps_page_${paddedPage}.png`);
  const jsonPath = join(DOCS_DIR, `rps-extraction-page-${pageNumber}.json`);

  // Skip if already extracted
  if (existsSync(jsonPath)) {
    console.log(`Page ${pageNumber}: Already extracted, skipping`);
    return true;
  }

  // Check if image exists
  if (!existsSync(imagePath)) {
    console.log(`Page ${pageNumber}: No image file found, skipping`);
    return false;
  }

  try {
    const imageData = readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    const message = await client.messages.create({
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
              text: `Extract all parts data from this RPS manual page into structured JSON.

CRITICAL INSTRUCTIONS:
1. Extract EVERY part listed on the page
2. Capture group code, group name from header
3. Extract RPS page number from footer "PAGE NO: XX"
4. For each part extract:
   - item_number (e.g., "001", "9001")
   - designation (full part description)
   - nsn (format: "NNNN XX-XXX-XXXX" or null)
   - niin (last 9 digits of NSN or null)
   - manufacturer_code and manufacturer_part_no
   - supplier_code and supplier_part_no
   - quantity (as string)
   - unit_of_issue (EA, AY, KT, MR, etc.)
   - essential (X or empty string)
   - grade_of_repair (L, LM, M, H or empty string)
   - notes (brief technical note)

Return ONLY valid JSON in this format:
{
  "page_number": ${pageNumber},
  "rps_page_number": XX,
  "extraction_date": "${new Date().toISOString().split('T')[0]}",
  "page_type": "PARTS_LIST",
  "is_parts_list": true,
  "group_code": "XXX",
  "group_name": "GROUP NAME",
  "issue_number": 6,
  "rps_number": "02155",
  "parts": [
    {
      "item_number": "001",
      "designation": "PART NAME",
      "nsn": "NNNN XX-XXX-XXXX",
      "niin": "XX-XXX-XXXX",
      "manufacturer_code": "XXXXX",
      "manufacturer_part_no": "XXXXX",
      "supplier_code": "XXXXX",
      "supplier_part_no": "XXXXX",
      "quantity": "1",
      "unit_of_issue": "EA",
      "essential": "X",
      "grade_of_repair": "M",
      "notes": "Brief note"
    }
  ],
  "parts_extracted": N,
  "parts_with_nsn": N,
  "status": "complete",
  "group_complete": false
}

NO markdown code blocks, just pure JSON.`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Clean up response
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    // Validate JSON
    const data = JSON.parse(jsonText);

    // Write to file
    writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`Page ${pageNumber}: Extracted ${data.parts_extracted} parts (${data.parts_with_nsn} with NSN) - Group ${data.group_code}`);
    return true;

  } catch (error) {
    console.error(`Page ${pageNumber}: Error -`, error instanceof Error ? error.message : error);
    return false;
  }
}

async function main() {
  console.log(`Batch RPS extraction: Pages ${START_PAGE} to ${END_PAGE}`);
  console.log(`Extracting odd-numbered pages (parts lists only)\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let page = START_PAGE; page <= END_PAGE; page++) {
    // Only process odd-numbered pages (parts lists)
    if (page % 2 === 0) continue;

    const success = await extractPage(page);
    if (success) {
      const jsonPath = join(DOCS_DIR, `rps-extraction-page-${page}.json`);
      if (existsSync(jsonPath)) {
        successCount++;
      } else {
        skipCount++;
      }
    } else {
      errorCount++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\nBatch extraction complete:`);
  console.log(`- Successful: ${successCount}`);
  console.log(`- Skipped: ${skipCount}`);
  console.log(`- Errors: ${errorCount}`);
}

main().catch(console.error);
