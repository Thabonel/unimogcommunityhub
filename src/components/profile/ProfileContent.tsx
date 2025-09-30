
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OverviewTab from './OverviewTab';
import ActivityTab from './ActivityTab';
import VehiclesTab from './VehiclesTab';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get active tab from URL parameter, defaulting to overview
  const activeTab = searchParams.get('tab') || 'overview';

  // Handle tab changes by updating the URL
  const handleTabChange = (value: string) => {
    if (value === 'overview') {
      // For the default tab, don't show the parameter
      navigate('/profile', { replace: true });
    } else {
      navigate(`/profile?tab=${value}`, { replace: true });
    }
  };

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
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab userData={userData} />
      </TabsContent>

      <TabsContent value="vehicles">
        <VehiclesTab userData={userData} />
      </TabsContent>

      <TabsContent value="activity">
        <ActivityTab />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileContent;
