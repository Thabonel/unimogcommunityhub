
import { useState, useEffect } from 'react';
import { calculateCommission, commissionStructure } from '@/types/marketplace';
import { Card, CardContent } from '@/components/ui/card';

interface CommissionCalculatorProps {
  price: number;
  showDetails?: boolean;
}

export function CommissionCalculator({ price, showDetails = true }: CommissionCalculatorProps) {
  const [fees, setFees] = useState(calculateCommission(price));
  
  useEffect(() => {
    setFees(calculateCommission(price));
  }, [price]);

  if (isNaN(price) || price <= 0) {
    return null;
  }

  return (
    <Card className="bg-muted/40 border-muted">
      <CardContent className="pt-4">
        <h4 className="font-medium text-sm mb-2">Fee Breakdown</h4>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Listing Price</span>
            <span>${fees.subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-muted-foreground">
            <span>Platform Fee ({commissionStructure.percentage}%)</span>
            <span>-${fees.commission.toFixed(2)}</span>
          </div>
          
          {showDetails && (
            <div className="pt-2 text-xs text-muted-foreground">
              <p>
                The platform charges a {commissionStructure.percentage}% commission 
                (minimum ${commissionStructure.minFee.toFixed(2)}
                {commissionStructure.maxFee && `, maximum $${commissionStructure.maxFee.toFixed(2)}`})
                on all sales to cover operating costs.
              </p>
            </div>
          )}
          
          <div className="flex justify-between font-medium pt-2 border-t border-border mt-2">
            <span>You Receive</span>
            <span className="text-green-600">${fees.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
