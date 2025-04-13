
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { MainNavigation } from './MainNavigation';
import { SearchBar } from './SearchBar';
import { HeaderAuthActions } from './HeaderAuthActions';
import { AdminButton } from './AdminButton';
import { LearnButton } from './LearnButton';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";
import { LayoutDashboard, Map, BookOpen, ShoppingBag, Users } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  user?: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
  };
}

const Header = ({ isLoggedIn: propIsLoggedIn, user: propUser }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get auth context safely with fallback to props
  const authContext = (() => {
    try {
      return useAuthContext();
    } catch (error) {
      console.log("Auth context not available, using props");
      return { 
        user: null, 
        loading: false,
        signOut: async () => { 
          console.log("Mock signOut"); 
          return Promise.resolve({ success: true });
        }
      };
    }
  })();

  const { user: authUser, signOut } = authContext;
  
  // Use the authenticated user state instead of props if available
  const isLoggedIn = authUser !== null || propIsLoggedIn;
  const user = authUser ? {
    name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
    avatarUrl: authUser.user_metadata?.avatar_url,
    unimogModel: propUser?.unimogModel,
    vehiclePhotoUrl: propUser?.vehiclePhotoUrl,
    useVehiclePhotoAsProfile: propUser?.useVehiclePhotoAsProfile,
    email: authUser.email
  } : propUser;

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  // For development purposes, make admin button always visible on homepage for logged in users
  const isAdmin = process.env.NODE_ENV === 'development' && isLoggedIn;
  const showAdminButton = isLoggedIn && isHomePage && isAdmin;
  
  // Function to handle navigation to admin dashboard
  const handleAdminClick = () => {
    navigate('/admin');
  };

  // Create a wrapped signOut function that returns void for compatibility
  const handleSignOut = async () => {
    await signOut();
    return;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-military-green shadow-md border-b border-white/10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <MobileMenu 
            isLoggedIn={isLoggedIn} 
            onLogout={handleSignOut} 
            onLogin={() => Promise.resolve(navigate('/login'))}
          />
          <Logo />
        </div>
        
        {/* Modern dropdown navigation for logged in users */}
        {isLoggedIn && !isHomePage && (
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
        )}
        
        <div className="flex items-center gap-2">
          {/* Search form - only show when not on homepage */}
          {!isHomePage && <SearchBar className="hidden sm:flex" />}

          {/* Learn About Unimogs button - show only on homepage */}
          {isHomePage && <LearnButton />}

          {/* Admin Button - show for admins or in development mode */}
          {showAdminButton && <AdminButton onClick={handleAdminClick} />}
          
          {/* Auth actions (login button or user menu) */}
          <HeaderAuthActions 
            isLoggedIn={isLoggedIn}
            user={user}
            isHomePage={isHomePage}
            isAdmin={isAdmin}
            signOut={handleSignOut}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
