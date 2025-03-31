
import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PayPalButtonProps {
  amount: number;
  itemName: string;
}

export function PayPalButton({ amount, itemName }: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCheckout = () => {
    setIsLoading(true);
    
    // Simulate PayPal checkout process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Payment initiated! Redirecting to PayPal...");
      
      // In a real implementation, we would redirect to PayPal or show a PayPal modal
      window.open('https://www.paypal.com', '_blank');
    }, 1500);
  };
  
  return (
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
  );
}
