
import { ReactNode } from 'react';
import UserSidebar from './sidebar/UserSidebar';
import MemberFinder from './sidebar/MemberFinder';
import GroupsList from './groups/GroupsList';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface CommunityLayoutProps {
  children: ReactNode;
}

const CommunityLayout = ({ children }: CommunityLayoutProps) => {
  const { isMobile } = useMobile();
  
  return (
    <div className="container py-2 sm:py-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:block space-y-6">
          <div className="sticky top-24">
            <UserSidebar />
            <div className="mt-6 community-card">
              <GroupsList />
            </div>
          </div>
        </div>
        
        {/* Mobile sidebar controls */}
        {isMobile && (
          <div className="flex gap-2 mb-4">
            {/* Groups Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Users size={16} className="mr-2" />
                  Groups
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-4">
                <div className="mt-8">
                  <UserSidebar />
                  <div className="mt-6">
                    <GroupsList />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Member Finder Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <UserPlus size={16} className="mr-2" />
                  Find Members
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4">
                <div className="mt-8">
                  <MemberFinder />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {children}
        </div>
        
        {/* Right Sidebar - Desktop */}
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
