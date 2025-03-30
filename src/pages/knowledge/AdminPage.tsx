
import Layout from '@/components/Layout';
import { AdminDashboard } from '@/components/knowledge/AdminDashboard';

const AdminPage = () => {
  // In a real application, you would check if the user is an admin
  // For now, we'll assume anyone who accesses this page is an admin
  const mockUser = {
    name: 'Admin User',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L',
    isAdmin: true
  };
  
  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <AdminDashboard />
      </div>
    </Layout>
  );
};

export default AdminPage;
