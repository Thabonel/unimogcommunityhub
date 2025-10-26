import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const INPUT_DIR = "/Users/thabonel/Code/unimogcommunityhub/scripts/rps/output/ai_illustrations";
const OUTPUT_FILE = "/Users/thabonel/Code/unimogcommunityhub/scripts/rps/extracted-pages-401-627.json";

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
  items: PartItem[];
  pages: number[];
  total_items: number;
  title?: string;
}

interface ExtractedData {
  [groupCode: string]: GroupData;
}

async function extractPartsFromImage(imagePath: string, pageNumber: number): Promise<any> {
  console.log(`Processing page ${pageNumber}...`);

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const mediaType = "image/png";

  const prompt = `You are extracting parts list data from a military technical manual (RPS).

CRITICAL INSTRUCTIONS:
1. If this page is an ILLUSTRATION/DIAGRAM (not a parts list table), return: {"type": "illustration", "group_code": "XX", "page": ${pageNumber}}
2. If this page is a PARTS LIST TABLE, extract ALL items with complete data

For parts list pages, extract:
- GROUP_CODE from page header (e.g., "KA", "KB", "KBA", etc.)
- TITLE from page header (e.g., "HOUSING, FRONT AXLE")
- All table rows with these fields:
  * item_number (e.g., "001", "002", "9001")
  * designation (part name/description)
  * nsn (NATO Stock Number - first line in NSN column, may be "/NIL" if not applicable)
  * manufacturer_code (second line in NSN column)
  * supplier_code (third line in NSN column)
  * quantity_per_assembly (from NO column)
  * unit_of_issue (from U column - blank is OK)
  * repair_grade (from E column - blank is OK)
  * notes (from L* column or any special notes)

Return JSON format:
{
  "type": "parts_list",
  "group_code": "XX",
  "title": "TITLE FROM HEADER",
  "page": ${pageNumber},
  "items": [
    {
      "item_number": "001",
      "designation": "PART NAME",
      "nsn": "2530 98-856-0259",
      "manufacturer_code": "D8046/425 330 00 03",
      "supplier_code": "D8046/425 330 00 03",
      "quantity_per_assembly": "1",
      "unit_of_issue": "EA",
      "repair_grade": "Y",
      "notes": "N LM"
    }
  ]
}

IMPORTANT:
- Extract ALL items on the page
- For "/NIL" entries, use "/NIL" as the nsn value
- Include all alternates and variants (9001, 9002, etc.)
- Be precise with NSN formatting`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Extract JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn(`No JSON found in response for page ${pageNumber}`);
      return null;
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`Error processing page ${pageNumber}:`, error);
    return null;
  }
}

async function main() {
  // Get all PNG files in range 401-627
  const files = fs
    .readdirSync(INPUT_DIR)
    .filter((f) => {
      const match = f.match(/rps_page_0(\d+)\.png/);
      if (!match) return false;
      const pageNum = parseInt(match[1]);
      return pageNum >= 401 && pageNum <= 627;
    })
    .sort();

  console.log(`Found ${files.length} files to process`);

  const extractedData: ExtractedData = {};
  const illustrations: number[] = [];

  for (const file of files) {
    const pageMatch = file.match(/rps_page_0(\d+)\.png/);
    if (!pageMatch) continue;

    const pageNumber = parseInt(pageMatch[1]);
    const imagePath = path.join(INPUT_DIR, file);

    const result = await extractPartsFromImage(imagePath, pageNumber);

    if (!result) {
      console.log(`Skipping page ${pageNumber} (no data extracted)`);
      continue;
    }

    if (result.type === "illustration") {
      illustrations.push(pageNumber);
      console.log(`Page ${pageNumber}: Illustration (${result.group_code})`);
    } else if (result.type === "parts_list") {
      const groupCode = result.group_code;

      if (!extractedData[groupCode]) {
        extractedData[groupCode] = {
          items: [],
          pages: [],
          total_items: 0,
          title: result.title,
        };
      }

      extractedData[groupCode].pages.push(pageNumber);
      extractedData[groupCode].items.push(...result.items);
      extractedData[groupCode].total_items += result.items.length;

      console.log(
        `Page ${pageNumber}: ${groupCode} - ${result.items.length} items extracted`
      );
    }

    // Rate limiting: wait 1 second between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Generate summary
  const summary = {
    extraction_date: new Date().toISOString(),
    page_range: "401-627",
    total_files_processed: files.length,
    total_illustrations: illustrations.length,
    total_groups: Object.keys(extractedData).length,
    total_items_extracted: Object.values(extractedData).reduce(
      (sum, group) => sum + group.total_items,
      0
    ),
    groups: Object.keys(extractedData).sort(),
    illustrations: illustrations,
  };

  const output = {
    summary,
    data: extractedData,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n✓ Extraction complete!`);
  console.log(`✓ Output saved to: ${OUTPUT_FILE}`);
  console.log(`\nSummary:`);
  console.log(`  - Files processed: ${summary.total_files_processed}`);
  console.log(`  - Illustrations: ${summary.total_illustrations}`);
  console.log(`  - Groups found: ${summary.total_groups}`);
  console.log(`  - Total items: ${summary.total_items_extracted}`);
  console.log(`  - Groups: ${summary.groups.join(", ")}`);
}

main().catch(console.error);
