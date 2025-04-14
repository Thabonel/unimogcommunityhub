
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
import { 
  LayoutDashboard, 
  Map, 
  BookOpen, 
  ShoppingBag, 
  Users,
  Compass,
  Route,
  GalleryVertical,
  FileText,
  Wrench,
  MessageCircle
} from "lucide-react";

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
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                "flex h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                location.pathname === "/dashboard" 
                  ? "bg-white/20 text-white shadow-sm" 
                  : "text-white/90 hover:bg-white/10 hover:text-white hover:translate-y-[-2px]"
              )}
            >
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-1 transition-transform group-hover:scale-110" />
                Dashboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white hover:translate-y-[-2px] transition-all duration-200 data-[state=open]:bg-white/20 data-[state=open]:text-white">
              <Map className="h-4 w-4 mr-1" />
              Trips
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white dark:bg-background rounded-md shadow-lg border border-border/30 backdrop-blur-sm">
              <div className="grid w-[220px] gap-1 p-3">
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Link to="/trips" className="flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    <span>Plan a Trip</span>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Link to="/explore-routes" className="flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    <span>Explore Routes</span>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Link to="/explore-map" className="flex items-center gap-2">
                    <GalleryVertical className="h-4 w-4" />
                    <span>Map View</span>
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white hover:translate-y-[-2px] transition-all duration-200 data-[state=open]:bg-white/20 data-[state=open]:text-white">
              <BookOpen className="h-4 w-4 mr-1" />
              Knowledge
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white dark:bg-background rounded-md shadow-lg border border-border/30 backdrop-blur-sm">
              <div className="grid w-[230px] gap-1 p-3">
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Link to="/knowledge" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Knowledge Base</span>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Link to="/vehicle-dashboard" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span>Vehicle Dashboard</span>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Link to="/knowledge/manuals" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Manuals</span>
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                "flex h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                location.pathname === "/marketplace" 
                  ? "bg-white/20 text-white shadow-sm" 
                  : "text-white/90 hover:bg-white/10 hover:text-white hover:translate-y-[-2px]"
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
                "flex h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                location.pathname.startsWith("/community") 
                  ? "bg-white/20 text-white shadow-sm" 
                  : "text-white/90 hover:bg-white/10 hover:text-white hover:translate-y-[-2px]"
              )}
            >
              <Link to="/community">
                <Users className="h-4 w-4 mr-1" />
                Community
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                "flex h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                location.pathname === "/messages" 
                  ? "bg-white/20 text-white shadow-sm" 
                  : "text-white/90 hover:bg-white/10 hover:text-white hover:translate-y-[-2px]"
              )}
            >
              <Link to="/messages">
                <MessageCircle className="h-4 w-4 mr-1" />
                Messages
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
