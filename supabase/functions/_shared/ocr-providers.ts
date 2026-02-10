// OCR Provider Integrations for Invoice Processing

export interface OCRResult {
  text: string;
  confidence: number;
  blocks?: OCRBlock[];
  metadata?: Record<string, any>;
}

export interface OCRBlock {
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  type?: 'text' | 'table' | 'number' | 'date';
}

export interface InvoiceData {
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  vendorName?: string;
  vendorAddress?: string;
  vendorTaxId?: string;
  subtotal?: number;
  taxAmount?: number;
  totalAmount?: number;
  currency?: string;
  lineItems?: InvoiceLineItem[];
  confidence: number;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  taxAmount?: number;
}

// Google Cloud Vision API integration
export class GoogleVisionOCR {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async processDocument(imageData: Blob): Promise<OCRResult> {
    const base64Image = await this.blobToBase64(imageData);

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Image },
            features: [
              { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }
            ]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Google Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const annotation = data.responses[0]?.fullTextAnnotation;

    if (!annotation) {
      return {
        text: '',
        confidence: 0,
        blocks: []
      };
    }

    const blocks: OCRBlock[] = annotation.pages?.[0]?.blocks?.map((block: any) => ({
      text: block.paragraphs?.map((p: any) =>
        p.words?.map((w: any) =>
          w.symbols?.map((s: any) => s.text).join('')
        ).join(' ')
      ).join('\n') || '',
      confidence: block.confidence * 100,
      boundingBox: block.boundingBox ? {
        x: block.boundingBox.vertices[0]?.x || 0,
        y: block.boundingBox.vertices[0]?.y || 0,
        width: (block.boundingBox.vertices[2]?.x || 0) - (block.boundingBox.vertices[0]?.x || 0),
        height: (block.boundingBox.vertices[2]?.y || 0) - (block.boundingBox.vertices[0]?.y || 0)
      } : undefined
    })) || [];

    return {
      text: annotation.text,
      confidence: annotation.pages?.[0]?.confidence * 100 || 0,
      blocks,
      metadata: {
        provider: 'google_vision',
        pages: annotation.pages?.length || 0
      }
    };
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

// AWS Textract integration
export class AWSTextractOCR {
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;

  constructor(accessKeyId: string, secretAccessKey: string, region = 'us-east-1') {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.region = region;
  }

  async processDocument(imageData: Blob): Promise<OCRResult> {
    // Textract requires AWS SDK - placeholder for implementation
    // In production, use AWS SDK or API Gateway
    throw new Error('AWS Textract integration requires AWS SDK setup');
  }

  async analyzeExpense(imageData: Blob): Promise<InvoiceData> {
    // Textract's AnalyzeExpense API specifically for invoices/receipts
    throw new Error('AWS Textract AnalyzeExpense requires AWS SDK setup');
  }
}

// Unstructured.io API (already used in VIN verification)
export class UnstructuredOCR {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async processDocument(imageData: Blob, filename: string = 'document.pdf'): Promise<OCRResult> {
    const formData = new FormData();
    formData.append('files', imageData, filename);
    formData.append('strategy', 'ocr_only');
    formData.append('extract_text_only', 'true');

