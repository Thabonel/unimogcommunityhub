
import React from 'react';
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
  return (
    <div className="flex flex-col min-h-screen">
      <TrialBanner />
      <Header isLoggedIn={isLoggedIn} user={user} />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
};

export default Layout;
