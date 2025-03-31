
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  MarketplaceNotificationProps, 
  createListingNotification,
  createSaleNotification,
  createPaymentNotification,
  createCommissionNotification,
  createShippingNotification,
  createTransactionNotification
} from '@/components/marketplace/notifications/MarketplaceNotification';
import { 
  sendListingCreatedNotification,
  sendItemSoldNotification,
  sendPaymentProcessedNotification,
  sendCommissionFeeNotification,
  sendOrderConfirmationEmail,
  sendShipmentNotificationEmail
} from '@/utils/emailUtils';

export const useMarketplaceNotifications = (userEmail?: string) => {
  const [notifications, setNotifications] = useState<MarketplaceNotificationProps[]>([]);

  // Add a new notification
  const addNotification = useCallback((notification: MarketplaceNotificationProps) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Show a toast for immediate feedback
    toast(notification.message, {
      icon: notification.type === 'success' ? '✅' : 
            notification.type === 'warning' ? '⚠️' : 'ℹ️'
    });
    
    // In a real implementation, we would also store this in the database
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
    
    // In a real implementation, we would also update the database
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    
    // In a real implementation, we would also update the database
  }, []);

  // Listing created notification
  const notifyListingCreated = useCallback(async (title: string, id: string) => {
    const notification = createListingNotification(title, id);
    addNotification(notification);
    
    if (userEmail) {
      await sendListingCreatedNotification(userEmail, title, id);
    }
  }, [userEmail, addNotification]);

  // Item sold notification
  const notifyItemSold = useCallback(async (title: string, id: string, buyerEmail: string, amount: number) => {
    const notification = createSaleNotification(title, id);
    addNotification(notification);
    
    // Also add a transaction notification
    const transactionNotification = createTransactionNotification('sale', amount, title);
    addNotification(transactionNotification);
    
    if (userEmail) {
      await sendItemSoldNotification(userEmail, buyerEmail, title, amount);
    }
  }, [userEmail, addNotification]);

  // Payment processed notification
  const notifyPaymentProcessed = useCallback(async (amount: number, itemName: string, transactionId: string) => {
    const notification = createPaymentNotification(amount);
    addNotification(notification);
    
    // Also add a transaction notification
    const transactionNotification = createTransactionNotification('purchase', amount, itemName);
    addNotification(transactionNotification);
    
    if (userEmail) {
      await sendPaymentProcessedNotification(userEmail, amount, itemName, transactionId);
    }
  }, [userEmail, addNotification]);

  // Commission fee notification
  const notifyCommissionFee = useCallback(async (amount: number, itemName: string, commission: number, finalAmount: number) => {
    const notification = createCommissionNotification(commission);
    addNotification(notification);
    
    // Also add a transaction notification
    const transactionNotification = createTransactionNotification('commission', commission, itemName);
    addNotification(transactionNotification);
    
    if (userEmail) {
      await sendCommissionFeeNotification(userEmail, itemName, amount, commission, finalAmount);
    }
  }, [userEmail, addNotification]);

  // Order confirmation
  const sendOrderConfirmation = useCallback(async (
    buyerEmail: string,
    sellerEmail: string,
    itemName: string,
    amount: number,
    orderId: string
  ) => {
    if (userEmail) {
      await sendOrderConfirmationEmail(buyerEmail, sellerEmail, itemName, amount, orderId);
    }
  }, [userEmail]);

  // Shipment notification
  const notifyShipment = useCallback(async (
    buyerEmail: string,
    itemName: string,
    orderId: string,
    trackingNumber?: string,
    carrier?: string
  ) => {
    const notification = createShippingNotification(itemName);
    addNotification(notification);
    
    if (userEmail) {
      await sendShipmentNotificationEmail(buyerEmail, itemName, orderId, trackingNumber, carrier);
    }
  }, [userEmail, addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    notifyListingCreated,
    notifyItemSold,
    notifyPaymentProcessed,
    notifyCommissionFee,
    sendOrderConfirmation,
    notifyShipment
  };
};
