
import { Link } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCircle, MessageSquare, Settings, LogOut, ShieldCheck, CreditCard, History } from 'lucide-react';

interface UserMenuProps {
  user: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
  };
  onLogout: () => Promise<void>;
  isAdmin?: boolean;
}

export const UserMenu = ({ user, onLogout, isAdmin = false }: UserMenuProps) => {
  // Determine which photo to use as the profile picture
  const profileImageUrl = user.useVehiclePhotoAsProfile && user.vehiclePhotoUrl
    ? user.vehiclePhotoUrl
    : user.avatarUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profileImageUrl} alt={user.name} />
            <AvatarFallback className="bg-unimog-500 text-unimog-50">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center p-2">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={profileImageUrl} alt={user.name} />
            <AvatarFallback className="bg-unimog-500 text-unimog-50">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <Link to="/profile" className="text-xs text-muted-foreground">View Profile</Link>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
            <UserCircle size={16} />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/messages" className="flex items-center gap-2 cursor-pointer">
            <MessageSquare size={16} />
            <span>Messages</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/marketplace/account-settings" className="flex items-center gap-2 cursor-pointer">
            <Settings size={16} />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/marketplace/account-settings?tab=transactions" className="flex items-center gap-2 cursor-pointer">
            <History size={16} />
            <span>Transaction History</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/marketplace/two-factor-setup" className="flex items-center gap-2 cursor-pointer">
            <ShieldCheck size={16} />
            <span>Two-Factor Auth</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/marketplace/account-settings?tab=payment" className="flex items-center gap-2 cursor-pointer">
            <CreditCard size={16} />
            <span>Payment Methods</span>
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center gap-2 cursor-pointer text-purple-700 dark:text-purple-400">
                <ShieldCheck size={16} />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer text-red-500 dark:text-red-400"
          onClick={onLogout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
