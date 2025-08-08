
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from './OverviewTab';
import ActivityTab from './ActivityTab';
import ProfileEditForm from './ProfileEditForm';

interface ProfileContentProps {
  isEditing: boolean;
  userData: any;
  handleCancelEdit: () => void;
  handleProfileUpdate: (formData: any) => void;
  isMasterUser: boolean;
  isSaving?: boolean;
}

const ProfileContent = ({
  isEditing,
  userData,
  handleCancelEdit,
  handleProfileUpdate,
  isMasterUser,
  isSaving = false
}: ProfileContentProps) => {
  if (isEditing) {
    return (
      <ProfileEditForm 
        initialData={userData}
        onCancel={handleCancelEdit}
        onSubmit={handleProfileUpdate}
        isMasterUser={isMasterUser}
        isSaving={isSaving}
      />
    );
  }
  
  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTab userData={userData} />
      </TabsContent>
      
      <TabsContent value="activity">
        <ActivityTab />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileContent;
