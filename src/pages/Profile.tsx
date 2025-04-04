
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import ProfileLoading from '@/components/profile/ProfileLoading';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileContent from '@/components/profile/ProfileContent';
import VehicleDetailsDialog from '@/components/profile/VehicleDetailsDialog';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [renderKey, setRenderKey] = useState(Date.now()); // Add a key to force remount
  
  // Reset component on user change to prevent stale state
  useEffect(() => {
    setRenderKey(Date.now());
  }, [user?.id]);
  
  const {
    userData,
    isLoading,
    isEditing,
    isMasterUser,
    handleEditClick,
    handleCancelEdit,
    handleProfileUpdate
  } = useProfile();
  
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
  
  // Display loading state while fetching profile data
  if (isLoading) {
    return <ProfileLoading user={user} />;
  }
  
  // Check if we have essential user data
  const hasUserData = userData && userData.name;
  if (!hasUserData && !isLoading) {
    // Show error message if profile failed to load
    useEffect(() => {
      toast({
        title: "Profile Error",
        description: "Could not load profile data. Please try again.",
        variant: "destructive",
      });
    }, []);
    
    return (
      <Layout isLoggedIn={!!user}>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-unimog-800 dark:text-unimog-200">
            Profile Error
          </h1>
          <p className="text-red-500">Failed to load profile data.</p>
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
            <ProfileSidebar 
              userData={userData}
              isEditing={isEditing}
              onEditClick={handleEditClick}
            />
          </div>
          
          {/* Main profile content */}
          <div className="lg:col-span-3">
            <ProfileContent
              isEditing={isEditing}
              userData={userData}
              handleCancelEdit={handleCancelEdit}
              handleProfileUpdate={handleProfileUpdate}
              isMasterUser={isMasterUser}
            />
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
