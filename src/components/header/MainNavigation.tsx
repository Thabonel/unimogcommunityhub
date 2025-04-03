
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MainNavigationProps {
  isActive?: (path: string) => boolean;
}

export const MainNavigation = ({ isActive }: MainNavigationProps) => {
  const mainNavLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/trips", label: "Trip Planner" },
    { href: "/community", label: "Community" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/knowledge", label: "Knowledge Base" },
  ];

  return (
    <nav className="flex items-center gap-2">
      {mainNavLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "px-3 py-2 text-sm font-medium rounded-md transition-colors",
            isActive && isActive(link.href)
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
