import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RpsItem {
  item_number: string;
  designation: string;
  nsn: string;
  manufacturer_code: string;
  supplier_code: string;
  quantity_per_assembly: string;
  unit_of_issue: string;
  repair_grade: string;
  notes: string;
}

interface RpsGroup {
  group_code: string;
  title: string;
  pages: number[];
  items: RpsItem[];
}

interface ExtractionSession {
  start_date: string;
  pages_to_extract: string;
  png_files_available: number;
  groups_found: { [key: string]: number };
  total_items: number;
  status: string;
  next_steps: string[];
}

async function analyzePagesAvailable() {
  console.log('=== RPS Pages 90-627 Extraction Analysis ===\n');

  const aiIllustrationDir = path.join(__dirname, 'output', 'ai_illustrations');
  const files = fs.readdirSync(aiIllustrationDir).filter(f => f.endsWith('.png'));

  // Parse available pages
  const availablePages = new Set<number>();
  files.forEach(file => {
    const match = file.match(/rps_page_(\d+)\.png/);
    if (match) {
      availablePages.add(parseInt(match[1]));
    }
  });

  const sortedPages = Array.from(availablePages).sort((a, b) => a - b);

  console.log(`Total PNG files available: ${files.length}`);
  console.log(`Page range: ${Math.min(...sortedPages)} - ${Math.max(...sortedPages)}\n`);

  // Analyze what needs extraction
  const ranges = [
    { name: 'Pages 90-200', start: 90, end: 200 },
    { name: 'Pages 222-400', start: 222, end: 400 },
    { name: 'Pages 427-627', start: 427, end: 627 }
  ];

  let totalToExtract = 0;
  ranges.forEach(range => {
    const inRange = sortedPages.filter(p => p >= range.start && p <= range.end);
    console.log(`${range.name}: ${inRange.length} PNG files available`);
    totalToExtract += inRange.length;
  });

  console.log(`\nTotal pages available for extraction: ${totalToExtract}\n`);

  // Groups identified so far from manual reading
  const groupsIdentified: { [key: string]: { pages: number[]; estimatedItems: number } } = {
    'ABC': { pages: [90, 91, 93, 95, 97, 99, 100, 101], estimatedItems: 82 },
    'AC': { pages: [103], estimatedItems: 13 },
    // More to be discovered...
  };

  const session: ExtractionSession = {
    start_date: new Date().toISOString(),
    pages_to_extract: '90-200, 222-400, 427-627',
    png_files_available: totalToExtract,
    groups_found: Object.fromEntries(Object.entries(groupsIdentified).map(([k, v]) => [k, v.estimatedItems])),
    total_items: Object.values(groupsIdentified).reduce((sum, g) => sum + g.estimatedItems, 0),
    status: 'Ready for systematic extraction',
    next_steps: [
      '1. Use Claude vision API to read and extract from all PNG files systematically',
      '2. Parse structured table format from parts lists',
      '3. Group items by GROUP_CODE and page ranges',
      '4. Consolidate all extracted data into master JSON',
      '5. Generate and execute SQL INSERT for database upload'
    ]
  };

  const sessionPath = path.join(__dirname, 'extraction-session-90-627.json');
  fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2), 'utf-8');

  console.log('Session created:', sessionPath);
  console.log('\nGroups identified so far:', groupsIdentified);
  console.log('\nEstimated total items in identified groups:', session.total_items);
  console.log('\nRecommendation:');
  console.log('Use systematic page-by-page vision extraction to capture all parts data');
  console.log('This will require reading ~' + totalToExtract + ' PNG images and parsing table structures');
}

analyzePagesAvailable().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
