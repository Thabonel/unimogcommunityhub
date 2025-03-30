
import { Button } from '@/components/ui/button';
import { RefreshCw, MessageSquare, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';
import { useAnalytics } from '@/hooks/use-analytics';

interface CommunityHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const CommunityHeader = ({ isRefreshing, onRefresh }: CommunityHeaderProps) => {
  const { trackFeatureUse } = useAnalytics();

  const trackNavigation = (destination: string) => {
    trackFeatureUse('navigation', {
      from: 'community',
      to: destination
    });
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
      <div className="flex gap-2">
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
          onClick={() => trackFeatureUse('find_members', { action: 'click' })}
        >
          <UserPlus size={16} />
          <span>Find Members</span>
        </Button>
      </div>
    </div>
  );
};

export default CommunityHeader;
