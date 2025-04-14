
import { Link } from 'react-router-dom';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Menu,
  Store,
  BookOpen,
  Map,
  UserCircle,
  MessageCircle,
  LogOut,
  LogIn,
  Info,
  Tags,
  Mail,
  BookOpenCheck,
  Crown,
  LayoutDashboard,
  Compass,
  Route,
  FileText,
  Wrench
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/use-subscription';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isLoggedIn: boolean;
  onLogout: () => Promise<void>;
  onLogin: () => Promise<void>;
}

export const MobileMenu = ({ isLoggedIn, onLogout, onLogin }: MobileMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { hasActiveSubscription } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsOpen(false); // Close the mobile menu first
    await onLogout();
  };

  const handleLogin = async () => {
    setIsOpen(false); // Close the mobile menu first
    await onLogin();
  };

  const navItemClass = "flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-accent";
  const activeItemClass = "bg-accent/50 font-semibold";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="border-r border-border/30 pt-10">
        <nav className="flex flex-col gap-1 mt-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold mb-6 mx-1 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-md border border-border/50 group-hover:border-primary/50 transition-all">
              <img src="/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png" alt="Unimog Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-rugged tracking-wide">Unimog Hub</span>
          </Link>
          
          {isLoggedIn && (
            <Link 
              to="/learn-about-unimogs" 
              className={cn(navItemClass, "mb-2", location.pathname === "/learn-about-unimogs" && activeItemClass)}
              onClick={() => setIsOpen(false)}
            >
              <BookOpenCheck size={18} />
              Learn About Unimogs
              {!hasActiveSubscription() && <Crown size={14} className="ml-auto text-amber-500" />}
            </Link>
          )}
          
          {isLoggedIn ? (
            <>
              <div className="pb-2">
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground">Navigation</div>
                <Link 
                  to="/dashboard" 
                  className={cn(navItemClass, location.pathname === "/dashboard" && activeItemClass)}
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              </div>
              
              <div className="pb-2">
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground">Trips</div>
                <Link 
                  to="/trips" 
                  className={cn(navItemClass, location.pathname === "/trips" && activeItemClass)}
                  onClick={() => setIsOpen(false)}
                >
                  <Route size={18} />
                  Plan a Trip
                </Link>
                <Link 
                  to="/explore-routes" 
                  className={cn(navItemClass, location.pathname === "/explore-routes" && activeItemClass)}
                  onClick={() => setIsOpen(false)}
                >
                  <Compass size={18} />
                  Explore Routes
                </Link>
                <Link 
                  to="/explore-map" 
                  className={cn(navItemClass, location.pathname === "/explore-map" && activeItemClass)}
                  onClick={() => setIsOpen(false)}
                >
                  <Map size={18} />
                  Map View
                </Link>
              </div>
              
              <div className="pb-2">
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground">Knowledge</div>
                <Link 
                  to="/knowledge" 
                  className={cn(navItemClass, location.pathname === "/knowledge" && activeItemClass)}
                  onClick={() => setIsOpen(false)}
                >
                  <BookOpen size={18} />
                  Knowledge Base
                </Link>
                <Link 
                  to="/vehicle-dashboard" 
                  className={cn(navItemClass, location.pathname === "/vehicle-dashboard" && activeItemClass)}
                  onClick={() => setIsOpen(false)}
                >
                  <Wrench size={18} />
                  Vehicle Dashboard
                </Link>
                <Link 
                  to="/knowledge/manuals" 
                  className={cn(navItemClass, location.pathname === "/knowledge/manuals" && activeItemClass)}
                  onClick={() => setIsOpen(false)}
                >
                  <FileText size={18} />
                  Manuals
                </Link>
              </div>
              
              <div className="pb-2">
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground">Community</div>
                <Link 
                  to="/marketplace" 
                  className={cn(navItemClass, location.pathname === "/marketplace" && activeItemClass)}
                  onClick={() => setIsOpen(false)}
                >
                  <Store size={18} />
                  Marketplace
                </Link>
                <Link 
                  to="/community" 
                  className={cn(navItemClass, location.pathname === "/community" && activeItemClass)}
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircle size={18} />
                  Community
                </Link>
                <Link 
                  to="/messages" 
                  className={cn(navItemClass, location.pathname === "/messages" && activeItemClass)}
                  onClick={() => setIsOpen(false)}
                >
                  <MessageCircle size={18} />
                  Messages
                </Link>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border/30">
                <button 
                  onClick={handleLogout}
                  className={cn(navItemClass, "text-destructive hover:text-destructive hover:bg-destructive/10")}
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/about" 
                className={cn(navItemClass, location.pathname === "/about" && activeItemClass)}
                onClick={() => setIsOpen(false)}
              >
                <Info size={18} />
                About
              </Link>
              <Link 
                to="/pricing" 
                className={cn(navItemClass, location.pathname === "/pricing" && activeItemClass)}
                onClick={() => setIsOpen(false)}
              >
                <Tags size={18} />
                Pricing
              </Link>
              <Link 
                to="/contact" 
                className={cn(navItemClass, location.pathname === "/contact" && activeItemClass)}
                onClick={() => setIsOpen(false)}
              >
                <Mail size={18} />
                Contact
              </Link>
              <button 
                onClick={handleLogin}
                className={cn(navItemClass, "mt-4 bg-primary/10 hover:bg-primary/20 text-primary")}
              >
                <LogIn size={18} />
                Log In
              </button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
