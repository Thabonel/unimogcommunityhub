import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavigationDropdownProps {
  label: string;
  items: DropdownItem[];
  isActive?: (path: string) => boolean;
  icon: React.ElementType;
}

export const NavigationDropdown = ({ label, items, isActive, icon: Icon }: NavigationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if any item in the dropdown is currently active
  const hasActiveItem = items.some(item => isActive?.(item.href));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2 md:px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors uppercase tracking-wide",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:outline-none",
          "min-w-0 flex-shrink whitespace-nowrap",
          hasActiveItem
            ? "bg-white/20 text-white font-bold"
            : "text-gray-100 hover:bg-white/10 hover:text-white"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" aria-hidden="true" />
        <span className="relative">
          {label}
          <span className={cn(
            "absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300",
            hasActiveItem ? "w-full" : "w-0"
          )}></span>
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 md:h-4 md:w-4 transition-transform duration-200 flex-shrink-0",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-10 md:hidden" onClick={() => setIsOpen(false)} />

          {/* Dropdown menu */}
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors",
                  isActive?.(item.href) && "bg-military-green/10 text-military-green font-medium"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};