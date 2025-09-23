import { supabase } from '@/lib/supabase-client';
import { UnstructuredApi } from 'unstructured-client';

export interface ProcessingResult {
  success: boolean;
  jobId?: string;
  pages?: number;
  textChunks?: number;
  images?: number;
  error?: string;
  processingTime?: number;
}

export interface ProcessingProgress {
  stage: string;
  progress: number;
  currentPage?: number;
  totalPages?: number;
  chunksCreated?: number;
  imagesExtracted?: number;
  elementsProcessed?: number;
  totalElements?: number;
}

export interface UnstructuredElement {
  type: string;
  text: string;
  metadata: {
    page_number?: number;
    coordinates?: any;
    parent_id?: string;
    filename?: string;
    filetype?: string;
  };
}

export interface ProcessedChunk {
  manual_id: string;
  manual_title: string;
  chunk_index: number;
  page_number: number;
  section_title?: string;
  content: string;
  content_type: string;
  has_visual_elements: boolean;
  visual_content_type?: string;
  procedure_complexity?: number;
  extraction_method: string;
  extraction_quality: number;
  metadata: any;
}

export interface ProcessedImage {
  id: string;
  manual_id: string;
  chunk_id?: string;
  image_path?: string;
  image_url?: string;
  description?: string;
  alt_text?: string;
}

export class UnstructuredManualProcessor {
  private client: UnstructuredApi;
  private manualId: string;
  private manualTitle: string;
  private progressCallback?: (progress: ProcessingProgress) => void;

  constructor(
    apiKey: string,
    manualId: string,
    manualTitle: string,
    progressCallback?: (progress: ProcessingProgress) => void
  ) {
    this.client = new UnstructuredApi({
      apiKeyAuth: apiKey,
    });
    this.manualId = manualId;
    this.manualTitle = manualTitle;
    this.progressCallback = progressCallback;
  }

