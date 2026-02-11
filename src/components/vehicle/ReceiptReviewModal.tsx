/**
 * Receipt Review Modal Component
 * Side-by-side display for reviewing OCR results with editable form
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  Building,
  Hash,
  Fuel,
  Wrench,
  Receipt,
  ZoomIn,
  RotateCw
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ExtractedData, vehicleOcrService } from '@/services/vehicle-ocr-service';
import { OCRStatusIndicator } from './OCRStatusIndicator';

// Form validation schema
const receiptFormSchema = z.object({
  vendor: z.string().min(1, 'Vendor name is required'),
  date: z.string().min(1, 'Date is required'),
  total: z.coerce.number().min(0.01, 'Total must be greater than 0'),
  invoiceNumber: z.string().optional(),
  // Fuel-specific fields
  fuelAmount: z.coerce.number().optional(),
  fuelPrice: z.coerce.number().optional(),
  odometer: z.coerce.number().optional(),
  // Service-specific fields
  serviceDescription: z.string().optional(),
  laborHours: z.coerce.number().optional(),
  laborRate: z.coerce.number().optional(),
  partsTotal: z.coerce.number().optional(),
  // Tax fields
  vat: z.coerce.number().optional(),
  vatRate: z.coerce.number().optional(),
  // General fields
  notes: z.string().optional()
});

type ReceiptFormData = z.infer<typeof receiptFormSchema>;

interface ReceiptReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptId: string;
  extractedData: ExtractedData;
  originalImage?: string;
  confidence: number;
  receiptType: 'fuel' | 'service' | 'expense';
  onSave: (data: ReceiptFormData) => Promise<void>;
  onCancel: () => void;
}

const confidenceThresholds = {
  excellent: 0.9,
  good: 0.8,
  fair: 0.6,
  poor: 0
};

const getConfidenceInfo = (confidence: number) => {
  if (confidence >= confidenceThresholds.excellent) {
    return { label: 'Excellent', color: 'text-military-green', bgColor: 'bg-military-green/10' };
  } else if (confidence >= confidenceThresholds.good) {
    return { label: 'Good', color: 'text-military-green', bgColor: 'bg-military-green/10' };
  } else if (confidence >= confidenceThresholds.fair) {
    return { label: 'Fair', color: 'text-amber-600', bgColor: 'bg-amber-50' };
  } else {
    return { label: 'Poor', color: 'text-red-600', bgColor: 'bg-red-50' };
  }
};

const getFieldConfidence = (field: { value: any; confidence: number } | undefined): number => {
  return field?.confidence || 0;
};

export const ReceiptReviewModal: React.FC<ReceiptReviewModalProps> = ({
  open,
  onOpenChange,
  receiptId,
  extractedData,
  originalImage,
  confidence,
  receiptType,
  onSave,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const confidenceInfo = getConfidenceInfo(confidence);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptFormSchema)
  });

  // Initialize form with extracted data
  useEffect(() => {
    if (extractedData && open) {
      reset({
        vendor: extractedData.vendor?.value || '',
        date: extractedData.date?.value || '',
        total: extractedData.total?.value || 0,
        invoiceNumber: extractedData.invoiceNumber?.value || '',
        fuelAmount: extractedData.fuelAmount?.value || undefined,
        fuelPrice: extractedData.fuelPrice?.value || undefined,
        odometer: extractedData.odometer?.value || undefined,
        vat: extractedData.vat?.value || undefined,
        vatRate: extractedData.vatRate?.value || undefined,
        serviceDescription: extractedData.serviceItems?.[0]?.description || '',
        notes: ''
      });
    }
  }, [extractedData, open, reset]);

  const handleSaveForm = async (data: ReceiptFormData) => {
    setIsLoading(true);
    try {
      await onSave(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save receipt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const renderFieldWithConfidence = (
    label: string,
    name: keyof ReceiptFormData,
    type: 'text' | 'number' | 'date' = 'text',
    confidence?: number,
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
        {confidence !== undefined && (
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              confidence >= 0.8
                ? 'text-military-green border-military-green'
                : confidence >= 0.6
                ? 'text-amber-600 border-amber-600'
                : 'text-red-600 border-red-600'
            )}
          >
            {Math.round(confidence * 100)}%
          </Badge>
        )}
      </div>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          'w-full',
          confidence !== undefined && confidence < 0.6 && 'border-amber-500 bg-amber-50'
        )}
        {...register(name)}
      />
      {errors[name] && (
        <p className="text-sm text-red-600">{errors[name]?.message}</p>
      )}
    </div>
  );

  const renderServiceItems = () => {
    if (receiptType !== 'service' || !extractedData.serviceItems) return null;

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">Service Items</Label>
        <div className="space-y-2">
          {extractedData.serviceItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{item.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  {Math.round(item.confidence * 100)}%
                </Badge>
                <span className="text-sm font-medium">${item.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderImagePreview = () => {
    if (!originalImage) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Original Receipt</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImageZoom(prev => Math.min(prev + 0.2, 2))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImageZoom(1)}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[400px] w-full border rounded-lg">
          <div className="p-4 flex justify-center">
            <img
              src={originalImage}
              alt="Receipt"
              style={{ transform: `scale(${imageZoom})` }}
              className="max-w-none transition-transform duration-200"
            />
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderFormFields = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          {receiptType === 'fuel' ? (
            <Fuel className="h-5 w-5 text-blue-600" />
          ) : receiptType === 'service' ? (
            <Wrench className="h-5 w-5 text-orange-600" />
          ) : (
            <Receipt className="h-5 w-5 text-purple-600" />
          )}
          <h3 className="text-lg font-semibold capitalize">{receiptType} Receipt</h3>
        </div>
        <OCRStatusIndicator
          status="completed"
          confidence={confidence}
          showProgress
          size="sm"
        />
      </div>

      {/* Overall confidence alert */}
      {confidence < 0.8 && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This receipt had {confidenceInfo.label.toLowerCase()} OCR confidence ({Math.round(confidence * 100)}%).
            Please review all fields carefully before saving.
          </AlertDescription>
        </Alert>
      )}

      {/* Basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderFieldWithConfidence(
          'Vendor Name',
          'vendor',
          'text',
          getFieldConfidence(extractedData.vendor),
          'e.g. Shell Station'
        )}
        {renderFieldWithConfidence(
          'Date',
          'date',
          'date',
          getFieldConfidence(extractedData.date)
        )}
        {renderFieldWithConfidence(
          'Total Amount',
          'total',
          'number',
          getFieldConfidence(extractedData.total),
          '0.00'
        )}
        {renderFieldWithConfidence(
          'Invoice/Receipt Number',
          'invoiceNumber',
          'text',
          getFieldConfidence(extractedData.invoiceNumber),
          'Optional'
        )}
      </div>

      {/* Fuel-specific fields */}
      {receiptType === 'fuel' && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderFieldWithConfidence(
              'Fuel Amount (L)',
              'fuelAmount',
              'number',
              getFieldConfidence(extractedData.fuelAmount),
              'Liters'
            )}
            {renderFieldWithConfidence(
              'Price per Liter',
              'fuelPrice',
              'number',
              getFieldConfidence(extractedData.fuelPrice),
              '0.00'
            )}
            {renderFieldWithConfidence(
              'Odometer Reading',
              'odometer',
              'number',
              getFieldConfidence(extractedData.odometer),
              'km'
            )}
          </div>
        </>
      )}

      {/* Service items display */}
      {receiptType === 'service' && (
        <>
          <Separator />
          {renderServiceItems()}
        </>
      )}

      {/* Tax fields */}
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderFieldWithConfidence(
          'VAT/Tax Amount',
          'vat',
          'number',
          getFieldConfidence(extractedData.vat),
          '0.00'
        )}
        {renderFieldWithConfidence(
          'VAT/Tax Rate (%)',
          'vatRate',
          'number',
          getFieldConfidence(extractedData.vatRate),
          'e.g. 10'
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Additional Notes
        </Label>
        <Textarea
          id="notes"
          placeholder="Any additional information..."
          className="min-h-[80px]"
          {...register('notes')}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Review Receipt Data
          </DialogTitle>
          <DialogDescription>
            Review and edit the extracted data before saving to your vehicle logs.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          {/* Left side - Image preview */}
          <div className="space-y-4">
            {renderImagePreview()}
          </div>

          {/* Right side - Form */}
          <ScrollArea className="flex-1">
            <form onSubmit={handleSubmit(handleSaveForm)} className="space-y-6 pr-4">
              {renderFormFields()}
            </form>
          </ScrollArea>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handleSaveForm)}
            disabled={isLoading}
            className="ml-2"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save to Vehicle Log
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};