
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VehicleDetailsSection from './VehicleDetailsSection';
import OwnerManualSection from './OwnerManualSection';
import ProfileEditForm from './ProfileEditForm';

interface OverviewTabProps {
  userData: {
    name: string;
    email: string;
    unimogModel: string;
    about: string;
    location: string;
    website?: string;
  };
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onProfileUpdate: (data: any) => void;
}

const OverviewTab = ({ userData, isEditing, setIsEditing, onProfileUpdate }: OverviewTabProps) => {
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      {isEditing ? (
        <ProfileEditForm 
          initialData={userData} 
          onCancel={handleCancelEdit}
          onSubmit={onProfileUpdate}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{userData.about}</p>
            </CardContent>
          </Card>
          
          <VehicleDetailsSection unimogModel={userData.unimogModel} />
          
          <OwnerManualSection unimogModel={userData.unimogModel} />
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your recent activities will appear here.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default OverviewTab;
