import { useState, useCallback, useEffect } from 'react';
import { Plus, X, Fuel, Wrench, Map, Cloud, CloudOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  onLogFuel: () => void;
  onLogService: () => void;
  onLogTrip: () => void;
  className?: string;
}

export function FloatingActionButton({
  onLogFuel,
  onLogService,
  onLogTrip,
  className,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isOnline, hasPendingSync, stats } = useOfflineQueue();

  const actions: QuickAction[] = [
    {
      id: 'fuel',
      label: 'Log Fuel',
      icon: <Fuel className="h-5 w-5" />,
      color: 'bg-amber-500 hover:bg-amber-600',
      onClick: onLogFuel,
    },
    {
      id: 'service',
      label: 'Log Service',
      icon: <Wrench className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: onLogService,
    },
    {
      id: 'trip',
      label: 'Add Trip',
      icon: <Map className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: onLogTrip,
    },
  ];

  const handleToggle = useCallback(() => {
    setIsAnimating(true);
    setIsExpanded(prev => !prev);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const handleActionClick = useCallback(
    (action: QuickAction) => {
      setIsExpanded(false);
      action.onClick();
    },
    []
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-fab]')) {
          setIsExpanded(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isExpanded]);

  return (
    <div
      data-fab
      className={cn(
        'fixed bottom-6 right-6 z-50 flex flex-col-reverse items-center gap-3',
        className
      )}
    >
      {/* Backdrop for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 -z-10 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Action buttons */}
      <div
        className={cn(
          'flex flex-col-reverse items-center gap-3 transition-all duration-300',
          isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {actions.map((action, index) => (
          <div
            key={action.id}
            className={cn(
              'flex items-center gap-3 transition-all duration-300',
              isExpanded
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            )}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : '0ms',
            }}
          >
            {/* Label tooltip */}
            <span
              className={cn(
                'hidden md:block px-3 py-1.5 rounded-lg text-sm font-medium',
                'bg-gray-900 text-white shadow-lg',
                'whitespace-nowrap'
              )}
            >
              {action.label}
            </span>

            {/* Action button */}
            <button
              onClick={() => handleActionClick(action)}
              className={cn(
                'w-12 h-12 rounded-full shadow-lg flex items-center justify-center',
                'text-white transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'active:scale-95',
                action.color
              )}
              aria-label={action.label}
            >
              {action.icon}
            </button>
          </div>
        ))}
      </div>

      {/* Main FAB button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className={cn(
          'w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl',
          'flex items-center justify-center',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-military-green focus:ring-offset-2',
          'active:scale-95',
          isExpanded
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-military-green hover:bg-military-green/90',
          isAnimating && 'scale-110'
        )}
        aria-label={isExpanded ? 'Close menu' : 'Log vehicle activity'}
        aria-expanded={isExpanded}
      >
        <div
          className={cn(
            'transition-transform duration-300',
            isExpanded && 'rotate-45'
          )}
        >
          {isExpanded ? (
            <X className="h-6 w-6 md:h-7 md:w-7 text-white" />
          ) : (
            <Plus className="h-6 w-6 md:h-7 md:w-7 text-white" />
          )}
        </div>
      </button>

      {/* Sync status indicator */}
      {(hasPendingSync || !isOnline) && (
        <div
          className={cn(
            'absolute -top-1 -right-1 w-5 h-5 rounded-full',
            'flex items-center justify-center',
            'text-white text-xs font-bold',
            !isOnline ? 'bg-gray-500' : 'bg-orange-500 animate-pulse'
          )}
          title={
            !isOnline
              ? 'Offline - changes will sync when online'
              : `${stats.pending} pending sync`
          }
        >
          {!isOnline ? (
            <CloudOff className="h-3 w-3" />
          ) : (
            <Cloud className="h-3 w-3" />
          )}
        </div>
      )}
    </div>
  );
}
