
import React from 'react';
import Header from './header/Header';
import Footer from './Footer';
import { MobileBottomNav } from './navigation/MobileBottomNav';
import { SkipLinks } from './ui/skip-links';
import { useAuth } from '@/contexts/AuthContext';
import "../styles/production.css"; // This ensures the production CSS is loaded

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
  const authContext = (() => {
    try {
      return useAuth();
    } catch {
      return { signOut: async () => {} };
    }
  })();

  return (
    <div className={`flex flex-col min-h-screen max-w-full overflow-x-hidden ${isLoggedIn ? 'pb-mobile-nav md:pb-0' : ''}`}>
      <SkipLinks />
      <Header isLoggedIn={isLoggedIn} user={user} />
      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>
      <Footer />
      {isLoggedIn && (
        <MobileBottomNav onLogout={async () => { await authContext.signOut(); }} />
      )}
    </div>
  );
};

export default Layout;
