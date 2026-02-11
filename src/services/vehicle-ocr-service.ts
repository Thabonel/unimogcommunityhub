/**
 * Vehicle OCR Service
 * Handles receipt OCR processing for fuel logs, service records, and expense tracking
 */

import { supabase } from '@/lib/supabase-client';
import { SupabaseService } from './core/SupabaseService';
import { logger } from '@/utils/logger';

// OCR Result Types
export interface OcrResult {
  success: boolean;
  confidence: number;
  extractedData: ExtractedData;
  processingTime: number;
  error?: string;
}

export interface ExtractedData {
  // Common receipt fields
  vendor?: { value: string; confidence: number };
  date?: { value: string; confidence: number };
  total?: { value: number; confidence: number };
  invoiceNumber?: { value: string; confidence: number };

  // Fuel-specific fields
  fuelAmount?: { value: number; confidence: number };
  fuelPrice?: { value: number; confidence: number };
  odometer?: { value: number; confidence: number };

  // Service-specific fields
  serviceItems?: Array<{
    description: string;
    amount: number;
    confidence: number;
  }>;

  // Tax/VAT fields
  vat?: { value: number; confidence: number };
  vatRate?: { value: number; confidence: number };
}

export interface ReceiptUpload {
  file: File;
  type: 'fuel' | 'service' | 'expense';
  vehicleId: string;
  userId: string;
}

export interface ProcessedReceipt {
  id: string;
  uploadPath: string;
  status: OcrStatus;
  extractedData?: ExtractedData;
  confidence?: number;
  needsReview: boolean;
  processingErrors?: string[];
  createdAt: string;
  updatedAt: string;
}

export type OcrStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'needs_review';

/**
 * Vehicle OCR Service for processing receipts and extracting vehicle log data
 */
export class VehicleOcrService {
  private static instance: VehicleOcrService;
  private supabaseService: SupabaseService;

  private constructor() {
    this.supabaseService = SupabaseService.getInstance();
  }

  static getInstance(): VehicleOcrService {
    if (!VehicleOcrService.instance) {
      VehicleOcrService.instance = new VehicleOcrService();
    }
    return VehicleOcrService.instance;
  }

