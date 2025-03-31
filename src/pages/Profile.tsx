
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ProfileHeader from '@/components/profile/ProfileHeader';
import OverviewTab from '@/components/profile/OverviewTab';
import ActivityTab from '@/components/profile/ActivityTab';
import VehiclesTab from '@/components/profile/VehiclesTab';
import VehicleDetailsDialog from '@/components/profile/VehicleDetailsDialog';

const Profile = () => {
  const { toast } = useToast();
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  
  // Mock user data - in a real app this would come from authentication/context
  const initialUserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L',
    about: 'Unimog enthusiast since 2015. I use my vehicle for both work and adventure travel. Currently exploring modifications for improved off-road capability.',
    location: 'Munich, Germany',
    website: 'www.myunimogadventures.com',
    joinDate: '2023-05-10',
  };
  
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
  
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleProfileUpdate = (formData: any) => {
    // Save the updated user data
    setUserData(formData);
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };
  
  return (
    <Layout isLoggedIn={true} user={userData}>
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
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
              </TabsList>
              
              {/* Overview tab content */}
              <TabsContent value="overview">
                <OverviewTab 
                  userData={userData} 
                  isEditing={isEditing} 
                  setIsEditing={setIsEditing} 
                  onProfileUpdate={handleProfileUpdate} 
                />
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
