
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Switch } from '@/components/ui/switch';
import { PhotoUpload } from '@/components/shared/PhotoUpload';

interface ProfileTabProps {
  user: any;
  emailVerified: boolean;
  fullName: string;
  setFullName: (value: string) => void;
  displayName: string;
  setDisplayName: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  isUpdatingProfile: boolean;
  setIsUpdatingProfile: (value: boolean) => void;
  handleProfileUpdate: (e: React.FormEvent) => Promise<void>;
  avatarUrl?: string;
  setAvatarUrl?: (url: string) => void;
  vehiclePhotoUrl?: string;
  setVehiclePhotoUrl?: (url: string) => void;
  useVehiclePhotoAsProfile: boolean;
  setUseVehiclePhotoAsProfile: (value: boolean) => void;
}

export const ProfileTab = ({
  user,
  emailVerified,
  fullName,
  setFullName,
  displayName,
  setDisplayName,
  location,
  setLocation,
  isUpdatingProfile,
  setIsUpdatingProfile,
  handleProfileUpdate,
  avatarUrl,
  setAvatarUrl,
  vehiclePhotoUrl,
  setVehiclePhotoUrl,
  useVehiclePhotoAsProfile,
  setUseVehiclePhotoAsProfile
}: ProfileTabProps) => {
  const navigate = useNavigate();
  
  // Calculate if the toggle should be disabled
  const isToggleDisabled = !vehiclePhotoUrl || vehiclePhotoUrl.trim() === '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="email" 
                value={user?.email || ''} 
                disabled 
                className="flex-1"
              />
              {emailVerified ? (
                <div className="flex items-center text-sm text-green-600 gap-1 whitespace-nowrap">
                  <Check className="h-4 w-4" />
                  Verified
                </div>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/marketplace/verify-email')}
                >
                  Verify Email
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left column - Profile info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            
            {/* Right column - Photos */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Profile Photo</h3>
                <PhotoUpload
                  initialImageUrl={avatarUrl}
                  onImageUploaded={(url) => setAvatarUrl && setAvatarUrl(url)}
                  type="profile"
                  size="md"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Vehicle Photo</h3>
                <PhotoUpload
                  initialImageUrl={vehiclePhotoUrl}
                  onImageUploaded={(url) => setVehiclePhotoUrl && setVehiclePhotoUrl(url)}
                  type="vehicle"
                  size="md"
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-vehicle-photo"
                    checked={useVehiclePhotoAsProfile}
                    onCheckedChange={setUseVehiclePhotoAsProfile}
                    disabled={isToggleDisabled}
                  />
                  <Label 
                    htmlFor="use-vehicle-photo"
                    className={isToggleDisabled ? "text-muted-foreground" : ""}
                  >
                    Use vehicle photo as profile picture
                  </Label>
                </div>
                {isToggleDisabled && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a vehicle photo first to enable this option
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isUpdatingProfile}
            className="mt-4"
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
