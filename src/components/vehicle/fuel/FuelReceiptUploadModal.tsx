/**
 * Fuel Receipt Upload Modal
 * Multi-step modal for camera capture, file upload, OCR processing, and data review
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Fuel,
  Car,
  Save,
  X,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Vehicle } from '@/hooks/vehicle-maintenance/types';
import { CameraCapture } from '../expenses/CameraCapture';
import { ReceiptUploadZone } from '../expenses/ReceiptUploadZone';
import { FuelReceiptParser, FuelReceiptData, CombinedTotals } from '@/services/fuel-receipt-parser';
import { ExtractedData } from '@/services/vehicle-ocr-service';
import { supabase } from '@/lib/supabase-client';
import { cn } from '@/lib/utils';
import { VehicleLoadingState } from './VehicleLoadingState';

// Confidence thresholds for OCR accuracy assessment
const CONFIDENCE_THRESHOLD_HIGH = 85; // Auto-proceed without review
const CONFIDENCE_THRESHOLD_MEDIUM = 70; // Warning but usable
// Below CONFIDENCE_THRESHOLD_MEDIUM = Manual review required

// Modal step types
type ModalStep = 'capture' | 'processing' | 'review' | 'complete';

interface FuelReceiptUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Vehicle[];
  isLoadingVehicles?: boolean;
  onReceiptProcessed: (fuelData: FuelReceiptData, vehicleId: string) => void;
}

interface ProcessingStatus {
  step: string;
  progress: number;
  message: string;
}

interface ReviewData {
  fuelReceiptData: FuelReceiptData;
  needsReview: boolean;
  confidence: number;
  originalImage?: string;
}

export const FuelReceiptUploadModal: React.FC<FuelReceiptUploadModalProps> = ({
  open,
  onOpenChange,
  vehicles,
  isLoadingVehicles = false,
  onReceiptProcessed
}) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('capture');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    step: '',
    progress: 0,
    message: ''
  });
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [editedFuelData, setEditedFuelData] = useState<FuelReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  // Reset modal state when opened/closed
  useEffect(() => {
    if (!open) {
      // Reset all state when modal closes
      setCurrentStep('capture');
      setUploadedFiles([]);
      setIsProcessing(false);
      setProcessingStatus({ step: '', progress: 0, message: '' });
      setReviewData(null);
      setEditedFuelData(null);
      setError(null);
      setCameraOpen(false);
    } else {
      // When modal opens, auto-select vehicle if only one exists
      if (vehicles.length === 1) {
        setSelectedVehicle(vehicles[0].id);
      } else {
        setSelectedVehicle('');
      }
    }
  }, [open, vehicles]);

  // Handle file uploads from camera or file picker
  const handleFilesChange = useCallback((files: File[]) => {
    setUploadedFiles(files);
    setError(null);
  }, []);

  // Handle camera capture
  const handleCameraCapture = useCallback((file: File) => {
    setUploadedFiles([file]);
    setCameraOpen(false);
    setError(null);
  }, []);

  // Process receipt with OCR
  const processReceipt = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload a receipt image first');
      return;
    }

    if (!selectedVehicle) {
      setError('Please select a vehicle');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');
    setError(null);

    try {
      const file = uploadedFiles[0];

      // Step 1: Upload file to storage
      setProcessingStatus({
        step: 'upload',
        progress: 10,
        message: 'Uploading receipt image...'
      });

      const fileName = `fuel-receipt-${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('expense-receipts')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL for OCR processing
      const { data: { publicUrl } } = supabase.storage
        .from('expense-receipts')
        .getPublicUrl(uploadData.path);

      // Step 2: Call OCR service
      setProcessingStatus({
        step: 'ocr',
        progress: 30,
        message: 'Analyzing receipt with Claude Vision...'
      });

      const { data: ocrData, error: ocrError } = await supabase.functions.invoke('process-invoice-ocr', {
        body: {
          documentUrl: publicUrl,
          documentType: 'image',
          ocrProvider: 'claude_vision'
        }
      });

      if (ocrError) {
        throw new Error(`OCR processing failed: ${ocrError.message}`);
      }

      // Step 3: Parse OCR results
      setProcessingStatus({
        step: 'parsing',
        progress: 70,
        message: 'Extracting fuel data...'
      });

      const extractedData: ExtractedData = ocrData.invoiceData || {};
      const metadata = ocrData.metadata || {};

      // Parse using FuelReceiptParser
      const fuelReceiptData = FuelReceiptParser.parseClaudeVisionResult(extractedData, metadata);

      // Determine if review is needed
      const needsReview = FuelReceiptParser.shouldRequireReview(metadata.fuel_data);
      const confidence = fuelReceiptData.confidence;

      // Step 4: Complete processing
      setProcessingStatus({
        step: 'complete',
        progress: 100,
        message: 'Processing complete!'
      });

      // Store review data
      setReviewData({
        fuelReceiptData,
        needsReview,
        confidence,
        originalImage: URL.createObjectURL(file)
      });

      setEditedFuelData(fuelReceiptData);

      // Decide next step based on confidence
      if (needsReview || confidence < CONFIDENCE_THRESHOLD_HIGH) {
        setCurrentStep('review');
      } else {
        // High confidence - proceed directly to completion
        handleSaveFuelData(fuelReceiptData);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process receipt');
      setCurrentStep('capture');
    } finally {
      setIsProcessing(false);
    }
  };

  // Save fuel data to vehicle logs
  const handleSaveFuelData = async (fuelData: FuelReceiptData) => {
    try {
      setIsProcessing(true);

      // Call the parent handler to save the fuel data
      onReceiptProcessed(fuelData, selectedVehicle);

      setCurrentStep('complete');

      // Auto-close after success
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save fuel data');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle manual save from review step
  const handleReviewSave = () => {
    if (editedFuelData) {
      handleSaveFuelData(editedFuelData);
    }
  };

  // Update edited fuel data
  const updateFuelData = (field: keyof FuelReceiptData, value: string | number | CombinedTotals) => {
    if (editedFuelData) {
      setEditedFuelData({
        ...editedFuelData,
        [field]: value
      });
    }
  };

  // Render vehicle selection
  const renderVehicleSelection = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Car className="h-5 w-5 text-blue-600" />
        <Label className="text-sm font-medium">
          {isLoadingVehicles ? 'Loading Vehicle...' : vehicles.length === 1 ? 'Vehicle' : 'Select Vehicle'}
        </Label>
      </div>

      {/* Show loading state while vehicles load */}
      {isLoadingVehicles && (
        <VehicleLoadingState />
      )}

      {/* Multiple vehicles - show dropdown */}
      {!isLoadingVehicles && vehicles.length > 1 && (
        <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a vehicle for this fuel receipt" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.name} ({vehicle.model} {vehicle.year})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Single vehicle - show as read-only */}
      {!isLoadingVehicles && vehicles.length === 1 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
          <Car className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {vehicles[0].name} ({vehicles[0].model} {vehicles[0].year})
          </span>
        </div>
      )}

      {!isLoadingVehicles && selectedVehicle && vehicles.length > 1 && (
        <p className="text-sm text-muted-foreground">
          Fuel data will be added to {vehicles.find(v => v.id === selectedVehicle)?.name}
        </p>
      )}

      {!isLoadingVehicles && vehicles.length === 1 && (
        <p className="text-sm text-muted-foreground">
          Fuel data will be added to this vehicle
        </p>
      )}
    </div>
  );

  // Render capture step
  const renderCaptureStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Fuel className="h-12 w-12 mx-auto text-blue-600" />
        <h3 className="text-lg font-semibold">Upload Fuel Receipt</h3>
        <p className="text-muted-foreground">
          Take a photo or upload an image of your fuel receipt for automatic processing
        </p>
      </div>

      {renderVehicleSelection()}

      <Separator />

      <ReceiptUploadZone
        files={uploadedFiles}
        onFilesChange={handleFilesChange}
        disabled={!selectedVehicle}
        maxFiles={1}
      />

      <CameraCapture
        isOpen={cameraOpen}
        onCapture={handleCameraCapture}
        onClose={() => setCameraOpen(false)}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  // Render processing step
  const renderProcessingStep = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="h-16 w-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Processing Receipt</h3>
          <p className="text-muted-foreground">{processingStatus.message}</p>
        </div>
      </div>

      <div className="space-y-3">
        <Progress value={processingStatus.progress} className="w-full" />
        <div className="flex items-center justify-center gap-2 text-sm">
          <Badge variant="outline" className="capitalize">
            {processingStatus.step}
          </Badge>
          <span className="text-muted-foreground">
            {processingStatus.progress}% complete
          </span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Uploading image to secure storage</p>
        <p>• Analyzing with Claude Vision OCR</p>
        <p>• Extracting fuel station and volume data</p>
        <p>• Validating dual tank breakdown</p>
      </div>
    </div>
  );

  // Render review step
  const renderReviewStep = () => {
    if (!reviewData || !editedFuelData) return null;

    const { confidence, originalImage } = reviewData;
    const confidenceColor = confidence >= CONFIDENCE_THRESHOLD_HIGH
      ? 'text-green-600'
      : confidence >= CONFIDENCE_THRESHOLD_MEDIUM
      ? 'text-amber-600'
      : 'text-red-600';

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Review Extracted Data</h3>
            <p className="text-sm text-muted-foreground">
              Please verify the information extracted from your receipt
            </p>
          </div>
          <Badge variant="outline" className={cn('text-sm', confidenceColor)}>
            {confidence}% confidence
          </Badge>
        </div>

        {confidence < CONFIDENCE_THRESHOLD_MEDIUM && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Low confidence detected. Please review all fields carefully before saving.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original image preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Original Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              {originalImage && (
                <div className="aspect-[3/4] border rounded-lg overflow-hidden bg-muted">
                  <img
                    src={originalImage}
                    alt="Receipt"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editable form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fuel Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Station Name</Label>
                <Input
                  value={editedFuelData.stationName}
                  onChange={(e) => updateFuelData('stationName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={editedFuelData.date}
                  onChange={(e) => updateFuelData('date', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Total Volume (L)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editedFuelData.combinedTotals.totalVolume}
                    onChange={(e) => updateFuelData('combinedTotals', {
                      ...editedFuelData.combinedTotals,
                      totalVolume: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Cost ({editedFuelData.currency})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editedFuelData.combinedTotals.totalAmount}
                    onChange={(e) => updateFuelData('combinedTotals', {
                      ...editedFuelData.combinedTotals,
                      totalAmount: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>

              {editedFuelData.odometerReading && (
                <div className="space-y-2">
                  <Label>Odometer Reading (km)</Label>
                  <Input
                    type="number"
                    value={editedFuelData.odometerReading}
                    onChange={(e) => updateFuelData('odometerReading', parseFloat(e.target.value) || undefined)}
                  />
                </div>
              )}

              {/* Tank breakdown */}
              {editedFuelData.dualTankEntries.length > 1 && (
                <div className="space-y-3">
                  <Label>Tank Breakdown</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {editedFuelData.dualTankEntries.map((entry, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-muted/50">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="font-medium">
                            {entry.tankNumber ? `Tank ${entry.tankNumber}` : 'Tank'}: {entry.fuelType}
                          </span>
                          <span>{entry.volumeLiters}L</span>
                          <span>${entry.totalAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Render complete step
  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Receipt Processed Successfully!</h3>
          <p className="text-muted-foreground">
            Your fuel data has been added to your vehicle log
          </p>
        </div>
      </div>

      {reviewData && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Station:</span>
                <span className="font-medium">{editedFuelData?.stationName}</span>
              </div>
              <div className="flex justify-between">
                <span>Volume:</span>
                <span className="font-medium">{editedFuelData?.combinedTotals.totalVolume}L</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">${editedFuelData?.combinedTotals.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle:</span>
                <span className="font-medium">
                  {vehicles.find(v => v.id === selectedVehicle)?.name}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Render footer buttons
  const renderFooter = () => {
    if (currentStep === 'processing') return null;

    return (
      <DialogFooter className="flex-row justify-between">
        <div className="flex gap-2">
          {currentStep === 'review' && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep('capture')}
              disabled={isProcessing}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {currentStep !== 'complete' && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}

          {currentStep === 'capture' && (
            <Button
              onClick={processReceipt}
              disabled={uploadedFiles.length === 0 || !selectedVehicle || isProcessing}
            >
              <FileText className="h-4 w-4 mr-2" />
              Process Receipt
            </Button>
          )}

          {currentStep === 'review' && (
            <Button
              onClick={handleReviewSave}
              disabled={isProcessing}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Fuel Data
            </Button>
          )}

          {currentStep === 'complete' && (
            <Button
              onClick={() => onOpenChange(false)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Done
            </Button>
          )}
        </div>
      </DialogFooter>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Upload Fuel Receipt
          </DialogTitle>
          <DialogDescription>
            Process your fuel receipt automatically with OCR technology
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-1">
            {currentStep === 'capture' && renderCaptureStep()}
            {currentStep === 'processing' && renderProcessingStep()}
            {currentStep === 'review' && renderReviewStep()}
            {currentStep === 'complete' && renderCompleteStep()}
          </div>
        </ScrollArea>

        {renderFooter()}
      </DialogContent>
    </Dialog>
  );
};