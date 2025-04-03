
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { Map as MapIcon } from 'lucide-react';

const MainNavigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Community</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-unimog-500/50 to-unimog-700 p-6 no-underline outline-none focus:shadow-md"
                    to="/community"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium text-white">
                      Unimog Community
                    </div>
                    <p className="text-sm leading-tight text-white/90">
                      Connect with fellow Unimog enthusiasts and share your experiences.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem to="/community" title="Forum">
                Discuss everything Unimog with the community
              </ListItem>
              <ListItem to="/community/groups" title="Groups">
                Join specialized interest groups
              </ListItem>
              <ListItem to="/community/improvement" title="Community Health">
                View community health metrics
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <ListItem to="/learn" title="About Unimog">
                Learn about these versatile vehicles
              </ListItem>
              <ListItem to="/knowledge" title="Knowledge Base">
                Access our comprehensive collection of manuals and guides
              </ListItem>
              <ListItem to="/knowledge/manuals" title="Manuals">
                Official manuals for different Unimog models
              </ListItem>
              <ListItem to="/knowledge/repair" title="Repair Guides">
                DIY repair guides and maintenance tips
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Marketplace</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <ListItem to="/marketplace" title="Buy & Sell">
                Marketplace for Unimog vehicles and parts
              </ListItem>
              <ListItem to="/marketplace" title="Featured Listings">
                Check out our featured listings
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/explore" className="flex items-center px-4 py-2 text-sm font-medium">
            <MapIcon className="w-4 h-4 mr-2" />
            Explore Map
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { to: string; title: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={to}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default MainNavigation;
