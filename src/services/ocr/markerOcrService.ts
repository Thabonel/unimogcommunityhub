/**
 * Marker OCR Service - Replicate Integration
 *
 * Uses Marker model on Replicate to convert RPS parts list images to markdown
 * Model: cuuupid/marker
 * Cost: ~$0.092 per run, ~95 seconds per document
 */

import Replicate from 'replicate';

export interface MarkerOCRInput {
  imageUrl: string;
  language?: string;
  dpi?: number;
  maxPages?: number;
}

export interface MarkerOCROutput {
  markdown: string;
  metadata: {
    language: string;
    file_type: string;
    pages: number;
    ocr_stats?: Record<string, any>;
  };
}

export class MarkerOCRService {
  private replicate: Replicate;

  constructor(apiToken: string) {
    if (!apiToken) {
      throw new Error('REPLICATE_API_TOKEN is required');
    }

    this.replicate = new Replicate({
      auth: apiToken,
    });
  }

  /**
   * Process a single image with Marker OCR
   */
  async processImage(input: MarkerOCRInput): Promise<MarkerOCROutput> {
    console.log('[Marker OCR] Processing image:', input.imageUrl);

    try {
      const output = await this.replicate.run(
        'cuuupid/marker',
        {
          input: {
            document: input.imageUrl,
            lang: input.language || 'English',
            dpi: input.dpi || 400,
            max_pages: input.maxPages || 1,
            parallel_factor: 1,
            enable_editor: false
          }
        }
      ) as any;

      console.log('[Marker OCR] Raw output:', output);

      if (!output.markdown) {
        throw new Error('No markdown output from Marker OCR');
      }

      const markdownUrl = typeof output.markdown === 'string'
        ? output.markdown
        : output.markdown.toString();

      const markdownResponse = await fetch(markdownUrl);

      if (!markdownResponse.ok) {
        throw new Error(`Failed to download markdown: ${markdownResponse.status}`);
      }

      const markdownContent = await markdownResponse.text();

      console.log('[Marker OCR] Success:', {
        contentLength: markdownContent.length,
        metadata: output.metadata
      });

      return {
        markdown: markdownContent,
        metadata: output.metadata || {
          language: input.language || 'English',
          file_type: 'image',
          pages: 1
        }
      };
    } catch (error: any) {
      console.error('[Marker OCR] Error:', error);
      throw new Error(`Marker OCR failed: ${error.message}`);
    }
  }

  /**
   * Batch process multiple images
   */
  async batchProcess(
    inputs: MarkerOCRInput[],
    onProgress?: (current: number, total: number, result?: MarkerOCROutput) => void
  ): Promise<MarkerOCROutput[]> {
    const results: MarkerOCROutput[] = [];

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];

      try {
        const result = await this.processImage(input);
        results.push(result);

        if (onProgress) {
          onProgress(i + 1, inputs.length, result);
        }

        if (i < inputs.length - 1) {
          await this.sleep(2000);
        }
      } catch (error: any) {
        console.error(`[Marker OCR] Failed on image ${i + 1}:`, error);

        results.push({
          markdown: `Error: ${error.message}`,
          metadata: {
            language: 'English',
            file_type: 'error',
            pages: 0
          }
        });

        if (onProgress) {
          onProgress(i + 1, inputs.length);
        }
      }
    }

    return results;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Factory function to create MarkerOCRService instance
 */
export function createMarkerOCRService(apiToken?: string): MarkerOCRService {
  const token = apiToken || import.meta.env.VITE_REPLICATE_API_TOKEN;

  if (!token) {
    throw new Error('REPLICATE_API_TOKEN environment variable is not set');
  }

  return new MarkerOCRService(token);
}