  /**
   * Upload and process a receipt with OCR
   */
  async processReceipt(upload: ReceiptUpload): Promise<OcrResult> {
    const startTime = performance.now();

    try {
      // Validate file
      this.validateFile(upload.file);

      // Upload to storage
      const uploadPath = await this.uploadReceiptFile(upload);

      // Create processing record
      const receiptRecord = await this.createReceiptRecord(upload, uploadPath);

      // Process with OCR
      const ocrResult = await this.extractDataFromReceipt(upload.file, upload.type);

      // Update record with results
      await this.updateReceiptRecord(receiptRecord.id, {
        status: ocrResult.success ? 'completed' : 'failed',
        extractedData: ocrResult.extractedData,
        confidence: ocrResult.confidence,
        needsReview: this.shouldRequireReview(ocrResult),
        processingErrors: ocrResult.error ? [ocrResult.error] : undefined
      });

      const processingTime = performance.now() - startTime;

      logger.info('Receipt processed successfully', {
        component: 'VehicleOcrService',
        action: 'process_receipt',
        receiptId: receiptRecord.id,
        processingTime,
        confidence: ocrResult.confidence
      });

      return {
        ...ocrResult,
        processingTime
      };

    } catch (error) {
      const processingTime = performance.now() - startTime;

      logger.error('Receipt processing failed', error, {
        component: 'VehicleOcrService',
        action: 'process_receipt_error',
        processingTime
      });

      return {
        success: false,
        confidence: 0,
        extractedData: {},
        processingTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get OCR processing status for a receipt
   */
  async getReceiptStatus(receiptId: string): Promise<ProcessedReceipt | null> {
    try {
      const result = await this.supabaseService.query<ProcessedReceipt[]>('receipts', {
        filters: [{ column: 'id', operator: 'eq', value: receiptId }]
      });

      return result.success && result.data ? result.data[0] : null;
    } catch (error) {
      logger.error('Failed to get receipt status', error, {
        component: 'VehicleOcrService',
        action: 'get_receipt_status',
        receiptId
      });
      return null;
    }
  }

  /**
   * Get all receipts for a vehicle with filtering
   */
  async getVehicleReceipts(
    vehicleId: string,
    options: {
      status?: OcrStatus;
      type?: 'fuel' | 'service' | 'expense';
      needsReview?: boolean;
      limit?: number;
    } = {}
  ): Promise<ProcessedReceipt[]> {
    try {
      const filters = [
        { column: 'vehicle_id', operator: 'eq', value: vehicleId }
      ];

      if (options.status) {
        filters.push({ column: 'status', operator: 'eq', value: options.status });
      }

      if (options.type) {
        filters.push({ column: 'type', operator: 'eq', value: options.type });
      }

      if (options.needsReview !== undefined) {
        filters.push({ column: 'needs_review', operator: 'eq', value: options.needsReview.toString() });
      }

      const result = await this.supabaseService.query<ProcessedReceipt[]>('receipts', {
        filters,
        orderBy: { column: 'created_at', ascending: false },
        pagination: options.limit ? { page: 0, pageSize: options.limit } : undefined
      });

      return result.success && result.data ? result.data : [];
    } catch (error) {
      logger.error('Failed to get vehicle receipts', error, {
        component: 'VehicleOcrService',
        action: 'get_vehicle_receipts',
        vehicleId
      });
      return [];
    }
  }

  /**
   * Update extracted data after manual review
   */
  async updateExtractedData(receiptId: string, data: ExtractedData): Promise<boolean> {
    try {
      const result = await this.supabaseService.mutate('receipts', 'update', {
        updates: {
          extracted_data: data,
          needs_review: false,
          status: 'completed',
          updated_at: new Date().toISOString()
        },
        match: { id: receiptId }
      });

      return result.success;
    } catch (error) {
      logger.error('Failed to update extracted data', error, {
        component: 'VehicleOcrService',
        action: 'update_extracted_data',
        receiptId
      });
      return false;
    }
  }

  /**
   * Get OCR statistics for analytics
   */
  async getOcrStats(vehicleId?: string): Promise<{
    totalProcessed: number;
    successRate: number;
    averageConfidence: number;
    needsReview: number;
    byType: Record<string, number>;
  }> {
    try {
      // This would typically be a database function call
      // For now, we'll use a simple query approach
      const receipts = vehicleId
        ? await this.getVehicleReceipts(vehicleId)
        : await this.getAllReceipts();

      const totalProcessed = receipts.length;
      const successful = receipts.filter(r => r.status === 'completed').length;
      const needsReview = receipts.filter(r => r.needsReview).length;

      const confidenceScores = receipts
        .filter(r => r.confidence !== undefined)
        .map(r => r.confidence!);

      const averageConfidence = confidenceScores.length > 0
        ? confidenceScores.reduce((sum, c) => sum + c, 0) / confidenceScores.length
        : 0;

      const byType = receipts.reduce((acc, receipt) => {
        const type = receipt.extractedData?.vendor?.value || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalProcessed,
        successRate: totalProcessed > 0 ? successful / totalProcessed : 0,
        averageConfidence,
        needsReview,
        byType
      };
    } catch (error) {
      logger.error('Failed to get OCR stats', error, {
        component: 'VehicleOcrService',
        action: 'get_ocr_stats',
        vehicleId
      });
      return {
        totalProcessed: 0,
        successRate: 0,
        averageConfidence: 0,
        needsReview: 0,
        byType: {}
      };
    }
  }

  // Private helper methods

  private validateFile(file: File): void {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG, PNG, WebP, or PDF files.');
    }
  }

  private async uploadReceiptFile(upload: ReceiptUpload): Promise<string> {
    const fileName = `${upload.userId}/${upload.vehicleId}/${Date.now()}_${upload.file.name}`;
    const filePath = `receipts/${fileName}`;

    const { data, error } = await supabase.storage
      .from('vehicles')
      .upload(filePath, upload.file);

    if (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }

    return filePath;
  }

  private async createReceiptRecord(upload: ReceiptUpload, uploadPath: string): Promise<{ id: string }> {
    const result = await this.supabaseService.mutate<{ id: string }[]>('receipts', 'insert', {
      user_id: upload.userId,
      vehicle_id: upload.vehicleId,
      upload_path: uploadPath,
      type: upload.type,
      status: 'processing',
      needs_review: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (!result.success || !result.data?.[0]) {
      throw new Error('Failed to create receipt record');
    }

    return result.data[0];
  }

  private async updateReceiptRecord(id: string, updates: Partial<ProcessedReceipt>): Promise<void> {
    await this.supabaseService.mutate('receipts', 'update', {
      updates: {
        ...updates,
        updated_at: new Date().toISOString()
      },
      match: { id }
    });
  }

  private async extractDataFromReceipt(file: File, type: string): Promise<OcrResult> {
    try {
      // Convert file to base64 for processing
      const base64 = await this.fileToBase64(file);

      // Call OCR service (mock implementation - replace with actual OCR API)
      const ocrResponse = await this.callOcrApi(base64, type);

      return {
        success: true,
        confidence: ocrResponse.confidence,
        extractedData: ocrResponse.data,
        processingTime: 0
      };
    } catch (error) {
      return {
        success: false,
        confidence: 0,
        extractedData: {},
        processingTime: 0,
        error: error instanceof Error ? error.message : 'OCR processing failed'
      };
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/... prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async callOcrApi(base64Data: string, type: string): Promise<{
    confidence: number;
    data: ExtractedData;
  }> {
    // Mock implementation - replace with actual OCR service
    // This would typically call a service like Google Cloud Vision, AWS Textract, or similar

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock extracted data based on type
    const mockData: ExtractedData = type === 'fuel' ? {
      vendor: { value: 'Shell Station', confidence: 0.95 },
      date: { value: new Date().toISOString().split('T')[0], confidence: 0.90 },
      total: { value: 65.50, confidence: 0.85 },
      fuelAmount: { value: 45.5, confidence: 0.80 },
      fuelPrice: { value: 1.44, confidence: 0.85 }
    } : {
      vendor: { value: 'AutoService Pro', confidence: 0.92 },
      date: { value: new Date().toISOString().split('T')[0], confidence: 0.88 },
      total: { value: 250.00, confidence: 0.90 },
      serviceItems: [
        { description: 'Oil Change', amount: 75.00, confidence: 0.85 },
        { description: 'Air Filter', amount: 25.00, confidence: 0.80 },
        { description: 'Labor', amount: 150.00, confidence: 0.90 }
      ]
    };

    return {
      confidence: 0.87,
      data: mockData
    };
  }

  private shouldRequireReview(ocrResult: OcrResult): boolean {
    // Require review if overall confidence is low or critical fields are missing
    if (ocrResult.confidence < 0.8) return true;

    const data = ocrResult.extractedData;

    // Check for missing critical fields
    if (!data.total || data.total.confidence < 0.7) return true;
    if (!data.date || data.date.confidence < 0.7) return true;
    if (!data.vendor || data.vendor.confidence < 0.7) return true;

    return false;
  }

  private async getAllReceipts(): Promise<ProcessedReceipt[]> {
    try {
      const result = await this.supabaseService.query<ProcessedReceipt[]>('receipts', {
        orderBy: { column: 'created_at', ascending: false }
      });

      return result.success && result.data ? result.data : [];
    } catch (error) {
      logger.error('Failed to get all receipts', error, {
        component: 'VehicleOcrService',
        action: 'get_all_receipts'
      });
      return [];
    }
  }
}

// Export service instance
export const vehicleOcrService = VehicleOcrService.getInstance();