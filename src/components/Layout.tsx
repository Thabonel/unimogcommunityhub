import React from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import "../styles/production.css"; // Add this line

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
}

const Layout = ({ children, isLoggedIn, user }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} user={user} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
