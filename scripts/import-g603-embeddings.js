#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Load the G603 embeddings
const embeddingsPath = '/Users/thabonel/Downloads/g603_embeddings.json';
const embeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));

console.log(`📊 Processing ${embeddings.length} G603 embeddings...`);

// Pad 384-dimension embeddings to 768 dimensions
const paddedEmbeddings = embeddings.map(item => {
  const currentDims = item.embedding.length;
  const targetDims = 768;

  // Pad with zeros to reach 768 dimensions
  const padded = [...item.embedding];
  while (padded.length < targetDims) {
    padded.push(0.0);
  }

  return {
    chunk_index: item.chunk_index,
    section_title: item.section_title,
    page_number: item.page_number,
    quality_score: item.quality_score,
    embedding: padded,
    original_dims: currentDims,
    padded_dims: padded.length
  };
});

console.log(`✅ Padded embeddings from 384 to 768 dimensions`);

// Generate SQL statements for database import
const sqlStatements = paddedEmbeddings.map(item => {
  const vectorString = `[${item.embedding.join(',')}]`;

  return `UPDATE manual_chunks
SET embedding = '${vectorString}'::vector
WHERE manual_title = 'G603 Unimog all types Light Repair.pdf'
  AND chunk_index = ${item.chunk_index}
  AND page_number = ${item.page_number};`;
});

// Write SQL file
const sqlPath = '/Users/thabonel/Code/unimogcommunityhub/scripts/import-g603-embeddings.sql';
const sqlContent = `-- Import G603 Hash-Based Embeddings
-- Generated: ${new Date().toISOString()}
-- Total embeddings: ${paddedEmbeddings.length}
-- Dimensions: 768 (padded from 384)

${sqlStatements.join('\n\n')}

-- Verify import
SELECT manual_title,
       COUNT(*) as total_chunks,
       COUNT(CASE WHEN embedding IS NOT NULL THEN 1 END) as chunks_with_embeddings,
       ROUND(COUNT(CASE WHEN embedding IS NOT NULL THEN 1 END) * 100.0 / COUNT(*), 1) as coverage_percent
FROM manual_chunks
WHERE manual_title = 'G603 Unimog all types Light Repair.pdf'
GROUP BY manual_title;
`;

fs.writeFileSync(sqlPath, sqlContent);

// Write processed embeddings for reference
const processedPath = '/Users/thabonel/Code/unimogcommunityhub/scripts/g603-padded-embeddings.json';
fs.writeFileSync(processedPath, JSON.stringify(paddedEmbeddings, null, 2));

console.log(`📝 Generated SQL import script: ${sqlPath}`);
console.log(`💾 Saved padded embeddings: ${processedPath}`);
console.log(`🎯 Ready to import ${paddedEmbeddings.length} embeddings into database`);

// Statistics
console.log('\n📊 Statistics:');
console.log(`- Original dimensions: 384`);
console.log(`- Padded dimensions: 768`);
console.log(`- Chunks to update: ${paddedEmbeddings.length}`);
console.log(`- SQL statements: ${sqlStatements.length}`);