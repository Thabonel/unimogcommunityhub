
import { Transaction } from '@/types/marketplace';
import { 
  ArrowDown, 
  ArrowUp, 
  ShoppingCart, 
  ReceiptText 
} from 'lucide-react';

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export function TransactionSummary({ transactions }: TransactionSummaryProps) {
  // Calculate summary data
  const totalPurchases = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSales = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalCommissions = transactions
    .filter(t => t.type === 'commission')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const purchaseCount = transactions.filter(t => t.type === 'purchase').length;
  const salesCount = transactions.filter(t => t.type === 'sale').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-muted/30 rounded-md p-4 border">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingCart className="h-4 w-4 text-unimog-600" />
          <h4 className="font-medium text-sm">Purchases</h4>
        </div>
        <div className="text-2xl font-bold">${totalPurchases.toFixed(2)}</div>
        <div className="text-xs text-muted-foreground mt-1">{purchaseCount} items purchased</div>
      </div>
      
      <div className="bg-muted/30 rounded-md p-4 border">
        <div className="flex items-center gap-2 mb-1">
          <ReceiptText className="h-4 w-4 text-green-600" />
          <h4 className="font-medium text-sm">Sales</h4>
        </div>
        <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
        <div className="text-xs text-muted-foreground mt-1">{salesCount} items sold</div>
      </div>
      
      <div className="bg-muted/30 rounded-md p-4 border">
        <div className="flex items-center gap-2 mb-1">
          <ArrowUp className="h-4 w-4 text-orange-600" />
          <h4 className="font-medium text-sm">Commission Fees</h4>
        </div>
        <div className="text-2xl font-bold">${totalCommissions.toFixed(2)}</div>
        <div className="text-xs text-muted-foreground mt-1">{salesCount > 0 ? `~${(totalCommissions / salesCount).toFixed(2)} per sale` : '0.00 per sale'}</div>
      </div>
      
      <div className="bg-muted/30 rounded-md p-4 border">
        <div className="flex items-center gap-2 mb-1">
          <ArrowDown className="h-4 w-4 text-unimog-600" />
          <h4 className="font-medium text-sm">Net Earnings</h4>
        </div>
        <div className="text-2xl font-bold">${(totalSales - totalCommissions).toFixed(2)}</div>
        <div className="text-xs text-muted-foreground mt-1">{Math.round((1 - totalCommissions / totalSales) * 100) || 0}% of sales revenue</div>
      </div>
    </div>
  );
}
