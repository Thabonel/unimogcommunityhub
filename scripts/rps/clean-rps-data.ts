#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, 'output');

interface Part {
  item_number: string;
  niin: string | null;
  nsn: string | null;
  description: string;
  quantity: number | null;
  repair_grade: 'L' | 'M' | 'H' | null;
}

interface GroupData {
  group_code: string;
  group_name: string;
  rps_number: string;
  page_start: number;
  page_end: number;
  parts: Part[];
  illustrations: any[];
}

function normalizeNSN(nsn: string | null): string | null {
  if (!nsn) return null;

  nsn = nsn.trim();
  if (!nsn) return null;

  const digits = nsn.replace(/\D/g, '');

  if (digits.length === 12) {
    return `${digits.substring(0, 4)}-${digits.substring(4, 6)}-${digits.substring(6, 9)}-${digits.substring(9)}`;
  }

  if (digits.length === 13) {
    return `${digits.substring(0, 4)}-${digits.substring(4, 6)}-${digits.substring(6, 9)}-${digits.substring(9)}`;
  }

  return nsn;
}

function extractNIINFromDescription(description: string, niin: string | null): string | null {
  if (niin) return niin;

  const niinMatch = description.match(/\b(\d{2}-\d{3}-\d{4})\b/);
  if (niinMatch) {
    return niinMatch[1];
  }

  return null;
}

function extractRepairGradeFromDescription(description: string, grade: string | null): 'L' | 'M' | 'H' | null {
  if (grade && ['L', 'M', 'H'].includes(grade)) return grade as 'L' | 'M' | 'H';

  const gradeMatch = description.match(/\b([LMH])\b(?:\s|$)/);
  if (gradeMatch && ['L', 'M', 'H'].includes(gradeMatch[1])) {
    return gradeMatch[1] as 'L' | 'M' | 'H';
  }

  return null;
}

function cleanDescription(description: string): string {
  return description
    .replace(/\s*\(Also Part of\s+[A-Z0-9\s]+\)\s*$/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanPart(part: Part): Part {
  return {
    item_number: part.item_number.trim(),
    niin: extractNIINFromDescription(part.description, part.niin),
    nsn: normalizeNSN(part.nsn),
    description: cleanDescription(part.description),
    quantity: part.quantity,
    repair_grade: extractRepairGradeFromDescription(part.description, part.repair_grade as any),
  };
}

function cleanGroupData(data: GroupData): GroupData {
  return {
    ...data,
    group_code: data.group_code.trim().toUpperCase(),
    group_name: data.group_name.trim(),
    parts: data.parts.map(cleanPart),
    illustrations: data.illustrations.map(illus => ({
      ...illus,
      description: cleanDescription(illus.description || ''),
      title: illus.title ? cleanDescription(illus.title) : illus.title,
    })),
  };
}

async function cleanAllGroups() {
  console.log('🧹 Starting RPS data cleanup...\n');

  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('group_') && f.endsWith('.json'));

  let totalCleaned = 0;
  let totalParts = 0;

  for (const file of files) {
    const filePath = path.join(OUTPUT_DIR, file);
    const groupCode = file.replace('group_', '').replace('_complete.json', '').toUpperCase();

    try {
      const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const cleanedData = cleanGroupData(rawData);

      fs.writeFileSync(filePath, JSON.stringify(cleanedData, null, 2));

      const partStats = cleanedData.parts.filter(p => p.niin || p.nsn).length;
      totalParts += cleanedData.parts.length;

      console.log(`✅ Group ${groupCode}: ${cleanedData.parts.length} parts (${partStats} have NIIN/NSN)`);
      totalCleaned++;
    } catch (error) {
      console.error(`❌ Failed to clean ${file}:`, error);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✨ CLEANUP COMPLETE');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Groups cleaned: ${totalCleaned}`);
  console.log(`📦 Total parts: ${totalParts}`);
  console.log();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  cleanAllGroups()
    .then(() => {
      console.log('✅ All data cleaned successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Cleanup failed:', error);
      process.exit(1);
    });
}

export { cleanGroupData, cleanAllGroups };
