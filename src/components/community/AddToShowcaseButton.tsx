import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Globe, Camera, Wrench, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';
import CountrySelector from './CountrySelector';
import { PhotoUpload } from '@/components/shared/PhotoUpload';

interface AddToShowcaseButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

const AddToShowcaseButton = ({ 
  className = '', 
  variant = 'default',
  size = 'default'
}: AddToShowcaseButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: '',
    description: '',
    modifications: '',
    country_code: '',
    country: '',
    region: '',
    city: '',
    is_showcase: true,
    photos: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add your vehicle.',
        variant: 'destructive'
      });
      return;
    }

    // Validation
    if (!formData.name || !formData.model || !formData.year || !formData.country_code) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if user already has a vehicle with this name
      const { data: existingVehicle } = await supabase
        .from('vehicles')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', formData.name)
        .single();

      if (existingVehicle) {
        // Update existing vehicle
        const { error: updateError } = await supabase
          .from('vehicles')
          .update({
            model: formData.model,
            year: formData.year,
            description: formData.description,
            modifications: formData.modifications,
            country_code: formData.country_code,
            country: formData.country,
            region: formData.region,
            city: formData.city,
            is_showcase: true,
            photos: photos,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVehicle.id);

        if (updateError) throw updateError;

        toast({
          title: 'Vehicle updated!',
          description: 'Your vehicle has been added to the showcase.',
        });
      } else {
        // Create new vehicle
        const { data: newVehicle, error: insertError } = await supabase
          .from('vehicles')
          .insert({
            user_id: user.id,
            name: formData.name,
            model: formData.model,
            year: formData.year,
            description: formData.description,
            modifications: formData.modifications,
            country_code: formData.country_code,
            country: formData.country,
            region: formData.region,
            city: formData.city,
            is_showcase: true,
            photos: photos,
            current_odometer: 0,
            odometer_unit: 'km'
          })
          .select()
          .single();

        if (insertError) throw insertError;

        toast({
          title: 'Vehicle added!',
          description: 'Your vehicle is now in the global showcase.',
        });

        // Navigate to the new vehicle page
        if (newVehicle) {
          navigate(`/community/members/${user.id}/vehicle/${newVehicle.id}`);
        }
      }

      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding vehicle to showcase:', error);
      toast({
        title: 'Error',
        description: 'Failed to add vehicle. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      model: '',
      year: '',
      description: '',
      modifications: '',
      country_code: '',
      country: '',
      region: '',
      city: '',
      is_showcase: true,
      photos: []
    });
    setPhotos([]);
  };

  const handlePhotoUpload = async (files: FileList) => {
    if (!user) return;

    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < Math.min(files.length, 10 - photos.length); i++) {
      const file = files[i];
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
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
      >
        <Plus className="w-4 h-4" />
        Add Your Vehicle
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Add Vehicle to Global Showcase
            </DialogTitle>
            <DialogDescription>
              Share your Unimog with the worldwide community. Your vehicle will be visible to enthusiasts from all countries.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Vehicle Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., My Beast, Desert Warrior"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Select
                    value={formData.model}
                    onValueChange={(value) => setFormData({ ...formData, model: value })}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="U1700L">U1700L</SelectItem>
                      <SelectItem value="U1300L">U1300L</SelectItem>
                      <SelectItem value="U2150L">U2150L</SelectItem>
                      <SelectItem value="U4000">U4000</SelectItem>
                      <SelectItem value="U5000">U5000</SelectItem>
                      <SelectItem value="U500">U500</SelectItem>
                      <SelectItem value="404">404</SelectItem>
                      <SelectItem value="406">406</SelectItem>
                      <SelectItem value="416">416</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g., 1987"
                  min="1946"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h3>
              
              <div>
                <Label htmlFor="country">Country *</Label>
                <CountrySelector
                  value={formData.country_code}
                  onChange={(value) => setFormData({ ...formData, country_code: value })}
                  showAll={false}
                  placeholder="Select your country"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region">State/Region</Label>
                  <Input
                    id="region"
                    placeholder="e.g., California, Bavaria"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Los Angeles, Munich"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Photos (Max 10)
              </h3>
              
              <div className="border-2 border-dashed rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                  className="hidden"
                  id="photo-upload"
                  disabled={photos.length >= 10}
                />
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 p-4 rounded"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload photos
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {photos.length}/10 photos uploaded
                  </span>
                </label>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Story & Details</h3>
              
              <div>
                <Label htmlFor="description">Vehicle Story</Label>
                <Textarea
                  id="description"
                  placeholder="Tell the story of your Unimog... Where has it been? What adventures have you had?"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="modifications">
                  <Wrench className="w-4 h-4 inline mr-1" />
                  Modifications
                </Label>
                <Textarea
                  id="modifications"
                  placeholder="List your modifications, upgrades, and customizations..."
                  rows={3}
                  value={formData.modifications}
                  onChange={(e) => setFormData({ ...formData, modifications: e.target.value })}
                />
              </div>
            </div>

            {/* Privacy */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="showcase" className="font-medium">
                  Show in Global Showcase
                </Label>
                <p className="text-xs text-muted-foreground">
                  Your vehicle will be visible to all users worldwide
                </p>
              </div>
              <Switch
                id="showcase"
                checked={formData.is_showcase}
                onCheckedChange={(checked) => setFormData({ ...formData, is_showcase: checked })}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add to Showcase'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddToShowcaseButton;