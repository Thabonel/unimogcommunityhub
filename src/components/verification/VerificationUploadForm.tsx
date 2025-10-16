import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';

interface VerificationStatus {
  status: 'none' | 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  approved_at?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_location?: string;
  vehicle_story?: string;
  photo_url?: string;
}

export function VerificationUploadForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({ status: 'none' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleLocation, setVehicleLocation] = useState('');
  const [vehicleStory, setVehicleStory] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Load existing verification status
  useState(() => {
    loadVerificationStatus();
  });

  async function loadVerificationStatus() {
    if (!user) return;

    const { data, error } = await supabase
      .from('verifications')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading verification:', error);
      return;
    }

    if (data) {
      setVerificationStatus({
        status: data.status,
        rejection_reason: data.rejection_reason,
        approved_at: data.approved_at,
        vehicle_model: data.vehicle_model,
        vehicle_year: data.vehicle_year,
        vehicle_location: data.vehicle_location,
        vehicle_story: data.vehicle_story,
        photo_url: data.photo_url,
      });

      // Pre-fill form if status is rejected (allow resubmit)
      if (data.status === 'rejected') {
        setVehicleModel(data.vehicle_model || '');
        setVehicleYear(data.vehicle_year?.toString() || '');
        setVehicleLocation(data.vehicle_location || '');
        setVehicleStory(data.vehicle_story || '');
      }
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }

  function handleFile(file: File) {
    // Validate file type
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG or PNG image',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image under 10MB',
        variant: 'destructive',
      });
      return;
    }

    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !photoFile) return;

    setLoading(true);

    try {
      // Upload photo to storage
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('verifications')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('verifications')
        .getPublicUrl(filePath);

      // Create or update verification record
      const verificationData = {
        user_id: user.id,
        photo_url: publicUrl,
        vehicle_model: vehicleModel,
        vehicle_year: vehicleYear ? parseInt(vehicleYear) : null,
        vehicle_location: vehicleLocation,
        vehicle_story: vehicleStory,
        status: 'pending',
        rejection_reason: null,
        admin_reviewed_by: null,
        approved_at: null,
      };

      const { error: dbError } = await supabase
        .from('verifications')
        .upsert(verificationData, { onConflict: 'user_id' });

      if (dbError) throw dbError;

      toast({
        title: 'Verification submitted!',
        description: "We'll review your submission within 48 hours.",
      });

      // Reload status
      await loadVerificationStatus();
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: 'Submission failed',
        description: 'There was an error submitting your verification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  // Show current status if already submitted
  if (verificationStatus.status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Verification Pending
          </CardTitle>
          <CardDescription>
            We'll review your submission within 48 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Vehicle: {verificationStatus.vehicle_model}</p>
              {verificationStatus.vehicle_year && (
                <p className="text-sm text-muted-foreground">Year: {verificationStatus.vehicle_year}</p>
              )}
            </div>
            {verificationStatus.photo_url && (
              <img
                src={verificationStatus.photo_url}
                alt="Verification photo"
                className="w-full max-w-md rounded-lg border"
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus.status === 'approved') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Verified Owner
          </CardTitle>
          <CardDescription>
            Approved on {verificationStatus.approved_at && format(new Date(verificationStatus.approved_at), 'MMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            <span className="font-semibold">You're a verified Unimog owner!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rejection reason if rejected */}
      {verificationStatus.status === 'rejected' && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Verification rejected:</strong> {verificationStatus.rejection_reason}
            <p className="mt-2">You can update your information and resubmit below.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Photo Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>1. Photo Upload</CardTitle>
          <CardDescription>
            Take a photo of your Unimog with a handwritten note showing your username and today's date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {photoPreview ? (
              <div className="space-y-4">
                <img src={photoPreview} alt="Preview" className="max-w-md mx-auto rounded-lg" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                >
                  Change Photo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Drag and drop your photo here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileInput}
                  className="hidden"
                  id="photo-upload"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground">JPEG or PNG, max 10MB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>2. Vehicle Details</CardTitle>
          <CardDescription>Tell us about your Unimog</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="vehicle-model">Vehicle Model *</Label>
            <Select value={vehicleModel} onValueChange={setVehicleModel} required>
              <SelectTrigger id="vehicle-model">
                <SelectValue placeholder="Select your Unimog model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="U1700L">U1700L</SelectItem>
                <SelectItem value="U435">U435</SelectItem>
                <SelectItem value="U4000">U4000</SelectItem>
                <SelectItem value="U5000">U5000</SelectItem>
                <SelectItem value="U6000">U6000</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vehicle-year">Vehicle Year (optional)</Label>
            <Input
              id="vehicle-year"
              type="number"
              min="1900"
              max="2100"
              value={vehicleYear}
              onChange={(e) => setVehicleYear(e.target.value)}
              placeholder="e.g., 1985"
            />
          </div>

          <div>
            <Label htmlFor="vehicle-location">Vehicle Location (optional)</Label>
            <Input
              id="vehicle-location"
              value={vehicleLocation}
              onChange={(e) => setVehicleLocation(e.target.value)}
              placeholder="e.g., Sydney, Australia"
            />
          </div>

          <div>
            <Label htmlFor="vehicle-story">Your Unimog Story (optional, max 500 characters)</Label>
            <Textarea
              id="vehicle-story"
              value={vehicleStory}
              onChange={(e) => setVehicleStory(e.target.value.slice(0, 500))}
              placeholder="Tell us about your truck..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">{vehicleStory.length}/500</p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button type="submit" disabled={!photoFile || !vehicleModel || loading} className="w-full">
        {loading ? 'Submitting...' : verificationStatus.status === 'rejected' ? 'Re-submit Verification' : 'Submit for Verification'}
      </Button>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your submission will be reviewed by our team within 48 hours. You'll receive a notification once it's been reviewed.
        </AlertDescription>
      </Alert>
    </form>
  );
}
