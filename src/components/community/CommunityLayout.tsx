
import { ReactNode } from 'react';
import UserSidebar from './sidebar/UserSidebar';
import MemberFinder from './sidebar/MemberFinder';
import GroupsList from './groups/GroupsList';

interface CommunityLayoutProps {
  children: ReactNode;
}

const CommunityLayout = ({ children }: CommunityLayoutProps) => {
  return (
    <div className="container py-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="hidden lg:block space-y-6">
          <div className="sticky top-24">
            <UserSidebar />
            <div className="mt-6 community-card">
              <GroupsList />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {children}
        </div>
        
        {/* Right Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 community-card">
            <MemberFinder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
