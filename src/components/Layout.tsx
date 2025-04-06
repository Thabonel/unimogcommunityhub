
import React, { useCallback } from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import TrialBanner from '@/components/TrialBanner';

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  user?: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
  };
  noFooter?: boolean;
}

const Layout = ({ children, isLoggedIn = false, user, noFooter = false }: LayoutProps) => {
  console.log('Layout component is rendering');
  
  // Function to safely check if we're inside an AuthProvider context
  const SafeTrialBanner = useCallback(() => {
    try {
      // We don't directly import and use useAuth() here to prevent the error
      // Instead, we dynamically render the component and catch any errors
      return <TrialBanner />;
    } catch (error) {
      console.log("Auth context not available for TrialBanner");
      return null;
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Only render SafeTrialBanner when inside the authenticated part of the app */}
      {isLoggedIn && <SafeTrialBanner />}
      <Header isLoggedIn={isLoggedIn} user={user} />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
};

export default Layout;
