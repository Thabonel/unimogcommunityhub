
import Layout from '@/components/Layout';
import { MessageSquare } from 'lucide-react';

const Messages = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Messages
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Communicate with other Unimog enthusiasts and sellers.
            </p>
          </div>
        </div>
        
        <div className="grid place-items-center py-12">
          <div className="max-w-md text-center">
            <MessageSquare size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Messages Coming Soon</h2>
            <p className="text-muted-foreground mb-4">
              We're working on a messaging system that will allow you to communicate with other Unimog enthusiasts.
              Check back soon!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
