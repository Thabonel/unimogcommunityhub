
import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { calculateCommission } from '@/types/marketplace';
import { 
  sendPaymentProcessedNotification,
  sendOrderConfirmationEmail,
  sendItemSoldNotification 
} from '@/utils/emailUtils';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplaceNotifications } from '@/hooks/use-marketplace-notifications';

interface PayPalButtonProps {
  amount: number;
  itemName: string;
  sellerEmail?: string;
  sellerId?: string;
  sellerName?: string;
  listingId: string;
}

export function PayPalButton({ 
  amount, 
  itemName, 
  sellerEmail, 
  sellerId, 
  sellerName,
  listingId 
}: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fees = calculateCommission(amount);
  const { user } = useAuth();
  const { 
    notifyPaymentProcessed, 
    notifyItemSold, 
    notifyCommissionFee, 
    sendOrderConfirmation 
  } = useMarketplaceNotifications(user?.email);
  
  const handleCheckout = async () => {
    setIsLoading(true);
    
    // Simulate PayPal checkout process
    try {
      // Wait for 1.5 seconds to simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random order ID
      const orderId = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Generate a random transaction ID
      const transactionId = 'TRANS-' + Math.floor(10000000 + Math.random() * 90000000).toString();
      
      // Send notifications if we have user information
      if (user?.email) {
        // In a real implementation, these would be triggered by backend events
        // and not directly from the frontend
        
        // Send payment notification to buyer
        notifyPaymentProcessed(amount, itemName, transactionId);
        
        // Send order confirmation to buyer
        if (sellerEmail) {
          sendOrderConfirmation(
            user.email,
            sellerEmail,
            itemName,
            amount,
            orderId
          );
        }
        
        // Send sold notification to seller
        if (sellerEmail && sellerId) {
          notifyItemSold(itemName, listingId, user.email, amount);
          
          // Also send commission fee notification to seller
          notifyCommissionFee(amount, itemName, fees.commission, fees.total);
        }
      }
      
      toast.success("Payment successful! Order confirmation sent.");
      
      // In a real implementation, we would redirect to PayPal or show a PayPal modal
      // We would pass both the full amount and the commission information
      window.open('https://www.paypal.com', '_blank');
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm border-t border-b py-3 space-y-2">
        <div className="flex justify-between">
          <span>Item price:</span>
          <span>${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Platform fee:</span>
          <span>${fees.commission.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Seller receives:</span>
          <span>${fees.total.toFixed(2)}</span>
        </div>
      </div>
      
      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white flex items-center justify-center gap-2 h-12"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Buy with PayPal</span>
          </>
        )}
      </Button>
    </div>
  );
}
