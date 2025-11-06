import { createClient } from '@supabase/supabase-js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function processPDF() {
  const pdfPath = '/Users/thabonel/Documents/Unimog Manuals/U1700L manuals ex military/U435_Maint_54_Batteries.pdf';
  const manualTitle = 'U435_Maint_54_Batteries.pdf';

  console.log(`Processing: ${manualTitle}`);

  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  console.log(`Total pages: ${pdf.numPages}`);

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    console.log(`\nPage ${pageNum} (${pageText.length} chars)`);
    console.log(`First 200 chars: ${pageText.substring(0, 200)}...`);

    const { data: inserted, error } = await supabase
      .from('manual_chunks')
      .insert({
        manual_title: manualTitle,
        chunk_index: pageNum - 1,
        page_number: pageNum,
        section_title: `Page ${pageNum}`,
        content: pageText
      })
      .select();

    if (error) {
      console.error(`Error inserting page ${pageNum}:`, error);
    } else {
      console.log(`✓ Inserted page ${pageNum}`);
    }
  }

  console.log('\n✅ Complete!');
}

processPDF().catch(console.error);
