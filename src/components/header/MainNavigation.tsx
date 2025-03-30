
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Store, BookOpen, Map, UserCircle, MessageSquare } from 'lucide-react';

interface MainNavigationProps {
  isActive: (path: string) => boolean;
}

export const MainNavigation = ({ isActive }: MainNavigationProps) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/marketplace">
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} flex items-center gap-1 ${isActive('/marketplace') ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <Store size={16} />
              <span>Marketplace</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/knowledge">
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} flex items-center gap-1 ${isActive('/knowledge') ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <BookOpen size={16} />
              <span>Knowledge</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/trips">
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} flex items-center gap-1 ${isActive('/trips') ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <Map size={16} />
              <span>Trips</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/community">
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} flex items-center gap-1 ${isActive('/community') ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <UserCircle size={16} />
              <span>Community</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/messages">
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} flex items-center gap-1 ${isActive('/messages') ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <MessageSquare size={16} />
              <span>Messages</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
