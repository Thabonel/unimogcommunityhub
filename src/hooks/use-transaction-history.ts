import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Transaction, TransactionType, TransactionFilters } from '@/types/marketplace';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock transaction data for demo purposes
// In a real implementation, this would come from Supabase
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'purchase',
    listingId: '1',
    listingTitle: 'Original Unimog U1700L Front Bumper',
    amount: 550,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'completed',
    sellerId: 'user1',
    sellerName: 'John Doe',
    paymentMethod: 'PayPal',
    orderId: '123456',
    transactionId: 'TRANS-12345678'
  },
  {
    id: '2',
    type: 'sale',
    listingId: '2',
    listingTitle: 'Complete Set of 4 BF Goodrich Tires for Unimog',
    amount: 1200,
    commission: 90,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'completed',
    buyerId: 'user2',
    buyerName: 'Jane Smith',
    paymentMethod: 'PayPal',
    orderId: '789012',
    transactionId: 'TRANS-87654321'
  },
  {
    id: '3',
    type: 'commission',
    listingId: '2',
    listingTitle: 'Complete Set of 4 BF Goodrich Tires for Unimog',
    amount: 90, // Commission amount
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'completed',
    orderId: '789012',
    transactionId: 'TRANS-COMM-87654321'
  },
  {
    id: '4',
    type: 'refund',
    listingId: '3',
    listingTitle: 'Workshop Manual Collection',
    amount: 250,
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    status: 'completed',
    sellerId: 'user4',
    sellerName: 'Robert Williams',
    paymentMethod: 'PayPal',
    orderId: '345678',
    transactionId: 'TRANS-REFUND-34567890'
  }
];

export function useTransactionHistory(initialFilters: TransactionFilters = { type: 'all' }) {
  const { user } = useAuth();
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);

  const { data: transactions, isLoading, error, refetch } = useQuery({
    queryKey: ['transactionHistory', user?.id, filters],
    queryFn: async () => {
      // In a real implementation, this would be a fetch to Supabase
      // with proper filtering based on the user ID and filters
      
      // For now, we'll mock the filtering
      let filteredTransactions = [...mockTransactions];
      
      if (filters.type && filters.type !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
      }
      
      if (filters.dateFrom) {
        filteredTransactions = filteredTransactions.filter(
          t => new Date(t.date) >= filters.dateFrom!
        );
      }
      
      if (filters.dateTo) {
        filteredTransactions = filteredTransactions.filter(
          t => new Date(t.date) <= filters.dateTo!
        );
      }
      
      if (filters.status) {
        filteredTransactions = filteredTransactions.filter(t => t.status === filters.status);
      }
      
      // Sort by date, newest first
      return filteredTransactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
    enabled: !!user,
  });

  const updateFilters = (newFilters: Partial<TransactionFilters>) => {
    setFilters(current => ({ ...current, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({ type: 'all' });
  };

  return {
    transactions,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch
  };
}
