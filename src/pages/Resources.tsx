
import Layout from '@/components/Layout';
import { UnimogResourcesList } from '@/components/resources/UnimogResourcesList';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';

const Resources = () => {
  const { user: authUser } = useAuth();
  const { userData } = useProfile();

  const layoutUser = userData ? {
    name: userData.name || authUser?.email?.split('@')[0] || 'User',
    avatarUrl: (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl)
      ? userData.vehiclePhotoUrl
      : userData.avatarUrl,
    unimogModel: userData.unimogModel || '',
    vehiclePhotoUrl: userData.vehiclePhotoUrl || '',
    useVehiclePhotoAsProfile: userData.useVehiclePhotoAsProfile || false
  } : undefined;

  return (
    <Layout isLoggedIn={!!authUser} user={layoutUser}>
      <div className="container py-10">
        <UnimogResourcesList />
      </div>
    </Layout>
  );
};

export default Resources;
