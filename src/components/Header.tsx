
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, Search, UserCircle, MessageSquare, 
  Store, BookOpen, Map, Settings, LogOut, LogIn 
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  isLoggedIn: boolean;
  user?: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
  };
}

const Header = ({ isLoggedIn: propIsLoggedIn, user: propUser }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { user: authUser, signOut } = useAuth();
  const { toast } = useToast();
  
  // Use the authenticated user state instead of props if available
  const isLoggedIn = authUser !== null || propIsLoggedIn;
  const user = authUser ? {
    name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
    avatarUrl: authUser.user_metadata?.avatar_url,
    unimogModel: propUser?.unimogModel
  } : propUser;

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Search implementation will go here
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-unimog-800 dark:text-unimog-200">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background border-r">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-bold flex items-center gap-2 text-unimog-800 dark:text-unimog-200">
                  <img src="/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png" alt="Unimog Logo" className="w-10 h-10 rounded-full" />
                  Unimog Hub
                </Link>
                {isLoggedIn ? (
                  <>
                    <Link to="/marketplace" className="nav-link flex items-center gap-2">
                      <Store size={18} />
                      Marketplace
                    </Link>
                    <Link to="/knowledge" className="nav-link flex items-center gap-2">
                      <BookOpen size={18} />
                      Knowledge Base
                    </Link>
                    <Link to="/trips" className="nav-link flex items-center gap-2">
                      <Map size={18} />
                      Trip Planning
                    </Link>
                    <Link to="/community" className="nav-link flex items-center gap-2">
                      <UserCircle size={18} />
                      Community
                    </Link>
                    <Link to="/messages" className="nav-link flex items-center gap-2">
                      <MessageSquare size={18} />
                      Messages
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/pricing" className="nav-link">Pricing</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                    <Link to="/login" className="nav-link flex items-center gap-2">
                      <LogIn size={18} />
                      Log In
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="text-lg md:text-xl font-bold flex items-center gap-2 text-unimog-800 dark:text-unimog-200">
            <img src="/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png" alt="Unimog Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
            <span className="hidden sm:inline">Unimog Community Hub</span>
            <span className="sm:hidden">Unimog Hub</span>
          </Link>
        </div>
        
        {isLoggedIn && (
          <div className="hidden md:block">
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
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Search form - only show on user pages (when logged in or not on homepage) */}
          {(!isHomePage || isLoggedIn) && (
            <form onSubmit={handleSearch} className="hidden sm:flex relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-32 md:w-64 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Search size={18} />
              </button>
            </form>
          )}
          
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="bg-unimog-500 text-unimog-50">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center p-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
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
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer text-red-500 dark:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="text-unimog-700 dark:text-unimog-300 flex items-center gap-2">
                  <LogIn size={18} />
                  <span className="font-medium">Login</span>
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
