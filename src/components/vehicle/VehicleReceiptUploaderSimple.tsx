/**
 * Vehicle Receipt Uploader Component (Simplified)
 * File upload with real-time OCR processing - no external dependencies
 */

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Fuel,
  Wrench,
  Receipt,
  Camera,
  AlertCircle,
  Info,
  X,
  CheckCircle
} from 'lucide-react';
import { vehicleOcrService, ReceiptUpload, OcrResult } from '@/services/vehicle-ocr-service';
import { OCRProcessingAnimation } from './OCRStatusIndicator';

interface VehicleReceiptUploaderSimpleProps {
  vehicleId: string;
  userId: string;
  onUploadComplete?: (result: OcrResult) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  defaultType?: 'fuel' | 'service' | 'expense';
  maxFiles?: number;
  showPreview?: boolean;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  result?: OcrResult;
  error?: string;
  preview?: string;
}

const receiptTypeConfig = {
  fuel: {
    label: 'Fuel Receipt',
    description: 'Gas station receipts, fuel cards, diesel purchases',
    icon: Fuel,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    tips: [
      'Include the odometer reading if visible',
      'Ensure fuel amount and price are clear',
      'Capture the full receipt including header'
    ]
  },
  service: {
    label: 'Service Receipt',
    description: 'Maintenance, repairs, parts, labor costs',
    icon: Wrench,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    tips: [
      'Include itemized service details',
      'Capture labor hours and rates',
      'Ensure all parts are visible'
    ]
  },
  expense: {
    label: 'General Expense',
    description: 'Insurance, registration, modifications, other costs',
    icon: Receipt,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    tips: [
      'Include vendor information clearly',
      'Capture tax/VAT information if applicable',
      'Ensure dates are clearly visible'
    ]
  }
} as const;

