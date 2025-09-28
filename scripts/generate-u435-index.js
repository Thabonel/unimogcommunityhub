#!/usr/bin/env node

/**
 * U435 Manual Index Generator
 * Parses the comprehensive manual index and creates SQL for Barry's database
 * Solves the page mapping problem between original 1,185 pages and 67 split PDFs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Page mapping function: translates original manual page to PDF page
function calculatePdfPage(originalPage, pdfStartPage) {
  if (!pdfStartPage || originalPage < pdfStartPage) return 1;
  return originalPage - pdfStartPage + 1;
}

// Extract section data from the index file
function parseIndexFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const sections = [];

  // Regular expression to match section entries
  const sectionRegex = /### (?:🎯\s*\*\*)?Page (\d+) \(PDF Page \d+\/1185\) - (.+?)(?:\*\*)?[\s\S]*?\*\*Section\*\*: (.+?)(?:\r?\n|\*\*)/g;

  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    const [, pageNum, title, section] = match;

    // Extract detailed info from the section
    const sectionStart = match.index;
    const nextSectionStart = content.indexOf('### ', sectionStart + 1);
    const sectionContent = content.slice(sectionStart, nextSectionStart > -1 ? nextSectionStart : content.length);

    // Extract keywords from the section content
    const keywords = extractKeywords(title, section, sectionContent);

    sections.push({
      originalPage: parseInt(pageNum),
      title: title.trim(),
      section: section.trim(),
      keywords,
      content: sectionContent
    });
  }

  return sections;
}

// Extract searchable keywords from section content
function extractKeywords(title, section, content) {
  const keywords = new Set();

  // Add title words
  title.toLowerCase().split(/\W+/).forEach(word => {
    if (word.length > 2) keywords.add(word);
  });

  // Add section words
  section.toLowerCase().split(/\W+/).forEach(word => {
    if (word.length > 2) keywords.add(word);
  });

  // Add common technical terms from content
  const technicalTerms = [
    'engine', 'transmission', 'axle', 'wheel', 'hub', 'drive', 'portal',
    'differential', 'clutch', 'brake', 'hydraulic', 'oil', 'filter',
    'bearing', 'seal', 'gasket', 'bolt', 'nut', 'washer', 'assembly',
    'disassembly', 'removal', 'installation', 'maintenance', 'repair',
    'torque', 'pressure', 'temperature', 'cooling', 'lubrication',
    'electrical', 'generator', 'starter', 'alternator', 'battery',
    'suspension', 'steering', 'turbocharger', 'intercooler'
  ];

  const lowerContent = content.toLowerCase();
  technicalTerms.forEach(term => {
    if (lowerContent.includes(term)) {
      keywords.add(term);
    }
  });

  return Array.from(keywords);
}

// Complete manual parts data from the database
const manualParts = [
  { id: 1, filename: 'U435_01_General.pdf', start_page: 5, end_page: 16 },
  { id: 2, filename: 'U435_02_Engine_Overview.pdf', start_page: 17, end_page: 50 },
  { id: 3, filename: 'U435_03_Cylinder_Head.pdf', start_page: 51, end_page: 88 },
  { id: 4, filename: 'U435_04_Engine_Block.pdf', start_page: 89, end_page: 126 },
  { id: 5, filename: 'U435_05_Lubrication.pdf', start_page: 127, end_page: 144 },
  { id: 6, filename: 'U435_06_Cooling_System.pdf', start_page: 145, end_page: 162 },
  { id: 7, filename: 'U435_07_Fuel_System.pdf', start_page: 163, end_page: 200 },
  { id: 8, filename: 'U435_08_Exhaust_System.pdf', start_page: 201, end_page: 214 },
  { id: 9, filename: 'U435_09_Manual_Trans.pdf', start_page: 215, end_page: 258 },
  { id: 10, filename: 'U435_10_Transfer_Case.pdf', start_page: 259, end_page: 292 },
  { id: 11, filename: 'U435_11_PTO_Systems.pdf', start_page: 293, end_page: 326 },
  { id: 12, filename: 'U435_12_Front_Axle_Drive.pdf', start_page: 327, end_page: 364 },
  { id: 13, filename: 'U435_13_Rear_Axle_Drive.pdf', start_page: 365, end_page: 402 },
  { id: 14, filename: 'U435_14_Wiring.pdf', start_page: 403, end_page: 440 },
  { id: 15, filename: 'U435_15_Instruments.pdf', start_page: 441, end_page: 467 },
  { id: 16, filename: 'U435_16_Frame.pdf', start_page: 468, end_page: 484 },
  { id: 17, filename: 'U435_17_Suspension.pdf', start_page: 485, end_page: 518 },
  { id: 18, filename: 'U435_18_Steering.pdf', start_page: 519, end_page: 554 },
  { id: 19, filename: 'U435_19_Wheel_Hub_Front.pdf', start_page: 555, end_page: 586 },
  { id: 20, filename: 'U435_20_Hub_Components.pdf', start_page: 587, end_page: 614 },
  { id: 21, filename: 'U435_21_Hub_Maintenance.pdf', start_page: 615, end_page: 650 },
  { id: 22, filename: 'U435_22_Wheel_Hub_Rear.pdf', start_page: 651, end_page: 686 },
  { id: 23, filename: 'U435_23_Service_Brakes.pdf', start_page: 687, end_page: 722 },
  { id: 24, filename: 'U435_24_Parking_Brake.pdf', start_page: 723, end_page: 758 },
  { id: 25, filename: 'U435_25_Main_Hydraulics.pdf', start_page: 759, end_page: 794 },
  { id: 26, filename: 'U435_26_Aux_Hydraulics.pdf', start_page: 795, end_page: 830 },
  { id: 27, filename: 'U435_27_Cab_Structure.pdf', start_page: 831, end_page: 866 },
  { id: 28, filename: 'U435_28_Doors_Windows.pdf', start_page: 867, end_page: 902 },
  { id: 29, filename: 'U435_29_HVAC_Heating.pdf', start_page: 903, end_page: 938 },
  { id: 30, filename: 'U435_30_Lighting.pdf', start_page: 939, end_page: 974 },
  { id: 31, filename: 'U435_31_Special_Equipment.pdf', start_page: 975, end_page: 1016 },
  { id: 32, filename: 'U435_32_Advanced_Electrical.pdf', start_page: 1017, end_page: 1030 },
  { id: 33, filename: 'U435_33_Box_Electrical.pdf', start_page: 1031, end_page: 1036 },
  { id: 34, filename: 'U435_34_PTO_Shafts.pdf', start_page: 1037, end_page: 1041 },
  { id: 35, filename: 'U435_35_Hydraulic_Advanced.pdf', start_page: 1042, end_page: 1051 },
  { id: 36, filename: 'U435_36_Hydrostat_Trans.pdf', start_page: 1052, end_page: 1074 },
  { id: 37, filename: 'U435_37_Driver_Cab_Tilt.pdf', start_page: 1075, end_page: 1094 },
  { id: 38, filename: 'U435_38_Box_Body_System.pdf', start_page: 1095, end_page: 1123 },
  { id: 39, filename: 'U435_39_Headlight_System.pdf', start_page: 1124, end_page: 1139 },
  { id: 40, filename: 'U435_40_Heating_Basic.pdf', start_page: 1140, end_page: 1151 },
  { id: 41, filename: 'U435_41_Heater_Eberspacher.pdf', start_page: 1152, end_page: 1185 }
];

// Find which PDF contains a given original page
function findPdfForPage(originalPage) {
  return manualParts.find(part =>
    part.start_page && part.end_page &&
    originalPage >= part.start_page &&
    originalPage <= part.end_page
  );
}

// Generate SQL INSERT statements
function generateSql(sections) {
  let sql = `-- U435 Manual Index - Generated from comprehensive index system
-- Total sections: ${sections.length}
-- Solves page mapping between original 1,185 pages and 67 split PDFs

INSERT INTO u435_manual_index (
  original_page,
  pdf_page,
  title,
  section_name,
  keywords,
  filename,
  manual_part_id,
  category,
  priority
) VALUES\n`;

  const values = [];

  sections.forEach((section, index) => {
    const pdf = findPdfForPage(section.originalPage);

    if (pdf) {
      const pdfPage = calculatePdfPage(section.originalPage, pdf.start_page);

      // Determine category and priority
      const category = determineCategory(section.title, section.section);
      const priority = determinePriority(section.keywords, section.title);

      values.push(`(
    ${section.originalPage},
    ${pdfPage},
    '${section.title.replace(/'/g, "''")}',
    '${section.section.replace(/'/g, "''")}',
    ARRAY[${section.keywords.map(k => `'${k.replace(/'/g, "''")}'`).join(', ')}],
    '${pdf.filename}',
    ${pdf.id},
    '${category}',
    '${priority}'
  )`);
    } else {
      console.warn(`⚠️  No PDF found for page ${section.originalPage}: ${section.title}`);
    }
  });

  sql += values.join(',\n') + ';\n\n';

  // Add helpful comments
  sql += `-- Key Portal Hub Procedures (User's Primary Interest):
-- Front Portal Hub: Page 555 → U435_19_Wheel_Hub_Front.pdf page 1
-- Rear Portal Hub: Page 651 → U435_22_Wheel_Hub_Rear.pdf page 1

-- Index includes ${sections.length} sections with intelligent page mapping
-- Barry can now navigate users to exact PDF pages with proper context\n`;

  return sql;
}

// Determine section category for better organization
function determineCategory(title, section) {
  const lower = (title + ' ' + section).toLowerCase();

  if (lower.includes('wheel') && lower.includes('hub')) return 'portal_hubs';
  if (lower.includes('engine')) return 'engine';
  if (lower.includes('transmission')) return 'transmission';
  if (lower.includes('axle')) return 'axles';
  if (lower.includes('brake')) return 'brakes';
  if (lower.includes('hydraulic')) return 'hydraulics';
  if (lower.includes('electrical')) return 'electrical';
  if (lower.includes('cooling')) return 'cooling';
  if (lower.includes('lubrication')) return 'lubrication';
  if (lower.includes('suspension')) return 'suspension';
  if (lower.includes('steering')) return 'steering';

  return 'general';
}

// Determine priority based on content and user interest
function determinePriority(keywords, title) {
  const priorityKeywords = ['wheel', 'hub', 'portal', 'brake', 'differential', 'engine'];
  const hasPriorityKeyword = keywords.some(k => priorityKeywords.includes(k));

  if (title.includes('🎯') || hasPriorityKeyword) return 'high';
  if (keywords.length > 5) return 'standard';
  return 'low';
}

// Main execution
function main() {
  console.log('🔧 U435 Manual Index Generator');
  console.log('Solving the page mapping problem for Barry AI\n');

  const indexPath = path.join(__dirname, '../docs/U435_MANUAL_INDEX_SYSTEM.md');

  if (!fs.existsSync(indexPath)) {
    console.error('❌ Index file not found:', indexPath);
    process.exit(1);
  }

  console.log('📖 Parsing comprehensive manual index...');
  const sections = parseIndexFile(indexPath);

  console.log(`✅ Found ${sections.length} sections`);
  console.log('🔍 Key sections found:');

  sections.filter(s => s.title.includes('WHEEL HUB')).forEach(s => {
    const pdf = findPdfForPage(s.originalPage);
    if (pdf) {
      const pdfPage = calculatePdfPage(s.originalPage, pdf.start_page);
      console.log(`   📄 Page ${s.originalPage} → ${pdf.filename} page ${pdfPage}: ${s.title}`);
    }
  });

  console.log('\n🚀 Generating SQL...');
  const sql = generateSql(sections);

  const outputPath = path.join(__dirname, 'u435-index-population.sql');
  fs.writeFileSync(outputPath, sql);

  console.log(`✅ SQL generated: ${outputPath}`);
  console.log(`📊 Total sections mapped: ${sections.length}`);
  console.log('\n🎯 Portal Hub Procedures Ready:');
  console.log('   - Front: Page 555 → U435_19_Wheel_Hub_Front.pdf page 1');
  console.log('   - Rear: Page 651 → U435_22_Wheel_Hub_Rear.pdf page 1');
  console.log('\n💡 Next steps:');
  console.log('   1. Review generated SQL');
  console.log('   2. Execute in Supabase to populate index');
  console.log('   3. Update Barry Edge Function to use new index');
  console.log('   4. Test portal hub procedure lookup');
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parseIndexFile, calculatePdfPage, generateSql };