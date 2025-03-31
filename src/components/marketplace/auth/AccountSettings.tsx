
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PaymentInfoNotice } from '@/components/marketplace/auth/PaymentInfoNotice';
import { ProfileTab } from '@/components/marketplace/auth/components/ProfileTab';
import { SecurityTab } from '@/components/marketplace/auth/components/SecurityTab';
import { PaymentTab } from '@/components/marketplace/auth/components/PaymentTab';
import { AddressTab } from '@/components/marketplace/auth/components/AddressTab';
import { TransactionHistory } from '@/components/marketplace/transactions/TransactionHistory';
import { useAccountSettings } from '@/components/marketplace/auth/hooks/useAccountSettings';
import { Skeleton } from '@/components/ui/skeleton';

export const AccountSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    fullName,
    setFullName,
    displayName,
    setDisplayName,
    location: userLocation,
    setLocation,
    isUpdatingProfile,
    setIsUpdatingProfile,
    twoFactorEnabled,
    emailVerified,
    user,
    handleProfileUpdate,
    userProfile,
    isLoadingProfile
  } = useAccountSettings();
  
  // Get tab from URL query parameter or default to 'profile'
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') || 'profile';
  
  // Handle tab switching
  const handleTabChange = (value: string) => {
    navigate(`/marketplace/account-settings?tab=${value}`, { replace: true });
  };

  if (isLoadingProfile) {
    return (
      <div className="container max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        <Skeleton className="h-[500px] w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <PaymentInfoNotice className="mb-8" />
      
      <Tabs 
        defaultValue={defaultTab} 
        value={defaultTab} 
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="address">Address & Currency</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment Information</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <ProfileTab
            user={user}
            emailVerified={emailVerified}
            fullName={fullName}
            setFullName={setFullName}
            displayName={displayName}
            setDisplayName={setDisplayName}
            location={userLocation}
            setLocation={setLocation}
            isUpdatingProfile={isUpdatingProfile}
            setIsUpdatingProfile={setIsUpdatingProfile}
            handleProfileUpdate={handleProfileUpdate}
          />
        </TabsContent>
        
        {/* Address Tab */}
        <TabsContent value="address">
          <AddressTab userProfile={userProfile} />
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <SecurityTab twoFactorEnabled={twoFactorEnabled} />
        </TabsContent>
        
        {/* Payment Information Tab */}
        <TabsContent value="payment">
          <PaymentTab />
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="transactions">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button variant="outline" onClick={() => navigate('/marketplace')}>
          Return to Marketplace
        </Button>
      </div>
    </div>
  );
};
