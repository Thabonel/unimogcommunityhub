export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
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
