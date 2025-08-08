
import { useState } from 'react';
import { Info } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useTransactionHistory } from '@/hooks/use-transaction-history';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';
import { TransactionSummary } from './TransactionSummary';

export function TransactionHistory() {
  const {
    transactions,
    isLoading,
    filters,
    updateFilters,
    resetFilters,
  } = useTransactionHistory();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Transaction History</h2>
        <p className="text-muted-foreground">
          View and manage your marketplace transaction history
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Your complete history of purchases, sales, and associated fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-md bg-blue-50 p-3 text-blue-700 text-sm flex items-start">
            <Info className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
            <p>
              This page shows your complete transaction history. You can filter by transaction type and date range.
              For any questions regarding your transactions, please contact support.
            </p>
          </div>

          <TransactionFilters 
            filters={filters}
            onUpdateFilters={updateFilters}
            onResetFilters={resetFilters}
          />

          <TransactionSummary transactions={transactions || []} />

          <TransactionTable
            transactions={transactions || []}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
