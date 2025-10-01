import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';
import CountrySelector from './CountrySelector';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: string;
  description?: string;
  modifications?: string;
  country_code?: string;
  country?: string;
  region?: string;
  city?: string;
  is_showcase: boolean;
  photos: string[];
}

interface EditVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onSuccess?: () => void;
}

export const EditVehicleDialog = ({ isOpen, onClose, vehicle, onSuccess }: EditVehicleDialogProps) => {
  const { user } = useAuth();
  const { userData } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>(vehicle.photos || []);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: vehicle.name || '',
    model: vehicle.model || '',
    year: vehicle.year || '',
    description: vehicle.description || '',
    modifications: vehicle.modifications || '',
    country_code: vehicle.country_code || '',
    country: vehicle.country || '',
    region: vehicle.region || '',
    city: vehicle.city || '',
    is_showcase: vehicle.is_showcase ?? true,
  });

  // Update form when vehicle changes, and auto-fill location from profile if vehicle has no location
  useEffect(() => {
    const hasVehicleLocation = vehicle.country_code || vehicle.city || vehicle.country;

    // If vehicle has no location data, use profile location
    const locationData = hasVehicleLocation ? {
      country_code: vehicle.country_code || '',
      country: vehicle.country || '',
      region: vehicle.region || '',
      city: vehicle.city || '',
    } : {
      // Auto-fill from profile
      country_code: userData?.country || '',
      country: '', // Will be populated by CountrySelector
      region: '', // Profile doesn't have region
      city: userData?.city || '',
    };

    setFormData({
      name: vehicle.name || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      description: vehicle.description || '',
      modifications: vehicle.modifications || '',
      ...locationData,
      is_showcase: vehicle.is_showcase ?? true,
    });
    setPhotos(vehicle.photos || []);
  }, [vehicle, userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to update your vehicle.',
        variant: 'destructive'
      });
      return;
    }

    // Validation
    if (!formData.name || !formData.model || !formData.year) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update vehicle
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({
          name: formData.name,
          model: formData.model,
          year: formData.year,
          description: formData.description,
          modifications: formData.modifications,
          country_code: formData.country_code,
          country: formData.country,
          region: formData.region,
          city: formData.city,
          is_showcase: formData.is_showcase,
          photos: photos,
          updated_at: new Date().toISOString()
        })
        .eq('id', vehicle.id);

      if (updateError) throw updateError;

      toast({
        title: 'Vehicle updated!',
        description: 'Your changes have been saved.',
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vehicle. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Unified upload function that works for both file input and drag-and-drop
  const uploadFiles = async (files: FileList | File[]) => {
    if (!user) return;

    const fileArray = Array.from(files);

    if (photos.length + fileArray.length > 10) {
      toast({
        title: 'Photo limit reached',
        description: 'You can upload a maximum of 10 photos per vehicle.',
        variant: 'destructive'
      });
      return;
    }

    setUploadingPhotos(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not an image file.`,
          variant: 'destructive'
        });
        continue;
      }

      const fileName = `${user.id}/${Date.now()}_${file.name}`;

      try {
        const { data, error } = await supabase.storage
          .from('vehicle_photos')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('vehicle_photos')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading photo:', error);
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive'
        });
      }
    }

    setPhotos([...photos, ...uploadedUrls]);
    setUploadingPhotos(false);

    if (uploadedUrls.length > 0) {
      toast({
        title: 'Photos uploaded',
        description: `${uploadedUrls.length} photo(s) added successfully.`,
      });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    await uploadFiles(files);

    // Reset input
    e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleRemovePhoto = (photoUrl: string) => {
    setPhotos(photos.filter(p => p !== photoUrl));
    toast({
      title: 'Photo removed',
      description: 'Photo will be deleted when you save changes.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Update your vehicle details and manage photos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos Section */}
          <div className="space-y-3">
            <Label>Photos ({photos.length}/10)</Label>

            {/* Photo Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button with Drag & Drop */}
            {photos.length < 10 && (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging
                    ? 'border-military-green bg-military-green/10'
                    : 'border-gray-300 bg-white'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhotos}
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {uploadingPhotos ? (
                    <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-2" />
                  ) : (
                    <Upload className={`w-10 h-10 mb-2 ${isDragging ? 'text-military-green' : 'text-gray-400'}`} />
                  )}
                  <span className={`text-sm font-medium ${isDragging ? 'text-military-green' : 'text-gray-600'}`}>
                    {uploadingPhotos
                      ? 'Uploading...'
                      : isDragging
                      ? 'Drop photos here'
                      : 'Click to upload or drag & drop photos'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {10 - photos.length} slots remaining
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Thabo's Mog"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., U1700L"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="e.g., 1987"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about your Unimog..."
              rows={3}
            />
          </div>

          {/* Modifications */}
          <div className="space-y-2">
            <Label htmlFor="modifications">Modifications</Label>
            <Textarea
              id="modifications"
              value={formData.modifications}
              onChange={(e) => setFormData({ ...formData, modifications: e.target.value })}
              placeholder="List any modifications or upgrades..."
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label>Location</Label>
            <CountrySelector
              value={formData.country_code}
              onChange={(value) => setFormData({ ...formData, country_code: value })}
              showAll={false}
              placeholder="Select your country"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Region/State"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          {/* Showcase Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="showcase">Show in Global Showcase</Label>
              <p className="text-sm text-muted-foreground">
                Make your vehicle visible to the community
              </p>
            </div>
            <Switch
              id="showcase"
              checked={formData.is_showcase}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_showcase: checked })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};