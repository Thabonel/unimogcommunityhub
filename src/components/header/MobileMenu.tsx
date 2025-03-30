
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
  MessageSquare,
  LogOut,
  LogIn
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface MobileMenuProps {
  isLoggedIn: boolean;
  onLogout: () => Promise<void>;
  onLogin: () => Promise<void>;
}

export const MobileMenu = ({ isLoggedIn, onLogout, onLogin }: MobileMenuProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
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
              {/* Only show main navigation links when not on homepage */}
              {!isHomePage && (
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
              )}
              <button 
                onClick={onLogout}
                className="nav-link flex items-center gap-2 mt-4 text-red-500"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/pricing" className="nav-link">Pricing</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              <button 
                onClick={onLogin}
                className="nav-link flex items-center gap-2 mt-4"
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
