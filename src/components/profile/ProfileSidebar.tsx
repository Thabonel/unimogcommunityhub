import { useSubscription } from '@/hooks/use-subscription';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
export interface ProfileSidebarProps {
  userData: {
    avatarUrl?: string;
    name?: string;
    email: string;
  };
  isEditing?: boolean;
  onEditClick?: () => void;
}
const ProfileSidebar = ({
  userData,
  isEditing,
  onEditClick
}: ProfileSidebarProps) => {
  const {
    hasActiveSubscription,
    getSubscriptionLevel
  } = useSubscription();
  const {
    user
  } = useAuth();
  const subscriptionLevel = getSubscriptionLevel();
  const isAdmin = user?.app_metadata?.roles?.includes('admin');
  return <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <img src={userData.avatarUrl || '/placeholder-avatar.jpg'} alt="Avatar" className="w-12 h-12 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold">{userData.name || 'No Name'}</h3>
          <p className="text-sm text-muted-foreground">{userData.email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Subscription</h4>
        {hasActiveSubscription() ? <Badge variant="secondary">
            {subscriptionLevel === 'lifetime' ? 'Lifetime' : 'Premium'}
          </Badge> : <Badge variant="outline">Free</Badge>}
      </div>
      
      {isAdmin && <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Admin</h4>
          <Badge variant="destructive">Administrator</Badge>
        </div>}

      {isEditing ? <p className="text-sm text-[#fefefe]">Editing profile...</p> : <button onClick={onEditClick} className="text-sm text-primary hover:underline">
          Edit Profile
        </button>}
    </div>;
};
export default ProfileSidebar;