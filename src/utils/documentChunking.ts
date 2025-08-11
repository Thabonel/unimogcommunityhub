import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

export interface ChunkingConfig {
  chunkSize: number;
  chunkOverlap: number;
  separators: string[];
  minChunkSize?: number;
  maxChunkSize?: number;
}

export interface ProcessedChunk {
  content: string;
  metadata: {
    pageNumber?: number;
    sectionTitle?: string;
    contentType: 'text' | 'table' | 'procedure' | 'diagram_caption';
    charCount: number;
    wordCount: number;
    hasNumbers?: boolean;
    hasBullets?: boolean;
    isHeader?: boolean;
  };
}

// Default configuration for technical manuals
export const DEFAULT_CHUNK_CONFIG: ChunkingConfig = {
  chunkSize: 1500,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '.', '!', '?', ';', ':', ' ', ''],
  minChunkSize: 100,
  maxChunkSize: 2000,
};

// Specialized config for different content types
export const CONTENT_SPECIFIC_CONFIGS: Record<string, ChunkingConfig> = {
  procedure: {
    chunkSize: 2000,
    chunkOverlap: 100,
    separators: ['\n\n', '\n', 'Step ', '1.', '2.', '3.', '4.', '5.'],
    minChunkSize: 200,
    maxChunkSize: 2500,
  },
  table: {
    chunkSize: 1000,
    chunkOverlap: 50,
    separators: ['\n\n', '\n', '|', '\t'],
    minChunkSize: 100,
    maxChunkSize: 1500,
  },
  parts_list: {
    chunkSize: 800,
    chunkOverlap: 100,
    separators: ['\n', '\t', ',', ';'],
    minChunkSize: 50,
    maxChunkSize: 1000,
  },
};

export class ManualChunker {
  private config: ChunkingConfig;
  private splitter: RecursiveCharacterTextSplitter;

  constructor(config: ChunkingConfig = DEFAULT_CHUNK_CONFIG) {
    this.config = config;
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: config.chunkSize,
      chunkOverlap: config.chunkOverlap,
      separators: config.separators,
    });
  }

  /**
   * Process a document into chunks with metadata
   */
  async processDocument(
    content: string,
    metadata?: Record<string, any>
  ): Promise<ProcessedChunk[]> {
    const chunks: ProcessedChunk[] = [];
    
    // Split content into chunks
    const documents = await this.splitter.createDocuments([content], [metadata || {}]);
    
    for (const doc of documents) {
      const processedChunk = this.analyzeChunk(doc.pageContent, doc.metadata);
      
      // Skip chunks that are too small or too large
      if (
        processedChunk.metadata.charCount < (this.config.minChunkSize || 0) ||
        processedChunk.metadata.charCount > (this.config.maxChunkSize || Infinity)
      ) {
        continue;
      }
      
      chunks.push(processedChunk);
    }
    
    return chunks;
  }

  /**
   * Analyze a chunk to extract metadata and content type
   */
  private analyzeChunk(content: string, baseMetadata: Record<string, any> = {}): ProcessedChunk {
    const lines = content.split('\n');
    const trimmedContent = content.trim();
    
    // Extract metadata
    const metadata = {
      ...baseMetadata,
      contentType: this.detectContentType(content) as ProcessedChunk['metadata']['contentType'],
      charCount: content.length,
      wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
      hasNumbers: /\d/.test(content),
      hasBullets: /^[\u2022\u2023\u25E6\u2043\u2219\-\*]\s/m.test(content),
      isHeader: this.isHeader(trimmedContent),
      sectionTitle: this.extractSectionTitle(lines),
    };
    
    return {
      content: trimmedContent,
      metadata,
    };
  }

  /**
   * Detect the type of content in a chunk
   */
  private detectContentType(text: string): string {
    const lines = text.split('\n');
    
    // Check for table-like content
    if (
      text.includes('|') || 
      text.match(/\t{2,}/) || 
      text.match(/\s{4,}\S+\s{4,}/) ||
      lines.some(line => line.split(/\s{2,}/).length > 3)
    ) {
      return 'table';
    }
    
    // Check for procedure/steps
    if (
      text.match(/^(Step\s+)?\d+[.)]/m) || 
      text.match(/^[a-z]\)/m) || 
      text.includes('Step ') ||
      text.match(/^\d+\.\s+\w/m)
    ) {
      return 'procedure';
    }
    
    // Check for diagram captions
    if (text.match(/^(Figure|Fig\.|Diagram|Image|Photo|Illustration|Exhibit)\s+\d+/mi)) {
      return 'diagram_caption';
    }
    
    // Default to text
    return 'text';
  }

  /**
   * Check if content is likely a header
   */
  private isHeader(text: string): boolean {
    if (text.length > 150) return false;
    
    // Check for numbered sections
    if (text.match(/^\d+(\.\d+)*\s+[A-Z]/)) return true;
    
    // Check for all caps headers
    if (
      text.length > 3 && 
      text === text.toUpperCase() && 
      /[A-Z]/.test(text) &&
      !text.match(/[.!?]$/)
    ) {
      return true;
    }
    
    // Check for title case
    const words = text.split(/\s+/);
    if (
      words.length <= 10 &&
      words.filter(w => w.length > 2 && w[0] === w[0].toUpperCase()).length > words.length * 0.7
    ) {
      return true;
    }
    
    return false;
  }

  /**
   * Extract section title from content
   */
  private extractSectionTitle(lines: string[]): string | undefined {
    for (const line of lines.slice(0, 5)) { // Check first 5 lines
      const trimmed = line.trim();
      
      if (!trimmed) continue;
      
      // Check for numbered sections
      if (trimmed.match(/^\d+(\.\d+)*\s+[A-Z]/)) {
        return trimmed.substring(0, Math.min(trimmed.length, 100));
      }
      
      // Check for all caps headers
      if (
        trimmed.length > 3 && 
        trimmed.length < 100 && 
        trimmed === trimmed.toUpperCase() && 
        /[A-Z]/.test(trimmed)
      ) {
        return trimmed;
      }
      
      // Check for title case headers
      if (this.isHeader(trimmed)) {
        return trimmed;
      }
    }
    
    return undefined;
  }

  /**
   * Merge small chunks that belong together
   */
  async mergeSmallChunks(chunks: ProcessedChunk[]): Promise<ProcessedChunk[]> {
    const merged: ProcessedChunk[] = [];
    let currentMerge: ProcessedChunk | null = null;
    
    for (const chunk of chunks) {
      // Don't merge headers or special content types
      if (chunk.metadata.isHeader || chunk.metadata.contentType !== 'text') {
        if (currentMerge) {
          merged.push(currentMerge);
          currentMerge = null;
        }
        merged.push(chunk);
        continue;
      }
      
      // Start new merge or add to current
      if (!currentMerge) {
        currentMerge = { ...chunk };
      } else if (
        currentMerge.metadata.charCount + chunk.metadata.charCount < this.config.chunkSize
      ) {
        // Merge chunks
        currentMerge.content += '\n\n' + chunk.content;
        currentMerge.metadata.charCount += chunk.metadata.charCount + 2;
        currentMerge.metadata.wordCount += chunk.metadata.wordCount;
      } else {
        // Save current merge and start new one
        merged.push(currentMerge);
        currentMerge = { ...chunk };
      }
    }
    
    // Don't forget the last merge
    if (currentMerge) {
      merged.push(currentMerge);
    }
    
    return merged;
  }
}

