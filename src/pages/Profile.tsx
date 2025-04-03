
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ProfileHeader from '@/components/profile/ProfileHeader';
import OverviewTab from '@/components/profile/OverviewTab';
import ActivityTab from '@/components/profile/ActivityTab';
import VehiclesTab from '@/components/profile/VehiclesTab';
import VehicleDetailsDialog from '@/components/profile/VehicleDetailsDialog';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMasterUser, setIsMasterUser] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatarUrl: '',
    unimogModel: '',
    about: '',
    location: '',
    website: '',
    joinDate: '',
    vehiclePhotoUrl: '',
    useVehiclePhotoAsProfile: false
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock vehicle data for the selected Unimog
  const vehicleData = {
    model: 'Unimog U1700L',
    year: '1988',
    engine: 'OM352A 5.7L inline-6 diesel',
    power: '124 hp (92 kW)',
    transmission: 'UG 3/40 - 8 forward, 8 reverse gears',
    weight: '7.5 tonnes',
    modifications: [
      'Upgraded suspension',
      'LED lighting package',
      'Winch installation',
      'Custom storage compartments'
    ],
    maintenanceHistory: [
      { date: '2023-08-15', service: 'Oil change and filter replacement' },
      { date: '2023-05-20', service: 'Brake system overhaul' },
      { date: '2023-01-10', service: 'Tire replacement' }
    ]
  };
  
  // Fetch user profile data from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Check if the user is a master user (email is master@development.com)
        setIsMasterUser(user.email === 'master@development.com');
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (profile) {
          setUserData({
            name: profile.full_name || profile.display_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatarUrl: profile.avatar_url || '',
            unimogModel: profile.unimog_model || '',
            about: profile.bio || '',
            location: profile.location || '',
            website: '', // Add this field to profiles table if needed
            joinDate: new Date(profile.created_at).toISOString().split('T')[0],
            vehiclePhotoUrl: profile.vehicle_photo_url || '',
            useVehiclePhotoAsProfile: profile.use_vehicle_photo_as_profile || false
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, toast]);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleProfileUpdate = async (formData: any) => {
    if (!user) return;
    
    try {
      // If email was changed and user is master, update the email in auth
      if (isMasterUser && formData.email !== userData.email) {
        // Update email in Supabase Auth
        const { error: authError } = await supabase.auth.updateUser({
          email: formData.email
        });
        
        if (authError) throw authError;
        
        toast({
          title: "Email updated",
          description: "You will receive a confirmation email at your new address",
        });
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          bio: formData.about,
          location: formData.location,
          unimog_model: formData.unimogModel,
          avatar_url: formData.avatarUrl,
          vehicle_photo_url: formData.vehiclePhotoUrl,
          use_vehicle_photo_as_profile: formData.useVehiclePhotoAsProfile
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUserData(formData);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <Layout isLoggedIn={!!user}>
        <div className="container flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout isLoggedIn={!!user} user={userData}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-unimog-800 dark:text-unimog-200">
          My Profile
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <ProfileHeader 
                  userData={userData} 
                  isEditing={isEditing} 
                  onEditClick={handleEditClick} 
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Main profile content */}
          <div className="lg:col-span-3">
            {isEditing ? (
              <ProfileEditForm 
                initialData={userData}
                onCancel={handleCancelEdit}
                onSubmit={handleProfileUpdate}
                isMasterUser={isMasterUser}
              />
            ) : (
              <Tabs defaultValue="overview">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
                </TabsList>
                
                {/* Overview tab content */}
                <TabsContent value="overview">
                  <OverviewTab userData={userData} />
                </TabsContent>
                
                {/* Activity tab content */}
                <TabsContent value="activity">
                  <ActivityTab />
                </TabsContent>
                
                {/* Vehicles tab content */}
                <TabsContent value="vehicles">
                  <VehiclesTab userData={userData} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
      
      {/* Vehicle Details Dialog */}
      <VehicleDetailsDialog 
        isOpen={showVehicleDetails} 
        onOpenChange={setShowVehicleDetails}
        userData={userData}
        vehicleData={vehicleData}
      />
    </Layout>
  );
};

export default Profile;
