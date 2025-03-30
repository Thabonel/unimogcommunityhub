
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Wrench, Hammer, MapPin, Cog, Disc, Shield } from 'lucide-react';

export function KnowledgeNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    {
      name: 'Maintenance',
      path: '/knowledge/maintenance',
      icon: <Wrench className="h-4 w-4" />,
    },
    {
      name: 'Repair',
      path: '/knowledge/repair',
      icon: <Hammer className="h-4 w-4" />,
    },
    {
      name: 'Adventures',
      path: '/knowledge/adventures',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      name: 'Modifications',
      path: '/knowledge/modifications',
      icon: <Cog className="h-4 w-4" />,
    },
    {
      name: 'Tyres',
      path: '/knowledge/tyres',
      icon: <Disc className="h-4 w-4" />,
    },
    {
      name: 'Admin',
      path: '/knowledge/admin',
      icon: <Shield className="h-4 w-4" />,
      admin: true,
    },
  ];
  
  // In a real app, you would check if the user is an admin
  const isAdmin = true; // Mock value - in a real app this would come from authentication
  
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8 border-y py-2">
      <Link
        to="/knowledge"
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          currentPath === "/knowledge"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        )}
      >
        All
      </Link>
      
      {navItems.map((item) => (
        // Only show admin items to admins
        (!item.admin || (item.admin && isAdmin)) && (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1",
              currentPath === item.path
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {item.icon}
            {item.name}
            {item.admin && <span className="ml-1 text-xs opacity-60">(Admin)</span>}
          </Link>
        )
      ))}
    </div>
  );
}
