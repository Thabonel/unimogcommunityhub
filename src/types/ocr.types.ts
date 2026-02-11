// OCR-related type definitions for vehicle logging

export type OcrStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'manual';

export interface OcrFields {
  receipt_url?: string;
  ocr_status?: OcrStatus;
  ocr_confidence?: number; // 0.00 to 1.00
  requires_review?: boolean;
}

export interface OcrProcessingResult {
  success: boolean;
  confidence: number;
  extractedData?: {
    // Fuel logs
    fuel_amount?: number;
    fuel_cost?: number;
    fuel_price_per_unit?: number;
    station_name?: string;
    fill_date?: string;
    mileage?: number;

    // Service logs
    service_date?: string;
    cost?: number;
    service_provider?: string;
    parts_replaced?: string[];
    description?: string;
    mileage_at_service?: number;
  };
  requiresReview?: boolean;
  errorMessage?: string;
}

export const OCR_STATUS_LABELS: Record<OcrStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
  manual: 'Manual Entry'
};

export const OCR_CONFIDENCE_THRESHOLD = {
  HIGH: 0.85,
  MEDIUM: 0.70,
  LOW: 0.50
} as const;