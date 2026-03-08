
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Map, Users, Calendar, ShoppingBag, BookOpen, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavigationDropdown } from "./NavigationDropdown";

interface MainNavigationProps {
  isActive?: (path: string) => boolean;
}

export const MainNavigation = ({ isActive }: MainNavigationProps) => {
  const { t } = useTranslation();

  // Adventure dropdown items
  const adventureItems = [
    { href: "/trips", label: t('nav.trips'), icon: Map },
    { href: "/knowledge", label: t('nav.knowledge'), icon: BookOpen },
    { href: "/marketplace", label: t('nav.marketplace'), icon: ShoppingBag },
  ];

  // Community dropdown items
  const communityItems = [
    { href: "/community", label: t('nav.community'), icon: Users },
    { href: "/events", label: t('nav.events'), icon: Calendar },
  ];

  return (
    <nav id="main-navigation" className="flex items-center gap-3 lg:gap-6" role="navigation" aria-label="Main navigation">
      {/* Dashboard - standalone */}
      <Link
        to="/dashboard"
        className={cn(
          "flex items-center gap-1.5 px-2 md:px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors uppercase tracking-wide",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:outline-none",
          "min-w-0 flex-shrink whitespace-nowrap",
          isActive && isActive("/dashboard")
            ? "bg-white/20 text-white font-bold"
            : "text-gray-100 hover:bg-white/10 hover:text-white"
        )}
        aria-current={isActive && isActive("/dashboard") ? "page" : undefined}
      >
        <LayoutDashboard className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" aria-hidden="true" />
        <span className="relative">
          {t('nav.dashboard')}
          <span className={cn(
            "absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300",
            isActive && isActive("/dashboard") ? "w-full" : "w-0"
          )}></span>
        </span>
      </Link>

      {/* Adventure dropdown */}
      <NavigationDropdown
        label={t('nav.adventure', 'Adventure')}
        items={adventureItems}
        isActive={isActive}
        icon={Compass}
      />

      {/* Community dropdown */}
      <NavigationDropdown
        label={t('nav.community_group', 'Community')}
        items={communityItems}
        isActive={isActive}
        icon={Users}
      />
    </nav>
  );
};
