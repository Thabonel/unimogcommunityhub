
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Map, Users, ShoppingBag, BookOpen } from "lucide-react";

interface MainNavigationProps {
  isActive?: (path: string) => boolean;
}

export const MainNavigation = ({ isActive }: MainNavigationProps) => {
  const mainNavLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/trips", label: "Trip Planner", icon: Map },
    { href: "/community", label: "Community", icon: Users },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
  ];

  // This component is kept for backward compatibility but
  // is now replaced by the NavigationMenu in Header.tsx
  return (
    <nav className="flex items-center gap-1">
      {mainNavLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors uppercase tracking-wide",
            isActive && isActive(link.href)
              ? "bg-white/20 text-white font-bold"
              : "text-white/90 hover:bg-white/10 hover:text-white"
          )}
        >
          <link.icon className="h-4 w-4" />
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
};
