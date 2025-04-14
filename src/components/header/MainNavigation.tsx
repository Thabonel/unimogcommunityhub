
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
              : "text-gray-100 hover:bg-white/10 hover:text-white"
          )}
        >
          <link.icon className="h-4 w-4" />
          <span className="relative">
            {link.label}
            <span className={cn(
              "absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full",
              isActive && isActive(link.href) ? "w-full" : "w-0"
            )}></span>
          </span>
        </Link>
      ))}
    </nav>
  );
};
