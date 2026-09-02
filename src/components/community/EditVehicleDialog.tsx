import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Loader2, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  purchase_odometer?: number;
  current_odometer?: number;
  odometer_unit?: string;
}

interface EditVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onSuccess?: () => void;
}

type VehicleFormData = Omit<Vehicle, 'id' | 'photos'>;

// Fields the caller did not supply stay undefined so handleSubmit can omit them
// from the update instead of writing a blank over stored data.
const buildFormData = (vehicle: Vehicle): VehicleFormData => ({
  name: vehicle.name || '',
  model: vehicle.model || '',
  year: vehicle.year || '',
  description: vehicle.description,
  modifications: vehicle.modifications,
  country_code: vehicle.country_code,
  country: vehicle.country,
  region: vehicle.region,
  city: vehicle.city,
  is_showcase: vehicle.is_showcase ?? true,
  purchase_odometer: vehicle.purchase_odometer,
  current_odometer: vehicle.current_odometer,
  odometer_unit: vehicle.odometer_unit,
});

export const EditVehicleDialog = ({ isOpen, onClose, vehicle, onSuccess }: EditVehicleDialogProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>(vehicle.photos || []);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [formData, setFormData] = useState<VehicleFormData>(() => buildFormData(vehicle));

  // Update form when vehicle changes
  useEffect(() => {
    setFormData(buildFormData(vehicle));
    setPhotos(vehicle.photos || []);
  }, [vehicle]);

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
      const updates: Record<string, unknown> = {
        ...formData,
        photos: photos,
        updated_at: new Date().toISOString()
      };

      // Drop fields the caller never supplied, so a partial vehicle record
      // cannot blank out stored values the form never showed.
      for (const key of Object.keys(updates)) {
        if (updates[key] === undefined) {
          delete updates[key];
        }
      }

      // Update vehicle
      const { error: updateError } = await supabase
        .from('vehicles')
        .update(updates)
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

  const handleSetPrimaryPhoto = (photoUrl: string) => {
    const newPhotos = [photoUrl, ...photos.filter(p => p !== photoUrl)];
    setPhotos(newPhotos);
    toast({
      title: 'Primary photo changed',
      description: 'This photo will be shown as the main image.',
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
                      className={`w-full h-32 object-cover rounded-lg ${index === 0 ? 'ring-2 ring-military-green' : ''}`}
                    />
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryPhoto(photo)}
                          className="p-1 bg-military-green text-white rounded-full"
                          title="Set as primary"
                        >
                          <Star size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo)}
                        className="p-1 bg-red-500 text-white rounded-full"
                        title="Remove photo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-military-green text-white text-xs rounded flex items-center gap-1">
                        <Star size={12} className="fill-white" />
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

          {/* Odometer Readings */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase_odometer">Purchase Reading</Label>
                <Input
                  id="purchase_odometer"
                  type="number"
                  min="0"
                  value={formData.purchase_odometer ?? ''}
                  onChange={(e) => setFormData({ ...formData, purchase_odometer: e.target.value === '' ? undefined : Number(e.target.value) })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Odometer when purchased</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_odometer">Current Reading</Label>
                <Input
                  id="current_odometer"
                  type="number"
                  min="0"
                  value={formData.current_odometer ?? ''}
                  onChange={(e) => setFormData({ ...formData, current_odometer: e.target.value === '' ? undefined : Number(e.target.value) })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Auto-updates from logs</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="odometer_unit">Unit</Label>
                <select
                  id="odometer_unit"
                  value={formData.odometer_unit ?? 'km'}
                  onChange={(e) => setFormData({ ...formData, odometer_unit: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="km">Kilometers</option>
                  <option value="mi">Miles</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description ?? ''}
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
              value={formData.modifications ?? ''}
              onChange={(e) => setFormData({ ...formData, modifications: e.target.value })}
              placeholder="List any modifications or upgrades..."
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label>Location</Label>
            <CountrySelector
              value={formData.country_code ?? ''}
              onChange={(value) => setFormData({ ...formData, country_code: value })}
              showAll={false}
              placeholder="Select your country"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Region/State"
                value={formData.region ?? ''}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
              <Input
                placeholder="City"
                value={formData.city ?? ''}
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