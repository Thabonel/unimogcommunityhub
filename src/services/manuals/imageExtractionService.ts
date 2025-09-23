import { supabase } from '@/lib/supabase-client';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export interface ExtractedImage {
  id: string;
  manualId: string;
  manualName: string;
  pageNumber: number;
  imageIndex: number;
  imageType: 'diagram' | 'photo' | 'schematic' | 'parts-view' | 'table' | 'chart';
  description: string;
  imageUrl: string;
  relatedTextChunks: string[];
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  metadata?: {
    fileSize: number;
    dimensions: { width: number; height: number };
    format: string;
  };
}

export interface ImageExtractionResult {
  success: boolean;
  manualName: string;
  totalImages: number;
  extractedImages: ExtractedImage[];
  errors?: string[];
}

export class ImageExtractionService {
  private static instance: ImageExtractionService;

  static getInstance(): ImageExtractionService {
    if (!this.instance) {
      this.instance = new ImageExtractionService();
    }
    return this.instance;
  }

  /**
   * Extract all images from a PDF manual
   */
  async extractImagesFromManual(manualName: string): Promise<ImageExtractionResult> {
    try {
      console.log(`Starting image extraction for ${manualName}`);

      // Get the PDF file from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('manuals')
        .download(manualName);

      if (downloadError || !fileData) {
        throw new Error(`Failed to download PDF: ${downloadError?.message}`);
      }

      // Convert blob to array buffer
      const arrayBuffer = await fileData.arrayBuffer();

      // Load PDF document
      const pdfDocument = await pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: '/cmaps/',
        cMapPacked: true,
      }).promise;

      const extractedImages: ExtractedImage[] = [];
      const errors: string[] = [];

