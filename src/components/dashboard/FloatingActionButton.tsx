import { useState, useCallback, useEffect } from 'react';
import { Plus, Fuel, Wrench, Map, Cloud, CloudOff } from 'lucide-react';
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
    setIsExpanded(prev => !prev);
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

      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 10);

      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isExpanded]);

  return (
    <div
      data-fab
      className={cn(
        'fixed left-5 z-40 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] md:bottom-5',
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

      {/* Action buttons - positioned above the FAB */}
      <div
        className={cn(
          'absolute bottom-14 left-0 flex flex-col gap-3 transition-all duration-200',
          isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {actions.map((action, index) => (
          <div
            key={action.id}
            className={cn(
              'flex items-center gap-3 transition-all duration-200',
              isExpanded
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            )}
            style={{
              transitionDelay: isExpanded ? `${(actions.length - 1 - index) * 50}ms` : '0ms',
            }}
          >
            {/* Action button */}
            <button
              onClick={() => handleActionClick(action)}
              className={cn(
                'w-12 h-12 rounded-full shadow-lg flex items-center justify-center',
                'text-white transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'hover:scale-110 active:scale-95',
                action.color
              )}
              aria-label={action.label}
            >
              {action.icon}
            </button>

            {/* Label tooltip */}
            <span
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium',
                'bg-gray-900 text-white shadow-lg',
                'whitespace-nowrap'
              )}
            >
              {action.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main FAB button - same size as Barry (48px) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className={cn(
          'w-12 h-12 rounded-full shadow-xl',
          'flex items-center justify-center',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-military-green focus:ring-offset-2',
          'hover:scale-105 active:scale-95',
          isExpanded
            ? 'bg-gray-700 hover:bg-gray-800 rotate-45'
            : 'bg-military-green hover:bg-military-green/90'
        )}
        aria-label={isExpanded ? 'Close menu' : 'Log vehicle activity'}
        aria-expanded={isExpanded}
      >
        <Plus className={cn(
          'h-6 w-6 text-white transition-transform duration-200',
          isExpanded && 'rotate-45'
        )} />
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
