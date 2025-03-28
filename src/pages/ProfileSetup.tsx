
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

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
  
  // Personal details
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('beginner');
  
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
    
    // This is a mock submission for demonstration
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Profile setup complete",
        description: "Welcome to the Unimog Community Hub!",
      });
      
      navigate('/dashboard');
    }, 1500);
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
                  <div className="space-y-2">
                    <Label htmlFor="model">Unimog Model *</Label>
                    <Select value={model} onValueChange={setModel} required>
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="u404">U404 (S 404)</SelectItem>
                        <SelectItem value="u406">U406</SelectItem>
                        <SelectItem value="u417">U417</SelectItem>
                        <SelectItem value="u435">U435</SelectItem>
                        <SelectItem value="u437">U437</SelectItem>
                        <SelectItem value="u1300">U1300</SelectItem>
                        <SelectItem value="u1550">U1550</SelectItem>
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
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="" alt="Profile" />
                        <AvatarFallback className="bg-primary text-xl">
                          {displayName ? displayName.substring(0, 2).toUpperCase() : "UC"}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-background shadow-sm">
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Upload profile picture</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Click the camera icon to upload a profile picture
                    </p>
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
