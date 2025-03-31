
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, Package, CreditCard, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export type NotificationType = 'success' | 'info' | 'warning';

export interface MarketplaceNotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onDismiss?: (id: string) => void;
  timestamp: Date;
}

// Component to render a single notification
export const MarketplaceNotificationItem = ({
  notification,
  onDismiss,
}: {
  notification: MarketplaceNotificationProps;
  onDismiss?: (id: string) => void;
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Alert className="mb-3 relative">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-2">
          {getIcon()}
        </div>
        <AlertDescription className="flex-grow">
          <div className="flex flex-col">
            <span>{notification.message}</span>
            {notification.actionLabel && notification.actionHref && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-left w-fit mt-1" 
                asChild
              >
                <a href={notification.actionHref}>{notification.actionLabel}</a>
              </Button>
            )}
            <span className="text-xs text-muted-foreground mt-1">
              {getRelativeTime(notification.timestamp)}
            </span>
          </div>
        </AlertDescription>
      </div>
      
      {onDismiss && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDismiss(notification.id)} 
          className="h-6 w-6 p-0 absolute top-2 right-2 text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  );
};

// Component to render the notification center
export const MarketplaceNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<MarketplaceNotificationProps[]>([]);
  
  // This is a placeholder. In a real implementation, we would fetch notifications from the backend
  useEffect(() => {
    if (user) {
      // Simulate fetching notifications
      const demoNotifications: MarketplaceNotificationProps[] = [
        {
          id: '1',
          type: 'success',
          message: 'Your item "Unimog Front Bumper" has been listed successfully.',
          actionLabel: 'View Listing',
          actionHref: '/marketplace/1',
          timestamp: new Date(Date.now() - 30 * 60000) // 30 minutes ago
        },
        {
          id: '2',
          type: 'info',
          message: 'Your item "Unimog Tires Set" has received a new message.',
          actionLabel: 'View Messages',
          actionHref: '/marketplace/messages',
          timestamp: new Date(Date.now() - 5 * 3600000) // 5 hours ago
        },
        {
          id: '3',
          type: 'success',
          message: 'Payment processed successfully for "Workshop Manual".',
          timestamp: new Date(Date.now() - 2 * 86400000) // 2 days ago
        }
      ];
      
      setNotifications(demoNotifications);
    }
  }, [user]);
  
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // In a real implementation, we would also update the backend
    // to mark this notification as dismissed
  };
  
  if (!notifications.length) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      {notifications.map(notification => (
        <MarketplaceNotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={handleDismissNotification}
        />
      ))}
    </div>
  );
};

// Helpers for creating marketplace notifications
export const createListingNotification = (title: string, id: string): MarketplaceNotificationProps => ({
  id: crypto.randomUUID(),
  type: 'success',
  message: `Your item "${title}" has been listed successfully.`,
  actionLabel: 'View Listing',
  actionHref: `/marketplace/${id}`,
  timestamp: new Date()
});

export const createSaleNotification = (title: string, id: string): MarketplaceNotificationProps => ({
  id: crypto.randomUUID(),
  type: 'success',
  message: `Your item "${title}" has been sold!`,
  actionLabel: 'View Details',
  actionHref: `/marketplace/account-settings?tab=payment`,
  timestamp: new Date()
});

export const createPaymentNotification = (amount: number): MarketplaceNotificationProps => ({
  id: crypto.randomUUID(),
  type: 'success',
  message: `Payment of $${amount.toFixed(2)} has been processed successfully.`,
  timestamp: new Date()
});

export const createCommissionNotification = (amount: number): MarketplaceNotificationProps => ({
  id: crypto.randomUUID(),
  type: 'info',
  message: `A commission fee of $${amount.toFixed(2)} has been applied to your recent sale.`,
  actionLabel: 'View Details',
  actionHref: `/marketplace/account-settings?tab=payment`,
  timestamp: new Date()
});

export const createShippingNotification = (title: string): MarketplaceNotificationProps => ({
  id: crypto.randomUUID(),
  type: 'info',
  message: `Your item "${title}" has been shipped.`,
  actionLabel: 'Track Package',
  actionHref: `/marketplace/account-settings?tab=orders`,
  timestamp: new Date()
});
