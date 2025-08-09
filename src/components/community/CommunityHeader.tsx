
import { Button } from '@/components/ui/button';
import { RefreshCw, MessageSquare, UserPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';
import { useAnalytics } from '@/hooks/use-analytics';
import { useState } from 'react';
import { CreateGroupDialog } from './groups/CreateGroupDialog';
import { toast } from '@/hooks/use-toast';

interface CommunityHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const CommunityHeader = ({ isRefreshing, onRefresh }: CommunityHeaderProps) => {
  const { trackFeatureUse } = useAnalytics();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const trackNavigation = (destination: string) => {
    trackFeatureUse('navigation', {
      from: 'community',
      to: destination
    });
  };

  const handleCreateGroup = () => {
    trackFeatureUse('create_group', { action: 'open_dialog' });
    setIsCreateGroupOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
          Community
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Connect with other Unimog enthusiasts from around the world.
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <FeedbackButton />
        <Button 
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          <span>Refresh</span>
        </Button>
        <Button 
          variant="outline"
          onClick={handleCreateGroup}
          className="flex items-center gap-2"
        >
          <Users size={16} />
          <span>Create Group</span>
        </Button>
        <Button 
          asChild 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => trackNavigation('messages')}
        >
          <Link to="/messages">
            <MessageSquare size={16} />
            <span>Messages</span>
          </Link>
        </Button>
        <Button 
          className="bg-primary flex items-center gap-2"
          onClick={() => {
            trackFeatureUse('find_members', { action: 'click' });
            // Scroll to the member finder section or show a toast
            const memberFinderElement = document.querySelector('[aria-label="Find Members"]');
            if (memberFinderElement) {
              memberFinderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              toast({
                title: "Find Members",
                description: "Use the member search on the right sidebar to find and connect with other members",
              });
            }
          }}
        >
          <UserPlus size={16} />
          <span>Find Members</span>
        </Button>
      </div>
      
      <CreateGroupDialog 
        open={isCreateGroupOpen} 
        onOpenChange={setIsCreateGroupOpen}
      />
    </div>
  );
};

export default CommunityHeader;
