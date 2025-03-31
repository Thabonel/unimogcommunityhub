
import { ReactNode } from 'react';
import UserSidebar from './sidebar/UserSidebar';
import MemberFinder from './sidebar/MemberFinder';
import GroupsList from './groups/GroupsList';

interface CommunityLayoutProps {
  children: ReactNode;
}

const CommunityLayout = ({ children }: CommunityLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar */}
      <div className="hidden lg:block space-y-6">
        <UserSidebar />
        <GroupsList />
      </div>
      
      {/* Main Content */}
      <div className="lg:col-span-2">
        {children}
      </div>
      
      {/* Right Sidebar */}
      <div className="hidden lg:block">
        <MemberFinder />
      </div>
    </div>
  );
};

export default CommunityLayout;
