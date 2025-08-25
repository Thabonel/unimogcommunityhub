
import { Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';

interface ProfileLoadingProps {
  user: any;
}

const ProfileLoading = ({ user }: ProfileLoadingProps) => {
  return (
    <Layout isLoggedIn={!!user}>
      <div className="container flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </Layout>
  );
};

export default ProfileLoading;
