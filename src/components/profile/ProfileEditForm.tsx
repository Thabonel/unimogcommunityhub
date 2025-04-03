
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Info } from 'lucide-react';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditFormProps {
  initialData: {
    name: string;
    email: string;
    unimogModel: string;
    about: string;
    location: string;
    avatarUrl: string;
    website?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
  };
  onCancel: () => void;
  onSubmit: (formData: any) => void;
  isMasterUser?: boolean;
}

const ProfileEditForm = ({ initialData, onCancel, onSubmit, isMasterUser = false }: ProfileEditFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAvatarChange = (url: string) => {
    setFormData({
      ...formData,
      avatarUrl: url
    });
  };
  
  const handleVehiclePhotoChange = (url: string) => {
    setFormData({
      ...formData,
      vehiclePhotoUrl: url
    });
  };
  
  const handleUseVehiclePhotoToggle = (checked: boolean) => {
    setFormData({
      ...formData,
      useVehiclePhotoAsProfile: checked
    });
  };
  
  const handleRequestEmailChange = () => {
    toast({
      title: "Email change request",
      description: "For security reasons, please contact support to change your email address.",
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left column - Profile info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    disabled={!isMasterUser}
                    className="pr-10"
                  />
                  {!isMasterUser && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2" 
                      onClick={handleRequestEmailChange}
                      title="Request email change"
                    >
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
                {!isMasterUser && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" /> 
                    For security, please contact support to change your email address
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unimogModel">Unimog Model</Label>
                <Input 
                  id="unimogModel" 
                  name="unimogModel" 
                  value={formData.unimogModel} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  name="website" 
                  value={formData.website} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            
            {/* Right column - Photos and about */}
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Profile Photo</Label>
                <PhotoUpload
                  initialImageUrl={formData.avatarUrl}
                  onImageUploaded={handleAvatarChange}
                  type="profile"
                  size="lg"
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Vehicle Photo</Label>
                <PhotoUpload
                  initialImageUrl={formData.vehiclePhotoUrl}
                  onImageUploaded={handleVehiclePhotoChange}
                  type="vehicle"
                  size="lg"
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-vehicle-photo"
                    checked={formData.useVehiclePhotoAsProfile}
                    onCheckedChange={handleUseVehiclePhotoToggle}
                  />
                  <Label htmlFor="use-vehicle-photo">Use vehicle photo as profile picture</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea 
                  id="about" 
                  name="about" 
                  rows={4} 
                  value={formData.about} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
