import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RpsItem {
  group_code: string;
  item_number: string;
  designation: string;
  nsn: string;
  manufacturer_code: string;
  supplier_code: string;
  quantity_per_assembly: string;
  unit_of_issue: string;
  repair_grade: string;
  notes: string;
  pages?: number[];
  source?: string;
}

interface RpsGroup {
  group_code: string;
  title: string;
  items: RpsItem[];
  page_range?: {
    start: number;
    end: number;
  };
  pages?: number[];
  source: string;
}

interface ConsolidatedData {
  metadata: {
    date: string;
    sources: string[];
    total_groups: number;
    total_items: number;
    coverage_pages: number;
    coverage_percentage: number;
  };
  groups: Record<string, RpsGroup>;
  coverage_analysis: {
    pages_extracted: number[];
    pages_missing: number[];
    groups_completed: string[];
  };
}

async function consolidateAllExtractions() {
  const scriptDir = __dirname;
  const outputDir = path.join(scriptDir, 'output');

  const consolidatedData: ConsolidatedData = {
    metadata: {
      date: new Date().toISOString(),
      sources: [],
      total_groups: 0,
      total_items: 0,
      coverage_pages: 0,
      coverage_percentage: 0
    },
    groups: {},
    coverage_analysis: {
      pages_extracted: [],
      pages_missing: [46, 48, 52, 56, 58, 64, 66, 68, 74], // Known missing pages
      groups_completed: []
    }
  };

  // Track all pages covered
  const pagesCovered = new Set<number>();

  try {
    // 1. Process Agent 2 partial extraction (201-221)
    console.log('Processing Agent 2 partial extraction...');
    const agent2File = path.join(scriptDir, 'agent2-partial-extraction-201-221.json');
    if (fs.existsSync(agent2File)) {
      const agent2Data = JSON.parse(fs.readFileSync(agent2File, 'utf-8'));
      consolidatedData.metadata.sources.push('Agent 2 (pages 201-221)');

      for (const [groupCode, groupData] of Object.entries(agent2Data.groups)) {
        const group = groupData as any;
        if (!consolidatedData.groups[groupCode]) {
          consolidatedData.groups[groupCode] = {
            group_code: groupCode,
            title: group.title || '',
            items: [],
            pages: group.pages || [],
            source: 'Agent 2 (manual extraction pages 201-221)'
          };
        }

        // Add items
        if (group.items && Array.isArray(group.items)) {
          for (const item of group.items) {
            consolidatedData.groups[groupCode].items.push({
              group_code: groupCode,
              item_number: item.item_number || '',
              designation: item.designation || '',
              nsn: item.nsn || '',
              manufacturer_code: item.manufacturer_code || '',
              supplier_code: item.supplier_code || '',
              quantity_per_assembly: item.quantity_per_assembly || '',
              unit_of_issue: item.unit_of_issue || '',
              repair_grade: item.repair_grade || '',
              notes: item.notes || '',
              pages: group.pages || [],
              source: 'Agent 2'
            });
          }
        }

        // Track pages
        if (group.pages) {
          group.pages.forEach((p: number) => pagesCovered.add(p));
        }
      }
    }

    // 2. Process Agent 3 partial extraction (401-426)
    console.log('Processing Agent 3 partial extraction...');
    const agent3File = path.join(scriptDir, 'extracted-pages-401-627-partial.json');
    if (fs.existsSync(agent3File)) {
      const agent3Data = JSON.parse(fs.readFileSync(agent3File, 'utf-8'));
      consolidatedData.metadata.sources.push('Agent 3 (pages 401-426)');

      const agent3Groups = agent3Data.data || agent3Data.groups || {};
      for (const [groupCode, groupData] of Object.entries(agent3Groups)) {
        const group = groupData as any;
        if (!consolidatedData.groups[groupCode]) {
          consolidatedData.groups[groupCode] = {
            group_code: groupCode,
            title: group.title || '',
            items: [],
            pages: group.pages || [],
            source: 'Agent 3 (manual extraction pages 401-426)'
          };
        }

        // Add items
        if (group.items && Array.isArray(group.items)) {
          for (const item of group.items) {
            consolidatedData.groups[groupCode].items.push({
              group_code: groupCode,
              item_number: item.item_number || '',
              designation: item.designation || '',
              nsn: item.nsn || '',
              manufacturer_code: item.manufacturer_code || '',
              supplier_code: item.supplier_code || '',
              quantity_per_assembly: item.quantity_per_assembly || '',
              unit_of_issue: item.unit_of_issue || '',
              repair_grade: item.repair_grade || '',
              notes: item.notes || '',
              pages: group.pages || [],
              source: 'Agent 3'
            });
          }
        }

        // Track pages
        if (group.pages) {
          group.pages.forEach((p: number) => pagesCovered.add(p));
        }
      }
    }

    // 3. Process individual completed group files
    console.log('Processing individual group files...');
    const groupFiles = fs.readdirSync(outputDir)
      .filter(f => f.startsWith('group_') && f.endsWith('_complete.json'));

    for (const file of groupFiles) {
      const filePath = path.join(outputDir, file);
      const groupData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const groupCode = groupData.group_code;

      if (!consolidatedData.groups[groupCode]) {
        consolidatedData.groups[groupCode] = {
          group_code: groupCode,
          title: groupData.group_name || groupData.title || '',
          items: [],
          page_range: groupData.page_start && groupData.page_end
            ? { start: groupData.page_start, end: groupData.page_end }
            : undefined,
          source: `Group file (${file})`
        };
      }

      // Add items from parts
      if (groupData.parts && Array.isArray(groupData.parts)) {
        for (const part of groupData.parts) {
          consolidatedData.groups[groupCode].items.push({
            group_code: groupCode,
            item_number: part.item_number || '',
            designation: part.description || '',
            nsn: part.nsn || '',
            manufacturer_code: part.niin || '',
            supplier_code: '',
            quantity_per_assembly: part.quantity ? String(part.quantity) : '',
            unit_of_issue: '',
            repair_grade: part.repair_grade || '',
            notes: '',
            source: `Group file (${file})`
          });
        }
      }

      // Track pages
      if (groupData.page_start && groupData.page_end) {
        for (let p = groupData.page_start; p <= groupData.page_end; p++) {
          pagesCovered.add(p);
        }
      }

      consolidatedData.metadata.sources.push(`Group ${groupCode} file`);
    }

    // 4. Calculate coverage
    const sortedPages = Array.from(pagesCovered).sort((a, b) => a - b);
    consolidatedData.coverage_analysis.pages_extracted = sortedPages;
    consolidatedData.metadata.coverage_pages = sortedPages.length;
    consolidatedData.metadata.coverage_percentage = Math.round((sortedPages.length / 627) * 100 * 10) / 10;

    // 5. Count totals
    for (const group of Object.values(consolidatedData.groups)) {
      consolidatedData.metadata.total_items += group.items.length;
      consolidatedData.coverage_analysis.groups_completed.push(group.group_code);
    }
    consolidatedData.metadata.total_groups = Object.keys(consolidatedData.groups).length;

    // 6. Write consolidated master file
    const outputPath = path.join(scriptDir, 'MASTER_RPS_CONSOLIDATED.json');
    fs.writeFileSync(outputPath, JSON.stringify(consolidatedData, null, 2), 'utf-8');

    console.log('\n=== CONSOLIDATION COMPLETE ===');
    console.log(`Total Groups: ${consolidatedData.metadata.total_groups}`);
    console.log(`Total Items: ${consolidatedData.metadata.total_items}`);
    console.log(`Pages Covered: ${consolidatedData.metadata.coverage_pages} out of 627 (${consolidatedData.metadata.coverage_percentage}%)`);
    console.log(`Sources: ${consolidatedData.metadata.sources.join(', ')}`);
    console.log(`\nOutput: ${outputPath}`);

    // 7. Generate SQL insert for database
    const sqlPath = path.join(path.dirname(__filename), '..', '..', 'docs', 'rps-consolidated-insert.sql');
    const sqlLines: string[] = [];

    sqlLines.push('BEGIN;');
    sqlLines.push('-- Consolidated RPS Parts Data Insert');
    sqlLines.push(`-- Generated: ${new Date().toISOString()}`);
    sqlLines.push(`-- Total Groups: ${consolidatedData.metadata.total_groups}`);
    sqlLines.push(`-- Total Items: ${consolidatedData.metadata.total_items}`);
    sqlLines.push(`-- Coverage: ${consolidatedData.metadata.coverage_percentage}% (${consolidatedData.metadata.coverage_pages}/627 pages)`);
    sqlLines.push('');
    sqlLines.push('INSERT INTO rps_parts (group_code, item_number, designation, nsn, manufacturer_code, supplier_code, quantity_per_assembly, unit_of_issue, repair_grade, notes) VALUES');

    const insertLines: string[] = [];
    for (const group of Object.values(consolidatedData.groups)) {
      for (const item of group.items) {
        const values = [
          `'${item.group_code}'`,
          `'${item.item_number}'`,
          `'${item.designation.replace(/'/g, "''")}'`,
          `'${item.nsn.replace(/'/g, "''")}'`,
          `'${item.manufacturer_code.replace(/'/g, "''")}'`,
          `'${item.supplier_code.replace(/'/g, "''")}'`,
          `'${item.quantity_per_assembly}'`,
          `'${item.unit_of_issue}'`,
          `'${item.repair_grade}'`,
          `'${item.notes.replace(/'/g, "''")}'`
        ];
        insertLines.push(`(${values.join(', ')})`);
      }
    }

    sqlLines.push(insertLines.join(',\n'));
    sqlLines.push(';');
    sqlLines.push('COMMIT;');

    fs.writeFileSync(sqlPath, sqlLines.join('\n'), 'utf-8');
    console.log(`SQL Insert: ${sqlPath}`);

  } catch (error) {
    console.error('Consolidation error:', error);
    process.exit(1);
  }
}

consolidateAllExtractions();