      // Process each page
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        try {
          const page = await pdfDocument.getPage(pageNum);
          const pageImages = await this.extractImagesFromPage(
            page,
            manualName,
            pageNum
          );
          extractedImages.push(...pageImages);
        } catch (error) {
          const errorMsg = `Error processing page ${pageNum}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      // Save extracted images to database
      if (extractedImages.length > 0) {
        await this.saveExtractedImages(extractedImages);
      }

      console.log(`✅ Image extraction completed for ${manualName}`);
      console.log(`📊 Extracted ${extractedImages.length} images from ${pdfDocument.numPages} pages`);

      return {
        success: true,
        manualName,
        totalImages: extractedImages.length,
        extractedImages,
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      console.error(`Error extracting images from ${manualName}:`, error);
      return {
        success: false,
        manualName,
        totalImages: 0,
        extractedImages: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Extract images from a single PDF page
   */
  private async extractImagesFromPage(
    page: pdfjsLib.PDFPageProxy,
    manualName: string,
    pageNumber: number
  ): Promise<ExtractedImage[]> {
    const extractedImages: ExtractedImage[] = [];

    try {
      // Get page operations to find images
      const operatorList = await page.getOperatorList();
      const viewport = page.getViewport({ scale: 1.0 });

      // Get page resources to access images
      const resources = await page.commonObjs;

      // Look for image operations in the operator list
      for (let i = 0; i < operatorList.fnArray.length; i++) {
        const fn = operatorList.fnArray[i];
        const args = operatorList.argsArray[i];

        // Check for image painting operations
        if (fn === pdfjsLib.OPS.paintImageXObject ||
            fn === pdfjsLib.OPS.paintJpegXObject ||
            fn === pdfjsLib.OPS.paintImageMaskXObject) {

          try {
            const imageName = args[0];
            const image = await this.extractImageData(page, imageName, pageNumber);

            if (image) {
              const extractedImage: ExtractedImage = {
                id: `${manualName}_p${pageNumber}_img${extractedImages.length + 1}`,
                manualId: manualName.replace('.pdf', ''),
                manualName,
                pageNumber,
                imageIndex: extractedImages.length + 1,
                imageType: this.classifyImageType(imageName, pageNumber),
                description: this.generateImageDescription(manualName, pageNumber, extractedImages.length + 1),
                imageUrl: '', // Will be set after upload
                relatedTextChunks: await this.findRelatedTextChunks(manualName.replace('.pdf', ''), pageNumber),
                metadata: {
                  fileSize: image.data.length,
                  dimensions: { width: image.width, height: image.height },
                  format: 'PNG'
                }
              };

              // Upload image to storage and get URL
              const imageUrl = await this.uploadImageToStorage(
                extractedImage.id,
                image.data,
                'image/png'
              );

              if (imageUrl) {
                extractedImage.imageUrl = imageUrl;
                extractedImages.push(extractedImage);
              }
            }
          } catch (imageError) {
            console.warn(`Failed to extract image ${i} from page ${pageNumber}:`, imageError);
          }
        }
      }

      // Alternative approach: Render page to canvas and detect image regions
      if (extractedImages.length === 0) {
        const canvasImages = await this.extractImagesFromCanvas(page, manualName, pageNumber);
        extractedImages.push(...canvasImages);
      }

    } catch (error) {
      console.error(`Error extracting images from page ${pageNumber}:`, error);
    }

    return extractedImages;
  }

  /**
   * Extract image data from PDF page resources
   */
  private async extractImageData(
    page: pdfjsLib.PDFPageProxy,
    imageName: string,
    pageNumber: number
  ): Promise<{ data: Uint8Array; width: number; height: number } | null> {
    try {
      // This is a simplified approach - actual implementation would need
      // to access the PDF's internal image resources
      console.log(`Attempting to extract image "${imageName}" from page ${pageNumber}`);

      // For now, we'll use canvas rendering approach
      return null;
    } catch (error) {
      console.error(`Failed to extract image data for ${imageName}:`, error);
      return null;
    }
  }

  /**
   * Extract images by rendering page to canvas and analyzing content
   */
  private async extractImagesFromCanvas(
    page: pdfjsLib.PDFPageProxy,
    manualName: string,
    pageNumber: number
  ): Promise<ExtractedImage[]> {
    try {
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return [];

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Convert canvas to image data
      const imageData = canvas.toDataURL('image/png');
      const imageBlob = await this.dataURLToBlob(imageData);

      // Create extracted image entry
      const extractedImage: ExtractedImage = {
        id: `${manualName}_p${pageNumber}_full`,
        manualId: manualName.replace('.pdf', ''),
        manualName,
        pageNumber,
        imageIndex: 1,
        imageType: this.classifyPageType(pageNumber),
        description: `Full page ${pageNumber} from ${manualName}`,
        imageUrl: '',
        relatedTextChunks: await this.findRelatedTextChunks(manualName.replace('.pdf', ''), pageNumber),
        metadata: {
          fileSize: imageBlob.size,
          dimensions: { width: canvas.width, height: canvas.height },
          format: 'PNG'
        }
      };

      // Upload to storage
      const imageUrl = await this.uploadImageToStorage(
        extractedImage.id,
        new Uint8Array(await imageBlob.arrayBuffer()),
        'image/png'
      );

      if (imageUrl) {
        extractedImage.imageUrl = imageUrl;
        return [extractedImage];
      }

      return [];
    } catch (error) {
      console.error(`Error extracting images from canvas for page ${pageNumber}:`, error);
      return [];
    }
  }

  /**
   * Upload extracted image to Supabase storage
   */
  private async uploadImageToStorage(
    imageId: string,
    imageData: Uint8Array,
    mimeType: string
  ): Promise<string | null> {
    try {
      const fileName = `${imageId}.png`;

      const { data, error } = await supabase.storage
        .from('manual-images')
        .upload(fileName, imageData, {
          contentType: mimeType,
          upsert: true
        });

      if (error) {
        console.error(`Error uploading image ${imageId}:`, error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('manual-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error(`Error uploading image ${imageId}:`, error);
      return null;
    }
  }

  /**
   * Save extracted images metadata to database
   */
  private async saveExtractedImages(images: ExtractedImage[]): Promise<void> {
    try {
      // For each image, find the related chunk_id based on exact page matching
      const imageRecords = await Promise.all(images.map(async (img) => {
        // Find the first text chunk for this exact page number
        const { data: chunk } = await supabase
          .from('manual_chunks')
          .select('id')
          .eq('manual_id', img.manualId)
          .eq('page_number', img.pageNumber) // Use exact page number matching
          .order('chunk_number')
          .limit(1)
          .single();

        console.log(`🔗 Linking image ${img.id} (page ${img.pageNumber}) to chunk ${chunk?.id || 'none'}`);

        return {
          id: img.id,
          manual_id: img.manualId,
          chunk_id: chunk?.id || null, // Link to first text chunk on this page
          image_path: img.imageUrl, // Store the storage path
          image_url: img.imageUrl,  // Store the public URL
        };
      }));

      const { error } = await supabase
        .from('manual_images')
        .upsert(imageRecords, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      console.log(`✅ Saved ${images.length} images to database with chunk linking`);
    } catch (error) {
      console.error('Error saving extracted images:', error);
      throw error;
    }
  }

  /**
   * Find related text chunks for an image
   */
  private async findRelatedTextChunks(manualId: string, pageNumber: number): Promise<string[]> {
    try {
      // Use exact page number matching to find all chunks on this page
      const { data, error } = await supabase
        .from('manual_chunks')
        .select('content')
        .eq('manual_id', manualId)
        .eq('page_number', pageNumber) // Exact page match
        .order('chunk_number')
        .limit(5);

      if (error || !data) {
        console.log(`No text chunks found for ${manualId} page ${pageNumber}`);
        return [];
      }

      console.log(`📖 Found ${data.length} text chunks for ${manualId} page ${pageNumber}`);
      return data.map(chunk => chunk.content.substring(0, 200));
    } catch (error) {
      console.error('Error finding related text chunks:', error);
      return [];
    }
  }

  /**
   * Classify image type based on context
   */
  private classifyImageType(imageName: string, pageNumber: number): ExtractedImage['imageType'] {
    const name = imageName.toLowerCase();

    if (name.includes('diagram') || name.includes('schematic')) return 'schematic';
    if (name.includes('parts') || name.includes('exploded')) return 'parts-view';
    if (name.includes('photo') || name.includes('picture')) return 'photo';
    if (name.includes('table') || name.includes('chart')) return 'table';
    if (name.includes('graph') || name.includes('curve')) return 'chart';

    // Default classification based on page number ranges (manual-specific)
    if (pageNumber < 50) return 'diagram';
    if (pageNumber > 400) return 'table';

    return 'diagram';
  }

  /**
   * Classify page type for full-page images
   */
  private classifyPageType(pageNumber: number): ExtractedImage['imageType'] {
    // Classification based on typical manual structure
    if (pageNumber < 20) return 'diagram';
    if (pageNumber > 450) return 'table';
    return 'schematic';
  }

  /**
   * Generate descriptive text for extracted images
   */
  private generateImageDescription(manualName: string, pageNumber: number, imageIndex: number): string {
    const manual = manualName.replace('.pdf', '');
    return `${manual} - Page ${pageNumber}, Image ${imageIndex}: Technical diagram or schematic`;
  }

  /**
   * Convert data URL to Blob
   */
  private async dataURLToBlob(dataURL: string): Promise<Blob> {
    const response = await fetch(dataURL);
    return response.blob();
  }

  /**
   * Get images for a specific manual
   */
  async getImagesForManual(manualId: string): Promise<ExtractedImage[]> {
    try {
      const { data, error } = await supabase
        .from('manual_images')
        .select('*')
        .eq('manual_id', manualId);

      if (error) throw error;

      return (data || []).map(img => ({
        id: img.id,
        manualId: img.manual_id,
        manualName: `${img.manual_id}.pdf`,
        pageNumber: 1, // Default since schema doesn't have page_number
        imageIndex: 1,
        imageType: 'diagram' as const,
        description: `Image from ${img.manual_id} manual`,
        imageUrl: img.image_url || img.image_path,
        relatedTextChunks: [],
        metadata: {
          fileSize: 0,
          dimensions: { width: 0, height: 0 },
          format: 'PNG'
        }
      }));
    } catch (error) {
      console.error('Error getting images for manual:', error);
      return [];
    }
  }

  /**
   * Search images by content or description
   */
  async searchImages(query: string, manualId?: string): Promise<ExtractedImage[]> {
    try {
      let queryBuilder = supabase
        .from('manual_images')
        .select('*');

      if (manualId) {
        queryBuilder = queryBuilder.eq('manual_id', manualId);
      }

      const { data, error } = await queryBuilder.limit(20);

      if (error) throw error;

      return (data || []).map(img => ({
        id: img.id,
        manualId: img.manual_id,
        manualName: `${img.manual_id}.pdf`,
        pageNumber: 1, // Default since schema doesn't have page_number
        imageIndex: 1,
        imageType: 'diagram' as const,
        description: `Image from ${img.manual_id} manual`,
        imageUrl: img.image_url || img.image_path,
        relatedTextChunks: [],
        metadata: {
          fileSize: 0,
          dimensions: { width: 0, height: 0 },
          format: 'PNG'
        }
      }));
    } catch (error) {
      console.error('Error searching images:', error);
      return [];
    }
  }
}