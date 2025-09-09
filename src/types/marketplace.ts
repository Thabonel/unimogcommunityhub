
export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string; // Currency the item was listed in
  category: string;
  condition: string;
  photos: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  createdAt: string;
  location?: string;
}

export type ListingCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';

export interface MarketplaceCategory {
  id: string;
  name: string;
}

export const marketplaceCategories: MarketplaceCategory[] = [
  { id: 'parts', name: 'Parts' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'vehicles', name: 'Vehicles' },
  { id: 'tools', name: 'Tools' },
  { id: 'merchandise', name: 'Merchandise' },
  { id: 'other', name: 'Other' }
];

export const listingConditions: ListingCondition[] = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location?: string;
  photos: File[];
  agreedToTerms: true;
}

export interface CommissionInfo {
  percentage: number;
  minFee: number;
  maxFee?: number;
}

export const commissionStructure: CommissionInfo = {
  percentage: 7.5, // 7.5% commission
  minFee: 1.00,   // Minimum $1.00 fee
  maxFee: 250.00, // Maximum $250.00 fee
};

export interface TransactionFees {
  subtotal: number;
  commission: number;
  total: number;
}

export function calculateCommission(price: number): TransactionFees {
  const commissionAmount = Math.max(
    commissionStructure.minFee,
    price * (commissionStructure.percentage / 100)
  );
  
  // Apply maximum fee cap if defined
  const finalCommission = commissionStructure.maxFee 
    ? Math.min(commissionAmount, commissionStructure.maxFee) 
    : commissionAmount;
  
  return {
    subtotal: price,
    commission: Number(finalCommission.toFixed(2)),
    total: Number((price - finalCommission).toFixed(2))
  };
}

// Transaction history types
export type TransactionType = 'purchase' | 'sale' | 'commission' | 'refund';

export interface Transaction {
  id: string;
  type: TransactionType;
  listingId: string;
  listingTitle: string;
  amount: number;
  commission?: number;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  buyerId?: string;
  buyerName?: string;
  sellerId?: string;
  sellerName?: string;
  paymentMethod?: string;
  orderId?: string;
  transactionId?: string;
}

// Add TransactionFilters interface for the transaction history filters
export interface TransactionFilters {
  type?: TransactionType | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
}