    const response = await fetch('https://api.unstructured.io/general/v0/general', {
      method: 'POST',
      headers: {
        'unstructured-api-key': this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Unstructured API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data
      .map((element: any) => element.text || '')
      .join('\n');

    return {
      text,
      confidence: 85,
      metadata: {
        provider: 'unstructured',
        elements: data.length
      }
    };
  }
}

// OCR Result Parser - Extract structured data from OCR text
export class InvoiceParser {
  static parseInvoiceData(ocrResult: OCRResult): InvoiceData {
    const text = ocrResult.text.toUpperCase();
    const lines = text.split('\n').filter(l => l.trim());

    const invoice: InvoiceData = {
      confidence: ocrResult.confidence
    };

    // Extract invoice number
    const invoicePatterns = [
      /INVOICE\s*(?:#|NO\.?|NUMBER)?\s*:?\s*([A-Z0-9-]+)/i,
      /INV\s*(?:#|NO\.?)?\s*:?\s*([A-Z0-9-]+)/i,
      /BILL\s*(?:#|NO\.?)?\s*:?\s*([A-Z0-9-]+)/i
    ];

    for (const pattern of invoicePatterns) {
      const match = text.match(pattern);
      if (match) {
        invoice.invoiceNumber = match[1].trim();
        break;
      }
    }

    // Extract dates
    const datePatterns = [
      /(?:INVOICE\s+DATE|DATE|ISSUED)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        invoice.invoiceDate = this.normalizeDate(match[1]);
        break;
      }
    }

    // Extract vendor name (usually at top of document)
    if (lines.length > 0) {
      invoice.vendorName = this.extractVendorName(lines);
    }

    // Extract amounts
    invoice.totalAmount = this.extractTotalAmount(text);
    invoice.taxAmount = this.extractTaxAmount(text);

    if (invoice.totalAmount && invoice.taxAmount) {
      invoice.subtotal = invoice.totalAmount - invoice.taxAmount;
    }

    // Extract currency
    invoice.currency = this.extractCurrency(text);

    // Extract line items
    invoice.lineItems = this.extractLineItems(lines);

    // Adjust confidence based on extracted data
    invoice.confidence = this.calculateConfidence(invoice, ocrResult.confidence);

    return invoice;
  }

  private static extractVendorName(lines: string[]): string {
    // Vendor name is typically in first 3-5 lines
    // Skip common headers like "INVOICE", "BILL", "RECEIPT"
    const skipPatterns = /^(INVOICE|BILL|RECEIPT|TAX INVOICE)/i;

    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 3 && !skipPatterns.test(line) && !/^\d+$/.test(line)) {
        return line;
      }
    }

    return lines[0] || 'Unknown Vendor';
  }

  private static extractTotalAmount(text: string): number | undefined {
    const patterns = [
      /TOTAL\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
      /AMOUNT\s+DUE\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
      /BALANCE\s+DUE\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
      /GRAND\s+TOTAL\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
      }
    }

    return undefined;
  }

  private static extractTaxAmount(text: string): number | undefined {
    const patterns = [
      /(?:TAX|VAT|GST)\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
      /(?:TAX|VAT|GST)\s+AMOUNT\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
      }
    }

    return undefined;
  }

  private static extractCurrency(text: string): string {
    // Look for currency symbols and codes
    if (text.includes('$') && (text.includes('USD') || text.includes('US'))) return 'USD';
    if (text.includes('€') || text.includes('EUR')) return 'EUR';
    if (text.includes('£') || text.includes('GBP')) return 'GBP';
    if (text.includes('¥') || text.includes('JPY')) return 'JPY';
    if (text.includes('₺') || text.includes('TRY')) return 'TRY';
    if (text.includes('AUD') || text.includes('A$')) return 'AUD';

    return 'USD'; // Default
  }

  private static extractLineItems(lines: string[]): InvoiceLineItem[] {
    const items: InvoiceLineItem[] = [];

    // Simple line item detection
    // Look for lines with: description, quantity, price pattern
    const itemPattern = /^(.+?)\s+(\d+(?:\.\d+)?)\s+\$?([\d,]+\.?\d{0,2})\s+\$?([\d,]+\.?\d{0,2})$/;

    for (const line of lines) {
      const match = line.match(itemPattern);
      if (match) {
        items.push({
          description: match[1].trim(),
          quantity: parseFloat(match[2]),
          unitPrice: parseFloat(match[3].replace(/,/g, '')),
          lineTotal: parseFloat(match[4].replace(/,/g, ''))
        });
      }
    }

    return items;
  }

