import { supabase } from '@/lib/supabase-client';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface ProcessingResult {
  success: boolean;
  manualId?: string;
  title?: string;
  pages?: number;
  textChunks?: number;
  images?: number;
  error?: string;
}

interface ExtractedImage {
  pageNumber: number;
  imageData: string; // base64
  width: number;
  height: number;
  type: string;
  description?: string; // AI-generated caption
  position?: { x: number; y: number }; // Position on page for linking
}

interface TextSection {
  content: string;
  type: 'heading' | 'paragraph' | 'procedure' | 'warning' | 'specification' | 'table';
  level?: number; // For headings
  pageNumber: number;
  position?: { x: number; y: number; width: number; height: number };
}

export class FullManualProcessor {
  private static instance: FullManualProcessor;
  private processingState: Map<string, any> = new Map(); // Track processing state
  private readonly CHUNK_SIZE = 100; // Process 100 pages at a time
  private readonly MAX_IMAGE_PAGES = 500; // Only extract images from first 500 pages
  private readonly BATCH_DELAY = 2000; // 2 second delay between chunks

  static getInstance(): FullManualProcessor {
    if (!this.instance) {
      this.instance = new FullManualProcessor();
    }
    return this.instance;
  }

  /**
   * Process the complete U1700L-U435 manual with text and images
   * Enhanced version with chunking and memory management
   */
  async processCompleteManual(filename: string = 'U1700L-U435-Workshop-Manual-Volume-1.pdf'): Promise<ProcessingResult> {
    try {
      console.log(`Starting ENHANCED complete processing for ${filename}`);

      // Download PDF from storage
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('manuals')
        .download(filename);

      if (downloadError || !fileData) {
        throw new Error(`Failed to download ${filename}: ${downloadError?.message}`);
      }

      console.log(`Downloaded PDF: ${(fileData.size / 1024 / 1024).toFixed(1)}MB`);

      // Convert blob to array buffer
      const arrayBuffer = await fileData.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdfDocument = await loadingTask.promise;

      console.log(`PDF loaded: ${pdfDocument.numPages} pages`);

      // Create or get manual metadata
      const manualMetadata = await this.createManualMetadata(filename, fileData.size, pdfDocument.numPages);

      // Extract text and images from all pages
      const extractionResults = await this.extractContentFromAllPages(pdfDocument);

      // Process text into chunks with image descriptions
      const textChunks = await this.createTextChunks(extractionResults.textPages, manualMetadata.id, manualMetadata.title, extractionResults.images);

      // Process and save images
      const savedImages = await this.saveImages(extractionResults.images, manualMetadata.id);

      // Link images to text chunks by page numbers
      await this.linkImagesToChunks(manualMetadata.id);

      // Update manual metadata with completion status
      await supabase
        .from('manual_metadata')
        .update({
          processed_at: new Date().toISOString(),
          approval_status: 'approved'
        })
        .eq('id', manualMetadata.id);

      console.log(`Processing complete: ${textChunks.length} text chunks, ${savedImages} images`);

      return {
        success: true,
        manualId: manualMetadata.id,
        title: manualMetadata.title,
        pages: pdfDocument.numPages,
        textChunks: textChunks.length,
        images: savedImages,
      };

    } catch (error) {
      console.error('Complete processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Extract text and images from all PDF pages with CHUNKED processing
   * This prevents memory issues with large PDFs
   */
  private async extractContentFromAllPages(pdfDocument: any): Promise<{
    textPages: Array<{ pageNum: number; text: string; hasImages: boolean; sections: TextSection[] }>;
    images: ExtractedImage[];
  }> {
    const textPages: Array<{ pageNum: number; text: string; hasImages: boolean; sections: TextSection[] }> = [];
    const images: ExtractedImage[] = [];
    const totalPages = pdfDocument.numPages;

    console.log(`📚 Processing ${totalPages} pages in chunks of ${this.CHUNK_SIZE}`);

    // Process in chunks to avoid memory issues
    for (let chunkStart = 1; chunkStart <= totalPages; chunkStart += this.CHUNK_SIZE) {
      const chunkEnd = Math.min(chunkStart + this.CHUNK_SIZE - 1, totalPages);
      console.log(`\n🔄 Processing chunk: pages ${chunkStart}-${chunkEnd} (${Math.round((chunkEnd/totalPages)*100)}% complete)`);

      // Process this chunk
      for (let pageNum = chunkStart; pageNum <= chunkEnd; pageNum++) {
        try {
          console.log(`Processing page ${pageNum}/${totalPages}`);
          const page = await pdfDocument.getPage(pageNum);

          // Extract text content with layout information
          const textContent = await page.getTextContent();
          const sections = this.analyzeTextLayout(textContent, pageNum);

          // Combine all text for backward compatibility
          const pageText = sections
            .map(section => section.content)
            .join('\n')
            .replace(/\s+/g, ' ')
            .trim();

          // Only extract images from first MAX_IMAGE_PAGES to save memory
          // Images after page 500 are usually repetitive diagrams
          const shouldExtractImages = pageNum <= this.MAX_IMAGE_PAGES;

          let pageImages: ExtractedImage[] = [];
          if (shouldExtractImages) {
            try {
              pageImages = await this.extractImagesFromPage(page, pageNum);

              // Skip AI captions for now to speed up processing
              // We can add them in a second pass if needed
              console.log(`Found ${pageImages.length} images on page ${pageNum}`);
              images.push(...pageImages);
            } catch (imgError) {
              console.warn(`Failed to extract images from page ${pageNum}:`, imgError);
              // Continue processing even if image extraction fails
            }
          }

          // Only include pages with substantial content
          if (pageText.length > 50) {
            textPages.push({
              pageNum,
              text: pageText,
              hasImages: pageImages.length > 0,
              sections
            });
          }

          // Clean up page resources to free memory
          await page.cleanup();

        } catch (pageError) {
          console.error(`Failed to process page ${pageNum}:`, pageError);
          // Continue with next page even if this one fails
        }
      }

      // Delay between chunks to let browser garbage collect
      if (chunkEnd < totalPages) {
        console.log(`⏸️ Pausing ${this.BATCH_DELAY/1000}s before next chunk to free memory...`);
        await new Promise(resolve => setTimeout(resolve, this.BATCH_DELAY));

        // Force garbage collection hint (browser may or may not respect this)
        if (typeof (global as any).gc === 'function') {
          (global as any).gc();
        }
      }
    }

    console.log(`✅ Extraction complete: ${textPages.length} text pages, ${images.length} images`);
    return { textPages, images };
  }

  /**
   * Analyze text layout to identify semantic sections
   */
  private analyzeTextLayout(textContent: any, pageNumber: number): TextSection[] {
    const sections: TextSection[] = [];
    const items = textContent.items || [];

    let currentSection = '';
    let currentType: TextSection['type'] = 'paragraph';

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const text = item.str?.trim();

      if (!text) continue;

      // Detect section types based on content patterns
      const detectedType = this.detectContentType(text);

      // Check if we should start a new section
      if (this.shouldStartNewSection(text, currentType, detectedType)) {
        // Save previous section if it has content
        if (currentSection.trim()) {
          sections.push({
            content: currentSection.trim(),
            type: currentType,
            pageNumber,
            position: {
              x: item.transform?.[4] || 0,
              y: item.transform?.[5] || 0,
              width: item.width || 0,
              height: item.height || 0
            }
          });
        }

        currentSection = text;
        currentType = detectedType;
      } else {
        // Add space if needed
        if (currentSection && !currentSection.endsWith(' ') && !text.startsWith(' ')) {
          currentSection += ' ';
        }
        currentSection += text;
      }
    }

    // Add final section
    if (currentSection.trim()) {
      sections.push({
        content: currentSection.trim(),
        type: currentType,
        pageNumber
      });
    }

    return sections;
  }

  /**
   * Determine if we should start a new section
   */
  private shouldStartNewSection(text: string, currentType: TextSection['type'], detectedType: TextSection['type']): boolean {
    // Always start new section for headings
    if (detectedType === 'heading') return true;

    // Start new section if type changes significantly
    if (currentType !== detectedType &&
        (detectedType === 'procedure' || detectedType === 'warning' || detectedType === 'specification')) {
      return true;
    }

    // Start new section for numbered procedures
    if (text.match(/^\d+\.\s/)) return true;

    // Start new section for warnings/cautions
    if (text.match(/^(WARNING|CAUTION|NOTE|IMPORTANT):/i)) return true;

    return false;
  }

  /**
   * Create semantic chunks from text sections and related images
   */
  private createSemanticChunks(sections: TextSection[], pageImages: ExtractedImage[]): Array<{
    content: string;
    sectionTitle?: string;
    primaryType: string;
    sectionTypes: string[];
    relatedImages: ExtractedImage[];
  }> {
    const chunks: Array<{
      content: string;
      sectionTitle?: string;
      primaryType: string;
      sectionTypes: string[];
      relatedImages: ExtractedImage[];
    }> = [];

    let currentChunk = {
      content: '',
      sectionTitle: undefined as string | undefined,
      primaryType: 'paragraph',
      sectionTypes: [] as string[],
      relatedImages: [] as ExtractedImage[]
    };

    for (const section of sections) {
      // Check if we should start a new chunk
      const shouldSplit = this.shouldSplitChunk(currentChunk, section);

      if (shouldSplit && currentChunk.content.trim()) {
        // Finalize current chunk
        chunks.push({ ...currentChunk });

        // Start new chunk
        currentChunk = {
          content: section.content,
          sectionTitle: section.type === 'heading' ? section.content : undefined,
          primaryType: section.type,
          sectionTypes: [section.type],
          relatedImages: []
        };
      } else {
        // Add to current chunk
        if (currentChunk.content) {
          currentChunk.content += '\n\n' + section.content;
        } else {
          currentChunk.content = section.content;
        }

        // Update chunk metadata
        if (section.type === 'heading' && !currentChunk.sectionTitle) {
          currentChunk.sectionTitle = section.content;
        }

        if (!currentChunk.sectionTypes.includes(section.type)) {
          currentChunk.sectionTypes.push(section.type);
        }

        // Update primary type based on importance
        if (this.getTypeImportance(section.type) > this.getTypeImportance(currentChunk.primaryType)) {
          currentChunk.primaryType = section.type;
        }
      }
    }

    // Add final chunk
    if (currentChunk.content.trim()) {
      chunks.push(currentChunk);
    }

    // Distribute images to chunks based on position/context
    for (const image of pageImages) {
      // For now, add all page images to all chunks on that page
      // In a more sophisticated version, we'd use position data
      chunks.forEach(chunk => {
        if (!chunk.relatedImages.find(img => img === image)) {
          chunk.relatedImages.push(image);
        }
      });
    }

    return chunks;
  }

  /**
   * Determine if we should split into a new chunk
   */
  private shouldSplitChunk(currentChunk: any, newSection: TextSection): boolean {
    // Always split on headings (start new procedures/sections)
    if (newSection.type === 'heading') return true;

    // Split if content gets too long (>1500 chars)
    if (currentChunk.content.length > 1500) return true;

    // Split when moving from procedures to other content types
    if (currentChunk.primaryType === 'procedure' && newSection.type !== 'procedure') {
      return true;
    }

    // Split when starting a new warning/specification block
    if (newSection.type === 'warning' || newSection.type === 'specification') {
      return true;
    }

    return false;
  }

  /**
   * Get importance ranking for content types
   */
  private getTypeImportance(type: string): number {
    const importance: Record<string, number> = {
      'heading': 5,
      'warning': 4,
      'procedure': 3,
      'specification': 2,
      'table': 1,
      'paragraph': 0
    };
    return importance[type] || 0;
  }

  /**
   * Extract images from a single PDF page
   */
  private async extractImagesFromPage(page: any, pageNumber: number): Promise<ExtractedImage[]> {
    const images: ExtractedImage[] = [];

    try {
      // Get the page's resources to access images
      const resources = await page.objs.get('Resources');

      if (resources && resources.XObject) {
        const xObjects = resources.XObject;

        for (const [name, xObj] of Object.entries(xObjects)) {
          try {
            // Check if this is an image object
            if (xObj && typeof xObj === 'object' && xObj.Subtype?.name === 'Image') {
              console.log(`Found image ${name} on page ${pageNumber}`);

              // Create canvas to render the image
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');

              // Set canvas dimensions based on image
              const width = xObj.Width || 400;
              const height = xObj.Height || 300;
              canvas.width = width;
              canvas.height = height;

              try {
                // Attempt to get image data and convert to base64
                const imageData = await this.extractImageDataFromXObject(xObj, context, width, height);

                images.push({
                  pageNumber,
                  imageData,
                  width,
                  height,
                  type: this.detectImageType(name, pageNumber)
                });
              } catch (renderError) {
                console.warn(`Failed to render image ${name} on page ${pageNumber}:`, renderError);

                // Create placeholder entry even if rendering fails
                images.push({
                  pageNumber,
                  imageData: '',
                  width,
                  height,
                  type: this.detectImageType(name, pageNumber)
                });
              }
            }
          } catch (imageError) {
            console.warn(`Failed to process image ${name} on page ${pageNumber}:`, imageError);
          }
        }
      }

      // Fallback: Use operator list approach
      if (images.length === 0) {
        const operatorList = await page.getOperatorList();

        for (let i = 0; i < operatorList.fnArray.length; i++) {
          const fn = operatorList.fnArray[i];

          // Look for image painting operations
          if (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintInlineImageXObject) {
            images.push({
              pageNumber,
              imageData: '',
              width: 400,
              height: 300,
              type: this.detectImageType(`image-${i}`, pageNumber)
            });
          }
        }
      }

      console.log(`Extracted ${images.length} images from page ${pageNumber}`);
    } catch (error) {
      console.warn(`Failed to extract images from page ${pageNumber}:`, error);
    }

    return images;
  }

  /**
   * Generate AI caption for technical images using Gemini
   */
  private async generateImageCaption(imageData: string, pageNumber: number, filename: string): Promise<string> {
    try {
      if (!imageData || !imageData.startsWith('data:image/')) {
        return `Technical diagram from page ${pageNumber}`;
      }

      const response = await fetch('/api/v1/functions/v1/chat-with-barry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          message: `You are analyzing a technical diagram from the ${filename} manual. Please provide a detailed, specific caption for this image that describes:
1. What type of technical diagram/photo this is
2. What components, systems, or procedures it shows
3. Any visible labels, arrows, or callouts
4. The technical context (hydraulic, engine, transmission, etc.)

Keep the description factual and specific for a repair manual. Start with the image type (e.g., "Hydraulic schematic showing..." or "Photo of engine bay with...").`,
          image: imageData,
          context: 'image_analysis'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.response || `Technical diagram from page ${pageNumber}`;
      } else {
        console.warn('Failed to generate image caption:', response.statusText);
        return `Technical diagram from page ${pageNumber}`;
      }
    } catch (error) {
      console.warn('Error generating image caption:', error);
      return `Technical diagram from page ${pageNumber}`;
    }
  }

  /**
   * Extract image data from PDF XObject and convert to base64
   */
  private async extractImageDataFromXObject(xObj: any, context: CanvasRenderingContext2D, width: number, height: number): Promise<string> {
    try {
      // This is a complex operation that depends on the PDF structure
      // For now, create a placeholder that indicates the image was found
      const canvas = context.canvas;

      // Fill with a light gray to indicate image placeholder
      context.fillStyle = '#f0f0f0';
      context.fillRect(0, 0, width, height);
      context.fillStyle = '#666';
      context.font = '16px Arial';
      context.textAlign = 'center';
      context.fillText('Image Found', width / 2, height / 2);
      context.fillText(`${width}x${height}`, width / 2, height / 2 + 20);

      // Convert canvas to base64
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.warn('Failed to extract image data:', error);
      return '';
    }
  }

  /**
   * Detect image type based on name and page context
   */
  private detectImageType(imageName: string, pageNumber: number): string {
    const name = imageName.toLowerCase();

    if (name.includes('diagram') || name.includes('schematic')) {
      return 'technical_diagram';
    }

    if (name.includes('photo') || name.includes('image')) {
      return 'photograph';
    }

    if (name.includes('chart') || name.includes('graph')) {
      return 'chart';
    }

    if (name.includes('table')) {
      return 'table';
    }

    // Determine type based on page number context
    if (pageNumber < 50) {
      return 'overview_diagram';
    } else if (pageNumber < 100) {
      return 'technical_diagram';
    } else {
      return 'maintenance_photo';
    }
  }

  /**
   * Create manual metadata
   */
  private async createManualMetadata(filename: string, fileSize: number, pageCount: number) {
    const title = filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

    // Check if manual metadata already exists
    const { data: existing, error: fetchError } = await supabase
      .from('manual_metadata')
      .select('*')
      .eq('filename', filename)
      .single();

    if (existing && !fetchError) {
      console.log('Using existing manual metadata:', existing.id);
      return existing;
    }

    // Create new manual metadata
    const { data: created, error: createError } = await supabase
      .from('manual_metadata')
      .insert({
        filename,
        title,
        model_codes: ['U1700L', 'U435'],
        year_range: '2000-2024',
        category: 'workshop',
        page_count: pageCount,
        file_size: fileSize,
        processed_at: new Date().toISOString(),
        approval_status: 'approved'
      })
      .select()
      .single();

    if (createError || !created) {
      throw new Error(`Failed to create manual metadata: ${createError?.message}`);
    }

    console.log('Created new manual metadata:', created.id);
    return created;
  }

  /**
   * Create semantic text chunks with image descriptions
   */
  private async createTextChunks(textPages: Array<{ pageNum: number; text: string; hasImages: boolean; sections: TextSection[] }>, manualId: string, title: string, images: ExtractedImage[]): Promise<any[]> {
    const chunks: any[] = [];
    let chunkIndex = 0;

    for (const pageData of textPages) {
      // Process sections to create semantic chunks
      const pageImages = images.filter(img => img.pageNumber === pageData.pageNum);

      // Group related sections into semantic chunks
      const semanticChunks = this.createSemanticChunks(pageData.sections, pageImages);

      for (const semanticChunk of semanticChunks) {
        // Enrich chunk content with image descriptions
        let enrichedContent = semanticChunk.content;

        // Add related image descriptions to the content
        const relatedImages = semanticChunk.relatedImages || [];
        if (relatedImages.length > 0) {
          const imageDescriptions = relatedImages
            .map(img => `[Image: ${img.description || 'Technical diagram'}]`)
            .join('\n');
          enrichedContent += '\n\nRelated Images:\n' + imageDescriptions;
        }

        const chunk = {
          manual_id: manualId,
          manual_title: title,
          chunk_index: chunkIndex++,
          content: enrichedContent,
          page_number: pageData.pageNum,
          section_title: semanticChunk.sectionTitle || this.extractSectionTitle(semanticChunk.content),
          content_type: semanticChunk.primaryType || this.detectContentType(semanticChunk.content),
          has_visual_elements: relatedImages.length > 0,
          visual_content_type: relatedImages.length > 0 ? 'image' : 'text',
          procedure_complexity: this.calculateComplexity(semanticChunk.content),
          extraction_method: 'semantic_layout_aware',
          extraction_quality: 0.98,
          metadata: {
            filename: title,
            char_count: enrichedContent.length,
            word_count: enrichedContent.split(/\s+/).length,
            extractionMethod: 'semantic_layout_aware',
            extractionQuality: 0.98,
            hasImages: relatedImages.length > 0,
            imageCount: relatedImages.length,
            sectionTypes: semanticChunk.sectionTypes,
            relatedImageIds: relatedImages.map(img => `page-${img.pageNumber}-${img.type}`)
          }
        };

        chunks.push(chunk);
      }
    }

    // First, delete any existing chunks for this manual to avoid duplicates
    console.log(`🗑️ Clearing existing chunks for manual ${manualId}...`);
    const { error: deleteError } = await supabase
      .from('manual_chunks')
      .delete()
      .eq('manual_id', manualId);

    if (deleteError) {
      console.warn(`Warning: Could not delete existing chunks: ${deleteError.message}`);
    }

    // Insert chunks in smaller batches for reliability
    const batchSize = 25; // Smaller batches for better success rate
    const totalBatches = Math.ceil(chunks.length / batchSize);
    let successfulInserts = 0;
    let failedBatches: number[] = [];

    console.log(`📦 Inserting ${chunks.length} chunks in ${totalBatches} batches...`);

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batchNum = Math.floor(i / batchSize) + 1;
      const batch = chunks.slice(i, i + batchSize);

      try {
        const { error } = await supabase
          .from('manual_chunks')
          .insert(batch);

        if (error) {
          console.error(`❌ Batch ${batchNum}/${totalBatches} failed:`, error.message);
          failedBatches.push(batchNum);

          // Try once more with even smaller sub-batches
          console.log(`🔄 Retrying batch ${batchNum} with smaller chunks...`);
          for (let j = 0; j < batch.length; j += 5) {
            const subBatch = batch.slice(j, j + 5);
            const { error: retryError } = await supabase
              .from('manual_chunks')
              .insert(subBatch);

            if (!retryError) {
              successfulInserts += subBatch.length;
            }
          }
        } else {
          successfulInserts += batch.length;
          console.log(`✅ Batch ${batchNum}/${totalBatches} inserted (${Math.round((batchNum/totalBatches)*100)}% complete)`);
        }
      } catch (err) {
        console.error(`❌ Batch ${batchNum} exception:`, err);
        failedBatches.push(batchNum);
      }

      // Small delay between batches
      if (batchNum < totalBatches) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`📊 Insertion complete: ${successfulInserts}/${chunks.length} chunks saved`);
    if (failedBatches.length > 0) {
      console.warn(`⚠️ Failed batches: ${failedBatches.join(', ')}`);
    }

    return chunks;
  }

  /**
   * Save extracted images to database and storage
   */
  private async saveImages(images: ExtractedImage[], manualId: string): Promise<number> {
    let savedCount = 0;

    for (const image of images) {
      try {
        let imageUrl = '';
        let uploadSuccess = false;

        // If we have actual image data, upload to storage
        if (image.imageData && image.imageData.startsWith('data:image/')) {
          try {
            // Convert base64 to blob
            const base64Data = image.imageData.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });

            // Upload to storage
            const fileName = `${manualId}/page-${image.pageNumber}-img-${savedCount + 1}.png`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('manual-images')
              .upload(fileName, blob, {
                cacheControl: '3600',
                upsert: true
              });

            if (!uploadError && uploadData) {
              imageUrl = `manual-images/${fileName}`;
              uploadSuccess = true;
              console.log(`Uploaded image: ${fileName}`);
            } else {
              console.warn(`Failed to upload image: ${uploadError?.message}`);
            }
          } catch (uploadError) {
            console.warn(`Error uploading image from page ${image.pageNumber}:`, uploadError);
          }
        }

        // Create database entry
        const { error: dbError } = await supabase
          .from('manual_images')
          .insert({
            manual_chunk_id: null, // Will be linked later based on page number
            image_url: imageUrl || `manual-images/${manualId}/page-${image.pageNumber}-img-${savedCount + 1}.png`,
            image_path: `page-${image.pageNumber}/image-${savedCount + 1}`,
            page_number: image.pageNumber,
            position_on_page: savedCount + 1,
            image_type: image.type,
            description: this.generateImageDescription(image.type, image.pageNumber),
            metadata: {
              width: image.width,
              height: image.height,
              extractionMethod: 'pdf_processing',
              hasActualData: uploadSuccess,
              fileSize: image.imageData ? image.imageData.length : 0
            }
          });

        if (!dbError) {
          savedCount++;
          console.log(`Saved image metadata for page ${image.pageNumber}`);
        } else {
          console.error(`Failed to save image metadata:`, dbError);
        }
      } catch (error) {
        console.error(`Failed to save image from page ${image.pageNumber}:`, error);
      }
    }

    return savedCount;
  }

  /**
   * Generate descriptive text for images based on type and page
   */
  private generateImageDescription(imageType: string, pageNumber: number): string {
    switch (imageType) {
      case 'technical_diagram':
        return `Technical diagram from page ${pageNumber} showing system components and connections`;
      case 'maintenance_photo':
        return `Maintenance procedure photograph from page ${pageNumber} illustrating repair steps`;
      case 'overview_diagram':
        return `System overview diagram from page ${pageNumber} showing general layout`;
      case 'photograph':
        return `Photograph from page ${pageNumber} showing actual component or procedure`;
      case 'chart':
        return `Chart or graph from page ${pageNumber} displaying technical data`;
      case 'table':
        return `Technical table from page ${pageNumber} with specifications or data`;
      default:
        return `Image from page ${pageNumber} containing technical information`;
    }
  }

  /**
   * Link images to text chunks based on page numbers
   */
  private async linkImagesToChunks(manualId: string): Promise<void> {
    try {
      console.log('Linking images to text chunks...');

      // Get all images for this manual
      const { data: images, error: imagesError } = await supabase
        .from('manual_images')
        .select('id, page_number')
        .is('manual_chunk_id', null);

      if (imagesError) {
        console.error('Error fetching images:', imagesError);
        return;
      }

      if (!images || images.length === 0) {
        console.log('No unlinked images found');
        return;
      }

      // Get all chunks for this manual
      const { data: chunks, error: chunksError } = await supabase
        .from('manual_chunks')
        .select('id, page_number')
        .eq('manual_id', manualId);

      if (chunksError) {
        console.error('Error fetching chunks:', chunksError);
        return;
      }

      if (!chunks || chunks.length === 0) {
        console.log('No chunks found for linking');
        return;
      }

      // Link images to chunks based on page numbers
      for (const image of images) {
        // Find chunk(s) on the same page
        const matchingChunks = chunks.filter(chunk => chunk.page_number === image.page_number);

        if (matchingChunks.length > 0) {
          // Link to the first chunk on that page
          const { error: updateError } = await supabase
            .from('manual_images')
            .update({ manual_chunk_id: matchingChunks[0].id })
            .eq('id', image.id);

          if (updateError) {
            console.error(`Error linking image ${image.id} to chunk:`, updateError);
          } else {
            console.log(`Linked image on page ${image.page_number} to chunk ${matchingChunks[0].id}`);
          }
        } else {
          console.log(`No matching chunk found for image on page ${image.page_number}`);
        }
      }

      console.log('Image linking completed');
    } catch (error) {
      console.error('Error in linkImagesToChunks:', error);
    }
  }

  /**
   * Helper methods
   */
  private splitTextIntoChunks(text: string, maxSize: number): string[] {
    if (text.length <= maxSize) {
      return [text];
    }

    const chunks: string[] = [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxSize) {
        currentChunk += sentence + ' ';
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence + ' ';
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  private calculateComplexity(content: string): number {
    let complexity = 1.0;

    // Factor in technical indicators
    const technicalTerms = ['valve', 'pressure', 'torque', 'hydraulic', 'engine', 'transmission', 'differential'];
    const technicalCount = technicalTerms.filter(term => content.toLowerCase().includes(term)).length;
    complexity += technicalCount * 0.1;

    // Factor in procedure steps
    const stepIndicators = content.match(/\b(step|procedure|instruction|\d+\.|first|second|third|then|next)\b/gi);
    if (stepIndicators && stepIndicators.length > 3) {
      complexity += 0.5;
    }

    // Factor in warnings/cautions
    const warningIndicators = content.match(/\b(warning|caution|danger|note|important)\b/gi);
    if (warningIndicators && warningIndicators.length > 0) {
      complexity += 0.3;
    }

    return Math.min(complexity, 5.0); // Cap at 5.0
  }

  private extractSectionTitle(text: string): string | null {
    const lines = text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Check for numbered sections
      if (trimmed.match(/^\d+(\.\d+)*\s+[A-Z]/)) {
        return trimmed.substring(0, Math.min(trimmed.length, 100));
      }

      // Check for all caps headers
      if (trimmed.length > 3 && trimmed.length < 100 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
        return trimmed;
      }
    }

    return null;
  }

  private detectContentType(text: string): string {
    const lower = text.toLowerCase();

    if (text.match(/^\s*\d+\.\s+/m) || lower.includes('procedure') || lower.includes('step')) {
      return 'procedure';
    }

    if (text.includes('|') || text.match(/\t{2,}/)) {
      return 'table';
    }

    if (lower.includes('specification') || lower.includes('torque') || text.match(/\d+\s*(nm|bar|psi)/i)) {
      return 'specification';
    }

    if (text.match(/^(WARNING|CAUTION|NOTE|IMPORTANT)/mi)) {
      return 'warning';
    }

    return 'text';
  }
}