/**
 * Extract Unimog model codes from text
 */
export function extractModelCodes(text: string): string[] {
  const modelCodes = new Set<string>();
  
  // Common Unimog model patterns
  const patterns = [
    /U\s?\d{3,4}[A-Z]?/g,     // U1700, U 5023, U5023B
    /404[\s.]?\d*/g,          // 404, 404.1, 404 S
    /40[6-9]/g,               // 406, 407, 408, 409
    /41[1-9]/g,               // 411-419
    /42[1-9]/g,               // 421-429
    /43[0-9]/g,               // 430-439
    /UGN\s?\d*/g,             // UGN, UGN 230
    /FLU[\s-]?419/g,          // FLU-419, FLU 419
    /SEE/g,                   // SEE (Small Emplacement Excavator)
    /MB[\s-]?trac/gi,         // MB-trac
  ];

  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const cleaned = match.trim().replace(/\s+/g, ' ');
        modelCodes.add(cleaned);
      });
    }
  });

  return Array.from(modelCodes);
}

/**
 * Extract year range from manual text
 */
export function extractYearRange(text: string): string | null {
  // Look for year patterns (1950-2024 range)
  const yearPattern = /\b(19[5-9]\d|20[0-2]\d)\b/g;
  const years = text.match(yearPattern);
  
  if (years && years.length > 0) {
    const uniqueYears = [...new Set(years)].map(Number).sort();
    if (uniqueYears.length === 1) {
      return uniqueYears[0].toString();
    } else {
      return `${uniqueYears[0]}-${uniqueYears[uniqueYears.length - 1]}`;
    }
  }
  
  return null;
}

/**
 * Categorize manual based on content
 */
export function categorizeManual(filename: string, content: string): string {
  const combined = (filename + ' ' + content).toLowerCase();
  
  const categories = [
    { keyword: ['operator', 'owner', 'operation'], category: 'operator' },
    { keyword: ['service', 'repair', 'servicing'], category: 'service' },
    { keyword: ['parts', 'catalog', 'catalogue'], category: 'parts' },
    { keyword: ['workshop'], category: 'workshop' },
    { keyword: ['technical', 'specification', 'specs'], category: 'technical' },
    { keyword: ['maintenance', 'preventive'], category: 'maintenance' },
    { keyword: ['electrical', 'wiring', 'circuit'], category: 'electrical' },
    { keyword: ['hydraulic', 'hydraulics'], category: 'hydraulic' },
    { keyword: ['engine', 'motor', 'diesel'], category: 'engine' },
    { keyword: ['transmission', 'gearbox', 'clutch'], category: 'transmission' },
    { keyword: ['axle', 'differential', 'portal'], category: 'drivetrain' },
    { keyword: ['troubleshooting', 'diagnostic'], category: 'troubleshooting' },
  ];
  
  for (const { keyword, category } of categories) {
    if (keyword.some(k => combined.includes(k))) {
      return category;
    }
  }
  
  return 'general';
}