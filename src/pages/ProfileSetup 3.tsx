import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { supabase } from '@/lib/supabase-client';
import { Loader2, Truck, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const ProfileSetup = () => {
  const [activeTab, setActiveTab] = useState('vehicle');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Vehicle details
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [tireSize, setTireSize] = useState('');
  const [camperSize, setCamperSize] = useState('');
  const [vehicleHeight, setVehicleHeight] = useState('');
  const [vehicleWidth, setVehicleWidth] = useState('');
  const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState('');
  
  // Personal details
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('beginner');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [useVehiclePhotoAsProfile, setUseVehiclePhotoAsProfile] = useState(false);
  
  const handleNext = () => {
    if (activeTab === 'vehicle') {
      setActiveTab('personal');
    }
  };
  
  const handlePrevious = () => {
    if (activeTab === 'personal') {
      setActiveTab('vehicle');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Prepare profile data
      const profileData = {
        id: user.id,
        email: user.email,
        display_name: displayName,
        full_name: displayName, // Using display name as full name for now
        bio: bio,
        location: location,
        unimog_model: model,
        vehicle_photo: vehiclePhoto,
        avatar_url: useVehiclePhotoAsProfile ? vehiclePhoto : avatarUrl,
        metadata: {
          vehicle_year: year,
          tire_size: tireSize,
          camper_size: camperSize,
          vehicle_height: vehicleHeight,
          vehicle_width: vehicleWidth,
          experience_level: experienceLevel,
          interests,
          setup_completed: true
        },
        updated_at: new Date().toISOString()
      };
      
      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });
        
      if (profileError) {
        throw profileError;
      }
      
      // If user has a vehicle photo, also create a vehicle record
      if (vehiclePhoto) {
        const vehicleData = {
          id: `${user.id}_${Date.now()}`,
          user_id: user.id,
          make: 'Mercedes-Benz',
          model: `Unimog ${model}`,
          year: parseInt(year),
          vin: '', // Optional
          license_plate: '', // Optional
          photo: vehiclePhoto,
          created_at: new Date().toISOString()
        };
        
        const { error: vehicleError } = await supabase
          .from('vehicles')
          .insert(vehicleData);
          
        if (vehicleError) {
          console.error('Error creating vehicle record:', vehicleError);
          // Don't throw, this is optional
        }
      }
      
      toast({
        title: "Profile setup complete",
        description: "Welcome to the Unimog Community Hub!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast({
        title: "Setup failed",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-12">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
            <CardDescription className="text-center">
              Tell us about your Unimog and yourself to help you connect with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="vehicle">Vehicle Details</TabsTrigger>
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vehicle">
                <form className="space-y-4">
                  <div className="space-y-6">
                    <div className="flex justify-center mb-4">
                      <PhotoUpload
                        initialImageUrl={vehiclePhotoUrl}
                        onImageUploaded={setVehiclePhotoUrl}
                        type="vehicle"
                        size="lg"
                      />
                    </div>
                    <p className="text-center text-sm text-muted-foreground mb-4">
                      Upload a photo of your Unimog
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Unimog Model *</Label>
                    <Select value={model} onValueChange={setModel} required>
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="max-h-[300px] overflow-y-auto">
                        <SelectItem value="u404">U404 (S 404)</SelectItem>
                        <SelectItem value="u406">U406</SelectItem>
                        <SelectItem value="u417">U417</SelectItem>
                        <SelectItem value="u435">U435</SelectItem>
                        <SelectItem value="u437">U437</SelectItem>
                        <SelectItem value="u1300">U1300</SelectItem>
                        <SelectItem value="u1550">U1550</SelectItem>
                        <SelectItem value="u1700l">U1700L</SelectItem>
                        <SelectItem value="u2450">U2450</SelectItem>
                        <SelectItem value="u4000">U4000</SelectItem>
                        <SelectItem value="u5000">U5000</SelectItem>
                        <SelectItem value="other">Other (specify in bio)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input 
                      id="year" 
                      type="text" 
                      placeholder="e.g. 1985" 
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tireSize">Tire Size *</Label>
                    <Input 
                      id="tireSize" 
                      type="text" 
                      placeholder="e.g. 335/80 R20" 
                      value={tireSize}
                      onChange={(e) => setTireSize(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This helps determine if your vehicle can navigate certain trails
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="camperSize">Camper/Body Size</Label>
                    <Input 
                      id="camperSize" 
                      type="text" 
                      placeholder="e.g. 4.5m x 2.3m" 
                      value={camperSize}
                      onChange={(e) => setCamperSize(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter dimensions if you have a camper or special build
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleHeight">Vehicle Height (m) *</Label>
                      <Input 
                        id="vehicleHeight" 
                        type="text" 
                        placeholder="e.g. 3.2" 
                        value={vehicleHeight}
                        onChange={(e) => setVehicleHeight(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleWidth">Vehicle Width (m) *</Label>
                      <Input 
                        id="vehicleWidth" 
                        type="text" 
                        placeholder="e.g. 2.3" 
                        value={vehicleWidth}
                        onChange={(e) => setVehicleWidth(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full" 
                    onClick={handleNext}
                    disabled={!model || !year || !tireSize || !vehicleHeight || !vehicleWidth}
                  >
                    Next: Personal Details
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="personal">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col items-center justify-center mb-6">
                    <PhotoUpload
                      initialImageUrl={avatarUrl}
                      onImageUploaded={setAvatarUrl}
                      type="profile"
                      size="lg"
                    />
                    <div className="mt-4 flex items-center space-x-2">
                      <Switch
                        id="use-vehicle-photo"
                        checked={useVehiclePhotoAsProfile}
                        onCheckedChange={setUseVehiclePhotoAsProfile}
                      />
                      <Label htmlFor="use-vehicle-photo">Use vehicle photo as profile picture</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input 
                      id="displayName" 
                      type="text" 
                      placeholder="How you'll appear in the community" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      type="text" 
                      placeholder="e.g. Berlin, Germany" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio" 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                      placeholder="Tell the community about yourself and your Unimog adventures..." 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Off-road Experience</Label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handlePrevious}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading || !displayName}
                    >
                      {isLoading ? "Completing setup..." : "Complete Setup"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-center text-sm text-muted-foreground">
              {activeTab === 'vehicle' ? "1 of 2" : "2 of 2"}
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfileSetup;
