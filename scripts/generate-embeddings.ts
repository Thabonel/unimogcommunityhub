#!/usr/bin/env tsx

/**
 * Embedding Generation Script for RRF Hybrid Search
 *
 * Generates vector(1536) embeddings for all manual_chunks using OpenAI text-embedding-3-small
 *
 * Usage:
 *   npm run generate-embeddings -- --dry-run           # Test on 10 pages
 *   npm run generate-embeddings                        # Generate all embeddings
 *   npm run generate-embeddings -- --batch-size 50     # Custom batch size
 *
 * Cost: ~$0.00001 per page (2,480 pages = $0.025 total)
 * Time: ~30-45 minutes for full run
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load .env.local first, then fall back to .env
dotenv.config({ path: '.env.local' });
dotenv.config();

interface ManualChunk {
  id: string;
  manual_title: string;
  page_number: number;
  section_title: string | null;
  content: string;
}

interface EmbeddingResponse {
  object: string;
  data: Array<{
    object: string;
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

class EmbeddingGenerator {
  private supabase: ReturnType<typeof createClient>;
  private openaiApiKey: string;
  private batchSize: number;
  private rateLimitDelay: number;
  private dryRun: boolean;

  private totalTokens = 0;
  private totalCost = 0;
  private processedCount = 0;
  private errorCount = 0;

  constructor(options: {
    batchSize?: number;
    rateLimitDelay?: number;
    dryRun?: boolean;
  } = {}) {
    this.batchSize = options.batchSize || 100;
    this.rateLimitDelay = options.rateLimitDelay || 1000; // 1 second between batches
    this.dryRun = options.dryRun || false;

    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get OpenAI API key
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    if (!this.openaiApiKey) {
      throw new Error('Missing OPENAI_API_KEY environment variable');
    }
  }

  /**
   * Fetch all chunks that need embeddings
   */
  async fetchPendingChunks(): Promise<ManualChunk[]> {
    console.log('📥 Fetching chunks without embeddings...');

    const { data, error } = await this.supabase
      .from('manual_chunks')
      .select('id, manual_title, page_number, section_title, content')
      .is('embedding', null)
      .order('manual_title, page_number');

    if (error) {
      throw new Error(`Failed to fetch chunks: ${error.message}`);
    }

    const chunks = data || [];
    console.log(`✅ Found ${chunks.length} chunks needing embeddings\n`);

    return chunks;
  }

  /**
   * Generate embeddings via OpenAI API
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: texts,
        encoding_format: 'float'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const result: EmbeddingResponse = await response.json();

    // Track usage
    this.totalTokens += result.usage.total_tokens;
    this.totalCost += (result.usage.total_tokens / 1000) * 0.00002; // $0.00002 per 1K tokens

    return result.data.map(d => d.embedding);
  }

  /**
   * Update database with embeddings
   */
  async updateEmbeddings(chunks: ManualChunk[], embeddings: number[][]): Promise<void> {
    if (this.dryRun) {
      console.log(`   [DRY RUN] Would update ${chunks.length} chunks`);
      return;
    }

    // Update in batches using Supabase client
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = embeddings[i];

      const { error } = await this.supabase
        .from('manual_chunks')
        .update({ embedding: embedding as any })
        .eq('id', chunk.id);

      if (error) {
        console.error(`   ❌ Failed to update chunk ${chunk.id}: ${error.message}`);
        this.errorCount++;
      } else {
        this.processedCount++;
      }
    }
  }

  /**
   * Process a single batch
   */
  async processBatch(batch: ManualChunk[], batchNumber: number, totalBatches: number): Promise<void> {
    console.log(`\n📦 Batch ${batchNumber}/${totalBatches} (${batch.length} chunks)`);

    // Prepare text for embedding
    const texts = batch.map(chunk => {
      // Truncate very long content (OpenAI limit: 8191 tokens ≈ 6000 words)
      const maxWords = 500; // Conservative limit
      const words = chunk.content.trim().split(/\s+/);
      const truncated = words.slice(0, maxWords).join(' ');

      return `${chunk.manual_title} - Page ${chunk.page_number}\n${chunk.section_title || ''}\n\n${truncated}`;
    });

    try {
      // Generate embeddings
      console.log('   🔮 Calling OpenAI API...');
      const embeddings = await this.generateEmbeddings(texts);

      // Verify dimensions
      if (embeddings[0].length !== 1536) {
        throw new Error(`Expected 1536 dimensions, got ${embeddings[0].length}`);
      }

      console.log(`   ✅ Generated ${embeddings.length} embeddings (1536 dimensions)`);

      // Update database
      console.log('   💾 Updating database...');
      await this.updateEmbeddings(batch, embeddings);
      console.log(`   ✅ Updated ${batch.length} chunks`);

    } catch (error) {
      console.error(`   ❌ Batch failed: ${error instanceof Error ? error.message : error}`);
      this.errorCount += batch.length;

      // Retry once after delay
      console.log('   🔄 Retrying in 5 seconds...');
      await this.sleep(5000);

      try {
        const embeddings = await this.generateEmbeddings(texts);
        await this.updateEmbeddings(batch, embeddings);
        console.log(`   ✅ Retry successful`);
      } catch (retryError) {
        console.error(`   ❌ Retry failed: ${retryError instanceof Error ? retryError.message : retryError}`);
        throw retryError; // Stop on persistent errors
      }
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Main generation flow
   */
  async generate(): Promise<void> {
    const startTime = Date.now();

    console.log('🚀 Embedding Generation Started\n');
    console.log(`Configuration:`);
    console.log(`  - Batch size: ${this.batchSize}`);
    console.log(`  - Rate limit delay: ${this.rateLimitDelay}ms`);
    console.log(`  - Dry run: ${this.dryRun}`);
    console.log(`  - Model: text-embedding-3-small (1536 dimensions)`);
    console.log(`  - Cost per 1K tokens: $0.00002\n`);

    // Fetch chunks
    let chunks = await this.fetchPendingChunks();

    if (chunks.length === 0) {
      console.log('✨ No chunks need embeddings. All done!');
      return;
    }

    // Dry run mode: only process first 10
    if (this.dryRun) {
      console.log('🧪 DRY RUN MODE: Processing first 10 chunks only\n');
      chunks = chunks.slice(0, 10);
    }

    // Process in batches
    const totalBatches = Math.ceil(chunks.length / this.batchSize);

    for (let i = 0; i < chunks.length; i += this.batchSize) {
      const batch = chunks.slice(i, i + this.batchSize);
      const batchNumber = Math.floor(i / this.batchSize) + 1;

      await this.processBatch(batch, batchNumber, totalBatches);

      // Progress summary
      const progress = Math.min(i + this.batchSize, chunks.length);
      const percent = ((progress / chunks.length) * 100).toFixed(1);
      console.log(`\n📊 Progress: ${progress}/${chunks.length} (${percent}%)`);
      console.log(`   Processed: ${this.processedCount} ✅ | Errors: ${this.errorCount} ❌`);
      console.log(`   Tokens used: ${this.totalTokens.toLocaleString()}`);
      console.log(`   Cost so far: $${this.totalCost.toFixed(4)}`);

      // Rate limiting (except last batch)
      if (i + this.batchSize < chunks.length) {
        console.log(`   ⏳ Waiting ${this.rateLimitDelay}ms before next batch...`);
        await this.sleep(this.rateLimitDelay);
      }
    }

    // Final summary
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log('✨ GENERATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`Total chunks: ${chunks.length}`);
    console.log(`Successfully processed: ${this.processedCount}`);
    console.log(`Errors: ${this.errorCount}`);
    console.log(`Total tokens: ${this.totalTokens.toLocaleString()}`);
    console.log(`Total cost: $${this.totalCost.toFixed(4)}`);
    console.log(`Duration: ${duration} minutes`);
    console.log('='.repeat(60) + '\n');

    if (!this.dryRun && this.errorCount === 0) {
      console.log('🎉 All embeddings generated successfully!');
      console.log('📝 Next steps:');
      console.log('   1. Verify embeddings: SELECT COUNT(*) FROM manual_chunks WHERE embedding IS NOT NULL;');
      console.log('   2. Test RRF search function');
      console.log('   3. Deploy RRFSearchEngine to edge function\n');
    }
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);

  const options = {
    dryRun: args.includes('--dry-run'),
    batchSize: parseInt(args.find(arg => arg.startsWith('--batch-size='))?.split('=')[1] || '100'),
    rateLimitDelay: parseInt(args.find(arg => arg.startsWith('--delay='))?.split('=')[1] || '1000')
  };

  const generator = new EmbeddingGenerator(options);

  try {
    await generator.generate();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { EmbeddingGenerator };
