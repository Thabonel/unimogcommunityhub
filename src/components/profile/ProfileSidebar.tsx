
import { Card, CardContent } from '@/components/ui/card';
import ProfileHeader from './ProfileHeader';

interface ProfileSidebarProps {
  userData: any;
  isEditing: boolean;
  onEditClick: () => void;
}

const ProfileSidebar = ({ userData, isEditing, onEditClick }: ProfileSidebarProps) => {
  return (
    <Card>
      <CardContent className="pt-6 flex flex-col items-center">
        <ProfileHeader 
          userData={userData} 
          isEditing={isEditing} 
          onEditClick={onEditClick} 
        />
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