  async processCompleteManual(file: File): Promise<ProcessingResult> {
    const startTime = Date.now();

    try {
      this.updateProgress({
        stage: 'Uploading PDF to Unstructured.io...',
        progress: 5
      });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('files', file);

      // Set processing parameters for optimal results
      const parameters = {
        strategy: 'hi_res', // High resolution for technical documents
        include_page_breaks: true,
        coordinates: true,
        extract_images: true,
        chunking_strategy: 'by_title', // Semantic chunking
        max_characters: 4000, // Optimal chunk size for embeddings
        new_after_n_chars: 3800,
        overlap: 200,
        languages: ['en'], // English technical manuals
      };

      this.updateProgress({
        stage: 'Processing document with AI...',
        progress: 15
      });

      // Submit document for processing
      const response = await this.client.general.partition({
        partitionParameters: {
          files: formData,
          ...parameters
        }
      });

      if (!response.elements || response.elements.length === 0) {
        throw new Error('No elements extracted from document');
      }

      this.updateProgress({
        stage: 'Creating semantic chunks...',
        progress: 40,
        totalElements: response.elements.length,
        elementsProcessed: 0
      });

      // Process elements into semantic chunks
      const chunks = await this.createSemanticChunks(response.elements);

      this.updateProgress({
        stage: 'Extracting and processing images...',
        progress: 65,
        chunksCreated: chunks.length
      });

      // Process images if any were extracted
      const images = await this.processImages(response.elements);

      this.updateProgress({
        stage: 'Saving chunks to database...',
        progress: 80,
        imagesExtracted: images.length
      });

      // Save chunks to database in batches
      await this.saveChunksToDatabase(chunks);

      this.updateProgress({
        stage: 'Saving images to database...',
        progress: 90
      });

      // Save images to database
      await this.saveImagesToDatabase(images, chunks);

      this.updateProgress({
        stage: 'Finalizing processing...',
        progress: 95
      });

      // Update manual metadata
      await this.updateManualMetadata(chunks.length, images.length);

      const processingTime = Date.now() - startTime;

      this.updateProgress({
        stage: 'Complete!',
        progress: 100
      });

      return {
        success: true,
        pages: this.getMaxPageNumber(chunks),
        textChunks: chunks.length,
        images: images.length,
        processingTime
      };

    } catch (error) {
      console.error('Unstructured processing error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown processing error';

      // Save error status to database
      await this.saveProcessingError(errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private async createSemanticChunks(elements: UnstructuredElement[]): Promise<ProcessedChunk[]> {
    const chunks: ProcessedChunk[] = [];
    let currentChunkIndex = 0;

    // Group elements by logical sections
    const sections = this.groupElementsBySection(elements);

    for (const [sectionTitle, sectionElements] of Object.entries(sections)) {
      // Process each section into chunks
      const sectionChunks = await this.processSectionElements(
        sectionElements,
        sectionTitle,
        currentChunkIndex
      );

      chunks.push(...sectionChunks);
      currentChunkIndex += sectionChunks.length;

      // Update progress
      this.updateProgress({
        stage: 'Creating semantic chunks...',
        progress: 40 + (chunks.length / elements.length) * 20,
        elementsProcessed: chunks.length,
        totalElements: elements.length,
        chunksCreated: chunks.length
      });
    }

    return chunks;
  }

  private groupElementsBySection(elements: UnstructuredElement[]): Record<string, UnstructuredElement[]> {
    const sections: Record<string, UnstructuredElement[]> = {};
    let currentSection = 'Introduction';

    for (const element of elements) {
      // Detect section headers based on element type and content
      if (element.type === 'Title' || element.type === 'Header') {
        currentSection = element.text.substring(0, 100); // Limit section title length
      }

      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }

      sections[currentSection].push(element);
    }

    return sections;
  }

  private async processSectionElements(
    elements: UnstructuredElement[],
    sectionTitle: string,
    startIndex: number
  ): Promise<ProcessedChunk[]> {
    const chunks: ProcessedChunk[] = [];
    let currentChunk = '';
    let currentPageNumber = 1;
    let chunkIndex = startIndex;

    for (const element of elements) {
      const pageNumber = element.metadata.page_number || currentPageNumber;
      currentPageNumber = pageNumber;

      // Skip very short elements
      if (element.text.length < 10) continue;

      // Check if adding this element would exceed chunk size
      if (currentChunk.length + element.text.length > 4000 && currentChunk.length > 0) {
        // Save current chunk
        chunks.push(this.createChunk(
          currentChunk.trim(),
          chunkIndex,
          pageNumber,
          sectionTitle,
          elements
        ));

        chunkIndex++;
        currentChunk = '';
      }

      // Add element to current chunk
      if (currentChunk.length > 0) {
        currentChunk += '\n\n';
      }
      currentChunk += element.text;
    }

    // Save final chunk if it has content
    if (currentChunk.trim().length > 0) {
      chunks.push(this.createChunk(
        currentChunk.trim(),
        chunkIndex,
        currentPageNumber,
        sectionTitle,
        elements
      ));
    }

    return chunks;
  }

  private createChunk(
    content: string,
    chunkIndex: number,
    pageNumber: number,
    sectionTitle: string,
    elements: UnstructuredElement[]
  ): ProcessedChunk {
    // Analyze content for visual elements and complexity
    const hasVisualElements = this.detectVisualElements(content);
    const visualContentType = this.classifyVisualContent(content);
    const procedureComplexity = this.assessProcedureComplexity(content);

    return {
      manual_id: this.manualId,
      manual_title: this.manualTitle,
      chunk_index: chunkIndex,
      page_number: pageNumber,
      section_title: sectionTitle,
      content,
      content_type: this.classifyContentType(content),
      has_visual_elements: hasVisualElements,
      visual_content_type: visualContentType,
      procedure_complexity: procedureComplexity,
      extraction_method: 'unstructured_api',
      extraction_quality: 0.95, // High quality from Unstructured.io
      metadata: {
        section_title: sectionTitle,
        word_count: content.split(' ').length,
        extraction_timestamp: new Date().toISOString(),
        api_version: 'unstructured-0.18.0'
      }
    };
  }

  private async processImages(elements: UnstructuredElement[]): Promise<ProcessedImage[]> {
    const images: ProcessedImage[] = [];

    // Filter elements that represent images
    const imageElements = elements.filter(el =>
      el.type === 'Image' ||
      (el.metadata && el.metadata.coordinates)
    );

    for (let i = 0; i < imageElements.length; i++) {
      const element = imageElements[i];

      // Generate image description based on surrounding context
      const description = await this.generateImageDescription(element, elements);

      images.push({
        id: `${this.manualId}_img_${i}`,
        manual_id: this.manualId,
        description,
        alt_text: `Technical diagram from page ${element.metadata.page_number || 'unknown'}`
      });
    }

    return images;
  }

  private async generateImageDescription(
    imageElement: UnstructuredElement,
    allElements: UnstructuredElement[]
  ): Promise<string> {
    // Find surrounding text elements for context
    const pageNumber = imageElement.metadata.page_number;
    const contextElements = allElements.filter(el =>
      el.metadata.page_number === pageNumber &&
      el.type !== 'Image'
    );

    const context = contextElements
      .map(el => el.text)
      .join(' ')
      .substring(0, 500);

    return `Technical diagram related to: ${context}`.substring(0, 200);
  }

  private async saveChunksToDatabase(chunks: ProcessedChunk[]): Promise<void> {
    const batchSize = 25;

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);

      const { error } = await supabase
        .from('manual_chunks')
        .insert(batch);

      if (error) {
        console.error('Batch insert failed, trying individual inserts:', error);

        // Try individual inserts for this batch
        for (const chunk of batch) {
          const { error: individualError } = await supabase
            .from('manual_chunks')
            .insert([chunk]);

          if (individualError) {
            console.error('Individual chunk insert failed:', individualError);
          }
        }
      }
    }
  }

  private async saveImagesToDatabase(
    images: ProcessedImage[],
    chunks: ProcessedChunk[]
  ): Promise<void> {
    if (images.length === 0) return;

    const { error } = await supabase
      .from('manual_images')
      .insert(images);

    if (error) {
      console.error('Failed to save images:', error);
    }
  }

  private async updateManualMetadata(chunksCount: number, imagesCount: number): Promise<void> {
    const { error } = await supabase
      .from('manual_metadata')
      .upsert({
        id: this.manualId,
        filename: `${this.manualTitle}.pdf`,
        title: this.manualTitle,
        processed_at: new Date().toISOString(),
        processing_status: 'completed',
        chunks_count: chunksCount,
        images_count: imagesCount,
        processing_method: 'unstructured_api'
      });

    if (error) {
      console.error('Failed to update manual metadata:', error);
    }
  }

  private async saveProcessingError(errorMessage: string): Promise<void> {
    await supabase
      .from('manual_metadata')
      .upsert({
        id: this.manualId,
        filename: `${this.manualTitle}.pdf`,
        title: this.manualTitle,
        processing_status: 'failed',
        error_message: errorMessage,
        failed_at: new Date().toISOString()
      });
  }

  private updateProgress(progress: ProcessingProgress): void {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  private detectVisualElements(content: string): boolean {
    const visualKeywords = [
      'figure', 'diagram', 'image', 'illustration', 'chart', 'graph',
      'table', 'schematic', 'drawing', 'photo', 'picture'
    ];

    const contentLower = content.toLowerCase();
    return visualKeywords.some(keyword => contentLower.includes(keyword));
  }

  private classifyVisualContent(content: string): string | undefined {
    const contentLower = content.toLowerCase();

    if (contentLower.includes('schematic') || contentLower.includes('wiring')) {
      return 'schematic';
    }
    if (contentLower.includes('diagram') || contentLower.includes('illustration')) {
      return 'diagram';
    }
    if (contentLower.includes('photo') || contentLower.includes('picture')) {
      return 'photo';
    }
    if (contentLower.includes('table') || contentLower.includes('chart')) {
      return 'table';
    }

    return undefined;
  }

  private classifyContentType(content: string): string {
    const contentLower = content.toLowerCase();

    if (contentLower.includes('procedure') || contentLower.includes('step')) {
      return 'procedure';
    }
    if (contentLower.includes('specification') || contentLower.includes('technical data')) {
      return 'specification';
    }
    if (contentLower.includes('troubleshooting') || contentLower.includes('problem')) {
      return 'troubleshooting';
    }
    if (contentLower.includes('maintenance') || contentLower.includes('service')) {
      return 'maintenance';
    }

    return 'general';
  }

  private assessProcedureComplexity(content: string): number {
    const contentLower = content.toLowerCase();
    let complexity = 0.5; // Base complexity

    // Increase complexity based on indicators
    if (contentLower.includes('warning') || contentLower.includes('caution')) {
      complexity += 0.2;
    }
    if (contentLower.includes('special tool') || contentLower.includes('equipment')) {
      complexity += 0.2;
    }
    if (contentLower.includes('torque') || contentLower.includes('specification')) {
      complexity += 0.1;
    }

    // Count numbered steps
    const steps = (content.match(/\d+\./g) || []).length;
    if (steps > 5) complexity += 0.1;
    if (steps > 10) complexity += 0.1;

    return Math.min(complexity, 1.0);
  }

  private getMaxPageNumber(chunks: ProcessedChunk[]): number {
    return Math.max(...chunks.map(chunk => chunk.page_number), 0);
  }
}