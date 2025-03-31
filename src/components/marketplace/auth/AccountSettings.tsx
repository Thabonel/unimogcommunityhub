
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PaymentInfoNotice } from '@/components/marketplace/auth/PaymentInfoNotice';
import { ProfileTab } from '@/components/marketplace/auth/components/ProfileTab';
import { SecurityTab } from '@/components/marketplace/auth/components/SecurityTab';
import { PaymentTab } from '@/components/marketplace/auth/components/PaymentTab';
import { useAccountSettings } from '@/components/marketplace/auth/hooks/useAccountSettings';

export const AccountSettings = () => {
  const navigate = useNavigate();
  const {
    fullName,
    setFullName,
    displayName,
    setDisplayName,
    location,
    setLocation,
    isUpdatingProfile,
    setIsUpdatingProfile,
    twoFactorEnabled,
    emailVerified,
    user,
    handleProfileUpdate,
  } = useAccountSettings();

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <PaymentInfoNotice className="mb-8" />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment Information</TabsTrigger>
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
            location={location}
            setLocation={setLocation}
            isUpdatingProfile={isUpdatingProfile}
            setIsUpdatingProfile={setIsUpdatingProfile}
            handleProfileUpdate={handleProfileUpdate}
          />
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <SecurityTab twoFactorEnabled={twoFactorEnabled} />
        </TabsContent>
        
        {/* Payment Information Tab */}
        <TabsContent value="payment">
          <PaymentTab />
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