export const VehicleReceiptUploaderSimple: React.FC<VehicleReceiptUploaderSimpleProps> = ({
  vehicleId,
  userId,
  onUploadComplete,
  onUploadError,
  className,
  defaultType = 'fuel',
  maxFiles = 5,
  showPreview = true
}) => {
  const [selectedType, setSelectedType] = useState<'fuel' | 'service' | 'expense'>(defaultType);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(selectedFiles);
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      onUploadError?.('No valid files selected. Please choose JPG, PNG, WebP, or PDF files under 10MB.');
      return;
    }

    processFiles(validFiles.slice(0, maxFiles));
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);

    // Initialize upload progress for each file
    const newUploads: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading',
      preview: showPreview && file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setUploads(newUploads);

    // Process each file
    for (let i = 0; i < newUploads.length; i++) {
      try {
        await processFile(newUploads[i], i);
      } catch (error) {
        console.error('File processing failed:', error);
        updateUploadStatus(i, 'error', undefined, error instanceof Error ? error.message : 'Processing failed');
      }
    }

    setIsProcessing(false);
  };

  const processFile = async (upload: UploadProgress, index: number) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 20) {
      updateUploadProgress(index, progress);
      if (progress < 100) await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Start OCR processing
    updateUploadStatus(index, 'processing');

    const receiptUpload: ReceiptUpload = {
      file: upload.file,
      type: selectedType,
      vehicleId,
      userId
    };

    try {
      const result = await vehicleOcrService.processReceipt(receiptUpload);

      if (result.success) {
        updateUploadStatus(index, 'completed', result);
        onUploadComplete?.(result);
      } else {
        updateUploadStatus(index, 'error', undefined, result.error || 'Processing failed');
        onUploadError?.(result.error || 'Processing failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateUploadStatus(index, 'error', undefined, errorMessage);
      onUploadError?.(errorMessage);
    }
  };

  const updateUploadProgress = (index: number, progress: number) => {
    setUploads(prev => prev.map((upload, i) =>
      i === index ? { ...upload, progress } : upload
    ));
  };

  const updateUploadStatus = (
    index: number,
    status: UploadProgress['status'],
    result?: OcrResult,
    error?: string
  ) => {
    setUploads(prev => prev.map((upload, i) =>
      i === index ? { ...upload, status, result, error, progress: 100 } : upload
    ));
  };

  const removeUpload = (index: number) => {
    setUploads(prev => {
      const newUploads = [...prev];
      // Revoke object URL to prevent memory leaks
      if (newUploads[index].preview) {
        URL.revokeObjectURL(newUploads[index].preview!);
      }
      newUploads.splice(index, 1);
      return newUploads;
    });
  };

  const clearAllUploads = () => {
    uploads.forEach(upload => {
      if (upload.preview) {
        URL.revokeObjectURL(upload.preview);
      }
    });
    setUploads([]);
  };

  const renderTypeSelector = () => (
    <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
      <TabsList className="grid w-full grid-cols-3">
        {Object.entries(receiptTypeConfig).map(([type, config]) => {
          const IconComponent = config.icon;
          return (
            <TabsTrigger key={type} value={type} className="flex items-center gap-2">
              <IconComponent className="h-4 w-4" />
              {config.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {Object.entries(receiptTypeConfig).map(([type, config]) => (
        <TabsContent key={type} value={type} className="mt-4">
          <Alert className={cn('border-l-4', config.bgColor)}>
            <Info className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              <config.icon className={cn('h-4 w-4', config.color)} />
              {config.label} Tips
            </AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-2">{config.description}</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {config.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>
      ))}
    </Tabs>
  );

  const renderDropZone = () => (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
        isDragOver
          ? 'border-military-green bg-military-green/5'
          : 'border-camo-brown hover:border-military-green hover:bg-military-green/5',
        isProcessing && 'opacity-50 cursor-not-allowed'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isProcessing}
      />

      <div className="flex flex-col items-center space-y-4">
        {isDragOver ? (
          <Upload className="h-12 w-12 text-military-green animate-bounce" />
        ) : (
          <div className="relative">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <Camera className="h-6 w-6 text-military-green absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {isDragOver ? 'Drop files here' : 'Upload Receipt Photos'}
          </h3>
          <p className="text-muted-foreground">
            Drag & drop files or click to browse
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span>JPG, PNG, WebP, PDF</span>
            <span>•</span>
            <span>Max 10MB each</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="flex items-center gap-1">
            <Camera className="h-3 w-3" />
            Take Photo
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Upload className="h-3 w-3" />
            Upload File
          </Badge>
        </div>
      </div>
    </div>
  );

  const renderUploadProgress = () => {
    if (uploads.length === 0) return null;

    return (
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Upload Progress</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllUploads}
            className="h-auto p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploads.map((upload, index) => (
              <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                {showPreview && upload.preview && (
                  <div className="flex-shrink-0">
                    <img
                      src={upload.preview}
                      alt={upload.file.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {upload.file.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpload(index)}
                      className="h-auto p-1 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {upload.status === 'uploading' && (
                      <>
                        <Progress value={upload.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Uploading... {upload.progress}%
                        </p>
                      </>
                    )}

                    {upload.status === 'processing' && (
                      <>
                        <OCRProcessingAnimation />
                        <p className="text-xs text-muted-foreground">
                          Extracting data from receipt...
                        </p>
                      </>
                    )}

                    {upload.status === 'completed' && upload.result && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-military-green" />
                          <span className="text-sm font-medium text-military-green">
                            Processing Complete
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Confidence: {Math.round(upload.result.confidence * 100)}%
                          {upload.result.extractedData.total && (
                            <> • Total: ${upload.result.extractedData.total.value}</>
                          )}
                        </div>
                        {upload.result.extractedData.vendor && (
                          <p className="text-xs text-muted-foreground">
                            Vendor: {upload.result.extractedData.vendor.value}
                          </p>
                        )}
                      </div>
                    )}

                    {upload.status === 'error' && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {upload.error || 'Upload failed'}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {renderTypeSelector()}
      {renderDropZone()}
      {renderUploadProgress()}

      {isProcessing && (
        <Alert className="border-military-green bg-military-green/5">
          <OCRProcessingAnimation />
          <AlertDescription className="ml-6">
            Processing {uploads.length} file{uploads.length !== 1 ? 's' : ''}.
            This may take a few moments...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};