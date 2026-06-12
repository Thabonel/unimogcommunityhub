#!/usr/bin/env node
/**
 * Barry v2 Embedding Generator
 * Generates vector embeddings for all content blocks using local Xenova Transformers.
 * 
 * Usage: node scripts/generate-barry-v2-embeddings.mjs
 * 
 * Prerequisites: npm install @xenova/transformers
 * 
 * Output: docs/embeddings/embeddings.sql (SQL UPDATE statements)
 *         docs/embeddings/embeddings.json (full embeddings data)
 */

import fs from 'fs';
import path from 'path';
import { pipeline } from '@xenova/transformers';
import { createHash, randomUUID } from 'crypto';

const EXTRACTION_DIR = 'docs/extraction';
const OUTPUT_DIR = 'docs/embeddings';
const BATCH_SIZE = 32;

function uuidFrom(str) {
    const hex = createHash('md5').update(str).digest('hex');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
}

async function main() {
    console.log('Loading embedding model (Xenova/all-MiniLM-L6-v2)...');
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Model ready (384-dim embeddings)\n');

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Gather all blocks
    const files = fs.readdirSync(EXTRACTION_DIR)
        .filter(f => f.endsWith('_extraction.json'))
        .sort();

    const allBlocks = [];
    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(EXTRACTION_DIR, file), 'utf-8'));
        const title = data.normalized_title || path.basename(data.source, '.pdf');
        const blocks = data.content_blocks || [];
        for (let i = 0; i < blocks.length; i++) {
            const text = (blocks[i].content_text || '').trim();
            if (text.length < 10) continue;
            allBlocks.push({
                uuid: uuidFrom(`block:${title}:${i}`),
                source: title,
                index: i,
                text: text.slice(0, 5000),  // Truncate for speed
                page: blocks[i].page_start || 0,
            });
        }
    }

    console.log(`Total blocks to embed: ${allBlocks.length}`);
    console.log(`Batches of ${BATCH_SIZE}: ${Math.ceil(allBlocks.length / BATCH_SIZE)}\n`);

    // Generate embeddings in batches
    const embeddings = [];
    const startTime = Date.now();

    for (let i = 0; i < allBlocks.length; i += BATCH_SIZE) {
        const batch = allBlocks.slice(i, i + BATCH_SIZE);
        const texts = batch.map(b => b.text);

        try {
            const output = await extractor(texts, { pooling: 'mean', normalize: true });
            const batchEmbeddings = output.tolist ? output.tolist() : Array.from({ length: texts.length }, (_, j) => {
                // Extract each sequence's embedding
                const start = j * 384;
                return Array.from(output.data.slice(start, start + 384));
            });

            for (let j = 0; j < batch.length; j++) {
                embeddings.push({
                    ...batch[j],
                    embedding: batchEmbeddings[j],
                });
            }
        } catch (err) {
            console.error(`  Batch ${Math.floor(i/BATCH_SIZE) + 1} failed:`, err.message.slice(0, 100));
            // Fall back to zero embeddings for failed blocks
            for (const b of batch) {
                embeddings.push({ ...b, embedding: new Array(384).fill(0) });
            }
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
        const rate = (embeddings.length / (Date.now() - startTime) * 1000).toFixed(1);
        const pct = (embeddings.length / allBlocks.length * 100).toFixed(0);
        const eta = ((allBlocks.length - embeddings.length) / parseFloat(rate)).toFixed(0);
        process.stdout.write(`\r  ${embeddings.length}/${allBlocks.length} (${pct}%) ${rate} blk/s eta=${eta}s`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n\nDone in ${elapsed}s (${(allBlocks.length / parseFloat(elapsed)).toFixed(1)} blk/s)`);

    // Save full results
    const output = {
        generated: new Date().toISOString(),
        model: 'Xenova/all-MiniLM-L6-v2',
        dimension: 384,
        total_blocks: embeddings.length,
        blocks: embeddings.map(b => ({
            uuid: b.uuid,
            source: b.source,
            index: b.index,
            page: b.page,
            embedding: b.embedding,
        })),
    };

    const jsonPath = path.join(OUTPUT_DIR, 'embeddings.json');
    fs.writeFileSync(jsonPath, JSON.stringify(output));
    console.log(`Embeddings saved: ${jsonPath} (${(fs.statSync(jsonPath).size / 1024 / 1024).toFixed(0)}MB)`);

    // Generate SQL with pgvector-safe format
    const sqlLines = [
        '-- Barry v2 Embedding Import',
        `-- ${embeddings.length} blocks, 384-dim (Xenova/all-MiniLM-L6-v2)`,
        '-- Run ALTER TABLE barry_v2_content_blocks ALTER COLUMN embedding TYPE vector(384); first',
        'BEGIN;\n',
    ];

    for (const b of embeddings) {
        const vec = `[${b.embedding.join(',')}]`;
        sqlLines.push(
            `UPDATE barry_v2_content_blocks SET embedding = '${vec}'::vector WHERE id = '${b.uuid}';`
        );
    }

    sqlLines.push('\nCREATE INDEX IF NOT EXISTS idx_barry_v2_blocks_embedding ON barry_v2_content_blocks '
        + 'USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);');
    sqlLines.push('\nCOMMIT;');

    const sqlPath = path.join(OUTPUT_DIR, 'embeddings_import.sql');
    fs.writeFileSync(sqlPath, sqlLines.join('\n'));
    const sqlSize = (fs.statSync(sqlPath).size / 1024).toFixed(0);
    console.log(`SQL: ${sqlPath} (${sqlSize}KB, ${embeddings.length} UPDATEs)`);
}

main().catch(err => {
    console.error('Fatal:', err.message);
    process.exit(1);
});
