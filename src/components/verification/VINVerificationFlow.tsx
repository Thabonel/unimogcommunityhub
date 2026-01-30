import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Note: Select component available if needed for future enhancements
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/hooks/use-auth';

interface VINVerificationFlowProps {
  onVerificationSubmitted?: () => void;
  existingVerification?: any;
}

type DocumentType = 'registration' | 'title' | 'insurance' | 'photo';
type VerificationStep = 'document_type' | 'upload' | 'details' | 'processing' | 'complete';

interface VerificationData {
  documentType: DocumentType;
  file: File | null;
  vinNumber: string;
  vehicleYear: number | '';
  vehicleModel: string;
  vehicleLocation: string;
  vehicleStory: string;
}

export default function VINVerificationFlow({
  onVerificationSubmitted,
  existingVerification
}: VINVerificationFlowProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<VerificationStep>('document_type');
  const [isLoading, setIsLoading] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [data, setData] = useState<VerificationData>({
    documentType: 'registration',
    file: null,
    vinNumber: '',
    vehicleYear: '',
    vehicleModel: '',
    vehicleLocation: '',
    vehicleStory: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<{
    extractedVin?: string;
    confidence?: number;
    autoApproved?: boolean;
  } | null>(null);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setData(prev => ({ ...prev, file }));
    setCurrentStep('details');
  };

  const processDocumentOCR = async (uploadedFileUrl: string) => {
    setOcrProcessing(true);
    try {
      const { data: ocrResponse, error } = await supabase.functions.invoke('process-vin-verification', {
        body: {
          documentUrl: uploadedFileUrl,
          documentType: data.documentType
        }
      });

      if (error) throw error;

      setOcrResult({
        extractedVin: ocrResponse.extractedVin,
        confidence: ocrResponse.confidence,
        autoApproved: ocrResponse.autoApproved
      });

      // If VIN was extracted with high confidence, auto-fill the form
      if (ocrResponse.extractedVin && ocrResponse.confidence > 70) {
        setData(prev => ({ ...prev, vinNumber: ocrResponse.extractedVin }));
      }

      return ocrResponse;
    } catch (error) {
      console.error('OCR processing failed:', error);
      toast({
        title: "OCR Processing Failed",
        description: "We couldn't automatically read your document. Please enter details manually.",
        variant: "destructive"
      });
      return null;
    } finally {
      setOcrProcessing(false);
    }
  };

  const uploadFile = async () => {
    if (!data.file || !user) return null;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const fileExt = data.file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from('verifications')
        .upload(fileName, data.file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('verifications')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload your document. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const submitVerification = async () => {
    if (!user) return;

    setIsLoading(true);
    setCurrentStep('processing');

    try {
      // Upload file first
      const uploadedFileUrl = await uploadFile();
      if (!uploadedFileUrl) return;

      // Process OCR if enabled
      const ocrData = await processDocumentOCR(uploadedFileUrl);

      // Create verification record
      const verificationData = {
        user_id: user.id,
        photo_url: uploadedFileUrl,
        status: 'pending',
        verification_type: 'document_ocr',
        document_type: data.documentType,
        vin_number: data.vinNumber,
        vehicle_year: data.vehicleYear || null,
        vehicle_model: data.vehicleModel,
        vehicle_location: data.vehicleLocation,
        vehicle_story: data.vehicleStory,
        ocr_processed: !!ocrData,
        ocr_data: ocrData || null,
        confidence_score: ocrData?.confidence || null,
        auto_approved: ocrData?.autoApproved || false,
        privacy_acknowledged: true
      };

      const { error: insertError } = await supabase
        .from('verifications')
        .insert(verificationData);

      if (insertError) throw insertError;

      setCurrentStep('complete');

      toast({
        title: ocrData?.autoApproved ? "Verification Approved!" : "Verification Submitted!",
        description: ocrData?.autoApproved
          ? "Your Unimog ownership has been automatically verified. You now have free access!"
          : "Your verification has been submitted for review. We'll notify you when it's processed."
      });

      onVerificationSubmitted?.();

    } catch (error) {
      console.error('Verification submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive"
      });
      setCurrentStep('details');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDocumentTypeStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-military-green" />
          Choose Document Type
        </CardTitle>
        <CardDescription>
          What type of document will you upload to verify your Unimog ownership?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: 'registration', label: 'Vehicle Registration', description: 'Official registration document' },
            { value: 'title', label: 'Vehicle Title/Deed', description: 'Ownership certificate or title deed' },
            { value: 'insurance', label: 'Insurance Document', description: 'Current insurance policy showing your Unimog' },
            { value: 'photo', label: 'Vehicle Photo', description: 'Clear photo showing VIN plate or dashboard' }
          ].map((docType) => (
            <Card
              key={docType.value}
              className={`cursor-pointer border-2 transition-colors ${
                data.documentType === docType.value
                  ? 'border-military-green bg-military-green/5'
                  : 'border-gray-200 hover:border-military-green/50'
              }`}
              onClick={() => {
                setData(prev => ({ ...prev, documentType: docType.value as DocumentType }));
                setCurrentStep('upload');
              }}
            >
              <CardContent className="p-4">
                <h3 className="font-medium">{docType.label}</h3>
                <p className="text-sm text-gray-600">{docType.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Your Privacy is Protected:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Documents stored in encrypted, private storage</li>
              <li>Only you and admins can view your documents</li>
              <li>Documents auto-deleted after verification approval</li>
              <li>VIN extracted locally, never shared externally</li>
              <li>No data sold or shared with third parties</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const renderUploadStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-military-green" />
          Upload Document
        </CardTitle>
        <CardDescription>
          Upload a clear photo of your {data.documentType === 'registration' ? 'vehicle registration' :
          data.documentType === 'title' ? 'vehicle title' :
          data.documentType === 'insurance' ? 'insurance document' : 'Unimog with VIN visible'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-military-green transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {data.file ? (
            <div className="space-y-2">
              <Check className="h-8 w-8 text-military-green mx-auto" />
              <p className="text-sm font-medium">{data.file.name}</p>
              <p className="text-xs text-gray-500">{(data.file.size / 1024 / 1024).toFixed(1)} MB</p>
              <Button variant="outline" size="sm" onClick={(e) => {
                e.stopPropagation();
                setData(prev => ({ ...prev, file: null }));
              }}>
                Choose Different File
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-sm font-medium">Click to upload document</p>
              <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {data.file && (
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentStep('document_type')}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep('details')}
              className="flex-1 bg-military-green hover:bg-military-green/90"
            >
              Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderDetailsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5 text-military-green" />
          Vehicle Details
        </CardTitle>
        <CardDescription>
          Please provide details about your Unimog. Some fields may be auto-filled from document processing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ocrResult && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {ocrResult.extractedVin ? (
                <>OCR detected VIN: <strong>{ocrResult.extractedVin}</strong> (Confidence: {ocrResult.confidence}%)</>
              ) : (
                'OCR processing complete. Please verify details below.'
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vin">VIN Number *</Label>
            <Input
              id="vin"
              value={data.vinNumber}
              onChange={(e) => setData(prev => ({ ...prev, vinNumber: e.target.value.toUpperCase() }))}
              placeholder="17-character VIN"
              maxLength={17}
              className="font-mono"
            />
            {data.vinNumber && data.vinNumber.length !== 17 && (
              <p className="text-xs text-amber-600 mt-1">VIN should be 17 characters</p>
            )}
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={data.vehicleYear}
              onChange={(e) => setData(prev => ({ ...prev, vehicleYear: parseInt(e.target.value) || '' }))}
              placeholder="e.g., 2010"
              min="1970"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="model">Unimog Model *</Label>
          <Input
            id="model"
            value={data.vehicleModel}
            onChange={(e) => setData(prev => ({ ...prev, vehicleModel: e.target.value }))}
            placeholder="e.g., U1700L, U4000, U5000"
          />
        </div>

        <div>
          <Label htmlFor="location">Current Location</Label>
          <Input
            id="location"
            value={data.vehicleLocation}
            onChange={(e) => setData(prev => ({ ...prev, vehicleLocation: e.target.value }))}
            placeholder="City, Country"
          />
        </div>

        <div>
          <Label htmlFor="story">Your Unimog Story (Optional)</Label>
          <Textarea
            id="story"
            value={data.vehicleStory}
            onChange={(e) => setData(prev => ({ ...prev, vehicleStory: e.target.value }))}
            placeholder="Tell us about your Unimog - how you use it, modifications, adventures..."
            rows={3}
          />
        </div>

        {/* Privacy Acknowledgment */}
        <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="privacy-ack"
              checked={privacyAcknowledged}
              onChange={(e) => setPrivacyAcknowledged(e.target.checked)}
              className="mt-1 h-4 w-4 text-military-green border-gray-300 rounded focus:ring-military-green"
            />
            <label htmlFor="privacy-ack" className="text-sm text-gray-700">
              <strong>I understand and agree:</strong>
              <ul className="mt-1 space-y-1 text-gray-600">
                <li>My document is stored securely and encrypted</li>
                <li>Only admins will review it for verification</li>
                <li>My document will be deleted after approval</li>
                <li>My VIN is used only to confirm Unimog ownership</li>
              </ul>
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentStep('upload')}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={submitVerification}
            disabled={!data.vinNumber || !data.vehicleModel || !privacyAcknowledged || isLoading}
            className="flex-1 bg-military-green hover:bg-military-green/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Verification'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderProcessingStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-military-green" />
          Processing Verification
        </CardTitle>
        <CardDescription>
          We're processing your verification...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Check className="h-4 w-4 text-military-green" />
            <span className="text-sm">Document uploaded successfully</span>
          </div>

          {ocrProcessing ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-sm">Processing document with OCR...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-military-green" />
              <span className="text-sm">Document analysis complete</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm">Creating verification record...</span>
          </div>
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-military-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCompleteStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5 text-military-green" />
          {ocrResult?.autoApproved ? 'Verification Approved!' : 'Verification Submitted!'}
        </CardTitle>
        <CardDescription>
          {ocrResult?.autoApproved
            ? 'Your Unimog ownership has been automatically verified!'
            : 'Your verification request has been submitted for review.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ocrResult?.autoApproved ? (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>
              <strong>Congratulations!</strong> You now have free access to all UnimogCommunityHub features as a verified Unimog owner.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Our admin team will review your verification within 24-48 hours. You'll receive an email notification when the review is complete.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Verification Summary:</h4>
          <div className="space-y-1 text-sm">
            <div><strong>VIN:</strong> {data.vinNumber}</div>
            <div><strong>Model:</strong> {data.vehicleModel}</div>
            {data.vehicleYear && <div><strong>Year:</strong> {data.vehicleYear}</div>}
            {data.vehicleLocation && <div><strong>Location:</strong> {data.vehicleLocation}</div>}
            {ocrResult?.confidence && (
              <div><strong>OCR Confidence:</strong> {ocrResult.confidence}%</div>
            )}
          </div>
        </div>

        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-military-green hover:bg-military-green/90"
        >
          Continue to Community Hub
        </Button>
      </CardContent>
    </Card>
  );

  // Show existing verification status if user already has one
  if (existingVerification) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {existingVerification.status === 'approved' && <Check className="h-5 w-5 text-military-green" />}
            {existingVerification.status === 'pending' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
            {existingVerification.status === 'rejected' && <AlertCircle className="h-5 w-5 text-red-500" />}
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={
            existingVerification.status === 'approved' ? 'default' :
            existingVerification.status === 'pending' ? 'secondary' : 'destructive'
          }>
            {existingVerification.status}
          </Badge>

          {existingVerification.status === 'rejected' && (
            <div className="mt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {existingVerification.rejection_reason || 'Your verification was rejected. Please contact support for details.'}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        {(['document_type', 'upload', 'details', 'processing', 'complete'] as VerificationStep[]).map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
              currentStep === step
                ? 'border-military-green bg-military-green text-white'
                : index < (['document_type', 'upload', 'details', 'processing', 'complete'] as VerificationStep[]).indexOf(currentStep)
                  ? 'border-military-green bg-military-green text-white'
                  : 'border-gray-300 text-gray-500'
            }`}>
              {index + 1}
            </div>
            {index < 4 && <div className={`w-12 h-0.5 ${
              index < (['document_type', 'upload', 'details', 'processing', 'complete'] as VerificationStep[]).indexOf(currentStep)
                ? 'bg-military-green' : 'bg-gray-300'
            }`} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      {currentStep === 'document_type' && renderDocumentTypeStep()}
      {currentStep === 'upload' && renderUploadStep()}
      {currentStep === 'details' && renderDetailsStep()}
      {currentStep === 'processing' && renderProcessingStep()}
      {currentStep === 'complete' && renderCompleteStep()}
    </div>
  );
}