
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LayoutDashboard, Map, BookOpen, ShoppingBag, Users } from "lucide-react";

interface HeaderNavigationProps {
  isLoggedIn: boolean;
  isHomePage: boolean;
}

export const HeaderNavigation = ({ isLoggedIn, isHomePage }: HeaderNavigationProps) => {
  const location = useLocation();
  
  // Don't show navigation on home page or if not logged in
  if (isHomePage || !isLoggedIn) {
    return null;
  }

  return (
    <div className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                "flex h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium",
                location.pathname === "/dashboard" ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"
              )}
            >
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/20 data-[state=open]:text-white">
              <Map className="h-4 w-4 mr-1" />
              Trips
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white dark:bg-background">
              <div className="grid w-[200px] gap-1 p-2">
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                  <Link to="/trips">Plan a Trip</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                  <Link to="/explore-routes">Explore Routes</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                  <Link to="/explore-map">Map View</Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/20 data-[state=open]:text-white">
              <BookOpen className="h-4 w-4 mr-1" />
              Knowledge
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white dark:bg-background">
              <div className="grid w-[220px] gap-1 p-2">
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                  <Link to="/knowledge">Knowledge Base</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                  <Link to="/vehicle-dashboard">Vehicle Dashboard</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                  <Link to="/knowledge/manuals">Manuals</Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                "flex h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium",
                location.pathname === "/marketplace" ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"
              )}
            >
              <Link to="/marketplace">
                <ShoppingBag className="h-4 w-4 mr-1" />
                Marketplace
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                "flex h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium",
                location.pathname === "/community" ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"
              )}
            >
              <Link to="/community">
                <Users className="h-4 w-4 mr-1" />
                Community
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