  private static normalizeDate(dateStr: string): string {
    // Convert various date formats to ISO format (YYYY-MM-DD)
    const cleaned = dateStr.replace(/[\/\-\.]/g, '-');
    const parts = cleaned.split('-');

    if (parts.length !== 3) return dateStr;

    let [part1, part2, part3] = parts;

    // Expand 2-digit year
    if (part3.length === 2) {
      part3 = parseInt(part3) > 50 ? `19${part3}` : `20${part3}`;
    }

    // Determine format (MM-DD-YYYY vs DD-MM-YYYY)
    // Heuristic: if first part > 12, assume DD-MM-YYYY
    if (parseInt(part1) > 12) {
      return `${part3}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
    } else {
      return `${part3}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`;
    }
  }

  private static calculateConfidence(invoice: InvoiceData, baseConfidence: number): number {
    let confidence = baseConfidence;

    // Boost confidence for each extracted field
    if (invoice.invoiceNumber) confidence += 5;
    if (invoice.invoiceDate) confidence += 5;
    if (invoice.vendorName && invoice.vendorName !== 'Unknown Vendor') confidence += 5;
    if (invoice.totalAmount) confidence += 10;
    if (invoice.lineItems && invoice.lineItems.length > 0) confidence += 5;

    // Cap at 95 (never 100% confident without human review)
    return Math.min(confidence, 95);
  }
}

// Vendor recognition using fuzzy matching
export class VendorRecognition {
  static async recognizeVendor(
    extractedName: string,
    supabaseAdmin: any
  ): Promise<{ vendorId?: string; name: string; confidence: number }> {
    if (!extractedName || extractedName === 'Unknown Vendor') {
      return { name: extractedName, confidence: 0 };
    }

    // Query known vendors
    const { data: vendors, error } = await supabaseAdmin
      .from('known_vendors')
      .select('*')
      .limit(100);

    if (error || !vendors || vendors.length === 0) {
      return { name: extractedName, confidence: 50 };
    }

    // Fuzzy matching
    let bestMatch = { vendorId: undefined, name: extractedName, confidence: 50 };

    for (const vendor of vendors) {
      // Direct name match
      if (this.normalizeString(vendor.name) === this.normalizeString(extractedName)) {
        return { vendorId: vendor.id, name: vendor.name, confidence: 95 + vendor.confidence_boost };
      }

      // Check aliases
      if (vendor.aliases) {
        for (const alias of vendor.aliases) {
          if (this.normalizeString(alias) === this.normalizeString(extractedName)) {
            return { vendorId: vendor.id, name: vendor.name, confidence: 90 + vendor.confidence_boost };
          }
        }
      }

      // Substring match
      const normalizedExtracted = this.normalizeString(extractedName);
      const normalizedVendor = this.normalizeString(vendor.name);

      if (normalizedExtracted.includes(normalizedVendor) || normalizedVendor.includes(normalizedExtracted)) {
        const similarity = this.calculateSimilarity(normalizedExtracted, normalizedVendor);
        const confidence = 70 + similarity * 20 + vendor.confidence_boost;

        if (confidence > bestMatch.confidence) {
          bestMatch = { vendorId: vendor.id, name: vendor.name, confidence };
        }
      }
    }

    return bestMatch;
  }

  private static normalizeString(str: string): string {
    return str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}

// Category auto-suggestion
export class CategorySuggestion {
  static async suggestCategory(
    invoice: InvoiceData,
    supabaseAdmin: any
  ): Promise<{ category: string; confidence: number }> {
    // Get predefined categories with keywords
    const { data: categories, error } = await supabaseAdmin
      .from('expense_categories')
      .select('name, keywords, vendor_patterns')
      .eq('is_active', true);

    if (error || !categories || categories.length === 0) {
      return { category: 'Uncategorized', confidence: 0 };
    }

    const searchText = [
      invoice.vendorName,
      invoice.lineItems?.map(i => i.description).join(' ')
    ].filter(Boolean).join(' ').toLowerCase();

    let bestMatch = { category: 'Uncategorized', confidence: 0 };

    for (const category of categories) {
      let score = 0;

      // Check keywords
      if (category.keywords) {
        for (const keyword of category.keywords) {
          if (searchText.includes(keyword.toLowerCase())) {
            score += 20;
          }
        }
      }

      // Check vendor patterns
      if (category.vendor_patterns && invoice.vendorName) {
        for (const pattern of category.vendor_patterns) {
          if (invoice.vendorName.toLowerCase().includes(pattern.toLowerCase())) {
            score += 30;
          }
        }
      }

      if (score > bestMatch.confidence) {
        bestMatch = { category: category.name, confidence: score };
      }
    }

    return bestMatch;
  }
}
