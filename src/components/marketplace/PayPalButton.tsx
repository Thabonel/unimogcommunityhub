
import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { calculateCommission } from '@/types/marketplace';

interface PayPalButtonProps {
  amount: number;
  itemName: string;
}

export function PayPalButton({ amount, itemName }: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fees = calculateCommission(amount);
  
  const handleCheckout = () => {
    setIsLoading(true);
    
    // Simulate PayPal checkout process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Payment initiated! Redirecting to PayPal...");
      
      // In a real implementation, we would redirect to PayPal or show a PayPal modal
      // We would pass both the full amount and the commission information
      window.open('https://www.paypal.com', '_blank');
    }, 1500);
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
