import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Map, ShoppingBag, MoreHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { href: '/knowledge', icon: BookOpen, labelKey: 'nav.knowledge' },
  { href: '/trips', icon: Map, labelKey: 'nav.trips' },
  { href: '/marketplace', icon: ShoppingBag, labelKey: 'nav.marketplace' },
] as const;

interface MobileBottomNavProps {
  onLogout: () => Promise<void>;
}

export function MobileBottomNav({ onLogout }: MobileBottomNavProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      const heightDiff = window.innerHeight - viewport.height;
      setIsKeyboardOpen(heightDiff > 150);
    };

    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, []);

  if (isKeyboardOpen) return null;

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-border pb-safe md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 min-w-[64px] min-h-[44px] gap-0.5 transition-colors',
                active
                  ? 'text-military-green'
                  : 'text-muted-foreground'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <item.icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
              <span className="text-[10px] font-medium leading-tight">
                {t(item.labelKey)}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-military-green rounded-b" />
              )}
            </Link>
          );
        })}

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className="flex flex-col items-center justify-center flex-1 min-w-[64px] min-h-[44px] gap-0.5 text-muted-foreground"
              aria-label="More navigation options"
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-tight">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl pb-safe">
            <nav className="flex flex-col gap-4 py-4">
              <Link
                to="/community"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium"
              >
                Community
              </Link>
              <Link
                to="/events"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium"
              >
                Events
              </Link>
              <Link
                to="/messages"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium"
              >
                Messages
              </Link>
              <Link
                to="/profile"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium"
              >
                Settings
              </Link>
              <button
                onClick={async () => {
                  setMoreOpen(false);
                  await onLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium text-red-500"
              >
                Log Out
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
