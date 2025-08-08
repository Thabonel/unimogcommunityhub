
import { formatDistanceToNow } from 'date-fns';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Transaction, TransactionType } from '@/types/marketplace';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function TransactionTable({ transactions, isLoading }: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="h-8 w-8 border-4 border-t-unimog-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/30">
        <h3 className="text-lg font-medium mb-1">No transactions found</h3>
        <p className="text-muted-foreground">
          No transaction records match your current filters.
        </p>
      </div>
    );
  }

  // Helper function to format transaction type
  const getTransactionType = (type: TransactionType) => {
    switch (type) {
      case 'purchase':
        return { label: 'Purchase', icon: <ArrowUp className="h-4 w-4 text-red-500" /> };
      case 'sale':
        return { label: 'Sale', icon: <ArrowDown className="h-4 w-4 text-green-500" /> };
      case 'commission':
        return { label: 'Commission', icon: <ArrowUp className="h-4 w-4 text-orange-500" /> };
      case 'refund':
        return { label: 'Refund', icon: <ArrowDown className="h-4 w-4 text-blue-500" /> };
      default:
        return { label: 'Unknown', icon: null };
    }
  };

  // Helper function to format status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const { label, icon } = getTransactionType(transaction.type);
            
            return (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  <div>{new Date(transaction.date).toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {icon}
                    <span>{label}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="truncate" title={transaction.listingTitle}>
                    {transaction.listingTitle}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transaction.type === 'purchase' && transaction.sellerName && (
                      <>from {transaction.sellerName}</>
                    )}
                    {transaction.type === 'sale' && transaction.buyerName && (
                      <>to {transaction.buyerName}</>
                    )}
                  </div>
                </TableCell>
                <TableCell className={transaction.type === 'purchase' || transaction.type === 'commission' ? 'text-red-600' : 'text-green-600'}>
                  {transaction.type === 'purchase' || transaction.type === 'commission' ? '-' : '+'}
                  ${transaction.amount.toFixed(2)}
                  {transaction.type === 'sale' && transaction.commission && (
                    <div className="text-xs text-muted-foreground">
                      (Fee: ${transaction.commission.toFixed(2)})
                    </div>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell>
                  <div className="font-mono text-xs">{transaction.orderId}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[100px]" title={transaction.transactionId}>
                    {transaction.transactionId}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
