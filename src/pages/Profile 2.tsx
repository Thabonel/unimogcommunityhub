
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/profile';
import { useStorageCheck } from '@/hooks/use-storage-check';
import ProfileLoading from '@/components/profile/ProfileLoading';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileContent from '@/components/profile/ProfileContent';
import VehicleDetailsDialog from '@/components/profile/VehicleDetailsDialog';
import { useToast } from '@/hooks/toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Database, ServerOff, Trash2 } from 'lucide-react';
import { clearAndReload } from '@/utils/auth-reset';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [renderKey] = useState(() => Date.now());
  const [loadingRetries, setLoadingRetries] = useState(0);
  
  // Check storage service availability
  const { 
    storageStatus,
    isChecking: isCheckingStorage,
    recheckStorage
  } = useStorageCheck();
  
  const {
    userData,
    isLoading,
    isEditing,
    isSaving,
    isMasterUser,
    handleEditClick,
    handleCancelEdit,
    handleProfileUpdate,
    error,
    fetchUserProfile
  } = useProfile();
  
  // Log the profile state for debugging
  useEffect(() => {
    console.log("Profile page state:", {
      isLoading,
      hasUserData: userData?.name ? true : false,
      isMasterUser,
      renderKey,
      error: error ? error : 'No error',
      userAuthenticated: !!user,
      userEmail: user?.email,
      isEditing,
      storageAvailable: storageStatus.isAvailable,
      buckets: storageStatus.buckets
    });
  }, [userData, isLoading, isMasterUser, error, user, renderKey, isEditing, storageStatus]);
  
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
  
  const handleRetry = () => {
    setLoadingRetries(prev => prev + 1);
    fetchUserProfile();
    recheckStorage();
    toast({
      title: "Retrying",
      description: "Attempting to load your profile again",
    });
  };
  
  // Display loading state while fetching profile data
  if (isLoading) {
    return <ProfileLoading user={user} />;
  }
  
  // Show error state if there's an error or no user data
  const hasUserData = userData && userData.name;
  if ((!hasUserData && !isLoading) || error) {
    return (
      <Layout isLoggedIn={!!user}>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-unimog-800 dark:text-unimog-200">
            Profile Error
          </h1>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading profile</AlertTitle>
            <AlertDescription>
              {error || "Failed to load profile data. Please try again later."}
            </AlertDescription>
          </Alert>
          
          {/* Storage status alert */}
          {!storageStatus.isAvailable && (
            <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
              <ServerOff className="h-4 w-4 text-amber-600" />
              <AlertTitle>Storage service issue</AlertTitle>
              <AlertDescription>
                Storage service is currently unavailable. Photo uploads may not work correctly.
                {storageStatus.error && (
                  <p className="text-sm mt-1 text-amber-700">{storageStatus.error}</p>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-4 mt-4">
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Retry Loading Profile
            </Button>
            <Button 
              variant="destructive" 
              onClick={clearAndReload}
              className="flex items-center gap-2"
              title="This will sign you out and clear cached data"
            >
              <Trash2 className="h-4 w-4" /> Clear Cache & Reload
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </div>
          
          {isMasterUser && (
            <div className="mt-8 p-4 border border-amber-300 bg-amber-50 rounded-md">
              <h3 className="font-bold text-amber-800">Master User Debug Info</h3>
              <p className="text-sm text-amber-700">
                Master user detected but profile data could not be loaded. 
                Try refreshing the page or checking the console for errors.
              </p>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify({ 
                  userData, 
                  isMasterUser, 
                  userEmail: user?.email,
                  retryCount: loadingRetries,
                  storageStatus
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Layout>
    );
  }
  
  // Prepare user data for Layout with proper avatar logic
  const layoutUserData = userData ? {
    ...userData,
    // Ensure avatar URL respects vehicle photo preference for header display
    avatarUrl: (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl) 
      ? userData.vehiclePhotoUrl 
      : userData.avatarUrl
  } : undefined;

  return (
    <Layout isLoggedIn={!!user} user={layoutUserData}>
      <div className="bg-[#e4dac7] py-10 mb-6 border-b border-[#625d52]/20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#3a3631] font-serif tracking-wider">
            MY PROFILE
          </h1>
        </div>
      </div>
      
      <div className="container py-6">
        {/* Storage warning if needed */}
        {!storageStatus.isAvailable && (
          <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
            <Database className="h-4 w-4 text-amber-600" />
            <AlertTitle>Storage service issue</AlertTitle>
            <AlertDescription>
              Storage service is currently unavailable. Photo uploads may not work correctly.
              <Button 
                variant="outline" 
                size="sm" 
                onClick={recheckStorage} 
                className="ml-2 bg-amber-100 hover:bg-amber-200 border-amber-300"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Check Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
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
              isSaving={isSaving}
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
