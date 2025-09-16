
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CountrySelector } from '@/components/localization/CountrySelector';
import { LanguageSelector } from '@/components/localization/LanguageSelector';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : "U";
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-background'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">Unimog Hub</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('Dashboard')}
            </Link>
            <Link to="/forum" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('forum.title')}
            </Link>
            <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('resources.title')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <CountrySelector size="sm" />
          <LanguageSelector size="sm" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    {t('profile.title')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    {t('settings.title')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  {t('auth.sign_out')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">
                  {t('auth.sign_in')}
                </Link>
              </Button>
              <Button asChild>
                <Link to="/signup">
                  {t('auth.sign_up')}
                </Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu - Enhanced with proper transitions */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-background border-t shadow-lg">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/dashboard"
              className="px-2 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('Dashboard')}
            </Link>
            <Link
              to="/forum"
              className="px-2 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('forum.title')}
            </Link>
            <Link
              to="/resources"
              className="px-2 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('resources.title')}
            </Link>

            {/* Authentication links for mobile */}
            {!user && (
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Link
                  to="/login"
                  className="px-2 py-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('auth.sign_in')}
                </Link>
                <Link
                  to="/signup"
                  className="px-2 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('auth.sign_up')}
                </Link>
              </div>
            )}

            {user && (
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Link
                  to="/profile"
                  className="px-2 py-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('profile.title')}
                </Link>
                <Link
                  to="/settings"
                  className="px-2 py-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('settings.title')}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
                >
                  {t('auth.sign_out')}
                </button>
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t">
              <CountrySelector showLabel={true} className="flex-1" />
              <LanguageSelector showLabel={true} className="flex-1" />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
