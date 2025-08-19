import { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  X, 
  Info, 
  ShoppingCart, 
  DollarSign, 
  Truck, 
  Receipt 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export type NotificationType = 'success' | 'warning' | 'info' | 'error';

export interface MarketplaceNotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  description?: string;
  date: string;
  isRead?: boolean;
  icon?: React.ReactNode;
}

export function createListingNotification(title: string, id: string): MarketplaceNotificationProps {
  return {
    id: `listing-${id}`,
    type: 'success',
    message: `Listing Created: ${title}`,
    description: 'Your listing has been successfully published to the marketplace.',
    date: new Date().toISOString(),
    icon: <CheckCircle size={18} className="text-green-600" />
  };
}

export function createSaleNotification(title: string, id: string): MarketplaceNotificationProps {
  return {
    id: `sale-${id}`,
    type: 'success',
    message: `Item Sold: ${title}`,
    description: 'Your item has been purchased. Check your email for details.',
    date: new Date().toISOString(),
    icon: <ShoppingCart size={18} className="text-green-600" />
  };
}

export function createPaymentNotification(amount: number): MarketplaceNotificationProps {
  return {
    id: `payment-${Date.now()}`,
    type: 'success',
    message: `Payment Processed: $${amount.toFixed(2)}`,
    description: 'Your payment has been successfully processed.',
    date: new Date().toISOString(),
    icon: <DollarSign size={18} className="text-green-600" />
  };
}

export function createCommissionNotification(amount: number): MarketplaceNotificationProps {
  return {
    id: `commission-${Date.now()}`,
    type: 'info',
    message: `Commission Fee: $${amount.toFixed(2)}`,
    description: 'A commission fee has been applied to your recent sale.',
    date: new Date().toISOString(),
    icon: <Receipt size={18} className="text-blue-600" />
  };
}

export function createShippingNotification(itemName: string): MarketplaceNotificationProps {
  return {
    id: `shipping-${Date.now()}`,
    type: 'info',
    message: `Item Shipped: ${itemName}`,
    description: 'Your item has been shipped. Check your email for tracking information.',
    date: new Date().toISOString(),
    icon: <Truck size={18} className="text-blue-600" />
  };
}

export function createPurchaseNotification(itemName: string): MarketplaceNotificationProps {
  return {
    id: `purchase-${Date.now()}`,
    type: 'success',
    message: `Purchase Completed: ${itemName}`,
    description: 'Your purchase has been completed successfully.',
    date: new Date().toISOString(),
    icon: <ShoppingCart size={18} className="text-green-600" />
  };
}

export function createTransactionNotification(
  type: 'purchase' | 'sale' | 'commission' | 'refund', 
  amount: number, 
  itemName: string
): MarketplaceNotificationProps {
  const formattedAmount = `$${amount.toFixed(2)}`;
  
  switch (type) {
    case 'purchase':
      return {
        id: `transaction-${Date.now()}`,
        type: 'info',
        message: `Purchase: ${formattedAmount} - ${itemName}`,
        description: 'Your purchase has been recorded in your transaction history.',
        date: new Date().toISOString(),
        icon: <ShoppingCart size={18} className="text-blue-600" />
      };
    case 'sale':
      return {
        id: `transaction-${Date.now()}`,
        type: 'success',
        message: `Sale: ${formattedAmount} - ${itemName}`,
        description: 'Your sale has been recorded in your transaction history.',
        date: new Date().toISOString(),
        icon: <DollarSign size={18} className="text-green-600" />
      };
    case 'commission':
      return {
        id: `transaction-${Date.now()}`,
        type: 'info',
        message: `Commission: ${formattedAmount}`,
        description: 'A commission fee has been recorded in your transaction history.',
        date: new Date().toISOString(),
        icon: <Receipt size={18} className="text-orange-600" />
      };
    case 'refund':
      return {
        id: `transaction-${Date.now()}`,
        type: 'info',
        message: `Refund: ${formattedAmount} - ${itemName}`,
        description: 'A refund has been processed and recorded in your transaction history.',
        date: new Date().toISOString(),
        icon: <Receipt size={18} className="text-blue-600" />
      };
    default:
      return {
        id: `transaction-${Date.now()}`,
        type: 'info',
        message: `Transaction: ${formattedAmount}`,
        description: 'A new transaction has been recorded in your history.',
        date: new Date().toISOString(),
        icon: <Info size={18} className="text-blue-600" />
      };
  }
}

interface MarketplaceNotificationComponentProps {
  notification: MarketplaceNotificationProps;
  onDismiss: (id: string) => void;
}

export const MarketplaceNotification = ({ 
  notification, 
  onDismiss 
}: MarketplaceNotificationComponentProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };

  const getIcon = () => {
    if (notification.icon) {
      return notification.icon;
    }

    switch (notification.type) {
      case 'success':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'warning':
        return <AlertCircle size={18} className="text-yellow-600" />;
      case 'error':
        return <AlertCircle size={18} className="text-red-600" />;
      default:
        return <Info size={18} className="text-blue-600" />;
    }
  };

  const getBgClass = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`p-4 mb-3 rounded-md border ${getBgClass()} transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-sm font-semibold">{notification.message}</h4>
            {notification.description && (
              <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.date)}</p>
          </div>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-6 w-6" 
          onClick={handleDismiss}
        >
          <X size={16} />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  );
};

export const MarketplaceNotifications = () => {
  // This component will eventually fetch notifications from the server
  // For now, we'll keep it empty as it's being handled by the custom hook
  return null;
};
