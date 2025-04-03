
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  isLoggedIn?: boolean;
  user?: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
  };
}

const Layout = ({ children, isLoggedIn = false, user }: LayoutProps) => {
  // Default Unimog model to U1700L if not specified
  const defaultUnimogModel = user?.unimogModel || 'U1700L';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isLoggedIn={isLoggedIn} 
        user={{
          ...user, 
          unimogModel: defaultUnimogModel,
          vehiclePhotoUrl: user?.vehiclePhotoUrl,
          useVehiclePhotoAsProfile: user?.useVehiclePhotoAsProfile
        }} 
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
